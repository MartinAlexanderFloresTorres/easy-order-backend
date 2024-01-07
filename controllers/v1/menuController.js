import { isValidObjectId } from 'mongoose';
import { uploadFile } from '../../cloudinary/v1/uploadFile.js';
import transformUploadObject from '../../helpers/transformUploadObject.js';
import validateFields from '../../helpers/validateFields.js';
import { FOLDERS } from '../../constants/folders.js';
import { deleteFile } from '../../cloudinary/v1/deleteFile.js';
import Menu from '../../models/v1/Menu.js';

// CREAR
export const create = async (req, res) => {
  try {
    const { restaurant } = req;

    // Validar campos requeridos
    const errorRequired = validateFields(['name', 'description', 'category'], req.body);
    if (errorRequired) {
      return res.status(400).json(errorRequired);
    }

    // Validar que no exista un menu con el mismo nombre
    const menuExists = await Menu.findOne({
      name: { $regex: new RegExp(req.body.name.trim(), 'i') },
      restaurant: restaurant._id,
    });

    if (menuExists) {
      return res.status(400).json({ message: 'Ya existe un menu con ese nombre' });
    }

    const ingredients = req.body.ingredients.split(',').filter((v) => v.trim().length !== 0);

    // Creamos el menu
    const menu = new Menu({
      name: req.body.name,
      description: req.body.description,
      restaurant: restaurant._id,
      price: req.body.price,
      discount: req.body.discount,
      stockDaily: req.body.stockDaily,
      stock: req.body.stockDaily,
      category: req.body.category,
      isActive: req.body.isActive,
      ingredients: ingredients.map((item) => item.trim().toLowerCase()),
      nutritionalInformation: req.body.nutritionalInformation.map((item) => ({
        name: item.name.toLowerCase().trim(),
        value: item.value.toLowerCase().trim(),
      })),
    });

    // Guardamos
    const menuSave = await (await menu.save()).populate('category', 'name');

    res.json({
      message: 'Menu creado correctamente',
      menu: menuSave,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// UPLOAD LOGO AND IMAGES OR GALERY
export const uploads = async (req, res) => {
  try {
    const { restaurantId, menuId } = req.params;
    const { files } = req;

    if (!isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: 'El id del restaurante no es válido' });
    }

    if (!isValidObjectId(menuId)) {
      return res.status(400).json({ message: 'El id del menu no es válido' });
    }

    const menu = await Menu.findOne({
      _id: menuId,
      restaurant: restaurantId,
    }).populate('category', 'name');

    if (!menu) {
      return res.status(400).json({ message: 'El menu no existe' });
    }

    if (files?.images) {
      if (Array.isArray(files.images)) {
        // Eliminar imagenes anteriores
        if (menu.images.length > 0) {
          for (const image of menu.images) {
            await deleteFile(image.public_id, 'image');
          }

          // Limpiar el array de imagenes
          menu.images = [];
        }

        // Subir las nuevas imagenes
        for (const image of files.images) {
          const imageUpload = await uploadFile(image, FOLDERS.MENU, 'image');
          menu.images.push(transformUploadObject(imageUpload));
        }
      } else if (typeof files.images === 'object') {
        // Eliminar imagenes anteriores
        if (menu.images.length > 0) {
          for (const image of menu.images) {
            await deleteFile(image.public_id, 'image');
          }
        }

        // Limpiar el array de imagenes
        menu.images = [];

        // Subir la nueva imagen
        const image = await uploadFile(files.images, FOLDERS.MENU, 'image');
        menu.images.push(transformUploadObject(image));
      }
    }

    // Guardar en la base de datos
    const menuSave = await menu.save();

    res.json({ message: 'Imagenes subidas correctamente', menu: menuSave });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// ACTUALIZAR
export const update = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { restaurant } = req;

    // Validar campos requeridos
    const errorRequired = validateFields(['name', 'description', 'category'], req.body);
    if (errorRequired) {
      return res.status(400).json(errorRequired);
    }

    const menu = await Menu.findOne({
      _id: menuId,
      restaurant: restaurant._id,
    });

    if (!menu) {
      return res.status(404).json({ message: 'El menú no existe' });
    }

    // Si el nombre es igual a un menu existente y no es la misma
    if (menu.name.trim().toLowerCase() !== req.body.name.trim().toLowerCase()) {
      const menuExists = await Menu.findOne({
        name: { $regex: new RegExp(req.body.name.trim(), 'i') },
        restaurant: restaurant._id,
        _id: { $ne: menu._id },
      });

      if (menuExists) {
        return res.status(400).json({ message: 'Ya existe un menú con ese nombre' });
      }
    }

    // Actualizamos
    if (req.body.name) menu.name = req.body.name;
    if (req.body.description) menu.description = req.body.description;
    if (req.body.price) menu.price = req.body.price;
    if (req.body.discount) menu.discount = req.body.discount;
    if (req.body.stockDaily) {
      menu.stockDaily = req.body.stockDaily;
      // Si el stock actual es mayor al stock diario, actualizamos el stock
      if (req.body.stockDaily < menu.stock) {
        menu.stock = req.body.stockDaily;
      }
    }
    if (req.body.category) menu.category = req.body.category;
    if (req.body.isActive) menu.isActive = req.body.isActive;
    if (req.body.ingredients) {
      const ingredients = req.body.ingredients.split(',').filter((v) => v.trim().length !== 0);
      menu.ingredients = ingredients.map((item) => item.trim().toLowerCase());
    }
    if (req.body.nutritionalInformation) {
      menu.nutritionalInformation = req.body.nutritionalInformation.map((item) => ({
        name: item.name.toLowerCase().trim(),
        value: item.value.toLowerCase().trim(),
      }));
    }

    // Guardamos los cambios
    const menuSave = await (await menu.save()).populate('category', 'name');

    res.json({
      message: 'Menú actualizado correctamente',
      menu: menuSave,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// RENOVAR STOCK
export const renewStock = async (req, res) => {
  try {
    const { menuId, restaurantId } = req.params;

    const menu = await Menu.findOne({
      _id: menuId,
      restaurant: restaurantId,
    });

    if (!menu) {
      return res.status(404).json({ message: 'El menú no existe' });
    }

    // Actualizamos
    menu.stock = menu.stockDaily;

    // Guardamos los cambios
    const menuSave = await (await menu.save()).populate('category', 'name');

    res.json({
      message: 'Stock renovado correctamente',
      menu: menuSave,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// ACTUALIZAR ESTADO
export const status = async (req, res) => {
  try {
    const { menuId } = req.params;

    if (!isValidObjectId(menuId)) {
      return res.status(400).json({ message: 'El id del menú no es válido' });
    }

    const menu = await Menu.findById(menuId).populate('category', 'name');

    if (!menu) {
      return res.status(404).json({ message: 'No existe el menú' });
    }

    // Actualizamos el estado
    menu.isActive = !menu.isActive;

    // Guardamos los cambios
    await menu.save();

    res.json({
      message: `Categoría ${menu.isActive ? 'activada' : 'desactivada'} correctamente`,
      menu,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// OBTENER TODOS LOS MENUS DE UN RESTAURANTE
export const getAllMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: 'El id del restaurante no es válido' });
    }

    const menus = await Menu.find({
      restaurant: restaurantId,
    }).populate('category', 'name');

    res.json(menus);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// OBTENER UNO
export const getOne = async (req, res) => {
  try {
    const { restaurantSlug, menuSlug } = req.params;

    const menu = await Menu.findOne({
      slug: menuSlug,
      isActive: true,
    }).populate([
      {
        path: 'restaurant',
        select: 'name slug address logo',
        match: { slug: restaurantSlug },
      },
      {
        path: 'category',
        select: 'name slug image banner',
      },
    ]);

    if (!menu || !menu.restaurant) {
      return res.status(404).json({ message: 'No existe el menú' });
    }

    res.json(menu);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// OBTENER TODOS LOS MENUS
export const getAll = async (req, res) => {
  try {
    const { restaurantId } = req.query;

    // Obtener restaurantes con plan  premium y empresas van primero
    const filterRestaurant = restaurantId
      ? {
          restaurant: restaurantId,
          isActive: true,
        }
      : { isActive: true };

    const menus = await Menu.find(filterRestaurant)
      .select('-isActive -ingredients -stockDaily -nutritionalInformation -ingredients -__v')
      .sort({
        stock: -1,
        createdAt: -1,
      })
      .populate([
        {
          path: 'restaurant',
          select: 'name slug address logo',
        },
        {
          path: 'category',
          select: 'name slug',
        },
      ]);

    res.json(menus);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// SEARCH MENU
export const search = async (req, res) => {
  try {
    const { restaurantId, query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'La búsqueda es requerida' });
    }

    // Obtener restaurantes con plan  premium y empresas van primero
    const filterRestaurant = restaurantId
      ? {
          restaurant: restaurantId,
          isActive: true,
          $or: [{ name: { $regex: new RegExp(query.trim(), 'i') } }, { description: { $regex: new RegExp(query.trim(), 'i') } }],
        }
      : { isActive: true, $or: [{ name: { $regex: new RegExp(query.trim(), 'i') } }, { description: { $regex: new RegExp(query.trim(), 'i') } }] };

    const menus = await Menu.find(filterRestaurant)
      .select('-isActive -ingredients -stockDaily -nutritionalInformation -ingredients -__v')
      .sort({
        stock: -1,
        createdAt: -1,
      })
      .populate([
        {
          path: 'restaurant',
          select: 'name slug address logo',
        },
        {
          path: 'category',
          select: 'name slug',
        },
      ]);

    res.json(menus);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// OBTENER TODOS LOS MENUS DE UN RESTAURANTE CON OFERTAS
export const getAllMenuOffers = async (req, res) => {
  try {
    const menus = await Menu.find({
      discount: { $gt: 0 },
    })
      .sort({
        discount: -1,
      })
      .populate([
        {
          path: 'restaurant',
          select: 'name slug address logo',
        },
        {
          path: 'category',
          select: 'name slug',
        },
      ]);

    res.json(menus);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

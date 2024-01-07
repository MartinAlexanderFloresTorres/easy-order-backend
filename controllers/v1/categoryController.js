import { isValidObjectId } from 'mongoose';
import { uploadFile } from '../../cloudinary/v1/uploadFile.js';
import transformUploadObject from '../../helpers/transformUploadObject.js';
import validateFields from '../../helpers/validateFields.js';
import Category from '../../models/v1/Category.js';
import { FOLDERS } from '../../constants/folders.js';
import { deleteFile } from '../../cloudinary/v1/deleteFile.js';

// CREAR
export const create = async (req, res) => {
  try {
    const { restaurant } = req;

    // Validar campos requeridos
    const errorRequired = validateFields(['name', 'description'], req.body);
    if (errorRequired) {
      return res.status(400).json(errorRequired);
    }

    // Validar que no exista una categoría con el mismo nombre
    const categoryExists = await Category.findOne({
      name: { $regex: new RegExp(req.body.name.trim(), 'i') },
      restaurant: restaurant._id,
    });

    if (categoryExists) {
      return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
    }

    // Creamos la categoría
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      restaurant: restaurant._id,
    });

    // Guardamos la categoría
    await category.save();

    res.json({
      message: 'Categoría creada correctamente',
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// UPLOAD LOGO AND IMAGES OR GALERY
export const uploads = async (req, res) => {
  try {
    const { restaurantId, categoryId } = req.params;
    const { files } = req;

    if (!isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: 'El id del restaurante no es válido' });
    }

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({ message: 'El id de la categoría no es válido' });
    }

    const category = await Category.findOne({
      _id: categoryId,
      restaurant: restaurantId,
    });

    if (!category) {
      return res.status(400).json({ message: 'La categoría no existe' });
    }

    // Subir imagenes
    if (files?.image) {
      // Eliminar imagen anterior
      if (category.image) {
        await deleteFile(category.image.public_id, 'image');
      }

      const image = await uploadFile(files.image, FOLDERS.CATEGORY, 'image');
      category.image = transformUploadObject(image);
    }

    if (files?.banner) {
      // Eliminar imagen anterior
      if (category.banner) {
        await deleteFile(category.banner.public_id, 'image');
      }
      const banner = await uploadFile(files.banner, FOLDERS.CATEGORY, 'image');
      category.banner = transformUploadObject(banner);
    }

    // Guardar en la base de datos
    const categorySave = await category.save();

    res.json({ message: 'Imagenes subidas correctamente', category: categorySave });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// ACTUALIZAR
export const update = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { restaurant } = req;

    // Validar campos requeridos
    const errorRequired = validateFields(['name', 'description'], req.body);
    if (errorRequired) {
      return res.status(400).json(errorRequired);
    }

    const category = await Category.findOne({
      _id: categoryId,
      restaurant: restaurant._id,
    });

    if (!category) {
      return res.status(404).json({ message: 'La categoría no existe' });
    }

    // Si el nombre es igual a una categoría existente y no es la misma
    if (category.name.trim().toLowerCase() !== req.body.name.trim().toLowerCase()) {
      const categoryExists = await Category.findOne({
        name: { $regex: new RegExp(req.body.name.trim(), 'i') },
        restaurant: restaurant._id,
        _id: { $ne: category._id },
      });

      if (categoryExists) {
        return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
      }
    }

    // Actualizamos
    if (req.body.name) category.name = req.body.name;
    if (req.body.description) category.description = req.body.description;

    // Guardamos los cambios
    await category.save();

    res.json({
      message: 'Categoría actualizada correctamente',
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// ACTUALIZAR ESTADO
export const status = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({ message: 'El id de la categoría no es válido' });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'No existe la categoría' });
    }

    // Actualizamos el estado
    category.isActive = !category.isActive;

    // Guardamos los cambios
    const categorySave = await category.save();

    res.json({
      message: `Categoría ${category.isActive ? 'activada' : 'desactivada'} correctamente`,
      category: categorySave,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// OBTENER TODAS LAS CATEGORIAS DE UN RESTAURANTE
export const getAllByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: 'El id del restaurante no es válido' });
    }

    const categories = await Category.find({
      restaurant: restaurantId,
    });

    res.json(categories);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// OBTENER UNO
export const getOne = async (req, res) => {
  try {
    const { slug } = req.params;
    const { restaurant } = req;

    const category = await Category.deleteOne({ slug, restaurant: restaurant._id });

    if (!category) {
      return res.status(404).json({ message: 'No existe la categoría' });
    }

    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

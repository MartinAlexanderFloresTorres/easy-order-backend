import { isValidObjectId } from 'mongoose';
import validateEmail from '../../helpers/validateEmail.js';
import validateFields from '../../helpers/validateFields.js';
import Restaurant from '../../models/v1/Restaurant.js';
import { uploadFile } from '../../cloudinary/v1/uploadFile.js';
import { FOLDERS } from '../../constants/folders.js';
import transformUploadObject from '../../helpers/transformUploadObject.js';
import User from '../../models/v1/User.js';
import SubscriptionPlan from '../../models/v1/SubscriptionPlan.js';
import generateSlug from '../../helpers/generateSlug.js';
import { deleteFile } from '../../cloudinary/v1/deleteFile.js';

// CREAR
export const create = async (req, res) => {
  try {
    const { tokenCreateRestaurant } = req.params;
    const user = req.user;

    // Validar campos requeridos
    const errorRequired = validateFields(['name', 'description', 'address', 'phone', 'email', 'openingHours', 'closingTime'], req.body);
    if (errorRequired) {
      return res.status(400).json(errorRequired);
    }

    // Validar formato de email
    const errorEmail = validateEmail(req.body.email);
    if (errorEmail) {
      return res.status(400).json(errorEmail);
    }

    const {
      name,
      description,
      address,
      phone,
      email,
      acceptsDelivery,
      acceptsReservations,
      openingHours,
      closingTime,
      website,
      paymentMethods = [],
      socialMedia = [],
      location,
    } = req.body;

    const existsUser = await User.findOne({
      tokenCreateRestaurant,
      _id: user._id,
    })
      .select('tokenCreateRestaurant _id subscriptionPlan')
      .populate({
        path: 'subscriptionPlan',
        select: 'durationMonths',
      });

    // Validar si el token es igual al del usuario
    if (!existsUser) {
      return res.status(400).json({ message: 'No tienes permiso para crear un restaurante' });
    }

    // Existe un restaurante con el mismo nombre
    const existsRestaurant = await Restaurant.findOne({
      $or: [{ name }, { slug: generateSlug(name, false) }],
    });

    if (existsRestaurant) {
      return res.status(400).json({ message: 'Ya existe un restaurante con el mismo nombre' });
    }

    const restaurant = new Restaurant({
      name,
      description,
      address,
      phone,
      email,
      acceptsDelivery,
      acceptsReservations,
      openingHours,
      closingTime,
      website,
      paymentMethods,
      socialMedia,
      location,
    });

    const suscriptionPlan = await SubscriptionPlan.findById(existsUser.subscriptionPlan._id);

    // Validar si existe el plan de suscripción
    if (!suscriptionPlan) {
      return res.status(400).json({ message: 'No tienes un plan de suscripción' });
    }

    // Validar si el plan de suscripción tiene stock
    if (suscriptionPlan.stock <= 0) {
      return res.status(400).json({ message: 'No tienes stock para crear un restaurante' });
    }

    const getExpireDate = (monthDuration = 1) => {
      const date = new Date();
      const month = date.getMonth();
      const year = date.getFullYear();
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const milliseconds = date.getMilliseconds();
      const newDate = new Date(year, month + monthDuration, day, hours, minutes, seconds, milliseconds);
      return newDate;
    };

    const getRurationDate = (monthDuration = 1) => {
      // Resturar 5 dias antes de la fecha de expiracion
      const date = new Date();
      const month = date.getMonth();
      const year = date.getFullYear();
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const milliseconds = date.getMilliseconds();
      const newDate = new Date(year, month + monthDuration, day - 5, hours, minutes, seconds, milliseconds);
      return newDate;
    };

    const getStartDate = () => {
      const date = new Date();
      const month = date.getMonth();
      const year = date.getFullYear();
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const milliseconds = date.getMilliseconds();
      const newDate = new Date(year, month, day, hours, minutes, seconds, milliseconds);
      return newDate;
    };

    // Update stock
    suscriptionPlan.stock = suscriptionPlan.stock - 1;

    // Update user
    user.restaurant = restaurant._id;
    user.tokenCreateRestaurant = null;

    /* Update restaurant */
    restaurant.owner = existsUser._id;
    restaurant.subscription = {
      plan: existsUser.subscriptionPlan._id,
      startDate: getStartDate(),
      expirationDate: getExpireDate(existsUser.subscriptionPlan.durationMonths),
      renovationDate: getRurationDate(existsUser.subscriptionPlan.durationMonths),
      status: 'ACTIVE',
    };

    // Guardar en la base de datos
    await Promise.all([restaurant.save(), user.save(), suscriptionPlan.save()]);

    res.json({
      message: 'Restaurante creada correctamente',
      restaurantId: restaurant._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// UPLOAD LOGO AND IMAGES OR GALERY
export const uploads = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { files } = req;

    if (!isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: 'El id del restaurante no es válido' });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(400).json({ message: 'El restaurante no existe' });
    }

    if (files?.logo) {
      const logo = await uploadFile(files.logo, FOLDERS.LOGO, 'image');
      restaurant.logo = transformUploadObject(logo);
    }

    if (files?.banner) {
      const banner = await uploadFile(files.banner, FOLDERS.BANNER, 'image');
      restaurant.banner = transformUploadObject(banner);
    }

    if (files?.gallery) {
      if (Array.isArray(files.gallery)) {
        // Eliminar imagenes anteriores
        if (restaurant.gallery.length > 0) {
          for (const image of restaurant.gallery) {
            await deleteFile(image.public_id, 'image');
          }

          // Limpiar el array de imagenes
          restaurant.gallery = [];
        }

        // Subir las nuevas imagenes
        for (const file of files.gallery) {
          const image = await uploadFile(file, FOLDERS.GALLERY, 'image');
          restaurant.gallery.push(transformUploadObject(image));
        }
      } else if (typeof files.gallery === 'object') {
        // Eliminar imagenes anteriores
        if (restaurant.gallery.length > 0) {
          for (const image of restaurant.gallery) {
            await deleteFile(image.public_id, 'image');
          }

          // Limpiar el array de imagenes
          restaurant.gallery = [];
        }

        // Subir las nuevas imagenes
        const image = await uploadFile(files.gallery, FOLDERS.GALLERY, 'image');
        restaurant.gallery.push(transformUploadObject(image));
      }
    }

    // Guardar en la base de datos
    await restaurant.save();

    res.json({ message: 'Imagenes subidas correctamente', slug: restaurant.slug });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// ACTUALIZAR
export const update = async (req, res) => {
  try {
    res.json({ message: 'Restaurante actualizada correctamente' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// ELIMINAR
export const remove = async (req, res) => {
  try {
    res.json({ message: 'Restaurante eliminada correctamente' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// OBTENER UNO
export const getOne = async (req, res) => {
  try {
    const { slug } = req.params;

    const restaurant = await Restaurant.findOne({
      slug,
      isBlocked: false,
      isActive: true,
      /* isVerified: true, */ // Solo mostrar restaurantes verificados
    })
      .select('-apiTokens -additionalUsers -subscription -owner -isBlocked -isActive -isVerified -updatedAt -__v')
      .populate({
        path: 'reviews.user',
        select: 'name slug lastname photo city country',
      });

    if (!restaurant) {
      return res.status(400).json({ message: 'Restaurante no encontrado' });
    }

    res.json(restaurant);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// CHECK RESTAURANT PERMITS
export const checkRestaurantPermits = async (req, res) => {
  try {
    const { restaurantId, slug } = req.params;
    const user = req.user;

    if (!isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: 'El id del restaurante no es válido' });
    }

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      slug,
    });

    if (!restaurant) {
      return res.status(400).json({ message: 'Restaurante no encontrado' });
    }

    const isOwner = restaurant.owner.toString() === user._id.toString();
    const isAdditionalUser = restaurant.additionalUsers.includes(user._id.toString());

    if (!isOwner && !isAdditionalUser) {
      return res.status(400).json({ message: 'No tienes permisos para gestionar este restaurante' });
    }

    res.json(restaurant);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// OBTENER TODOS
export const getAll = async (req, res) => {
  try {
    // Obtener restaurantes lo premium y empresas van primero
    const restaurants = await Restaurant.find()
      .select('name slug logo banner gallery description address phone email openingHours closingTime subscription.plan')
      .populate({
        path: 'subscription.plan',
        select: 'name price',
      })
      .sort({ 'subscription.plan.price': 1 });

    res.json(restaurants);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

import { isValidObjectId } from 'mongoose';
import validateFields from '../../helpers/validateFields.js';
import Coupon from '../../models/v1/Coupon.js';

// CREAR
export const create = async (req, res) => {
  try {
    const { restaurant } = req;

    // Validar campos requeridos
    const errorRequired = validateFields(['name', 'description', 'code'], req.body);
    if (errorRequired) {
      return res.status(400).json(errorRequired);
    }

    // Validar que el descuento sea mayor a 0
    if (req.body.discount <= 0) {
      return res.status(400).json({ message: 'El descuento debe ser mayor a 0' });
    }

    // Validar que el descuento no se mayor a 100
    if (req.body.discount > 100) {
      return res.status(400).json({ message: 'El descuento no puede ser mayor a 100' });
    }

    // Validar que la fecha de expiracion sea mayor a la fecha actual
    if (req.body.expiration < new Date()) {
      return res.status(400).json({ message: 'La fecha de expiración debe ser mayor a la fecha actual' });
    }

    // Validar que el stock sea mayor a 0
    if (req.body.stock <= 0) {
      return res.status(400).json({ message: 'El stock debe ser mayor a 0' });
    }

    // Validar que no exista un cupon con el mismo codigo o nombre
    const couponExist = await Coupon.findOne({
      $or: [{ code: new RegExp(req.body.code.trim(), 'i') }, { name: new RegExp(req.body.name.trim(), 'i') }],
      restaurant: restaurant._id,
    });

    if (couponExist) {
      return res.status(400).json({ message: 'Ya existe un cupón con ese nombre o código' });
    }

    // Creamos el cupon
    const coupon = new Coupon({
      name: req.body.name,
      description: req.body.description,
      restaurant: restaurant._id,
      code: req.body.code,
      discount: req.body.discount,
      expiration: req.body.expiration,
      maximum: req.body.maximum,
      stockOfCoupons: req.body.maximum,
      isActive: req.body.isActive,
    });

    // Guardamos el restaurant
    await coupon.save();

    res.json({
      message: 'Cupón creado correctamente',
      coupon,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// ACTUALIZAR
export const update = async (req, res) => {
  try {
    const { couponId, restaurantId } = req.params;

    // Validar campos requeridos
    const errorRequired = validateFields(['name', 'description', 'code'], req.body);
    if (errorRequired) {
      return res.status(400).json(errorRequired);
    }

    // Validar que el descuento sea mayor a 0
    if (req.body.discount <= 0) {
      return res.status(400).json({ message: 'El descuento debe ser mayor a 0' });
    }

    // Validar que el stock sea mayor a 0
    if (req.body.stock <= 0) {
      return res.status(400).json({ message: 'El stock debe ser mayor a 0' });
    }

    // Validar que el id del cupon sea válido
    if (!isValidObjectId(couponId)) {
      return res.status(400).json({ message: 'El id del cupón no es válido' });
    }

    // Validar que el id del restaurante sea válido
    if (!isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: 'El id del restaurante no es válido' });
    }

    // Validar que no exista un cupon con el mismo codigo
    const couponExist = await Coupon.findOne({
      $or: [{ code: new RegExp(req.body.code.trim(), 'i') }],
      restaurant: restaurantId,
      _id: { $ne: couponId },
    });

    if (couponExist) {
      return res.status(400).json({ message: 'Ya existe un cupón con ese código' });
    }

    // Buscamos el cupon
    const coupon = await Coupon.findOne({
      _id: couponId,
      restaurant: restaurantId,
    });

    if (!coupon) {
      return res.status(404).json({ message: 'No se encontró el cupón' });
    }

    // Actualizamos el cupon
    if (req.body.name) coupon.name = req.body.name;
    if (req.body.description) coupon.description = req.body.description;
    if (req.body.code) coupon.code = req.body.code;
    if (req.body.discount) coupon.discount = req.body.discount;
    if (req.body.expiration) coupon.expiration = req.body.expiration;
    if (req.body.maximum) {
      // Si el máximo del req es mayor al máximo actual, se actualiza el stock restante
      if (req.body.maximum > coupon.maximum) {
        coupon.stockOfCoupons += req.body.maximum - coupon.maximum;
      } else if (req.body.maximum < coupon.maximum) {
        // Si el máximo del req es menor al máximo actual, se actualiza el stock restante
        const stock = coupon.maximum - req.body.maximum;
        if (coupon.stockOfCoupons > stock) coupon.stockOfCoupons -= stock;
        else coupon.stockOfCoupons = 0;
      }

      coupon.maximum = req.body.maximum;
    }
    if (req.body.isActive) coupon.isActive = req.body.isActive;

    // Guardamos el cupon
    await coupon.save();

    res.json({
      message: 'Cupón actualizado correctamente',
      coupon,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// OBTENER TODOS LOS CUPONES POR RESTAURANTE
export const getAllByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Validar que el id del restaurante sea válido
    if (!isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: 'El id del restaurante no es válido' });
    }

    // Buscamos los cupones
    const coupons = await Coupon.find({
      restaurant: restaurantId,
    });

    res.json(coupons);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// OBTENER UN CUPON
export const getOne = async (req, res) => {
  try {
    const { couponId, restaurantId } = req.params;

    // Validar que el id del cupon sea válido
    if (!isValidObjectId(couponId)) {
      return res.status(400).json({ message: 'El id del cupón no es válido' });
    }

    // Validar que el id del restaurante sea válido
    if (!isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: 'El id del restaurante no es válido' });
    }

    // Buscamos el cupon
    const coupon = await Coupon.findOne({
      _id: couponId,
      restaurant: restaurantId,
    });

    if (!coupon) {
      return res.status(404).json({ message: 'No se encontró el cupón' });
    }

    res.json({
      message: 'Cupón obtenido correctamente',
      coupon,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// OBTENER UN CUPON POR CODIGO Y RESTAURANTE
export const getByCode = async (req, res) => {
  try {
    const { code, restaurantId } = req.params;

    // Validar que el id del restaurante sea válido
    if (!isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: 'El id del restaurante no es válido' });
    }

    // Buscamos el cupon
    const coupon = await Coupon.findOne({ code, restaurant: restaurantId, isActive: true }).select('-isActive -updatedAt -__v -createdAt');

    if (!coupon) {
      return res.status(404).json({ message: 'Cupón no encontrado' });
    }

    // Validar que el cupon no haya expirado
    if (coupon.expiration < new Date()) {
      return res.status(404).json({ message: 'Cupón expirado' });
    }

    // Validar que el cupon no haya excedido el máximo de usos
    if (coupon.stockOfCoupons <= 0) {
      return res.status(404).json({ message: 'Cupón agotado' });
    }

    res.json(coupon);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// CAMBIAR ESTADO DE UN CUPON
export const changeStatus = async (req, res) => {
  try {
    const { couponId, restaurantId } = req.params;

    // Validar que el id del cupon sea válido
    if (!isValidObjectId(couponId)) {
      return res.status(400).json({ message: 'El id del cupón no es válido' });
    }

    // Validar que el id del restaurante sea válido
    if (!isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: 'El id del restaurante no es válido' });
    }

    // Buscamos el cupon
    const coupon = await Coupon.findOne({
      _id: couponId,
      restaurant: restaurantId,
    });

    if (!coupon) {
      return res.status(404).json({ message: 'No se encontró el cupón' });
    }

    // Actualizamos el cupon
    coupon.isActive = !coupon.isActive;

    // Guardamos el cupon
    await coupon.save();

    res.json({
      message: 'Cupón actualizado correctamente',
      coupon,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

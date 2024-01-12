import { isValidObjectId } from 'mongoose';
import Menu from '../../models/v1/Menu.js';
import Order, { ORDER_STATUS, PAYMENT_STATUS } from '../../models/v1/Order.js';
import Coupon from '../../models/v1/Coupon.js';

// CREAR ORDEN
export const create = async (req, res) => {
  try {
    const { user } = req;
    const { restaurantId, coupon, discount, total, subTotal, address, latitude, longitude, items } = req.body;

    // Validando que el usuario haya enviado los datos necesarios
    if (!restaurantId) {
      return res.status(400).json({ message: 'El id del restaurante es requerido' });
    }

    if (!items || !items.length) {
      return res.status(400).json({ message: 'Los items son requeridos' });
    }

    /*     if (!total) {
      return res.status(400).json({ message: 'El total es requerido' });
    } */

    if (!address || !latitude || !longitude) {
      return res.status(400).json({ message: 'La dirección es requerida' });
    }

    // Creando la orden
    const order = new Order({
      user: user._id,
      restaurant: restaurantId,
      shippingAddress: address,
      total,
      subTotal,
      discount,
      latitude,
      longitude,
    });

    for (const item of items) {
      const { menuId, quantity } = item;

      const menu = await Menu.findById(menuId);
      if (!menu) {
        return res.status(404).json({ message: `El menu ${menu.name.toLowerCase()} no existe` });
      }

      if (menu.stock < quantity) {
        return res.status(400).json({ message: `El menu ${menu.name.toLowerCase()} no tiene stock suficiente` });
      }
    }

    for (const item of items) {
      const { menuId, price, quantity, discount } = item;

      order.items.push({
        menu: menuId,
        price,
        quantity,
        discount,
      });

      // Actualizando el stock de cada menu
      Menu.findByIdAndUpdate(menuId, { $inc: { stock: -quantity } }).exec();
    }

    if (coupon) {
      // Validando que el cupon exista
      const couponExist = await Coupon.findOne({
        code: coupon.code,
        restaurant: coupon.restaurant,
        isActive: true,
      });

      if (!couponExist) {
        return res.status(404).json({ message: 'El cupón no existe' });
      }

      // Validando que el cupon no esté vencido
      if (couponExist.expiration < new Date()) {
        return res.status(400).json({ message: 'El cupón ya expiró' });
      }

      // Validando que el cupon maximo de usos no se haya alcanzado
      if (couponExist.stockOfCoupons <= 0) {
        return res.status(400).json({ message: 'El cupón alcanzó el máximo de usos' });
      }

      order.coupon = {
        name: couponExist.name,
        code: couponExist.code,
        discount: couponExist.discount,
      };

      Coupon.findByIdAndUpdate(couponExist._id, { $inc: { stockOfCoupons: -1 } }).exec();
    }

    // Guardando la orden
    const orderSave = await order.save();

    res.json({
      message: 'Orden creada correctamente',
      order: orderSave,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// OBTENER ORDENES DEL USUARIO
export const getOrdersByUser = async (req, res) => {
  try {
    const { user } = req;

    const orders = await Order.find({ user: user._id, isActive: true })
      .select('-__v -isActive')
      .populate([
        {
          path: 'restaurant',
          select: 'name slug address logo openingHours closingTime paymentMethods phone ',
        },
        {
          path: 'items.menu',
          // Solo una imagen de el array de items.menu.images
          select: {
            name: 1,
            slug: 1,
            images: { $slice: 1 },
          },
        },
        {
          path: 'user',
          select: 'name lastname slug phone city country photo',
        },
      ])
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// CANCELAR ORDEN
export const cancelOrder = async (req, res) => {
  try {
    const { user } = req;
    const { orderId } = req.params;

    if (!isValidObjectId(orderId)) {
      return res.status(400).json({ message: 'El id de la orden no es válido' });
    }

    const order = await Order.findOne({ _id: orderId, user: user._id, isActive: true });

    if (!order) {
      return res.status(404).json({ message: 'La orden no existe' });
    }

    // Si la orde ya a sido rechazada no se puede cancelar
    if (order.status === ORDER_STATUS.REJECTED) {
      return res.status(400).json({
        message: 'La orden ha sido rechazada, Por el restaurante',
        status: order.status,
      });
    }

    // Si la orde no está en estado EMITTED no se puede cancelar
    if (order.status !== ORDER_STATUS.EMITTED) {
      return res.status(400).json({
        message: 'La orden no se puede cancelar, Comuniquese con el restaurante para más indicarle que ya no desea el pedido',
        status: order.status,
      });
    }

    // Si la orden ya está cancelada no se puede cancelar
    if (order.status === ORDER_STATUS.CANCELLED) {
      return res.status(400).json({ message: 'La orden ya ha sido cancelada', status: order.status });
    }

    order.status = ORDER_STATUS.CANCELLED;

    await order.save();

    res.json({
      message: 'Orden cancelada correctamente',
      status: order.status,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// CAMBIAR ESTADO DE LA ORDEN
export const changeOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(orderId)) {
      return res.status(400).json({ message: 'El id de la orden no es válido' });
    }

    if (!status) {
      return res.status(400).json({ message: 'El estado es requerido' });
    }

    // Validando que el estado sea válido
    if (!Object.values(ORDER_STATUS).includes(status)) {
      return res.status(400).json({ message: 'El estado no es válido' });
    }

    const order = await Order.findOne({ _id: orderId, isActive: true });
    if (!order) {
      return res.status(404).json({ message: 'La orden no existe' });
    }

    // Si la orde no está en estado EMITTED no se puede cancelar
    if (order.status === ORDER_STATUS.CANCELLED) {
      return res.status(400).json({ message: 'La orden ya ha sido cancelada', status: order.status, paymentStatus: order.paymentStatus });
    }

    // Si la orde ya a sido rechazada no se puede cancelar
    if (order.status === ORDER_STATUS.REJECTED) {
      return res.status(400).json({ message: 'La orden ha sido rechazada, Por el restaurante', status: order.status, paymentStatus: order.paymentStatus });
    }

    // Si la orden ya a sido pagada
    if (order.paymentStatus === PAYMENT_STATUS.PAID) {
      return res.status(400).json({ message: 'La orden ya ha sido pagada', status: order.status, paymentStatus: order.paymentStatus });
    }

    order.status = status;

    await order.save();

    res.json({
      message: 'Estado de la orden actualizado correctamente',
      status: order.status,
      paymentStatus: order.paymentStatus,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// OBTENER ORDENES DEL RESTAURANTE
export const getOrdersByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const orders = await Order.find({ restaurant: restaurantId, isActive: true })
      .select('-restaurant -__v -isActive')
      .populate([
        {
          path: 'user',
          select: 'name lastname slug phone city country photo',
        },
        {
          path: 'items.menu',
          // Solo una imagen de el array de items.menu.images
          select: {
            name: 1,
            slug: 1,
            images: { $slice: 1 },
          },
        },
        {
          path: 'restaurant',
          select: 'name slug address logo openingHours closingTime paymentMethods phone',
        },
      ])
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// OBTENER ORDEN POR EL RESTAURANTE Y EL ID DE LA ORDEN
export const getOrderById = async (req, res) => {
  try {
    const { restaurantId, orderId } = req.params;

    if (!isValidObjectId(orderId)) {
      return res.status(400).json({ message: 'El id de la orden no es válido' });
    }

    if (!isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: 'El id del restaurante no es válido' });
    }

    const order = await Order.findOne({ _id: orderId, restaurant: restaurantId, isActive: true })
      .select('-restaurant -__v -isActive')
      .populate([
        {
          path: 'user',
          select: 'name lastname slug phone city country photo',
        },
        {
          path: 'restaurant',
          select: 'name slug address logo openingHours closingTime paymentMethods phone latitude longitude',
        },
        {
          path: 'items.menu',
          // Solo una imagen de el array de items.menu.images
          select: {
            name: 1,
            slug: 1,
            images: { $slice: 1 },
          },
        },
        /* {
          path: 'coupon',
          select: 'name code discount',
        }, */
      ]);

    if (!order) {
      return res.status(404).json({ message: 'La orden no existe' });
    }

    res.json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// PAGAR ORDEN POR EL RESTAURANTE Y EL ID DE LA ORDEN
export const payOrder = async (req, res) => {
  try {
    const { restaurantId, orderId } = req.params;

    if (!isValidObjectId(orderId)) {
      return res.status(400).json({ message: 'El id de la orden no es válido' });
    }

    if (!isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: 'El id del restaurante no es válido' });
    }

    const order = await Order.findOne({ _id: orderId, restaurant: restaurantId, isActive: true });

    if (!order) {
      return res.status(404).json({ message: 'La orden no existe' });
    }

    // Si el estado esta en emitido, rechazado, cancelado no se puede pagar
    if (order.status === ORDER_STATUS.EMITTED || order.status === ORDER_STATUS.REJECTED || order.status === ORDER_STATUS.CANCELLED) {
      return res.status(400).json({ message: 'La orden no se puede pagar', status: order.status, paymentStatus: order.paymentStatus });
    }

    // Si la orden ya está pagada no se puede pagar
    if (order.paymentStatus === PAYMENT_STATUS.PAID) {
      return res.status(400).json({ message: 'La orden ya ha sido pagada', status: order.status, paymentStatus: order.paymentStatus });
    }

    // Si el estado de la orden esta cancelado no se puede pagar
    if (order.paymentStatus === PAYMENT_STATUS.CANCELLED) {
      return res.status(400).json({ message: 'El pago de la orden ha sido cancelado', status: order.status, paymentStatus: order.paymentStatus });
    }

    order.paymentStatus = PAYMENT_STATUS.PAID;
    order.status = ORDER_STATUS.COMPLETED;

    await order.save();

    res.json({
      message: 'Orden pagada correctamente',
      status: order.status,
      paymentStatus: order.paymentStatus,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

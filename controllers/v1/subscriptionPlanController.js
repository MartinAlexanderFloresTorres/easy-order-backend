import { v4 } from 'uuid';
import { isValidObjectId } from 'mongoose';
import SubscriptionPlan from '../../models/v1/SubscriptionPlan.js';
import { emailRegisterRestaurant } from '../../emails/v1/emailRegiterRestaurant.js';

// OBTENER TODOS
export const findAll = async (req, res) => {
  try {
    const subscriptionPlans = await SubscriptionPlan.find();
    res.json(subscriptionPlans);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// SUSCRIBIRSE A UN PLAN
export const subscribe = async (req, res) => {
  try {
    const { planId } = req.body;
    const { user } = req;

    if (!isValidObjectId(planId)) {
      return res.status(400).json({ message: 'El id del plan de suscripción no es válido' });
    }

    const subscriptionPlan = await SubscriptionPlan.findById(planId);

    if (!subscriptionPlan) {
      return res.status(404).json({ message: 'No existe el plan de suscripción' });
    }

    /* // Comprobamos si el usuario ya tiene un plan de suscripción
    if (user.subscriptionPlan) {
      return res.status(400).json({ message: 'Ya tienes un plan de suscripción' });
    } */

    // Comprobamos si hay stock del plan de suscripción
    if (subscriptionPlan.stock <= 0) {
      return res.status(400).json({ message: 'No hay stock del plan de suscripción' });
    }

    // Restamos el stock del plan de suscripción
    subscriptionPlan.stock--;

    // generamos el token para crear un restaurante
    user.tokenCreateRestaurant = v4();
    // Actualizamos el plan de suscripción del usuario
    user.subscriptionPlan = subscriptionPlan._id;

    // Guardamos los cambios
    await Promise.all([user.save(), subscriptionPlan.save()]);

    // Enviar el email de crear restaurante
    emailRegisterRestaurant({
      email: user.email,
      name: user.name,
      token: user.tokenCreateRestaurant,
    });

    res.json({
      message: `Te has suscrito al plan de suscripción ${subscriptionPlan.name} correctamente`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

import Restaurant from '../../models/v1/Restaurant.js';

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN', // Dueño de la plataforma
  ADMIN: 'ADMIN', // Dueño del restaurante
  STAFF: 'STAFF', // Personal del restaurante
  WAITER: 'WAITER', // Mesero
  CHEF: 'CHEF', // Cocinero
  CASHIER: 'CASHIER', // Cajero
  ALL: ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'WAITER', 'CHEF', 'CASHIER'],
};

/**
 * @description Verifica si el usuario tiene el rol necesario para realizar la acción
 * @param  {...string} roles Roles permitidos para realizar la acción
 * @returns {Function} Middleware de express  `req.restaurant` es agregado a la petición
 * @example checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CASHIER, ROLES.STAFF, ROLES.WAITER)
 * @example checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN)
 */

const checkRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const restaurantId = req.user.restaurant ? req.user.restaurant._id : '';

      if (!user) {
        return res.status(401).json({ message: 'Implementar middleware checkAuth' });
      }

      if (!restaurantId) {
        return res.status(401).json({ message: 'El usuario no tiene un restaurante asignado' });
      }

      const restaurant = await Restaurant.findOne({
        _id: restaurantId,
        $or: [{ owner: user._id }, { 'additionalUsers.user': user._id }],
        isActive: true,
      });

      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurante no encontrado' });
      }

      const additionalUsers = restaurant.additionalUsers;
      const owner = restaurant.owner;

      if (
        user._id.toString() !== owner.toString() ||
        additionalUsers.some((item) => item.user.toString() === user._id.toString() && roles.includes(item.role))
      ) {
        return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
      }

      req.restaurant = restaurant;
      return next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: 'Token no valido' });
    }
  };
};

export default checkRole;

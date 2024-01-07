import express from 'express';
import checkRole, { ROLES } from '../../middlewares/v1/checkRole.js';
import checkAuth from '../../middlewares/v1/checkAuth.js';
import {
  cancelOrder,
  changeOrderStatus,
  create,
  getOrderById,
  getOrdersByRestaurant,
  getOrdersByUser,
  payOrder,
} from '../../controllers/v1/orderController.js';

// Instanciando el router de express
const orderRoutes = express.Router();

// Definiendo las rutas
orderRoutes.post('/', checkAuth, create);
orderRoutes.get('/', checkAuth, getOrdersByUser);
orderRoutes.get('/:restaurantId/by/:orderId', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), getOrderById);
orderRoutes.get('/:restaurantId', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), getOrdersByRestaurant);
orderRoutes.patch('/:orderId/cancel', checkAuth, cancelOrder);
orderRoutes.patch('/:orderId/status', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), changeOrderStatus);
orderRoutes.patch('/pay/:restaurantId/by/:orderId', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), payOrder);

export default orderRoutes;

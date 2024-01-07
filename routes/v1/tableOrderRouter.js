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
} from '../../controllers/v1/tableOrderController.js';

// Instanciando el router de express
const tableOrderRouter = express.Router();

// Definiendo las rutas
tableOrderRouter.post('/', checkAuth, create);
tableOrderRouter.get('/', checkAuth, getOrdersByUser);
tableOrderRouter.get('/:restaurantId/by/:orderId', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), getOrderById);
tableOrderRouter.get('/:restaurantId', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), getOrdersByRestaurant);
tableOrderRouter.patch('/:orderId/cancel', checkAuth, cancelOrder);
tableOrderRouter.patch('/:orderId/status', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), changeOrderStatus);
tableOrderRouter.patch('/pay/:restaurantId/by/:orderId', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), payOrder);

export default tableOrderRouter;

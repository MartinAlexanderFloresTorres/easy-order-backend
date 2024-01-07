import express from 'express';
import checkAuth from '../../middlewares/v1/checkAuth.js';
import checkRole, { ROLES } from '../../middlewares/v1/checkRole.js';
import { create, getAllByRestaurant, getOne, update, changeStatus, getByCode } from '../../controllers/v1/couponController.js';

// Instanciando el router de express
const couponRouter = express.Router();

// Definiendo las rutas
couponRouter.get('/:restaurantId', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), getAllByRestaurant);
couponRouter.post('/', checkAuth, checkRole(ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), create);
couponRouter.get('/:restaurantId/:slug', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), getOne);
couponRouter.patch('/:restaurantId/:couponId', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), update);
couponRouter.patch('/status/:restaurantId/:couponId', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), changeStatus);
couponRouter.get('/apply/:restaurantId/:code', checkAuth, getByCode);

export default couponRouter;

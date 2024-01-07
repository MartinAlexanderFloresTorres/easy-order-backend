import express from 'express';
import checkAuth from '../../middlewares/v1/checkAuth.js';
import checkRole, { ROLES } from '../../middlewares/v1/checkRole.js';
import { create, getAllByRestaurant, getOne, status, update, uploads } from '../../controllers/v1/categoryController.js';
import fileupload from 'express-fileupload';

// Instanciando el router de express
const categoryRoutes = express.Router();

// Definiendo las rutas
categoryRoutes.get('/restaurant/:restaurantId', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), getAllByRestaurant);
categoryRoutes.post('/', checkAuth, checkRole(ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), create);
categoryRoutes.patch(
  '/uploads/:restaurantId/:categoryId',
  checkAuth,
  checkRole(ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF),
  fileupload({ useTempFiles: false }),
  uploads,
);
categoryRoutes.get('/:slug/:restaurantId', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), getOne);
categoryRoutes.patch('/:categoryId', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), update);
categoryRoutes.patch('/status/:categoryId', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), status);

export default categoryRoutes;

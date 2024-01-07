import express from 'express';
import checkAuth from '../../middlewares/v1/checkAuth.js';
import checkRole, { ROLES } from '../../middlewares/v1/checkRole.js';
import { create, getAll, getAllMenu, getAllMenuOffers, getOne, renewStock, search, status, update, uploads } from '../../controllers/v1/menuController.js';
import fileupload from 'express-fileupload';

// Instanciando el router de express
const menuRoutes = express.Router();

// Definiendo las rutas
menuRoutes.get('/', getAll);
menuRoutes.get('/search', search);
menuRoutes.get('/offers', getAllMenuOffers);
menuRoutes.get('/:restaurantId', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), getAllMenu);
menuRoutes.post('/', checkAuth, checkRole(ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), create);
menuRoutes.patch('/uploads/:restaurantId/:menuId', checkAuth, checkRole(ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), fileupload({ useTempFiles: false }), uploads);
menuRoutes.get('/by/:restaurantSlug/:menuSlug', getOne);
menuRoutes.patch('/:menuId', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), update);
menuRoutes.patch('/status/:menuId', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), status);
menuRoutes.patch('/renew-stock/:menuId/:restaurantId', checkAuth, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), renewStock);

export default menuRoutes;

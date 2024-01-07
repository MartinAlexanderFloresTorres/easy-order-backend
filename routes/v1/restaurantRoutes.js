import express from 'express';
import checkAuth from '../../middlewares/v1/checkAuth.js';
import { checkRestaurantPermits, create, getAll, getOne, remove, update, uploads } from '../../controllers/v1/restaurantController.js';
import fileupload from 'express-fileupload';

// Instanciando el router de express
const restaurantRoutes = express.Router();

// Definiendo las rutas
restaurantRoutes.get('/', getAll);
restaurantRoutes.get('/by/:slug', getOne);
restaurantRoutes.post('/:tokenCreateRestaurant', checkAuth, create);
restaurantRoutes.patch('/uploads/:restaurantId', checkAuth, fileupload({ useTempFiles: false }), uploads);
restaurantRoutes.patch('/:slug', checkAuth, fileupload, update);
restaurantRoutes.delete('/:slug', checkAuth, remove);
restaurantRoutes.get('/check-permits/:restaurantId/:slug', checkAuth, checkRestaurantPermits);

export default restaurantRoutes;

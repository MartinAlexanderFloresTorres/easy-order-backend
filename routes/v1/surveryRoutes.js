import express from 'express';
import checkAuth from '../../middlewares/v1/checkAuth.js';
import checkRole, { ROLES } from '../../middlewares/v1/checkRole.js';
import { create, getAllByRestaurant, getAllResolvedByRestaurant, getOne, remove, saveAnswer, update } from '../../controllers/v1/surveryController.js';

// Instanciando el router de express
const surveryRoutes = express.Router();

// Definiendo las rutas
surveryRoutes.post('/:restaurantId', checkAuth, checkRole(ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), create);
surveryRoutes.patch('/:surveyId', checkAuth, checkRole(ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), update);
surveryRoutes.get('/:restaurantId', checkAuth, checkRole(ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), getAllByRestaurant);
surveryRoutes.get('/by/:surveyId', checkAuth, checkRole(ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), getOne);
surveryRoutes.post('/answer/:surveyId', checkAuth, saveAnswer);
surveryRoutes.patch('/status/:surveyId', checkAuth, checkRole(ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), remove);
surveryRoutes.get('/resolved/:restaurantId', checkAuth, checkRole(ROLES.ADMIN, ROLES.STAFF, ROLES.CHEF), getAllResolvedByRestaurant);

export default surveryRoutes;

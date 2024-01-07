import express from 'express';
import checkAuth from '../../middlewares/v1/checkAuth.js';
import { findAll, subscribe } from '../../controllers/v1/subscriptionPlanController.js';

// Instanciando el router de express
const subscriptionPlanRouter = express.Router();

// Definiendo las rutas
subscriptionPlanRouter.get('/', findAll);
subscriptionPlanRouter.post('/subscribe', checkAuth, subscribe);

export default subscriptionPlanRouter;

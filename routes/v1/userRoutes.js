import express from 'express';
import checkAuth from '../../middlewares/v1/checkAuth.js';
import {
  register,
  login,
  tokenConfirmValid,
  recoverPassword,
  checkTokenRecoverPassword,
  newPassword,
  updateProfile,
  authenticate,
  confirmationCode,
  checkTokenCreateRestaurant,
} from '../../controllers/v1/userController.js';

// Instanciando el router de express
const userRoutes = express.Router();

userRoutes.post('/register', register); // crea un nuevo usuario
userRoutes.post('/login', login); // autenticacion del usuario

userRoutes.route('/confirmation-code/:tokenConfirm').get(tokenConfirmValid).post(confirmationCode); // confirmar usuario
userRoutes.post('/recover-password', recoverPassword); // recuperar password
userRoutes.put('/update-profile', checkAuth, updateProfile); // actualizar el perfil de un usuario
userRoutes.route('/recover-password/:tokenRecoverPassword').get(checkTokenRecoverPassword).post(newPassword); // Validar token y definir nuevo password
userRoutes.get('/authenticate', checkAuth, authenticate); // obtener el perfil de un usuario
userRoutes.get('/new-restaurant/available-for-create/:tokenCreateRestaurant', checkAuth, checkTokenCreateRestaurant); // Validar token y definir nuevo password

export default userRoutes;

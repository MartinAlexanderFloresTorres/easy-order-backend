import { v4 } from 'uuid';
import User from '../../models/v1/User.js';
import generateJWT from '../../helpers/v1/generateJWT.js';
import { emailRegister } from '../../emails/v1/emailRegister.js';
import { emailRecoverPassword } from '../../emails/v1/emailRecoverPassword.js';
import { generateConfirmationCode } from '../../helpers/v1/generate-confirmation-code.js';
import validateFields from '../../helpers/validateFields.js';
import validateEmail from '../../helpers/validateEmail.js';
import getDataUser from '../../helpers/v1/getDataUser.js';

// REGISTRAR A USUARIO
export const register = async (req, res) => {
  // parametros requeridos { name, password, email, city, country }
  const { email, name, lastname, password, city, country } = req.body;

  // Validar campos requeridos
  const errorRequired = validateFields(['name', 'lastname', 'password', 'email', 'city', 'country'], req.body);
  if (errorRequired) {
    return res.status(400).json(errorRequired);
  }

  // Validar formato de email
  const errorEmail = validateEmail(email);
  if (errorEmail) {
    return res.status(400).json(errorEmail);
  }

  try {
    // verifica si el email existe
    const existeUser = await User.findOne({ email });
    if (existeUser) {
      const error = new Error('El email ya esta registrado');
      return res.status(400).json({ message: error.message });
    }

    // crea un user
    const user = new User({
      email,
      name,
      lastname,
      city,
      country,
      password,
    });

    // generamos el token de confirmacion
    user.tokenConfirm = v4();

    // Generar codigo de confirmacion de 5 digitos de numero y string unicos
    user.confirmationCode = generateConfirmationCode(5);

    // almacena el user
    await user.save();

    // Enviar el email de confirmacion
    emailRegister({
      email: user.email,
      name: user.name,
      token: user.tokenConfirm,
      confirmationCode: user.confirmationCode,
    });

    // respuesta
    res.json({
      message: 'Cuenta creada correctamente, comprueba tu email para confirmar tu cuenta',
      tokenConfirm: user.tokenConfirm,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// LOGIN DE USUARIO
export const login = async (req, res) => {
  // Comprobar si el user existe
  const { email, password } = req.body;

  // Validar campos requeridos
  const errorRequired = validateFields(['password', 'email'], req.body);
  if (errorRequired) {
    return res.status(400).json(errorRequired);
  }

  // Validar formato de email
  const errorEmail = validateEmail(email);
  if (errorEmail) {
    return res.status(400).json(errorEmail);
  }

  try {
    const user = await User.findOne({ email }).populate({
      path: 'restaurant',
      select: 'name slug',
    });
    if (!user) {
      const error = new Error('El usuario no existe');
      return res.status(404).json({ message: error.message });
    }

    // Comprobar si el user esta confirmado
    if (!user.isConfirmed) {
      const error = new Error('Tu cuenta no ha sido confirmada');
      return res.status(403).json({ message: error.message });
    }

    // Comprobar su password del user
    if (await user.checkPassword(password)) {
      res.json({
        message: 'Bienvenido',
        jwt: generateJWT(user._id),
        user: getDataUser(user),
      });
    } else {
      const error = new Error('El password es incorrecto');
      return res.status(403).json({ message: error.message });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// CONFIRMAR A LAS CUENTAS
export const confirmationCode = async (req, res) => {
  const { tokenConfirm } = req.params;
  const { confirmationCode } = req.body;

  if (!confirmationCode) {
    const error = new Error('El codigo de confirmacion es requerido');
    return res.status(403).json({ message: error.message });
  }

  if (confirmationCode.length < 5 || confirmationCode.length > 5) {
    const error = new Error('El codigo de confirmacion debe tener 5 digitos');
    return res.status(403).json({ message: error.message });
  }

  try {
    // Comprobar si el user existe
    const userConfirm = await User.findOne({ tokenConfirm }).populate({
      path: 'restaurant',
      select: 'name slug',
    });

    if (!userConfirm) {
      const error = new Error('El token de confirmacion no es válido');
      return res.status(403).json({ message: error.message });
    }

    // Comprobar si el user esta confirmado
    if (userConfirm.isConfirmed) {
      const error = new Error('Tu cuenta ya ha sido confirmada');
      return res.status(403).json({ message: error.message });
    }

    // Comprobar si el codigo de confirmacion es correcto
    if (userConfirm.confirmationCode !== confirmationCode) {
      const error = new Error('El codigo de confirmacion no es correcto');
      return res.status(403).json({ message: error.message });
    }

    // Confirmar el user
    userConfirm.isConfirmed = true;
    userConfirm.confirmationCode = null;
    userConfirm.tokenConfirm = null;

    await userConfirm.save();

    return res.json({
      message: 'Su cuenta ha sido confirmada correctamente',
      jwt: generateJWT(userConfirm._id),
      user: getDataUser(userConfirm),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// VALIDAR TOKEN DE CONFIRMACION
export const tokenConfirmValid = async (req, res) => {
  const { tokenConfirm } = req.params; // acceder al token

  try {
    // Comprobar si el user existe
    const userConfirm = await User.findOne({ tokenConfirm });

    if (!userConfirm) {
      const error = new Error('El token de confirmacion no es válido');
      return res.status(403).json({ message: error.message });
    }

    return res.json({ message: 'Token de confirmacion válido' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// RECUPERAR PASSWORD
export const recoverPassword = async (req, res) => {
  // Comprobar si el user existe
  const { email } = req.body;

  // Validar campos requeridos
  const errorRequired = validateFields(['email'], req.body);
  if (errorRequired) {
    return res.status(400).json(errorRequired);
  }

  // Validar formato de email
  const errorEmail = validateEmail(email);
  if (errorEmail) {
    return res.status(400).json(errorEmail);
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error('El usuario no existe');
      return res.status(404).json({ message: error.message });
    }

    user.tokenRecoverPassword = v4();

    await user.save();

    // Enviar el email
    emailRecoverPassword({
      email: user.email,
      name: user.name,
      tokenRecoverPassword: user.tokenRecoverPassword,
    });
    res.json({ message: 'Hemos enviado un email con las instruciones' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// VALIDAR TOKEN DE RECUPERACION DE PASSWORD
export const checkTokenRecoverPassword = async (req, res) => {
  const { tokenRecoverPassword } = req.params;

  try {
    const tokenValid = await User.findOne({ tokenRecoverPassword });
    if (tokenValid) {
      return res.json({ message: `Recupera tu password ${tokenValid.name}` });
    }

    const error = new Error('Token no Válido');
    return res.status(403).json({ message: error.message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// ACTUALIZAR PERFIL
export const updateProfile = async (req, res) => {
  // Comprobar si el user existe
  const { email } = req.user;
  const { name, password, passwordNuevo } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error('El user no existe');
      return res.status(404).json({ message: error.message });
    }

    // Comprobar si el user esta confirmado
    if (!user.isConfirmed) {
      const error = new Error('Tu cuenta no ha sido confirmada');
      return res.status(403).json({ message: error.message });
    }

    // Comprobar su password del user
    if (await user.checkPassword(password)) {
      if (passwordNuevo) {
        user.password = passwordNuevo;
      }
      if (name) {
        user.name = name;
      }

      await user.save();
      if (passwordNuevo && name === user.name) {
        res.json({ message: 'Password a sido modificado correctamente' });
      } else {
        res.json({ message: 'Su name ha sido actualizado correctamente' });
      }
    } else {
      const error = new Error('El password es incorrecto');
      return res.status(403).json({ message: error.message });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// NUEVO PASSWORD
export const newPassword = async (req, res) => {
  const { tokenRecoverPassword } = req.params;
  const { password } = req.body;

  // Validar campos requeridos
  const errorRequired = validateFields(['password'], req.body);
  if (errorRequired) {
    return res.status(400).json(errorRequired);
  }

  try {
    const user = await User.findOne({ tokenRecoverPassword });

    if (!user) {
      const error = new Error('El token no es válido');
      return res.status(403).json({ message: error.message });
    }

    user.password = password;
    user.tokenRecoverPassword = null;

    await user.save();
    return res.json({ message: 'Password modificado correctamente' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

// OBTENER PERFIL
export const authenticate = async (req, res) => {
  const { user } = req;
  res.json(user);
};

// CHECKEAR EL TOKEN DE CREAR RESTAURANTE ES VALIDO
export const checkTokenCreateRestaurant = async (req, res) => {
  const { tokenCreateRestaurant } = req.params;
  const { user } = req;

  try {
    const tokenValid = await User.findOne({ tokenCreateRestaurant });

    if (!tokenValid) return res.status(403).json({ message: 'El token no es válido' });

    // Comprobar si el user esta confirmado
    if (!tokenValid.isConfirmed) return res.status(403).json({ message: 'Tu cuenta no ha sido confirmada' });

    // Comprobar si es el mismo user
    if (tokenValid._id.toString() !== user._id.toString()) return res.status(403).json({ message: 'No tienes permisos para crear un restaurante' });

    return res.json({ message: `Crea tu restaurante ${tokenValid.name}` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lo sentimos, ha ocurrido un error' });
  }
};

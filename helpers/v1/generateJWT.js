import jwt from 'jsonwebtoken';

/**
 *
 * @param {*} id
 * @returns  {string} token
 * @description Genera un token de autenticacion
 * @example generateJWT(id) // retorna un token de autenticacion
 */

// Generamos un jsonwebtoken del id el usuario
const generateJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15d',
  });
};
export default generateJWT;

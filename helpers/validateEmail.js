/**
 *
 * @param {*} email  Email a validar
 * @returns `{ message: error.message } | undefined`
 * @description Valida el formato del email
 * @example validateEmail(email); // Valida el formato del email
 */

const validateEmail = (email) => {
  // Validar formato de email
  const emailFormat = /\S+@\S+\.\S+/;
  if (!emailFormat.test(email)) {
    const error = new Error('El email no es válido');
    return { message: error.message };
  }
};

export default validateEmail;

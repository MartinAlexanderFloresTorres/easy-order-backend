/**
 *
 * @param {*} type  Tipo de imagen
 * @returns True si es una imagen valida, false si no lo es
 * @description Valida si el tipo de imagen es valido
 * @example  validateImage('image/png') // true
 * @example  validateImage('image/pdf') // false
 */
const validateImage = (type) => {
  const formatos = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml'];
  return formatos.includes(type);
};

export default validateImage;

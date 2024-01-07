/**
 *
 * @param {number} number - default 5
 * @returns  {string} codigo generado
 * @description Generate confirmation code
 * @example generateConfirmationCode() // 5X8H3
 * @example generateConfirmationCode(5) // X8H3D
 * @example generateConfirmationCode(10) // 5X8H3D9F2G
 */

export const generateConfirmationCode = (number = 5) => {
  if (typeof number !== 'number' || number <= 0) {
    throw new Error('La longitud debe ser un número positivo');
  }

  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  const code = [];
  for (let i = 0; i < number; i++) {
    // Obtener un índice aleatorio de la cadena de caracteres
    const randomIndex = Math.floor(Math.random() * charactersLength);
    // Asegurarse de que el índice esté dentro del rango de la cadena de caracteres
    const character = characters.charAt(randomIndex);
    // Agregar el caracter a la cadena de código
    code.push(character);
  }
  return code.join('');
};

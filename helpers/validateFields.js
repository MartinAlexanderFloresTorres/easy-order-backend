/**
 *
 * @param {*} fields Array con los campos requeridos
 * @param {*} body Objeto con los campos enviados en el body
 * @returns  `{ message: error.message } | undefined`
 * @description Valida los campos requeridos y vacios
 * @example validateFields(['name', 'email', 'password'], req.body); // Valida los campos requeridos y vacios
 *
 */

const validateFields = (fields = [], body) => {
  // Validar campos requeridos
  const requiredFields = fields;
  const sentfields = Object.keys(body);
  const validfields = requiredFields.every((campo) => sentfields.includes(campo));

  if (!validfields) {
    const error = new Error('Hay campos que no se esperaban');
    return { message: error.message };
  }

  /* for (const key in validfields) {
    const campoValue = body[key];
    const campoField = fields[key];

    if (typeof campoValue === 'string') {
      if (campoValue.trim() === '') {
        const error = new Error(`El campo ${key} no puede estar vacio`);
        return { message: error.message };
      }
    }

    // campoField es string | object `{required: boolean, message: string, min: number, max: number, minLength: number, maxLength: number, name: string}`
    //  campoValue es string | number | object | array

    if (typeof campoValue === 'object') {
      if (Array.isArray(campoValue)) {
        const keyVal = fields[key];
        if (typeof keyVal === 'object') {
          if (keyVal.required) {
            if (campoValue.length === 0) {
              const error = new Error(`El campo ${key} no puede estar vacio`);
              return { message: error.message };
            }
          }
        }

        if (campoValue.length === 0) {
          const error = new Error(`El campo ${key} no puede estar vacio`);
          return { message: error.message };
        }
      }

      if (typeof campoValue === 'object') {
        if (campoField.required) {
          if (campoValue === null) {
            const error = new Error(`El campo ${key} no puede estar vacio`);
            return { message: error.message };
          }
        }
      }

      if (typeof campoValue === 'number') {
        if (campoField.min) {
          if (campoValue < campoField.min) {
            const error = new Error(`El campo ${key} debe ser mayor a ${campoField.min}`);
            return { message: error.message };
          }
        }

        if (campoField.max) {
          if (campoValue > campoField.max) {
            const error = new Error(`El campo ${key} debe ser menor a ${campoField.max}`);
            return { message: error.message };
          }
        }
      }

      if (typeof campoValue === 'string') {
        if (campoField.minLength) {
          if (campoValue.length < campoField.minLength) {
            const error = new Error(`El campo ${key} debe tener al menos ${campoField.minLength} caracteres`);
            return { message: error.message };
          }
        }

        if (campoField.maxLength) {
          if (campoValue.length > campoField.maxLength) {
            const error = new Error(`El campo ${key} debe tener como máximo ${campoField.maxLength} caracteres`);
            return { message: error.message };
          }
        }
      }
    }
  } */

  // Validar campos vacios
  const emptyFields = requiredFields.filter((campo) => {
    const campoValue = body[campo];
    return campoValue === undefined || campoValue === '' || (campoValue && campoValue.trim() === '');
  });

  if (emptyFields.length > 0) {
    const error = new Error(`Campos requeridos vacios: ${emptyFields}`);
    return { message: error.message };
  }
};

export default validateFields;

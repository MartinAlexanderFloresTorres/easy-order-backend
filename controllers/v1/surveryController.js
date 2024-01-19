import { isValidObjectId } from 'mongoose';
import { Survey, SurveyResolved } from '../../models/v1/Survey.js';
import Restaurant from '../../models/v1/Restaurant.js';

/*

const surveySchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    name: { type: String, required: true },
    description: { type: String, required: true },
    questions: [
      {
        question: { type: String, required: true },
        typeAnswer: { type: String, required: true },
        typeQuestion: { type: String, required: true },
        options: [
          {
            option: { type: String, required: true },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  },
);

const questionSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    question: { type: String, required: true },
    typeAnswer: { type: String, required: true },
    typeQuestion: { type: String, required: true },
    options: [
      {
        option: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Question = mongoose.model('Question', questionSchema);
const Survey = mongoose.model('Survey', surveySchema);

export { Survey, Question };

 */

/*
  export interface NewSurvey {
    name: string;
    description: string;
    questions: NewQuestion[];
  }

  export type TypeAnswer = 'text' | 'number' | 'date' | 'time' | 'email';

  export interface NewQuestion {
    id: string;
    question: string;
    typeAnswer: TypeAnswer;
    typeQuestion: 'open' | 'close';
    options: NewOption[];
  }

  export interface NewOption {
    id: string;
    option: string;
  }

 */

// CREAR
export const create = async (req, res) => {
  const { body } = req;
  const { restaurantId } = req.params;

  try {
    const { name, description, questions } = body;

    // Validar
    if (!isValidObjectId(restaurantId)) {
      return res.status(400).json({
        message: 'El id del restaurante es inválido',
      });
    }

    if (!name || !description || !questions) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios',
      });
    }

    if (!Array.isArray(questions)) {
      return res.status(400).json({
        message: 'El campo questions debe ser un array',
      });
    }

    if (questions.length === 0) {
      return res.status(400).json({
        message: 'Debe haber al menos una pregunta',
      });
    }

    if (questions.some((question) => question.question.trim() === '')) {
      return res.status(400).json({
        message: 'La pregunta no puede estar vacía',
      });
    }

    if (questions.some((question) => question.typeQuestion === 'close' && question.options.length === 0)) {
      return res.status(400).json({
        message: 'Debes agregar al menos una opción',
      });
    }

    if (questions.some((question) => question.typeQuestion === 'close' && question.options.some((option) => option.option.trim() === ''))) {
      return res.status(400).json({
        message: 'La opción no puede estar vacía',
      });
    }

    // Validar que el restaurante exista
    const restaurantExist = await Restaurant.findById(restaurantId);

    if (!restaurantExist) {
      return res.status(404).json({
        message: 'El restaurante no existe',
      });
    }

    // Crear la encuesta
    const survey = new Survey({
      restaurant: restaurantId,
      name,
      description,
      questions,
    });

    await survey.save();

    return res.status(201).json(survey);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error al crear la encuesta',
    });
  }
};

// EDITAR
export const update = async (req, res) => {
  const { body } = req;
  const { surveyId } = req.params;

  try {
    const { name, description, questions } = body;

    // Validar
    if (!isValidObjectId(surveyId)) {
      return res.status(400).json({
        message: 'El id de la encuesta es inválido',
      });
    }

    if (!name || !description || !questions) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios',
      });
    }

    if (!Array.isArray(questions)) {
      return res.status(400).json({
        message: 'El campo questions debe ser un array',
      });
    }

    if (questions.length === 0) {
      return res.status(400).json({
        message: 'Debe haber al menos una pregunta',
      });
    }

    if (questions.some((question) => question.question.trim() === '')) {
      return res.status(400).json({
        message: 'La pregunta no puede estar vacía',
      });
    }

    if (questions.some((question) => question.typeQuestion === 'close' && question.options.length === 0)) {
      return res.status(400).json({
        message: 'Debes agregar al menos una opción',
      });
    }

    if (questions.some((question) => question.typeQuestion === 'close' && question.options.some((option) => option.option.trim() === ''))) {
      return res.status(400).json({
        message: 'La opción no puede estar vacía',
      });
    }

    // Validar que la encuesta exista
    const surveyExist = await Survey.findById(surveyId);

    if (!surveyExist) {
      return res.status(404).json({
        message: 'La encuesta no existe',
      });
    }

    // Editar la encuesta
    const survey = await Survey.findByIdAndUpdate(
      surveyId,
      {
        name,
        description,
        questions,
      },
      { new: true },
    );

    return res.json(survey);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error al editar la encuesta',
    });
  }
};

// OBTENER TODAS LAS ENCUESTAS DE UN RESTAURANTE
export const getAllByRestaurant = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    // Validar
    if (!isValidObjectId(restaurantId)) {
      return res.status(400).json({
        message: 'El id del restaurante es inválido',
      });
    }

    // Listar las encuestas
    const surveys = await Survey.find({ restaurant: restaurantId });

    return res.json(surveys);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error al listar las encuestas',
    });
  }
};

// OBTENER UNA  ENCUESTA
export const getOne = async (req, res) => {
  const { surveyId } = req.params;

  try {
    // Validar
    if (!isValidObjectId(surveyId)) {
      return res.status(400).json({
        message: 'El id de la encuesta es inválido',
      });
    }

    // Listar las encuestas
    const survey = await Survey.findById(surveyId).populate('restaurant', 'name logo');

    if (!survey) {
      return res.status(404).json({
        message: 'La encuesta no existe',
      });
    }

    return res.json(survey);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error al listar la encuesta',
    });
  }
};

// ELIMINAR
export const remove = async (req, res) => {
  const { surveyId } = req.params;

  try {
    // Validar
    if (!isValidObjectId(surveyId)) {
      return res.status(400).json({
        message: 'El id de la encuesta es inválido',
      });
    }

    // Validar que la encuesta exista
    const surveyExist = await Survey.findById(surveyId);

    if (!surveyExist) {
      return res.status(404).json({
        message: 'La encuesta no existe',
      });
    }

    // Eliminar la encuesta
    const survey = await Survey.findByIdAndUpdate(
      surveyId,
      {
        isActive: !surveyExist.isActive,
      },
      { new: true },
    );

    return res.json({
      message: 'La encuesta se eliminó correctamente',
      survey,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error al eliminar la encuesta',
    });
  }
};

// GUARDAR RESPUESTA
export const saveAnswer = async (req, res) => {
  const { body } = req;
  const { surveyId } = req.params;
  const { user } = req;

  try {
    const { questions } = body;

    // Validar
    if (!isValidObjectId(surveyId)) {
      return res.status(400).json({
        message: 'El id de la encuesta es inválido',
      });
    }

    if (!Array.isArray(questions)) {
      return res.status(400).json({
        message: 'El campo questions debe ser un array',
      });
    }

    if (questions.length === 0) {
      return res.status(400).json({
        message: 'Debe haber al menos una pregunta',
      });
    }

    if (questions.some((question) => question.question.trim() === '')) {
      return res.status(400).json({
        message: 'La pregunta no puede estar vacía',
      });
    }

    if (questions.some((question) => question.typeQuestion === 'close' && question.options.length === 0)) {
      return res.status(400).json({
        message: 'Debes agregar al menos una opción',
      });
    }

    if (questions.some((question) => question.typeQuestion === 'close' && question.options.some((option) => option.option.trim() === ''))) {
      return res.status(400).json({
        message: 'La opción no puede estar vacía',
      });
    }

    // Validar que la encuesta exista
    const surveyExist = await Survey.findById(surveyId);

    if (!surveyExist) {
      return res.status(404).json({
        message: 'La encuesta no existe',
      });
    }

    // Guardar la encuesta resuelta
    const surveyResolved = new SurveyResolved({
      restaurant: surveyExist.restaurant,
      client: user._id,
      questions,
    });

    await surveyResolved.save();

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error al guardar la encuesta resuelta',
    });
  }
};

// OBTENER TODAS LAS ENCUESTAS RESUELTAS DE UN RESTAURANTE
export const getAllResolvedByRestaurant = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    // Validar
    if (!isValidObjectId(restaurantId)) {
      return res.status(400).json({
        message: 'El id del restaurante es inválido',
      });
    }

    // Listar las encuestas
    const surveys = await SurveyResolved.find({ restaurant: restaurantId }).populate('client', 'name lastname email photo country city');

    return res.json(surveys);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error al listar las encuestas resueltas',
    });
  }
};

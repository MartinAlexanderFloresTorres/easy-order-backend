import mongoose from 'mongoose';

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
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const surveyResolved = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    questions: [
      {
        question: { type: String, required: true },
        typeAnswer: { type: String, required: true },
        typeQuestion: { type: String, required: true },
        answer: { type: String, default: null },
        options: [
          {
            option: { type: String, required: true },
            checked: { type: Boolean, default: false },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  },
);

const SurveyResolved = mongoose.model('SurveyResolved', surveyResolved);
const Survey = mongoose.model('Survey', surveySchema);

export { Survey, SurveyResolved };

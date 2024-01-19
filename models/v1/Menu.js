import mongoose from 'mongoose';
import generateSlug from '../../helpers/generateSlug.js';

// creamos la estructura de un Schema
const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    // Stock diario disponible
    stock: {
      type: Number,
      default: 0,
    },
    // Stock diario
    stockDaily: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    images: [
      {
        public_id: String,
        secure_url: String,
        url: String,
        width: Number,
        height: Number,
        format: String,
        resource_type: String,
        folder: String,
        created_at: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },

    /* optional */
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        comment: {
          type: String,
          default: null,
        },
      },
    ],
    // Valoración promedio del menu
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    nutritionalInformation: [
      {
        name: {
          type: String,
          trim: true,
          required: true,
        },
        value: {
          type: String,
          trim: true,
          required: true,
        },
      },
    ],
    ingredients: [String],
  },
  {
    // crea dos columnas de creado y actualizado
    timestamps: true,
  },
);

menuSchema.pre('save', async function (next) {
  // si esta modificado el name que pase a la siguiente Middleware
  if (!this.isModified('name')) next();

  // Modificamos el slug
  this.slug = generateSlug(this.name);
});

// definimos el modelo
const Menu = mongoose.model('Menu', menuSchema);

export default Menu;

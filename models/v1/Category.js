import mongoose from 'mongoose';
import generateSlug from '../../helpers/generateSlug.js';

// creamos la estructura de un Schema
const categorySchema = new mongoose.Schema(
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
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    banner: {
      type: {
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
      default: null,
    },
    image: {
      type: {
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
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // crea dos columnas de creado y actualizado
    timestamps: true,
  },
);

categorySchema.pre('save', async function (next) {
  // si esta modificado el name que pase a la siguiente Middleware
  if (!this.isModified('name')) next();

  // Modificamos el slug
  this.slug = generateSlug(this.name);
});

// definimos el modelo
const Category = mongoose.model('Category', categorySchema);

export default Category;

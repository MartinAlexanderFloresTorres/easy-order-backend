import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import generateSlug from '../../helpers/generateSlug.js';

// creamos la estructura de un Schema
const userSchema = new mongoose.Schema(
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
    lastname: {
      type: String,
      default: null,
      trim: true,
    },
    photo: {
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
    city: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      default: null,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    tokenConfirm: {
      type: String,
      default: null,
    },
    tokenRecoverPassword: {
      type: String,
      default: null,
    },
    confirmationCode: {
      type: String,
      min: 5,
      max: 5,
      default: null,
    },
    tokenCreateRestaurant: {
      type: String,
      default: null,
    },
    subscriptionPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      default: null,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      default: null,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    // crea dos columnas de creado y actualizado
    timestamps: true,
  },
);

// hashear los password con el hook de pre de mongoose
userSchema.pre('save', async function (next) {
  // si esta modificado el password o slug que pase a la siguiente Middleware

  if (!this.isModified('password') || !this.isModified('name')) next();

  // Modificamos el slug
  if (this.isModified('name')) this.slug = generateSlug(`${this.name} ${this.lastname}`);

  // si esta modificado el password
  if (this.isModified('password')) {
    const sal = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, sal);
  }

  /* if (!this.isModified('password')) next();

  const sal = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, sal); */
});

// Comprobar password es verdadero mediante una nueva función
userSchema.methods.checkPassword = async function (passwordForm) {
  return await bcrypt.compare(passwordForm, this.password);
};

// definimos el modelo
const User = mongoose.model('User', userSchema);

export default User;

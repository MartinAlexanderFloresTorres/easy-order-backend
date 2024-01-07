import mongoose from 'mongoose';
import generateSlug from '../../helpers/generateSlug.js';

const restaurantSchema = new mongoose.Schema(
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
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    openingHours: {
      type: String,
      required: true,
      trim: true,
    },
    closingTime: {
      type: String,
      required: true,
      trim: true,
    },
    subscription: {
      // Plan de suscripción
      plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubscriptionPlan',
        required: true,
      },
      // Fecha de inicio del plan de suscripción
      startDate: {
        type: Date,
        required: true,
      },

      // Fecha de expiración del plan de suscripción
      expirationDate: {
        type: Date,
        required: true,
      },

      // Fecha de renovación del plan de suscripción
      renovationDate: {
        type: Date,
        required: true,
      },

      // Estado del plan de suscripción
      status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'EXPIRED'],
        default: 'ACTIVE',
      },
    },

    // Tokens de acceso a la API.
    apiTokens: [
      {
        type: String,
        required: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
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
    logo: {
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
    gallery: [
      {
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
      },
    ],
    // Ubicación del restaurante
    location: {
      latitude: {
        type: Number,
        default: 0,
      },
      longitude: {
        type: Number,
        default: 0,
      },
    },
    // Mesas del restaurante
    tables: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
      },
    ],
    // Usuario propietario del restaurante
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Array de usuarios adicionales con roles específicos
    additionalUsers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'WAITER', 'CHEF', 'CASHIER'],
          default: 'STAFF',
        },
      },
    ],

    // Servicios ofrecidos por el restaurante
    servicesOffered: [
      {
        type: String,
        trim: true,
      },
    ],

    // Acepta reservaciones
    acceptsReservations: {
      type: Boolean,
      default: false,
    },

    // Acepta pedidos a domicilio
    acceptsDelivery: {
      type: Boolean,
      default: false,
    },

    // Valoración promedio del restaurante
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    // Array de reseñas de los usuarios
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          trim: true,
        },
      },
    ],

    // Metodos de pago aceptados
    paymentMethods: [
      {
        name: {
          type: String,
          trim: true,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],

    // Horarios especiales
    specialHours: [
      {
        uniqueEspecialDay: {
          type: Date,
          trim: true,
          default: null,
        },
        day: {
          type: String,
          trim: true,
          default: null,
        },
        description: {
          type: String,
          trim: true,
          required: true,
        },
        openingTime: {
          type: String,
          trim: true,
          required: true,
        },
        closingTime: {
          type: String,
          trim: true,
          required: true,
        },
      },
    ],
    // Sitio web del restaurante
    website: {
      type: String,
      trim: true,
    },

    // Redes sociales del restaurante
    socialMedia: [
      {
        platform: {
          type: String,
          trim: true,
          required: true,
        },
        image: {
          type: String,
          required: true,
          default: null,
        },
        link: {
          type: String,
          trim: true,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Calcular valoración promedio del restaurante cuando se actualiza
restaurantSchema.pre('save', async function (next) {
  // si no se ha modificado el rating que pase a la siguiente Middleware
  if (!this.isModified('reviews') || !this.isModified('name')) next();

  // Modificamos el slug
  if (this.isModified('name')) this.slug = generateSlug(this.name, false);

  if (this.isModified('reviews')) {
    // Calcular el promedio de las valoraciones
    const averageRating = this.reviews.reduce((acc, item) => item.rating + acc, 0) / this.reviews.length;

    // Actualizar el promedio de valoración del restaurante
    this.averageRating = averageRating;
  }
});

// Definir el modelo
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;

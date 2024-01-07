import mongoose from 'mongoose';

export const SUBSCRIPTION_PLAN_TYPES = {
  FREE: 'free',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
  BASIC: 'basic',
};

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['free', 'premium', 'enterprise', 'basic'],
      required: true,
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
    durationMonths: {
      type: Number,
      required: true,
    },
    // stock de planes.
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    // maximo de menus por restaurante.
    maxMenusPerRestaurant: {
      type: Number,
      required: true,
    },
    // maximo de imagenes por menu.
    maxImagesPerMenu: {
      type: Number,
      required: true,
    },
    // maximo de mesas por restaurante.
    maxTablesPerRestaurant: {
      type: Number,
      required: true,
    },
    // maximo de usuarios por restaurante.
    maxUsersPerRestaurant: {
      type: Number,
      required: true,
    },
    // maximo de categorias por menu.
    maxPerCategory: {
      type: Number,
      required: true,
    },
    // maximo de historias por restaurante.
    maxStoriesPerRestaurant: {
      type: Number,
      required: true,
    },
    // tiene pedidos en tiempo reales.
    hasRealTimeOrders: {
      type: Boolean,
      required: true,
    },
    // tiene Gestion de usuarios.
    hasUserManagement: {
      type: Boolean,
      required: true,
    },
    // Tiene Gestion de roles
    hasRoleManagement: {
      type: Boolean,
      required: true,
    },
    // Tiene Gestion de categorias.
    hasCategoryManagement: {
      type: Boolean,
      required: true,
    },

    // Tiene Gestion de ventas.
    hasSalesManagement: {
      type: Boolean,
      required: true,
    },

    //  Gestion de reportes.
    hasReportsManagement: {
      type: Boolean,
      required: true,
    },

    // Acceso a la API.
    hasApiAccess: {
      type: Boolean,
      required: true,
    },

    // Tiene acceso a las configuraciones.
    hasSettingsAccess: {
      type: Boolean,
      required: true,
    },

    // Tiene buen posicionamiento en las busquedas.
    hasGoodSearchPosition: {
      type: Boolean,
      required: true,
    },

    features: [
      {
        name: {
          type: String,
          trim: true,
          required: true,
        },
        description: {
          type: String,
          trim: true,
          required: true,
        },
        available: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Definir el modelo
const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

export default SubscriptionPlan;

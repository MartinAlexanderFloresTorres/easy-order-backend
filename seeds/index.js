import dotenv from 'dotenv';
import mongodbConnection from '../configs/v1/mongodbConnection.js';
import SubscriptionPlan, { SUBSCRIPTION_PLAN_TYPES } from '../models/v1/SubscriptionPlan.js';

const [args] = process.argv.slice(2);
// npm run seed -- --seed
if (args === '--seed') {
  (async () => {
    dotenv.config();
    await mongodbConnection();

    await new SubscriptionPlan({
      name: 'Free',
      description: 'Plan gratis',
      type: SUBSCRIPTION_PLAN_TYPES.FREE,
      price: 0,
      stock: 100,
      durationMonths: 3,
      maxMenusPerRestaurant: 6,
      maxImagesPerMenu: 3,
      maxTablesPerRestaurant: 6,
      maxUsersPerRestaurant: 0,
      maxPerCategory: 5,
      maxStoriesPerRestaurant: 3,
      hasRealTimeOrders: false,
      hasUserManagement: false,
      hasRoleManagement: false,
      hasCategoryManagement: false,
      hasSalesManagement: false,
      hasReportsManagement: false,
      hasApiAccess: false,
      hasSettingsAccess: false,
      hasGoodSearchPosition: false,
      features: [
        {
          name: 'Acceso al panel de administración',
          description: 'Gestion de restaurantes, mesas, categorías, menús, historias y más',
          available: true,
        },
        {
          name: 'Máximo 6 Menús creados en tu restaurante',
          description: 'En el plan gratis puedes crear hasta 6 menús, para crear más debes actualizar tu plan',
          available: true,
        },
        {
          name: 'Máximo 3 Imágenes por menú',
          description: 'Puedes agregar hasta 3 imágenes por menú, Que se mostrarán en tu carta de tu menú',
          available: true,
        },
        {
          name: 'Máximo 6 Mesas creadas en tu restaurante',
          description: 'Puedes crear hasta 6 mesas en tu restaurante, para crear más debes actualizar tu plan',
          available: true,
        },
        {
          name: 'No puedes agregar usuarios que administren tu restaurante',
          description: 'En el plan gratis no puedes agregar usuarios que administren tu restaurante, para agregar más debes actualizar tu plan',
          available: false,
        },
        {
          name: 'Máximo 5 Categorías creadas',
          description: 'Puedes crear hasta 5 categorías en tu restaurante, para crear más debes actualizar tu plan',
          available: true,
        },
        {
          name: 'Máximo 3 Historias subidas a diario',
          description: 'Puedes subir hasta 3 historias diarias en tu restaurante, para subir más debes actualizar tu plan',
          available: true,
        },
        {
          name: 'Sin pedidos en tiempo real',
          description: 'En el plan gratis no puedes recibir pedidos en tiempo real, para recibir pedidos en tiempo real debes actualizar tu plan',
          available: false,
        },
        {
          name: 'Sin gestión de usuarios',
          description: 'En el plan gratis no puedes gestionar usuarios, para gestionar usuarios debes actualizar tu plan',
          available: false,
        },
        {
          name: 'Sin gestión de roles',
          description: 'En el plan gratis no puedes gestionar roles, para gestionar roles debes actualizar tu plan',
          available: false,
        },
        {
          name: 'Sin gestión de categorías',
          description: 'En el plan gratis no puedes gestionar categorías, para gestionar categorías debes actualizar tu plan',
          available: false,
        },
        {
          name: 'Sin gestión de ventas',
          description: 'En el plan gratis no puedes gestionar ventas, para gestionar ventas debes actualizar tu plan',
          available: false,
        },
        {
          name: 'Sin gestión de reportes',
          description: 'En el plan gratis no puedes gestionar reportes, para gestionar reportes debes actualizar tu plan',
          available: false,
        },
        {
          name: 'Sin acceso a la API',
          description: 'En el plan gratis no puedes acceder a la API, para acceder a la API debes actualizar tu plan',
          available: false,
        },
        {
          name: 'Sin acceso a configuraciones',
          description: 'En el plan gratis no puedes acceder a configuraciones, para acceder a configuraciones debes actualizar tu plan',
          available: false,
        },
        {
          name: 'Sin buena posición en búsquedas',
          description:
            'En el plan gratis no tienes buena posición en búsquedas. Esto significa que tu restaurante no aparecerá en las primeras posiciones de las búsquedas, para tener buena posición en búsquedas debes actualizar tu plan',
          available: false,
        },
      ],
    }).save();

    await new SubscriptionPlan({
      name: 'Basic',
      description: 'Plan básico',
      type: SUBSCRIPTION_PLAN_TYPES.BASIC,
      price: 30,
      stock: 100,
      durationMonths: 1,
      maxMenusPerRestaurant: 10,
      maxImagesPerMenu: 6,
      maxTablesPerRestaurant: 15,
      maxUsersPerRestaurant: 0,
      maxPerCategory: 10,
      maxStoriesPerRestaurant: 6,
      hasRealTimeOrders: true,
      hasUserManagement: false,
      hasRoleManagement: false,
      hasCategoryManagement: false,
      hasSalesManagement: false,
      hasReportsManagement: false,
      hasApiAccess: false,
      hasSettingsAccess: false,
      hasGoodSearchPosition: true,
      features: [
        {
          name: 'Acceso al panel de administración',
          description: 'Gestion de restaurantes, mesas, categorías, menús, historias y más',
          available: true,
        },
        {
          name: 'Máximo 10 Menús creados en tu restaurante',
          description: 'En el plan básico puedes crear hasta 10 menús, para crear más debes actualizar tu plan',
          available: true,
        },
        {
          name: 'Máximo 6 Imágenes por menú',
          description: 'Puedes agregar hasta 6 imágenes por menú, Que se mostrarán en tu carta de tu menú',
          available: true,
        },
        {
          name: 'Máximo 15 Mesas creadas en tu restaurante',
          description: 'Puedes crear hasta 15 mesas en tu restaurante, para crear más debes actualizar tu plan',
          available: true,
        },
        {
          name: 'No puedes agregar usuarios que administren tu restaurante',
          description: 'En el plan básico no puedes agregar usuarios que administren tu restaurante, para agregar más debes actualizar tu plan',
          available: false,
        },
        {
          name: 'Máximo 10 Categorías creadas',
          description: 'Puedes crear hasta 10 categorías en tu restaurante, para crear más debes actualizar tu plan',
          available: true,
        },
        {
          name: 'Máximo 6 Historias subidas a diario',
          description: 'Puedes subir hasta 6 historias diarias en tu restaurante, para subir más debes actualizar tu plan',
          available: true,
        },
        {
          name: 'Con pedidos en tiempo real',
          description: 'En el plan básico puedes recibir pedidos en tiempo real',
          available: true,
        },
        {
          name: 'Sin gestión de usuarios',
          description: 'En el plan básico no puedes gestionar usuarios, para gestionar usuarios debes actualizar tu plan',
          available: false,
        },
        {
          name: 'Sin gestión de roles',
          description: 'En el plan básico no puedes gestionar roles, para gestionar roles debes actualizar tu plan',
          available: false,
        },
        {
          name: 'Sin gestión de categorías',
          description: 'En el plan básico no puedes gestionar categorías, para gestionar categorías debes actualizar tu plan',
          available: false,
        },
        {
          name: 'Sin gestión de ventas',
          description: 'En el plan básico no puedes gestionar ventas, para gestionar ventas debes actualizar tu plan',
          available: false,
        },
        {
          name: 'Sin gestión de reportes',
          description: 'En el plan básico no puedes gestionar reportes, para gestionar reportes debes actualizar tu plan',
          available: false,
        },
        {
          name: 'Sin acceso a la API',
          description: 'En el plan básico no puedes acceder a la API, para acceder a la API debes actualizar tu plan',
          available: false,
        },
        {
          name: 'Sin acceso a configuraciones',
          description: 'En el plan básico no puedes acceder a configuraciones, para acceder a configuraciones debes actualizar tu plan',
          available: false,
        },
        {
          name: 'Con buena posición en búsquedas',
          description:
            'En el plan básico tienes buena posición en búsquedas. Esto significa que tu restaurante aparecerá en las primeras posiciones de las búsquedas',
          available: true,
        },
      ],
    }).save();

    await new SubscriptionPlan({
      name: 'Premium',
      description: 'Plan premium',
      type: SUBSCRIPTION_PLAN_TYPES.PREMIUM,
      price: 60,
      stock: 100,
      durationMonths: 1,
      maxMenusPerRestaurant: 50,
      maxImagesPerMenu: 10,
      maxTablesPerRestaurant: 30,
      maxUsersPerRestaurant: 16,
      maxPerCategory: 30,
      maxStoriesPerRestaurant: Infinity,
      hasRealTimeOrders: true,
      hasUserManagement: true,
      hasRoleManagement: true,
      hasCategoryManagement: true,
      hasSalesManagement: true,
      hasReportsManagement: true,
      hasApiAccess: false,
      hasSettingsAccess: true,
      hasGoodSearchPosition: true,
      features: [
        {
          name: 'Acceso al panel de administración',
          description: 'Gestion de restaurantes, mesas, categorías, menús, historias y más',
          available: true,
        },
        {
          name: 'Máximo 50 Menús creados en tu restaurante',
          description: 'En el plan premium puedes crear hasta 50 menús, para crear más debes actualizar tu plan',
          available: true,
        },
        {
          name: 'Máximo 10 Imágenes por menú',
          description: 'Puedes agregar hasta 10 imágenes por menú, Que se mostrarán en tu carta de tu menú',
          available: true,
        },
        {
          name: 'Máximo 30 Mesas creadas en tu restaurante',
          description: 'Puedes crear hasta 30 mesas en tu restaurante, para crear más debes actualizar tu plan',
          available: true,
        },
        {
          name: 'Máximo 16 Usuarios que administren tu restaurante',
          description:
            'En el plan premium puedes agregar hasta 16 usuarios que administren tu restaurante, para agregar más debes actualizar tu plan',
          available: true,
        },
        {
          name: 'Máximo 30 Categorías creadas',
          description: 'Puedes crear hasta 30 categorías en tu restaurante, para crear más debes actualizar tu plan',
          available: true,
        },
        {
          name: 'Máximo 999999999 Historias subidas a diario',
          description: 'Puedes subir hasta 999999999 historias diarias en tu restaurante, para subir más debes actualizar tu plan',
          available: true,
        },
        {
          name: 'Con pedidos en tiempo real',
          description: 'En el plan premium puedes recibir pedidos en tiempo real',
          available: true,
        },
        {
          name: 'Con gestión de usuarios',
          description: 'En el plan premium puedes gestionar usuarios',
          available: true,
        },
        {
          name: 'Con gestión de roles',
          description: 'En el plan premium puedes gestionar roles',
          available: true,
        },
        {
          name: 'Con gestión de categorías',
          description: 'En el plan premium puedes gestionar categorías',
          available: true,
        },
        {
          name: 'Con gestión de ventas',
          description: 'En el plan premium puedes gestionar ventas',
          available: true,
        },
        {
          name: 'Con gestión de reportes',
          description: 'En el plan premium puedes gestionar reportes',
          available: true,
        },
        {
          name: 'Sin acceso a la API',
          description: 'En el plan premium no puedes acceder a la API, para acceder a la API debes actualizar tu plan',
          available: false,
        },
        {
          name: 'Con acceso a configuraciones',
          description: 'En el plan premium puedes acceder a configuraciones',
          available: true,
        },
        {
          name: 'Con buena posición en búsquedas',
          description:
            'En el plan premium tienes buena posición en búsquedas. Esto significa que tu restaurante aparecerá en las primeras posiciones de las búsquedas',
          available: true,
        },
      ],
    }).save();

    await new SubscriptionPlan({
      name: 'Enterprise',
      description: 'Plan empresarial',
      type: SUBSCRIPTION_PLAN_TYPES.ENTERPRISE,
      price: 900,
      stock: 100,
      durationMonths: 12,
      maxMenusPerRestaurant: Infinity,
      maxImagesPerMenu: 60,
      maxTablesPerRestaurant: Infinity,
      maxUsersPerRestaurant: Infinity,
      maxPerCategory: Infinity,
      maxStoriesPerRestaurant: Infinity,
      hasRealTimeOrders: true,
      hasUserManagement: true,
      hasRoleManagement: true,
      hasCategoryManagement: true,
      hasSalesManagement: true,
      hasReportsManagement: true,
      hasApiAccess: true,
      hasSettingsAccess: true,
      hasGoodSearchPosition: true,
      features: [
        {
          name: 'Acceso al panel de administración',
          description: 'Gestion de restaurantes, mesas, categorías, menús, historias y más',
          available: true,
        },
        {
          name: 'Creación ilimitada de Menús',
          description: 'En el plan empresarial puedes crear una cantidad ilimitada de menús',
          available: true,
        },
        {
          name: 'Máximo 60 Imágenes por menú',
          description: 'Puedes agregar hasta 60 imágenes por menú, Que se mostrarán en tu carta de tu menú',
          available: true,
        },
        {
          name: 'Creación ilimitada de Mesas',
          description: 'En el plan empresarial puedes crear una cantidad ilimitada de mesas',
          available: true,
        },
        {
          name: 'Creación ilimitada de Usuarios que administren tu restaurante',
          description: 'En el plan empresarial puedes agregar una cantidad ilimitada de usuarios que administren tu restaurante',
          available: true,
        },
        {
          name: 'Creación ilimitada de Categorías',
          description: 'En el plan empresarial puedes crear una cantidad ilimitada de categorías',
          available: true,
        },
        {
          name: 'Creación ilimitada de Historias subidas a diario',
          description: 'En el plan empresarial puedes subir una cantidad ilimitada de historias diarias en tu restaurante',
          available: true,
        },
        {
          name: 'Con pedidos en tiempo real',
          description: 'En el plan empresarial puedes recibir pedidos en tiempo real',
          available: true,
        },
        {
          name: 'Con gestión de usuarios',
          description: 'En el plan empresarial puedes gestionar usuarios',
          available: true,
        },
        {
          name: 'Con gestión de roles',
          description: 'En el plan empresarial puedes gestionar roles',
          available: true,
        },
        {
          name: 'Con gestión de categorías',
          description: 'En el plan empresarial puedes gestionar categorías',
          available: true,
        },
        {
          name: 'Con gestión de ventas',
          description: 'En el plan empresarial puedes gestionar ventas',
          available: true,
        },
        {
          name: 'Con gestión de reportes',
          description: 'En el plan empresarial puedes gestionar reportes',
          available: true,
        },
        {
          name: 'Con acceso a la API',
          description: 'En el plan empresarial puedes acceder a la API',
          available: true,
        },
        {
          name: 'Con acceso a configuraciones',
          description: 'En el plan empresarial puedes acceder a configuraciones',
          available: true,
        },
        {
          name: 'Con buena posición en búsquedas',
          description:
            'En el plan empresarial tienes buena posición en búsquedas. Esto significa que tu restaurante aparecerá en las primeras posiciones de las búsquedas',
          available: true,
        },
      ],
    }).save();

    console.log('Seeds subscription plans created');
    process.exit(0);
  })();
}
// Update type of subscription plan
if (args === '--update') {
  (async () => {
    dotenv.config();
    await mongodbConnection();

    await SubscriptionPlan.updateMany({}, { type: SUBSCRIPTION_PLAN_TYPES.FREE });

    console.log('Seeds subscription plans updated');
    process.exit(0);
  })();
}

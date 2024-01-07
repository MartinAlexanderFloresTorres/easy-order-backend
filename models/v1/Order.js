import mongoose from 'mongoose';

export const ORDER_STATUS = {
  EMITTED: 'EMITTED',
  CONFIRMED: 'CONFIRMED',
  REJECTED: 'REJECTED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  SENDING: 'SENDING',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
};

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
};

// creamos la estructura de un Schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
    items: [
      {
        menu: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Menu',
        },
        discount: {
          type: Number,
          default: 0,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          min: 1,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ['EMITTED', 'CONFIRMED', 'REJECTED', 'PREPARING', 'READY', 'SENDING', 'DELIVERED', 'CANCELLED', 'COMPLETED'],
      default: 'EMITTED',
    },
    shippingAddress: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    coupon: {
      type: {
        name: String,
        code: String,
        discount: Number,
      },
      default: null,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'CARD'],
      default: 'CASH',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'CANCELLED'],
      default: 'PENDING',
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

// definimos el modelo
const Order = mongoose.model('Order', orderSchema);

export default Order;

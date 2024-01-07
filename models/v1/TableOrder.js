import mongoose from 'mongoose';

export const TABLE_ORDER_STATUS = {
  EMITTED: 'EMITTED',
  CONFIRMED: 'CONFIRMED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  COMPLETED: 'COMPLETED',
};

export const TABLE_PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
};

// creamos la estructura de un Schema
const tableOrderSchema = new mongoose.Schema(
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
      enum: ['EMITTED', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'PREPARING', 'READY', 'COMPLETED'],
      default: 'EMITTED',
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
const TableOrder = mongoose.model('TableOrder', tableOrderSchema);

export default TableOrder;

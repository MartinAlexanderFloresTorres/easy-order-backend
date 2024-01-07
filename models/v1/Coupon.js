import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    code: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    expiration: {
      type: Date,
      required: true,
    },
    stockOfCoupons: {
      type: Number,
      default: 0,
    },
    maximum: {
      type: Number,
      required: true,
    },
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
const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;

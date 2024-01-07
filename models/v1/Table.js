import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  tableNumber: {
    type: Number,
  },
  capacity: {
    type: Number,
  },
  isOccupied: {
    type: Boolean,
    default: false,
  },
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Table = mongoose.model('Table', tableSchema);

export default Table;

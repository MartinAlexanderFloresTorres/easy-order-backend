import mongoose from 'mongoose';

const notificationRestaurantSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  title: {
    type: String,
    trim: true,
  },
  content: {
    type: String,
    trim: true,
  },
  links: [
    {
      name: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
        trim: true,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const NotificationRestaurant = mongoose.model('NotificationRestaurant', notificationRestaurantSchema);

export default NotificationRestaurant;

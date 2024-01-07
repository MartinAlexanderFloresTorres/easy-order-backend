import mongoose from 'mongoose';

const notificationUserSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

const NotificationUser = mongoose.model('NotificationUser', notificationUserSchema);

export default NotificationUser;

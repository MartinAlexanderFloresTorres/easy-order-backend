import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import mongodbConnection from './configs/v1/mongodbConnection.js';
import userRoutes from './routes/v1/userRoutes.js';
import categoryRoutes from './routes/v1/categoryRoutes.js';
import restaurantRoutes from './routes/v1/restaurantRoutes.js';
import menuRoutes from './routes/v1/menuRoutes.js';
import orderRoutes from './routes/v1/orderRouter.js';
import couponRouter from './routes/v1/couponRouter.js';
import tableOrderRouter from './routes/v1/tableOrderRouter.js';
import subscriptionPlanRouter from './routes/v1/subscriptionPlanRouter.js';

// Load env vars
dotenv.config();

// Init express
const app = express();

// Body parser
app.use(express.json());

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Connect to database
mongodbConnection();

// Enable cors
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/restaurant', restaurantRoutes);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/order', orderRoutes);
app.use('/api/v1/table-order', tableOrderRouter);
app.use('/api/v1/coupon', couponRouter);
app.use('/api/v1/subscription-plan', subscriptionPlanRouter);

// Server port
const PORT = process.env.PORT || 4000;

// Listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

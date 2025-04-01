
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './utils/db';
import orderRoutes from './routes/orderRoutes';
import authRoutes from './routes/authRoutes';
import { initAdminUser } from './utils/initAdmin';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Connect to MongoDB and start server
connectDB()
  .then(async () => {
    // Initialize admin user after DB connection
    await initAdminUser();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  });

import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import revisionRoutes from './routes/revisionRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/revision', revisionRoutes);
app.use('/api/stats', statsRoutes);

// --- Custom Error Handling Middleware ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
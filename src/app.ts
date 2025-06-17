import express from 'express';
import { json, urlencoded } from 'body-parser';
import path from 'path';
import errorHandler from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import linkRoutes from './routes/linkRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import config from './config/index';
import expiryJob from './jobs/expiryJob';

const app = express();
const PORT = config.PORT;

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use(errorHandler);

// Start expiry job
expiryJob();

// Start server directly (Supabase is serverless, no connection needed)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
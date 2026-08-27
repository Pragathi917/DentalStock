require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const app = express();

// Apply Security Middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // We can restrict this if needed, allowing all for development.
  credentials: true
}));

// Body Parsing
app.use(express.json());

// Basic test/health routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "DentalStock API is running"
  });
});

app.get('/api/health', (req, res) => {
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  
  res.status(200).json({
    success: true,
    message: "API is running",
    database: dbStates[mongoose.connection.readyState] || 'unknown'
  });
});

// Import route paths
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/usage', require('./routes/usageRoutes'));
app.use('/api/forecast', require('./routes/forecastRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// 404 & Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

// Connect to Database first, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

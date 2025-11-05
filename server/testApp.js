const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const swapRoutes = require('./routes/swaps');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock socket.io for testing
app.set('io', {
  to: () => ({
    emit: () => {}
  })
});
app.set('userSockets', new Map());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', swapRoutes);

module.exports = app;

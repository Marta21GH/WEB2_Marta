const express = require('express');
const app = express();
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');

app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;

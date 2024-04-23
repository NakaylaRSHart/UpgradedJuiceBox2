const express = require('express');
const apiRouter = express.Router();
const jwt = require('jsonwebtoken');
const { getUserById } = require('../../db');
const { JWT_SECRET } = process.env;

// Authentication middleware
apiRouter.use(async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return next();
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.id) {
      throw new Error('Authorization token is invalid');
    }

    req.user = await getUserById(decoded.id);
    next();
  } catch (error) {
    next(error);
  }
});

// Logging middleware
apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log('User is set:', req.user);
  }
  next();
});

// Mount routers for specific endpoints
apiRouter.use('/users', require('./users'));
apiRouter.use('/posts', require('./posts'));
apiRouter.use('/tags', require('./tags'));

// Error handling middleware
apiRouter.use((error, req, res, next) => {
  res.status(500).json({ error: error.message || 'Internal Server Error' });
});

module.exports = apiRouter;

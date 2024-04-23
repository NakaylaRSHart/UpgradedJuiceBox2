const express = require('express');
const apiRouter = express.Router();
const usersRouter = require('./users'); 
const postsRouter = require('./posts'); 
const tagsRouter = require('./tags'); 

// Routers
apiRouter.use('/users', usersRouter);
apiRouter.use('/posts', postsRouter);
apiRouter.use('/tags', tagsRouter);

// Centralized error handling middleware
apiRouter.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = apiRouter;

const express = require('express');
const postsRouter = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { requireUser } = require('./utils');

// GET all posts
postsRouter.get('/', async (req, res, next) => {
  try {
    const allPosts = await prisma.post.findMany({
      where: { active: true }, // Filter active posts
      include: { author: true }, // Include author details
    });
    res.json({ posts: allPosts });
  } catch (error) {
    next(error);
  }
});

// POST (requires authentication)
postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content = '', tags = [] } = req.body;
  const authorId = req.user.id;

  try {
    const newPost = await prisma.post.create({
      data: { title, content, authorId, tags: { set: tags } }, // Create new post with tags
      include: { author: true }, // Include author details in response
    });
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
});

// Update (requires authentication)
postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  try {
    const updatedPost = await prisma.post.update({
      where: { id: Number(postId) },
      data: { title, content, tags: { set: tags } },
      include: { author: true }, // Include author details in response
    });
    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
});

// DELETE (requires authentication)
postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
  const { postId } = req.params;

  try {
    const deletedPost = await prisma.post.delete({
      where: { id: Number(postId) },
    });
    res.json(deletedPost);
  } catch (error) {
    next(error);
  }
});

module.exports = postsRouter;

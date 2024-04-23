const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');

// GET all tags
tagsRouter.get('/', async (req, res, next) => {
  try {
    const tags = await getAllTags();
    res.send({ tags });
  } catch (error) {
    next(error);
  }
});

// GET posts by tag name
tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  const { tagName } = req.params;

  try {
    const decodedTagName = decodeTagParam(tagName);
    const allPosts = await getPostsByTagName(decodedTagName);

    const filteredPosts = filterActivePosts(allPosts, req.user);
    res.send({ posts: filteredPosts });
  } catch (error) {
    next(error);
  }
});

// Helper function to decode tag name parameter --  grabbed from original juicebox
function decodeTagParam(tagName) {
  return decodeURIComponent(tagName);
}

function filterActivePosts(posts, user) {
  return posts.filter(post => {
    if (post.active) {
      return true;
    }
    return user && user.id === post.author.id;
  });
}

module.exports = tagsRouter;

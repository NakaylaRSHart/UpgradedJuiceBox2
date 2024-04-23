const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createUser({ username, password, name, location }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      name,
      location,
    },
  });
}

async function updateUser(id, { username, password, name, location }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.update({
    where: { id },
    data: {
      username,
      password: hashedPassword,
      name,
      location,
    },
  });
}

async function getAllUsers() {
  return prisma.user.findMany();
}

async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
  });
}

async function getUserByUsername(username) {
  return prisma.user.findUnique({
    where: { username },
  });
}

async function createPost({ authorId, title, content, tags }) {
  return prisma.post.create({
    data: {
      authorId,
      title,
      content,
      tags,
    },
  });
}

async function updatePost(id, { title, content, tags }) {
  return prisma.post.update({
    where: { id },
    data: {
      title,
      content,
      tags,
    },
  });
}

async function getAllPosts() {
  return prisma.post.findMany();
}

async function getPostById(id) {
  return prisma.post.findUnique({
    where: { id },
  });
}

async function getPostsByUser(userId) {
  return prisma.post.findMany({
    where: { authorId: userId },
  });
}

async function getPostsByTagName(tagName) {
  return prisma.post.findMany({
    where: {
      tags: {
        some: {
          name: tagName,
        },
      },
    },
  });
}

async function createTags(tags) {
  return prisma.tag.createMany({
    data: tags.map((name) => ({ name })),
  });
}

async function getAllTags() {
  return prisma.tag.findMany();
}

async function createPostTag(postId, tagId) {
  return prisma.postTag.create({
    data: {
      postId,
      tagId,
    },
  });
}

async function addTagsToPost(postId, tagIds) {
  return prisma.post.update({
    where: { id: postId },
    data: {
      tags: {
        connect: tagIds.map((id) => ({ id })),
      },
    },
  });
}

async function deletePost(id) {
  return prisma.post.delete({
    where: { id },
  });
}

module.exports = {
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  createPost,
  updatePost,
  getAllPosts,
  getPostById,
  getPostsByUser,
  getPostsByTagName,
  createTags,
  getAllTags,
  createPostTag,
  addTagsToPost,
  deletePost,
};

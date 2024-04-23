const express = require('express');
const usersRouter = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// GET all users
usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

// POST user login
usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide both username and password' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1w' });

    res.json({ message: 'You are logged in!', token });
  } catch (error) {
    next(error);
  }
});

// POST user registration
usersRouter.post('/register', async (req, res, next) => {
  const { username, password, name, location } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword, name, location },
    });

    const token = jwt.sign({ id: newUser.id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '1w' });

    res.json({ message: 'User registered successfully', token });
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;

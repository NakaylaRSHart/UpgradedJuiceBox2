const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function requireUser(req, res, next) {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  requireUser,
};

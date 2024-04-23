const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Clearing existing users...');
    await prisma.user.deleteMany();

    const usersToCreate = 5;

    for (let i = 0; i < usersToCreate; i++) {
      const username = faker.internet.userName();
      const password = faker.internet.password();
      const name = faker.name.findName();
      const location = faker.address.city();

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          name,
          location,
        },
      });

      console.log(`User created: ${user.username}`);
    }

    console.log(`Database seeded successfully with ${usersToCreate} users!`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

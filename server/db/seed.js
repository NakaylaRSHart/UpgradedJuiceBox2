const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Clearing existing data...');
    await prisma.post.deleteMany(); // Clear existing posts
    await prisma.user.deleteMany(); // Clear existing users

    const usersToCreate = 5;

    for (let i = 0; i < usersToCreate; i++) {
      const username = faker.internet.userName();
      const password = faker.internet.password();
      const name = faker.person.fullName();
      const location = faker.location.city();

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

      // Create 3 posts for each user
      for (let j = 0; j < 3; j++) {
        const title = faker.lorem.words(5);
        const content = faker.lorem.paragraphs(3);

        const post = await prisma.post.create({
          data: {
            authorId: user.id,
            title,
            content,
          },
        });

        console.log(`Post created for ${user.username}: ${post.title}`);
      }
    }

    console.log(`Database seeded successfully with ${usersToCreate} users and ${usersToCreate * 3} posts!`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

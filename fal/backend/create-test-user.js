const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: 'vqtqb738@gmail.com' }
    });

    if (existingUser) {
      console.log('Test user already exists!');
      console.log('Email: vqtqb738@gmail.com');
      console.log('Password: Vqtqn241.');
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Vqtqn241.', salt);

    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'vqtqb738@gmail.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'USER',
        coins: 100,
        dailyFreeFortunes: 3,
        dailyAiQuestions: 5,
        lastResetDate: new Date(),
        isActive: true
      }
    });

    console.log('✅ Test user created successfully!');
    console.log('Email: vqtqb738@gmail.com');
    console.log('Password: Vqtqn241.');
    console.log('Role: USER');
    console.log('User ID:', user.id);

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();

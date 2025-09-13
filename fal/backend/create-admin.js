const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { email: 'admin@falplatform.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@falplatform.com',
        password: hashedPassword,
        name: 'System Admin',
        role: 'ADMIN',
        coins: 1000,
        dailyFreeFortunes: 10,
        dailyAiQuestions: 20,
        lastResetDate: new Date()
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@falplatform.com');
    console.log('Password: admin123');
    console.log('Role: ADMIN');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Create moderator user
async function createModeratorUser() {
  try {
    // Check if moderator already exists
    const existingModerator = await prisma.user.findFirst({
      where: { email: 'moderator@falplatform.com' }
    });

    if (existingModerator) {
      console.log('Moderator user already exists!');
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('moderator123', salt);

    // Create moderator user
    const moderator = await prisma.user.create({
      data: {
        email: 'moderator@falplatform.com',
        password: hashedPassword,
        name: 'Content Moderator',
        role: 'MODERATOR',
        coins: 500,
        dailyFreeFortunes: 5,
        dailyAiQuestions: 10,
        lastResetDate: new Date()
      }
    });

    console.log('✅ Moderator user created successfully!');
    console.log('Email: moderator@falplatform.com');
    console.log('Password: moderator123');
    console.log('Role: MODERATOR');

  } catch (error) {
    console.error('Error creating moderator user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the functions
async function main() {
  console.log('Creating admin and moderator users...\n');
  
  await createAdminUser();
  console.log('');
  await createModeratorUser();
  
  console.log('\n🎉 Setup complete!');
  console.log('\nTest Accounts:');
  console.log('1. Admin: admin@falplatform.com / admin123');
  console.log('2. Moderator: moderator@falplatform.com / moderator123');
  console.log('3. Regular User: bilgivatanpekonur@gmail.com / (existing password)');
}

main();

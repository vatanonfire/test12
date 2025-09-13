const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addCoinsToUsers() {
  try {
    // Tüm kullanıcıları al
    const users = await prisma.user.findMany();
    
    console.log('Mevcut kullanıcılar:');
    users.forEach(user => {
      console.log(`- ${user.email}: ${user.coins} coin`);
    });

    // Her kullanıcıya 200 coin ekle
    for (const user of users) {
      await prisma.user.update({
        where: { id: user.id },
        data: { coins: user.coins + 200 }
      });
      console.log(`${user.email} kullanıcısına 200 coin eklendi. Yeni bakiye: ${user.coins + 200}`);
    }

    console.log('Tüm kullanıcılara coin eklendi!');
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addCoinsToUsers();

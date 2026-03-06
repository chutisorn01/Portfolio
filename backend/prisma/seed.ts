import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create Services
    const services = [
        { name: 'ทำบัตรประชาชน', code: 'ID_CARD' },
        { name: 'จดทะเบียนสมรส', code: 'MARRIAGE' },
        { name: 'แจ้งเกิด/แจ้งตาย', code: 'BIRTH_DEATH' },
    ];

    for (const service of services) {
        await prisma.service.upsert({
            where: { code: service.code },
            update: {},
            create: service,
        });
    }

    // Create Admin User
    // Note: In production interpretation, password should be hashed.
    // For this scaffold, we'll store plain "admin123" or handle hashing in controller layer if we implement it there.
    // Let's assume we will implement hashing in the seed for correctness.

    // Checking if upsert works without hashing for now, we will add bcrypt later.
    await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: 'admin123', // Will be hashed in real app or we can hash here if we install bcryptjs
            role: 'ADMIN',
            name: 'System Admin',
        },
    });

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

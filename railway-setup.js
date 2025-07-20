#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function railwaySetup() {
    try {
        console.log('🚂 Railway setup starting...');

        // Test database connection
        await prisma.$connect();
        console.log('✅ Database connection successful');

        // Generate Prisma client first
        console.log('🔧 Generating Prisma client...');
        execSync('npx prisma generate --schema=./prisma/schema.prisma', { stdio: 'inherit' });
        console.log('✅ Prisma client generated');

        // Run migrations
        console.log('🔄 Running database migrations...');
        execSync('npx prisma migrate deploy --schema=./prisma/schema.prisma', { stdio: 'inherit' });
        console.log('✅ Database migrations completed');

        console.log('🎉 Railway setup completed successfully!');
    } catch (error) {
        console.error('❌ Railway setup failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

railwaySetup(); 
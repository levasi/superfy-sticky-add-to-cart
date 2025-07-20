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

        // Check for failed migrations and resolve them
        console.log('🔍 Checking for failed migrations...');
        try {
            const migrations = await prisma.$queryRaw`
        SELECT * FROM "_prisma_migrations" 
        WHERE finished_at IS NULL OR logs IS NOT NULL
      `;

            if (migrations.length > 0) {
                console.log('⚠️ Found failed migrations, resolving...');

                // Mark failed migrations as applied if tables exist
                const tables = await prisma.$queryRaw`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name IN ('session', 'Setting')
        `;

                if (tables.length >= 2) {
                    console.log('✅ Required tables exist, marking failed migrations as applied...');
                    await prisma.$executeRaw`
            UPDATE "_prisma_migrations" 
            SET finished_at = NOW(), logs = NULL 
            WHERE finished_at IS NULL
          `;
                    console.log('✅ Failed migrations resolved');
                }
            }
        } catch (error) {
            console.log('ℹ️ No migration table found, proceeding with fresh setup...');
        }

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
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
            // Check if migration table exists
            const migrationTableExists = await prisma.$queryRaw`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = '_prisma_migrations'
                );
            `;

            if (migrationTableExists[0].exists) {
                console.log('📋 Migration table exists, checking for failed migrations...');

                // Get failed migrations
                const failedMigrations = await prisma.$queryRaw`
                    SELECT * FROM "_prisma_migrations" 
                    WHERE finished_at IS NULL
                `;

                if (failedMigrations.length > 0) {
                    console.log(`⚠️ Found ${failedMigrations.length} failed migrations, resolving...`);

                    // Check if our tables exist
                    const tables = await prisma.$queryRaw`
                        SELECT table_name 
                        FROM information_schema.tables 
                        WHERE table_schema = 'public' 
                        AND table_name IN ('session', 'Setting')
                    `;

                    console.log(`📊 Found ${tables.length} existing tables:`, tables.map(t => t.table_name));

                    if (tables.length >= 2) {
                        console.log('✅ Required tables exist, marking failed migrations as applied...');

                        // Mark all failed migrations as applied
                        await prisma.$executeRaw`
                            UPDATE "_prisma_migrations" 
                            SET finished_at = NOW(), logs = NULL 
                            WHERE finished_at IS NULL
                        `;

                        console.log('✅ Failed migrations resolved');
                    } else {
                        console.log('⚠️ Tables missing, will run fresh migration...');
                        // Delete failed migrations to start fresh
                        await prisma.$executeRaw`
                            DELETE FROM "_prisma_migrations" 
                            WHERE finished_at IS NULL
                        `;
                        console.log('✅ Cleared failed migrations');
                    }
                } else {
                    console.log('✅ No failed migrations found');
                }
            } else {
                console.log('ℹ️ No migration table found, will create fresh...');
            }
        } catch (error) {
            console.log('ℹ️ Error checking migrations, proceeding with fresh setup...', error.message);
        }

        // Run migrations with error handling for DATETIME issue
        console.log('🔄 Running database migrations...');
        try {
            execSync('npx prisma migrate deploy --schema=./prisma/schema.prisma', { stdio: 'inherit' });
            console.log('✅ Database migrations completed');
        } catch (migrationError) {
            console.log('⚠️ Migration failed, checking if it\'s a DATETIME issue...');

            // If it's a DATETIME error, clear migration state and try again
            if (migrationError.message.includes('DATETIME') || migrationError.message.includes('type "datetime" does not exist')) {
                console.log('🔧 Detected DATETIME error, clearing migration state and retrying...');

                try {
                    // Clear the migration table to start fresh
                    await prisma.$executeRaw`DROP TABLE IF EXISTS "_prisma_migrations"`;
                    console.log('✅ Cleared migration table');

                    // Try migration again
                    execSync('npx prisma migrate deploy --schema=./prisma/schema.prisma', { stdio: 'inherit' });
                    console.log('✅ Database migrations completed after retry');
                } catch (retryError) {
                    console.error('❌ Migration retry failed:', retryError);
                    throw retryError;
                }
            } else {
                throw migrationError;
            }
        }

        console.log('🎉 Railway setup completed successfully!');
    } catch (error) {
        console.error('❌ Railway setup failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

railwaySetup(); 
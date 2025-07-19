#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function fixMigration() {
  try {
    console.log('Checking database connection...');

    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Check if session table exists and its name
    const sessionTables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name ILIKE 'session'
    `;

    console.log('Session tables:', sessionTables);

    // Check if Setting table exists
    const settingTables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name ILIKE 'Setting'
    `;

    console.log('Setting tables:', settingTables);

    // Check migration status
    const migrations = await prisma.$queryRaw`
      SELECT * FROM "_prisma_migrations" 
      WHERE migration_name = '20250719164517_fix_session_table'
    `;

    console.log('Migration status:', migrations);

    // Handle session table
    if (sessionTables.length > 0) {
      console.log('Session table exists, cleaning up failed migration...');

      // Remove the failed migration entry
      await prisma.$executeRaw`
        DELETE FROM "_prisma_migrations" 
        WHERE migration_name = '20250719164517_fix_session_table' 
        AND finished_at IS NULL
      `;

      console.log('✅ Failed migration entry removed');

      // Mark the migration as applied (since the table already exists)
      await prisma.$executeRaw`
        INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
        VALUES ('20250719164517_fix_session_table', '20250719164517_fix_session_table', NOW(), '20250719164517_fix_session_table', NULL, NULL, NOW(), 1)
        ON CONFLICT (id) DO NOTHING
      `;

      console.log('✅ Migration marked as applied');
    } else {
      console.log('Session table does not exist, creating it...');

      // Create the session table with correct structure
      await prisma.$executeRaw`
        CREATE TABLE "session" (
          "id" TEXT NOT NULL,
          "shop" TEXT NOT NULL,
          "state" TEXT NOT NULL,
          "isOnline" BOOLEAN NOT NULL DEFAULT false,
          "scope" TEXT,
          "expires" TIMESTAMP(3),
          "accessToken" TEXT NOT NULL,
          "userId" BIGINT,
          "firstName" TEXT,
          "lastName" TEXT,
          "email" TEXT,
          "accountOwner" BOOLEAN NOT NULL DEFAULT false,
          "locale" TEXT,
          "collaborator" BOOLEAN DEFAULT false,
          "emailVerified" BOOLEAN DEFAULT false,
          CONSTRAINT "session_pkey" PRIMARY KEY ("id")
        )
      `;

      console.log('✅ Session table created');

      // Mark the migration as applied
      await prisma.$executeRaw`
        INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
        VALUES ('20250719164517_fix_session_table', '20250719164517_fix_session_table', NOW(), '20250719164517_fix_session_table', NULL, NULL, NOW(), 1)
        ON CONFLICT (id) DO NOTHING
      `;

      console.log('✅ Migration marked as applied');
    }

    // Handle Setting table
    if (settingTables.length === 0) {
      console.log('Setting table does not exist, creating it...');

      // Create the Setting table with correct structure
      await prisma.$executeRaw`
        CREATE TABLE "Setting" (
          "id" TEXT NOT NULL,
          "key" TEXT NOT NULL,
          "value" TEXT NOT NULL,
          CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
        )
      `;

      // Create unique index on key
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key")
      `;

      console.log('✅ Setting table created');
    } else {
      console.log('✅ Setting table already exists');
    }

    // Ensure all tables from the initial migration are created
    console.log('Ensuring all tables from initial migration exist...');

    // Check if we need to create the initial migration entry
    const initialMigration = await prisma.$queryRaw`
      SELECT * FROM "_prisma_migrations" 
      WHERE migration_name = '20250718152531_init'
    `;

    if (initialMigration.length === 0) {
      console.log('Creating initial migration entry...');
      await prisma.$executeRaw`
        INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
        VALUES ('20250718152531_init', '20250718152531_init', NOW(), '20250718152531_init', NULL, NULL, NOW(), 1)
        ON CONFLICT (id) DO NOTHING
      `;
      console.log('✅ Initial migration entry created');
    } else {
      console.log('✅ Initial migration entry already exists');
    }

    // Check if there are any pending migrations that need to be applied
    console.log('Checking for pending migrations...');
    const pendingMigrations = await prisma.$queryRaw`
      SELECT migration_name FROM "_prisma_migrations" 
      WHERE finished_at IS NULL
    `;

    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations, all migrations are applied');
    } else {
      console.log('Pending migrations found:', pendingMigrations);
      console.log('Deploying pending migrations...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    }

    console.log('✅ Migration fix completed successfully');

  } catch (error) {
    console.error('❌ Error fixing migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixMigration(); 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMobileSettings() {
    try {
        console.log('=== CHECKING MOBILE SETTINGS IN DATABASE ===');

        // Check for mobile settings
        const mobileSettings = await prisma.setting.findMany({
            where: {
                key: {
                    startsWith: 'sticky_mobile_'
                }
            }
        });

        console.log('Mobile settings found:', mobileSettings.length);
        mobileSettings.forEach(setting => {
            console.log(`${setting.key}: ${setting.value}`);
        });

        // Check for all settings
        const allSettings = await prisma.setting.findMany();
        console.log('\n=== ALL SETTINGS ===');
        console.log('Total settings:', allSettings.length);
        allSettings.forEach(setting => {
            console.log(`${setting.key}: ${setting.value}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkMobileSettings(); 
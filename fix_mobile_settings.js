import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixMobileSettings() {
    try {
        console.log('=== FIXING MOBILE SETTINGS ===');

        // Define the mobile settings that should be true by default
        const mobileDisplaySettings = {
            'sticky_mobile_content_display_image': 'true',
            'sticky_mobile_content_display_title': 'true',
            'sticky_mobile_content_display_price': 'true',
            'sticky_mobile_content_display_quantity': 'true'
        };

        // Update each setting
        for (const [key, value] of Object.entries(mobileDisplaySettings)) {
            console.log(`Updating ${key} to ${value}`);
            
            await prisma.setting.upsert({
                where: { key },
                update: { value },
                create: { key, value },
            });
        }

        // Verify the changes
        console.log('\n=== VERIFYING CHANGES ===');
        const updatedSettings = await prisma.setting.findMany({
            where: {
                key: {
                    in: Object.keys(mobileDisplaySettings)
                }
            }
        });

        console.log('Updated settings:');
        updatedSettings.forEach(setting => {
            console.log(`${setting.key}: ${setting.value}`);
        });

        console.log('\n=== MOBILE SETTINGS FIXED ===');
        console.log('Mobile display settings have been set to true by default.');

    } catch (error) {
        console.error('Error fixing mobile settings:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixMobileSettings(); 
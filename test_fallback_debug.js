import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testFallbackDebug() {
    try {
        console.log('=== TESTING FALLBACK PATH DEBUG ===');

        // Simulate the exact fallback path logic
        const settings = {
            sticky_bar_color: await prisma.setting.findUnique({ where: { key: "sticky_bar_color" } }),
            sticky_visibility: await prisma.setting.findUnique({ where: { key: "sticky_visibility" } }),
            sticky_trigger: await prisma.setting.findUnique({ where: { key: "sticky_trigger" } }),
            sticky_content_display_image: await prisma.setting.findUnique({ where: { key: "sticky_content_display_image" } }),
            sticky_content_display_title: await prisma.setting.findUnique({ where: { key: "sticky_content_display_title" } }),
            sticky_content_display_price: await prisma.setting.findUnique({ where: { key: "sticky_content_display_price" } }),
            sticky_content_display_quantity: await prisma.setting.findUnique({ where: { key: "sticky_content_display_quantity" } }),
            sticky_bar_width: await prisma.setting.findUnique({ where: { key: "sticky_bar_width" } }),
            sticky_max_width: await prisma.setting.findUnique({ where: { key: "sticky_max_width" } }),
            sticky_max_width_unit: await prisma.setting.findUnique({ where: { key: "sticky_max_width_unit" } }),
            sticky_alignment: await prisma.setting.findUnique({ where: { key: "sticky_alignment" } }),
            sticky_outer_spacing: await prisma.setting.findUnique({ where: { key: "sticky_outer_spacing" } }),
            sticky_outer_spacing_unit: await prisma.setting.findUnique({ where: { key: "sticky_outer_spacing_unit" } }),
            sticky_inner_spacing: await prisma.setting.findUnique({ where: { key: "sticky_inner_spacing" } }),
            sticky_inner_spacing_unit: await prisma.setting.findUnique({ where: { key: "sticky_inner_spacing_unit" } }),
            sticky_background_color: await prisma.setting.findUnique({ where: { key: "sticky_background_color" } }),
            sticky_border_color: await prisma.setting.findUnique({ where: { key: "sticky_border_color" } }),
            sticky_border_radius: await prisma.setting.findUnique({ where: { key: "sticky_border_radius" } }),
            sticky_product_name_color: await prisma.setting.findUnique({ where: { key: "sticky_product_name_color" } }),
            sticky_image_size: await prisma.setting.findUnique({ where: { key: "sticky_image_size" } }),
            sticky_quantity_color: await prisma.setting.findUnique({ where: { key: "sticky_quantity_color" } }),
            sticky_quantity_border_color: await prisma.setting.findUnique({ where: { key: "sticky_quantity_border_color" } }),
            sticky_button_behavior: await prisma.setting.findUnique({ where: { key: "sticky_button_behavior" } }),
            sticky_button_text: await prisma.setting.findUnique({ where: { key: "sticky_button_text" } }),
            sticky_enable_cart_icon: await prisma.setting.findUnique({ where: { key: "sticky_enable_cart_icon" } }),
            sticky_button_text_color: await prisma.setting.findUnique({ where: { key: "sticky_button_text_color" } }),
            sticky_button_bg_color: await prisma.setting.findUnique({ where: { key: "sticky_button_bg_color" } }),
            sticky_custom_css: await prisma.setting.findUnique({ where: { key: "sticky_custom_css" } }),

            // Mobile-specific settings
            sticky_mobile_content_display_image: await prisma.setting.findUnique({ where: { key: "sticky_mobile_content_display_image" } }),
            sticky_mobile_content_display_title: await prisma.setting.findUnique({ where: { key: "sticky_mobile_content_display_title" } }),
            sticky_mobile_content_display_price: await prisma.setting.findUnique({ where: { key: "sticky_mobile_content_display_price" } }),
            sticky_mobile_content_display_quantity: await prisma.setting.findUnique({ where: { key: "sticky_mobile_content_display_quantity" } }),
            sticky_mobile_bar_width: await prisma.setting.findUnique({ where: { key: "sticky_mobile_bar_width" } }),
            sticky_mobile_max_width: await prisma.setting.findUnique({ where: { key: "sticky_mobile_max_width" } }),
            sticky_mobile_max_width_unit: await prisma.setting.findUnique({ where: { key: "sticky_mobile_max_width_unit" } }),
            sticky_mobile_alignment: await prisma.setting.findUnique({ where: { key: "sticky_mobile_alignment" } }),
            sticky_mobile_outer_spacing: await prisma.setting.findUnique({ where: { key: "sticky_mobile_outer_spacing" } }),
            sticky_mobile_outer_spacing_unit: await prisma.setting.findUnique({ where: { key: "sticky_mobile_outer_spacing_unit" } }),
            sticky_mobile_inner_spacing: await prisma.setting.findUnique({ where: { key: "sticky_mobile_inner_spacing" } }),
            sticky_mobile_inner_spacing_unit: await prisma.setting.findUnique({ where: { key: "sticky_mobile_inner_spacing_unit" } }),
            sticky_mobile_background_color: await prisma.setting.findUnique({ where: { key: "sticky_mobile_background_color" } }),
            sticky_mobile_border_color: await prisma.setting.findUnique({ where: { key: "sticky_mobile_border_color" } }),
            sticky_mobile_border_radius: await prisma.setting.findUnique({ where: { key: "sticky_mobile_border_radius" } }),
            sticky_mobile_product_name_color: await prisma.setting.findUnique({ where: { key: "sticky_mobile_product_name_color" } }),
            sticky_mobile_image_size: await prisma.setting.findUnique({ where: { key: "sticky_mobile_image_size" } }),
            sticky_mobile_quantity_color: await prisma.setting.findUnique({ where: { key: "sticky_mobile_quantity_color" } }),
            sticky_mobile_quantity_border_color: await prisma.setting.findUnique({ where: { key: "sticky_mobile_quantity_border_color" } }),
            sticky_mobile_button_behavior: await prisma.setting.findUnique({ where: { key: "sticky_mobile_button_behavior" } }),
            sticky_mobile_button_text: await prisma.setting.findUnique({ where: { key: "sticky_mobile_button_text" } }),
            sticky_mobile_enable_cart_icon: await prisma.setting.findUnique({ where: { key: "sticky_mobile_enable_cart_icon" } }),
            sticky_mobile_button_text_color: await prisma.setting.findUnique({ where: { key: "sticky_mobile_button_text_color" } }),
            sticky_mobile_button_bg_color: await prisma.setting.findUnique({ where: { key: "sticky_mobile_button_bg_color" } }),
        };

        console.log('=== RAW DATABASE SETTINGS (FALLBACK SIMULATION) ===');
        console.log(JSON.stringify(settings, null, 2));

        // Check mobile settings specifically
        const mobileSettings = {};
        for (const [key, value] of Object.entries(settings)) {
            if (key.startsWith('sticky_mobile_')) {
                mobileSettings[key] = value;
            }
        }

        console.log('\n=== MOBILE SETTINGS FROM DATABASE ===');
        console.log('Number of mobile settings:', Object.keys(mobileSettings).length);
        Object.entries(mobileSettings).forEach(([key, setting]) => {
            console.log(`${key}: ${setting?.value || 'null'}`);
        });

        // Simulate the cleanSettings object creation (exact fallback logic)
        const cleanSettings = {
            sticky_bar_color: settings.sticky_bar_color?.value || '#fff',
            sticky_visibility: settings.sticky_visibility?.value || 'all',
            sticky_trigger: settings.sticky_trigger?.value || 'after-summary',
            sticky_content_display_image: settings.sticky_content_display_image?.value === 'true',
            sticky_content_display_title: settings.sticky_content_display_title?.value === 'true',
            sticky_content_display_price: settings.sticky_content_display_price?.value === 'true',
            sticky_content_display_quantity: settings.sticky_content_display_quantity?.value === 'true',
            sticky_bar_width: settings.sticky_bar_width?.value || 'contained',
            sticky_max_width: settings.sticky_max_width?.value || '',
            sticky_max_width_unit: settings.sticky_max_width_unit?.value || 'px',
            sticky_alignment: settings.sticky_alignment?.value || 'left',
            sticky_outer_spacing: settings.sticky_outer_spacing?.value || '',
            sticky_outer_spacing_unit: settings.sticky_outer_spacing_unit?.value || 'px',
            sticky_inner_spacing: settings.sticky_inner_spacing?.value || '16',
            sticky_inner_spacing_unit: settings.sticky_inner_spacing_unit?.value || 'px',
            sticky_background_color: settings.sticky_background_color?.value || '#FFFFFF',
            sticky_border_color: settings.sticky_border_color?.value || '#000000',
            sticky_border_radius: settings.sticky_border_radius?.value || '0',
            sticky_product_name_color: settings.sticky_product_name_color?.value || '#141414',
            sticky_image_size: settings.sticky_image_size?.value || 'medium',
            sticky_quantity_color: settings.sticky_quantity_color?.value || '#141414',
            sticky_quantity_border_color: settings.sticky_quantity_border_color?.value || '#DFDFDF',
            sticky_button_behavior: settings.sticky_button_behavior?.value || 'add',
            sticky_button_text: settings.sticky_button_text?.value || 'Add to cart',
            sticky_enable_cart_icon: settings.sticky_enable_cart_icon?.value === 'true',
            sticky_button_text_color: settings.sticky_button_text_color?.value || '#FFFFFF',
            sticky_button_bg_color: settings.sticky_button_bg_color?.value || '#141414',
            sticky_custom_css: settings.sticky_custom_css?.value || '',

            // Mobile-specific settings
            sticky_mobile_content_display_image: settings.sticky_mobile_content_display_image?.value === 'true',
            sticky_mobile_content_display_title: settings.sticky_mobile_content_display_title?.value === 'true',
            sticky_mobile_content_display_price: settings.sticky_mobile_content_display_price?.value === 'true',
            sticky_mobile_content_display_quantity: settings.sticky_mobile_content_display_quantity?.value === 'true',
            sticky_mobile_bar_width: settings.sticky_mobile_bar_width?.value || 'contained',
            sticky_mobile_max_width: settings.sticky_mobile_max_width?.value || '',
            sticky_mobile_max_width_unit: settings.sticky_mobile_max_width_unit?.value || 'px',
            sticky_mobile_alignment: settings.sticky_mobile_alignment?.value || 'right',
            sticky_mobile_outer_spacing: settings.sticky_mobile_outer_spacing?.value || '',
            sticky_mobile_outer_spacing_unit: settings.sticky_mobile_outer_spacing_unit?.value || 'px',
            sticky_mobile_inner_spacing: settings.sticky_mobile_inner_spacing?.value || '16',
            sticky_mobile_inner_spacing_unit: settings.sticky_mobile_inner_spacing_unit?.value || 'px',
            sticky_mobile_background_color: settings.sticky_mobile_background_color?.value || '#FFFFFF',
            sticky_mobile_border_color: settings.sticky_mobile_border_color?.value || '#000000',
            sticky_mobile_border_radius: settings.sticky_mobile_border_radius?.value || '12',
            sticky_mobile_product_name_color: settings.sticky_mobile_product_name_color?.value || '#141414',
            sticky_mobile_image_size: settings.sticky_mobile_image_size?.value || 'medium',
            sticky_mobile_quantity_color: settings.sticky_mobile_quantity_color?.value || '#141414',
            sticky_mobile_quantity_border_color: settings.sticky_mobile_quantity_border_color?.value || '#DFDFDF',
            sticky_mobile_button_behavior: settings.sticky_mobile_button_behavior?.value || 'add',
            sticky_mobile_button_text: settings.sticky_mobile_button_text?.value || 'Add to cart',
            sticky_mobile_enable_cart_icon: settings.sticky_mobile_enable_cart_icon?.value === 'true',
            sticky_mobile_button_text_color: settings.sticky_mobile_button_text_color?.value || '#FFFFFF',
            sticky_mobile_button_bg_color: settings.sticky_mobile_button_bg_color?.value || '#141414',
        };

        console.log('\n=== CLEAN SETTINGS (FALLBACK SIMULATION) ===');
        console.log(JSON.stringify(cleanSettings, null, 2));

        // Check mobile settings in cleanSettings
        const cleanMobileSettings = {};
        for (const [key, value] of Object.entries(cleanSettings)) {
            if (key.startsWith('sticky_mobile_')) {
                cleanMobileSettings[key] = value;
            }
        }

        console.log('\n=== MOBILE SETTINGS IN CLEAN SETTINGS ===');
        console.log('Number of mobile settings:', Object.keys(cleanMobileSettings).length);
        if (Object.keys(cleanMobileSettings).length === 0) {
            console.log('❌ PROBLEM: No mobile settings in cleanSettings!');
        } else {
            console.log('✅ Mobile settings found in cleanSettings');
            console.log('Mobile settings:', Object.keys(cleanMobileSettings));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testFallbackDebug(); 
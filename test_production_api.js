import fetch from 'node-fetch';

async function testProductionAPI() {
    try {
        console.log('=== TESTING PRODUCTION API AFTER DEPLOYMENT ===');

        // Test the production app proxy settings endpoint
        // The storefront calls /apps/proxy/settings relative to the shop domain
        // We need to test with the actual shop domain
        const shop = 'sticky-add-to-cart-develop.myshopify.com';
        const testUrl = `https://${shop}/apps/proxy/settings?t=${Date.now()}`;

        console.log('Testing URL:', testUrl);

        const response = await fetch(testUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-cache'
        });

        console.log('Response status:', response.status);

        if (response.ok) {
            const data = await response.json();

            // Check if mobile settings are present
            const mobileSettings = {};
            const desktopSettings = {};

            for (const [key, value] of Object.entries(data)) {
                if (key.startsWith('sticky_mobile_')) {
                    mobileSettings[key] = value;
                } else if (key.startsWith('sticky_')) {
                    desktopSettings[key] = value;
                }
            }

            console.log('\n=== PRODUCTION API ANALYSIS ===');
            console.log('Desktop settings count:', Object.keys(desktopSettings).length);
            console.log('Mobile settings count:', Object.keys(mobileSettings).length);

            if (Object.keys(mobileSettings).length === 0) {
                console.log('❌ PROBLEM: No mobile settings in production API!');
                console.log('This means the production deployment still has issues.');
            } else {
                console.log('✅ Mobile settings found in production API!');
                console.log('Mobile settings:', Object.keys(mobileSettings));

                // Check specific mobile display settings
                const displaySettings = [
                    'sticky_mobile_content_display_image',
                    'sticky_mobile_content_display_title',
                    'sticky_mobile_content_display_price',
                    'sticky_mobile_content_display_quantity'
                ];

                console.log('\n=== MOBILE DISPLAY SETTINGS IN PRODUCTION ===');
                displaySettings.forEach(key => {
                    const value = mobileSettings[key];
                    console.log(`${key}: ${value} (${typeof value})`);
                });
            }

        } else {
            console.error('❌ Production API request failed:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Error response:', errorText);
        }

    } catch (error) {
        console.error('❌ Error testing production API:', error);
    }
}

testProductionAPI(); 
import fetch from 'node-fetch';

async function debugProxyPath() {
    try {
        console.log('=== DEBUGGING PROXY PATH ===');

        // Test the local API endpoint
        const testUrl = 'http://localhost:9293/apps/proxy/settings?shop=sticky-add-to-cart-develop.myshopify.com&path_prefix=apps&timestamp=1753813835';

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

            console.log('\n=== SETTINGS ANALYSIS ===');
            console.log('Desktop settings count:', Object.keys(desktopSettings).length);
            console.log('Mobile settings count:', Object.keys(mobileSettings).length);

            if (Object.keys(mobileSettings).length === 0) {
                console.log('❌ PROBLEM: No mobile settings in API response!');
                console.log('This means either:');
                console.log('1. Authentication failed and fallback path is missing mobile settings');
                console.log('2. Mobile settings are not being loaded from database');
                console.log('3. Mobile settings are not being included in the response');
            } else {
                console.log('✅ Mobile settings found in API response');
                console.log('Mobile settings:', Object.keys(mobileSettings));
            }

            // Check specific mobile display settings
            const displaySettings = [
                'sticky_mobile_content_display_image',
                'sticky_mobile_content_display_title',
                'sticky_mobile_content_display_price',
                'sticky_mobile_content_display_quantity'
            ];

            console.log('\n=== MOBILE DISPLAY SETTINGS ===');
            displaySettings.forEach(key => {
                const value = mobileSettings[key];
                console.log(`${key}: ${value} (${typeof value})`);
            });

        } else {
            console.error('❌ API request failed:', response.status, response.statusText);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

debugProxyPath(); 
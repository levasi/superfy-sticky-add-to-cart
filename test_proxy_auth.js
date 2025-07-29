import fetch from 'node-fetch';

async function testProxyAuthentication() {
    try {
        console.log('=== TESTING APP PROXY AUTHENTICATION ===');

        // Test with proper Shopify app proxy parameters
        const shop = 'sticky-add-to-cart-develop.myshopify.com';
        const timestamp = Math.floor(Date.now() / 1000);
        const pathPrefix = 'apps';

        // Create a test URL with proper parameters
        const testUrl = `https://bodies-violation-gras-administration.trycloudflare.com/apps/proxy/settings?shop=${shop}&path_prefix=${pathPrefix}&timestamp=${timestamp}`;

        console.log('Testing URL:', testUrl);

        const response = await fetch(testUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-cache'
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
            const data = await response.json();
            console.log('\n=== API RESPONSE ===');
            console.log(JSON.stringify(data, null, 2));

            // Check if mobile settings are present
            const mobileSettings = {};
            for (const [key, value] of Object.entries(data)) {
                if (key.startsWith('sticky_mobile_')) {
                    mobileSettings[key] = value;
                }
            }

            console.log('\n=== MOBILE SETTINGS CHECK ===');
            console.log('Number of mobile settings:', Object.keys(mobileSettings).length);
            if (Object.keys(mobileSettings).length === 0) {
                console.log('❌ NO MOBILE SETTINGS FOUND - This is the problem!');
            } else {
                console.log('✅ Mobile settings found:', Object.keys(mobileSettings));
            }

        } else {
            console.error('❌ API request failed:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Error response:', errorText);
        }

    } catch (error) {
        console.error('❌ Error testing API:', error);
    }
}

testProxyAuthentication(); 
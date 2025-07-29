import fetch from 'node-fetch';

async function testAuthDebug() {
    try {
        console.log('=== TESTING AUTHENTICATION DEBUG ===');

        // Test the main API endpoint
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
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
            const data = await response.json();

            // Check if mobile settings are present
            const mobileSettings = {};
            for (const [key, value] of Object.entries(data)) {
                if (key.startsWith('sticky_mobile_')) {
                    mobileSettings[key] = value;
                }
            }

            console.log('\n=== MAIN API ANALYSIS ===');
            console.log('Mobile settings count:', Object.keys(mobileSettings).length);
            if (Object.keys(mobileSettings).length === 0) {
                console.log('❌ No mobile settings in main API');
            } else {
                console.log('✅ Mobile settings found in main API');
            }

        } else {
            console.error('❌ Main API failed:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Error response:', errorText);
        }

        // Test the metafields endpoint
        console.log('\n=== TESTING METAFIELDS ENDPOINT ===');
        const metafieldsUrl = 'http://localhost:9293/apps/proxy/metafields?shop=sticky-add-to-cart-develop.myshopify.com';

        const metafieldsResponse = await fetch(metafieldsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-cache'
        });

        console.log('Metafields response status:', metafieldsResponse.status);

        if (metafieldsResponse.ok) {
            const metafieldsData = await metafieldsResponse.json();

            // Check if mobile settings are present
            const mobileSettings = {};
            for (const [key, value] of Object.entries(metafieldsData)) {
                if (key.startsWith('sticky_mobile_')) {
                    mobileSettings[key] = value;
                }
            }

            console.log('\n=== METAFIELDS ANALYSIS ===');
            console.log('Mobile settings count:', Object.keys(mobileSettings).length);
            if (Object.keys(mobileSettings).length === 0) {
                console.log('❌ No mobile settings in metafields');
            } else {
                console.log('✅ Mobile settings found in metafields');
            }

        } else {
            console.error('❌ Metafields API failed:', metafieldsResponse.status, metafieldsResponse.statusText);
            const errorText = await metafieldsResponse.text();
            console.error('Error response:', errorText);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testAuthDebug(); 
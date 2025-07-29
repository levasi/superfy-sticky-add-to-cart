import fetch from 'node-fetch';

async function testMobileSettingsAPI() {
    try {
        console.log('=== TESTING MOBILE SETTINGS API ===');
        
        // Test the app proxy settings endpoint
        const response = await fetch('https://bodies-violation-gras-administration.trycloudflare.com/apps/proxy/settings', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-cache'
        });

        if (response.ok) {
            const data = await response.json();
            console.log('API Response:', JSON.stringify(data, null, 2));
            
            // Extract mobile settings
            const mobileSettings = {};
            for (const [key, value] of Object.entries(data)) {
                if (key.startsWith('sticky_mobile_')) {
                    mobileSettings[key] = value;
                }
            }
            
            console.log('\n=== MOBILE SETTINGS FROM API ===');
            console.log('Number of mobile settings:', Object.keys(mobileSettings).length);
            console.table(mobileSettings);
            
            // Check specific display settings
            const displaySettings = [
                'sticky_mobile_content_display_image',
                'sticky_mobile_content_display_title', 
                'sticky_mobile_content_display_price',
                'sticky_mobile_content_display_quantity'
            ];
            
            console.log('\n=== DISPLAY SETTINGS ===');
            displaySettings.forEach(key => {
                console.log(`${key}: ${mobileSettings[key]}`);
            });
            
        } else {
            console.error('API request failed:', response.status, response.statusText);
        }
        
    } catch (error) {
        console.error('Error testing API:', error);
    }
}

testMobileSettingsAPI(); 
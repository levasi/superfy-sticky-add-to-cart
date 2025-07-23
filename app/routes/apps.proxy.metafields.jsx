import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    console.log('=== METAFIELDS FALLBACK REQUEST ===');
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);

    try {
        // Try to authenticate the request
        const { admin } = await authenticate.admin(request);
        console.log('Admin authentication successful');

        // Get the shop from the request
        const url = new URL(request.url);
        const shop = url.searchParams.get('shop');

        console.log('Shop parameter:', shop);

        if (!shop) {
            console.log('ERROR: Shop parameter required');
            return json({ error: 'Shop parameter required' }, { status: 400 });
        }

        console.log('Loading settings from metafields for shop:', shop);

        // Get shop metafields
        const metafieldsResponse = await admin.graphql(`
            query {
                shop {
                    metafields(namespace: "sticky_bar", first: 50) {
                        edges {
                            node {
                                key
                                value
                                type
                            }
                        }
                    }
                }
            }
        `);

        const metafieldsData = await metafieldsResponse.json();
        console.log('Metafields response:', metafieldsData);

        // Convert metafields to settings object
        const metafields = metafieldsData.data.shop.metafields.edges;
        const settings = {};

        metafields.forEach(({ node }) => {
            if (node.key.startsWith('sticky_')) {
                let value = node.value;

                // Parse JSON values
                if (node.type === 'json') {
                    try {
                        value = JSON.parse(node.value);
                    } catch (e) {
                        console.error('Failed to parse JSON metafield:', node.key, node.value);
                    }
                }

                // Convert boolean strings
                if (typeof value === 'string' && (value === 'true' || value === 'false')) {
                    value = value === 'true';
                }

                settings[node.key] = value;
            }
        });

        console.log('=== METAFIELDS SETTINGS ===');
        console.log(JSON.stringify(settings, null, 2));

        // Convert to clean settings object with defaults
        const cleanSettings = {
            sticky_bar_color: settings.sticky_bar_color || '#fff',
            sticky_visibility: settings.sticky_visibility || 'all',
            sticky_trigger: settings.sticky_trigger || 'after-summary',
            sticky_content_display_image: settings.sticky_content_display_image !== false,
            sticky_content_display_title: settings.sticky_content_display_title !== false,
            sticky_content_display_price: settings.sticky_content_display_price !== false,
            sticky_content_display_quantity: settings.sticky_content_display_quantity !== false,
            sticky_bar_width: settings.sticky_bar_width || 'contained',
            sticky_max_width: settings.sticky_max_width || '',
            sticky_max_width_unit: settings.sticky_max_width_unit || 'px',
            sticky_alignment: settings.sticky_alignment || 'left',
            sticky_outer_spacing: settings.sticky_outer_spacing || '',
            sticky_outer_spacing_unit: settings.sticky_outer_spacing_unit || 'px',
            sticky_inner_spacing: settings.sticky_inner_spacing || '16',
            sticky_inner_spacing_unit: settings.sticky_inner_spacing_unit || 'px',
            sticky_background_color: settings.sticky_background_color || '#FFFFFF',
            sticky_border_color: settings.sticky_border_color || '#000000',
            sticky_product_name_color: settings.sticky_product_name_color || '#141414',
            sticky_image_size: settings.sticky_image_size || 'medium',
            sticky_quantity_color: settings.sticky_quantity_color || '#141414',
            sticky_quantity_border_color: settings.sticky_quantity_border_color || '#DFDFDF',
            sticky_button_behavior: settings.sticky_button_behavior || 'add',
            sticky_button_text: settings.sticky_button_text || 'Add to cart',
            sticky_enable_cart_icon: settings.sticky_enable_cart_icon === true,
            sticky_button_text_color: settings.sticky_button_text_color || '#FFFFFF',
            sticky_button_bg_color: settings.sticky_button_bg_color || '#141414',
            sticky_custom_css: settings.sticky_custom_css || '',
        };

        console.log('=== CLEAN METAFIELDS SETTINGS ===');
        console.log(JSON.stringify(cleanSettings, null, 2));
        console.log('=== END METAFIELDS FALLBACK ===');

        // Return settings with CORS headers for storefront access
        return json(cleanSettings, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

    } catch (error) {
        console.error('=== METAFIELDS FALLBACK ERROR ===');
        console.error('Error:', error);
        console.error('Stack:', error.stack);
        return json({ error: 'Failed to load metafields settings' }, { status: 500 });
    }
};

// Handle OPTIONS requests for CORS
export const action = async ({ request }) => {
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }

    return new Response('Method not allowed', { status: 405 });
}; 
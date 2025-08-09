import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    // Simple test endpoint
    const url = new URL(request.url);
    console.log('🔍 Request URL:', request.url);
    console.log('🔍 URL search params:', Object.fromEntries(url.searchParams.entries()));

    if (url.searchParams.get('test') === 'status') {
        console.log('🧪 TEST ENDPOINT TRIGGERED');
        const { getSetting } = await import("../models/settings.server");
        const statusSetting = await getSetting("sticky_bar_status");
        console.log('🧪 TEST: sticky_bar_status from database:', statusSetting);

        const testResponse = {
            test: 'status',
            sticky_bar_status: statusSetting?.value || 'not_found',
            raw_setting: statusSetting,
            timestamp: new Date().toISOString()
        };

        console.log('🧪 TEST: Returning test response:', testResponse);
        return json(testResponse);
    }

    console.log('🔍 Regular endpoint triggered (not test)');
    try {
        // Try to authenticate the request using Shopify's app proxy authentication
        const { storefront, liquid } = await authenticate.public.appProxy(request);

        // Get the shop from the request parameters (as per Shopify docs)
        const url = new URL(request.url);
        const shop = url.searchParams.get('shop');
        const pathPrefix = url.searchParams.get('path_prefix');
        const timestamp = url.searchParams.get('timestamp');
        const signature = url.searchParams.get('signature');
        const loggedInCustomerId = url.searchParams.get('logged_in_customer_id');

        if (!shop) {
            console.log('ERROR: Shop parameter required');
            return json({ error: 'Shop parameter required' }, { status: 400 });
        }

        // Import the getSetting function
        const { getSetting } = await import("../models/settings.server");

        // Load all sticky bar settings from database
        const settings = {
            sticky_bar_color: await getSetting("sticky_bar_color"),
            sticky_visibility: await getSetting("sticky_visibility"),
            sticky_trigger: await getSetting("sticky_trigger"),
            sticky_bar_status: await getSetting("sticky_bar_status"),
            sticky_content_display_image: await getSetting("sticky_content_display_image"),
            sticky_content_display_title: await getSetting("sticky_content_display_title"),
            sticky_content_display_price: await getSetting("sticky_content_display_price"),
            sticky_content_display_quantity: await getSetting("sticky_content_display_quantity"),
            sticky_content_display_mobile_image: await getSetting("sticky_content_display_mobile_image"),
            sticky_content_display_mobile_title: await getSetting("sticky_content_display_mobile_title"),
            sticky_content_display_mobile_price: await getSetting("sticky_content_display_mobile_price"),
            sticky_content_display_mobile_quantity: await getSetting("sticky_content_display_mobile_quantity"),
            sticky_bar_width: await getSetting("sticky_bar_width"),
            sticky_bar_width_mobile: await getSetting("sticky_bar_width_mobile"),
            sticky_max_width_mobile: await getSetting("sticky_max_width_mobile"),
            sticky_max_width_mobile_unit: await getSetting("sticky_max_width_mobile_unit"),
            sticky_alignment_mobile: await getSetting("sticky_alignment_mobile"),
            sticky_outer_spacing_mobile: await getSetting("sticky_outer_spacing_mobile"),
            sticky_outer_spacing_mobile_unit: await getSetting("sticky_outer_spacing_mobile_unit"),
            sticky_inner_spacing_mobile: await getSetting("sticky_inner_spacing_mobile"),
            sticky_max_width: await getSetting("sticky_max_width"),
            sticky_max_width_unit: await getSetting("sticky_max_width_unit"),
            sticky_alignment: await getSetting("sticky_alignment"),
            sticky_outer_spacing: await getSetting("sticky_outer_spacing"),
            sticky_outer_spacing_unit: await getSetting("sticky_outer_spacing_unit"),
            sticky_inner_spacing: await getSetting("sticky_inner_spacing"),
            sticky_inner_spacing_unit: await getSetting("sticky_inner_spacing_unit"),
            sticky_background_color: await getSetting("sticky_background_color"),
            sticky_border_color: await getSetting("sticky_border_color"),
            sticky_border_radius: await getSetting("sticky_border_radius"),
            sticky_product_name_color: await getSetting("sticky_product_name_color"),
            sticky_image_size: await getSetting("sticky_image_size"),
            sticky_image_size_mobile: await getSetting("sticky_image_size_mobile"),
            sticky_quantity_color: await getSetting("sticky_quantity_color"),
            sticky_quantity_border_color: await getSetting("sticky_quantity_border_color"),
            sticky_button_behavior: await getSetting("sticky_button_behavior"),
            sticky_button_text: await getSetting("sticky_button_text"),
            sticky_enable_cart_icon: await getSetting("sticky_enable_cart_icon"),
            sticky_enable_mobile_cart_icon: await getSetting("sticky_enable_mobile_cart_icon"),
            sticky_button_text_color: await getSetting("sticky_button_text_color"),
            sticky_button_bg_color: await getSetting("sticky_button_bg_color"),
            sticky_custom_css: await getSetting("sticky_custom_css"),
        };

        console.log('📥 App proxy loading sticky bar status from database:', settings.sticky_bar_status?.value);
        console.log('📥 Full sticky_bar_status object:', settings.sticky_bar_status);
        console.log('📥 All settings keys:', Object.keys(settings));

        // Convert to a clean settings object with default values
        const cleanSettings = {
            sticky_bar_color: settings.sticky_bar_color?.value || '#fff',
            sticky_visibility: settings.sticky_visibility?.value || 'all',
            sticky_trigger: settings.sticky_trigger?.value || 'after-summary',
            sticky_bar_status: settings.sticky_bar_status?.value || 'live',
            sticky_content_display_image: settings.sticky_content_display_image?.value === 'true',
            sticky_content_display_title: settings.sticky_content_display_title?.value === 'true',
            sticky_content_display_price: settings.sticky_content_display_price?.value === 'true',
            sticky_content_display_quantity: settings.sticky_content_display_quantity?.value === 'true',
            sticky_content_display_mobile_image: settings.sticky_content_display_mobile_image?.value !== 'false',
            sticky_content_display_mobile_title: settings.sticky_content_display_mobile_title?.value !== 'false',
            sticky_content_display_mobile_price: settings.sticky_content_display_mobile_price?.value !== 'false',
            sticky_content_display_mobile_quantity: settings.sticky_content_display_mobile_quantity?.value !== 'false',
            sticky_bar_width: settings.sticky_bar_width?.value || 'contained',
            sticky_bar_width_mobile: settings.sticky_bar_width_mobile?.value || 'full',
            sticky_max_width_mobile: settings.sticky_max_width_mobile?.value || '',
            sticky_max_width_mobile_unit: settings.sticky_max_width_mobile_unit?.value || 'px',
            sticky_alignment_mobile: settings.sticky_alignment_mobile?.value || 'right',
            sticky_outer_spacing_mobile: settings.sticky_outer_spacing_mobile?.value || '',
            sticky_outer_spacing_mobile_unit: settings.sticky_outer_spacing_mobile_unit?.value || 'px',
            sticky_inner_spacing_mobile: settings.sticky_inner_spacing_mobile?.value || '16',
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
            sticky_image_size_mobile: settings.sticky_image_size_mobile?.value || 'medium',
            sticky_quantity_color: settings.sticky_quantity_color?.value || '#141414',
            sticky_quantity_border_color: settings.sticky_quantity_border_color?.value || '#DFDFDF',
            sticky_button_behavior: settings.sticky_button_behavior?.value || 'add',
            sticky_button_text: settings.sticky_button_text?.value || 'Add to cart',
            sticky_enable_cart_icon: settings.sticky_enable_cart_icon?.value === 'true',
            sticky_enable_mobile_cart_icon: settings.sticky_enable_mobile_cart_icon?.value === 'true',
            sticky_button_text_color: settings.sticky_button_text_color?.value || '#FFFFFF',
            sticky_button_bg_color: settings.sticky_button_bg_color?.value || '#141414',
            sticky_custom_css: settings.sticky_custom_css?.value || '',
        };

        console.log('📤 Sending sticky bar settings to storefront:', {
            sticky_bar_status: cleanSettings.sticky_bar_status,
            sticky_visibility: cleanSettings.sticky_visibility,
            sticky_trigger: cleanSettings.sticky_trigger
        });
        console.log('📤 Full cleanSettings object:', cleanSettings);
        console.log('📤 cleanSettings keys:', Object.keys(cleanSettings));
        console.log('📤 Does cleanSettings have sticky_bar_status?', 'sticky_bar_status' in cleanSettings);

        return json(cleanSettings, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Last-Modified': new Date().toUTCString(),
                'ETag': `"${Date.now()}-${Math.random()}"`
            }
        });

    } catch (authError) {
        console.error('=== APP PROXY AUTHENTICATION FAILED ===');
        console.error('Auth error:', authError);

        // Fallback: Try to load settings without app proxy authentication
        // This might work if the store has password protection
        try {
            console.log('Trying fallback authentication...');

            // Get the shop from the request
            const url = new URL(request.url);
            const shop = url.searchParams.get('shop');

            if (!shop) {
                return json({ error: 'Shop parameter required' }, { status: 400 });
            }

            // Import the getSetting function
            const { getSetting } = await import("../models/settings.server");

            // Load all sticky bar settings from database
            const settings = {
                sticky_bar_color: await getSetting("sticky_bar_color"),
                sticky_visibility: await getSetting("sticky_visibility"),
                sticky_trigger: await getSetting("sticky_trigger"),
                sticky_bar_status: await getSetting("sticky_bar_status"),
                sticky_content_display_image: await getSetting("sticky_content_display_image"),
                sticky_content_display_title: await getSetting("sticky_content_display_title"),
                sticky_content_display_price: await getSetting("sticky_content_display_price"),
                sticky_content_display_quantity: await getSetting("sticky_content_display_quantity"),
                sticky_content_display_mobile_image: await getSetting("sticky_content_display_mobile_image"),
                sticky_content_display_mobile_title: await getSetting("sticky_content_display_mobile_title"),
                sticky_content_display_mobile_price: await getSetting("sticky_content_display_mobile_price"),
                sticky_content_display_mobile_quantity: await getSetting("sticky_content_display_mobile_quantity"),
                sticky_bar_width: await getSetting("sticky_bar_width"),
                sticky_bar_width_mobile: await getSetting("sticky_bar_width_mobile"),
                sticky_max_width_mobile: await getSetting("sticky_max_width_mobile"),
                sticky_max_width_mobile_unit: await getSetting("sticky_max_width_mobile_unit"),
                sticky_alignment_mobile: await getSetting("sticky_alignment_mobile"),
                sticky_outer_spacing_mobile: await getSetting("sticky_outer_spacing_mobile"),
                sticky_outer_spacing_mobile_unit: await getSetting("sticky_outer_spacing_mobile_unit"),
                sticky_inner_spacing_mobile: await getSetting("sticky_inner_spacing_mobile"),
                sticky_max_width: await getSetting("sticky_max_width"),
                sticky_max_width_unit: await getSetting("sticky_max_width_unit"),
                sticky_alignment: await getSetting("sticky_alignment"),
                sticky_outer_spacing: await getSetting("sticky_outer_spacing"),
                sticky_outer_spacing_unit: await getSetting("sticky_outer_spacing_unit"),
                sticky_inner_spacing: await getSetting("sticky_inner_spacing"),
                sticky_inner_spacing_unit: await getSetting("sticky_inner_spacing_unit"),
                sticky_background_color: await getSetting("sticky_background_color"),
                sticky_border_color: await getSetting("sticky_border_color"),
                sticky_border_radius: await getSetting("sticky_border_radius"),
                sticky_product_name_color: await getSetting("sticky_product_name_color"),
                sticky_image_size: await getSetting("sticky_image_size"),
                sticky_image_size_mobile: await getSetting("sticky_image_size_mobile"),
                sticky_quantity_color: await getSetting("sticky_quantity_color"),
                sticky_quantity_border_color: await getSetting("sticky_quantity_border_color"),
                sticky_button_behavior: await getSetting("sticky_button_behavior"),
                sticky_button_text: await getSetting("sticky_button_text"),
                sticky_enable_cart_icon: await getSetting("sticky_enable_cart_icon"),
                sticky_enable_mobile_cart_icon: await getSetting("sticky_enable_mobile_cart_icon"),
                sticky_button_text_color: await getSetting("sticky_button_text_color"),
                sticky_button_bg_color: await getSetting("sticky_button_bg_color"),
                sticky_custom_css: await getSetting("sticky_custom_css"),
            };

            console.log('📥 Fallback loading sticky bar status from database:', settings.sticky_bar_status?.value);
            console.log('📥 Full sticky_bar_status object:', settings.sticky_bar_status);
            console.log('📥 All settings keys:', Object.keys(settings));

            // Convert to a clean settings object with default values
            const cleanSettings = {
                sticky_bar_color: settings.sticky_bar_color?.value || '#fff',
                sticky_visibility: settings.sticky_visibility?.value || 'all',
                sticky_trigger: settings.sticky_trigger?.value || 'after-summary',
                sticky_bar_status: settings.sticky_bar_status?.value || 'live',
                sticky_content_display_image: settings.sticky_content_display_image?.value === 'true',
                sticky_content_display_title: settings.sticky_content_display_title?.value === 'true',
                sticky_content_display_price: settings.sticky_content_display_price?.value === 'true',
                sticky_content_display_quantity: settings.sticky_content_display_quantity?.value === 'true',
                sticky_content_display_mobile_image: settings.sticky_content_display_mobile_image?.value !== 'false',
                sticky_content_display_mobile_title: settings.sticky_content_display_mobile_title?.value !== 'false',
                sticky_content_display_mobile_price: settings.sticky_content_display_mobile_price?.value !== 'false',
                sticky_content_display_mobile_quantity: settings.sticky_content_display_mobile_quantity?.value !== 'false',
                sticky_bar_width: settings.sticky_bar_width?.value || 'contained',
                sticky_bar_width_mobile: settings.sticky_bar_width_mobile?.value || 'full',
                sticky_max_width_mobile: settings.sticky_max_width_mobile?.value || '',
                sticky_max_width_mobile_unit: settings.sticky_max_width_mobile_unit?.value || 'px',
                sticky_alignment_mobile: settings.sticky_alignment_mobile?.value || 'right',
                sticky_outer_spacing_mobile: settings.sticky_outer_spacing_mobile?.value || '',
                sticky_outer_spacing_mobile_unit: settings.sticky_outer_spacing_mobile_unit?.value || 'px',
                sticky_inner_spacing_mobile: settings.sticky_inner_spacing_mobile?.value || '16',
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
                sticky_image_size_mobile: settings.sticky_image_size_mobile?.value || 'medium',
                sticky_quantity_color: settings.sticky_quantity_color?.value || '#141414',
                sticky_quantity_border_color: settings.sticky_quantity_border_color?.value || '#DFDFDF',
                sticky_button_behavior: settings.sticky_button_behavior?.value || 'add',
                sticky_button_text: settings.sticky_button_text?.value || 'Add to cart',
                sticky_enable_cart_icon: settings.sticky_enable_cart_icon?.value === 'true',
                sticky_enable_mobile_cart_icon: settings.sticky_enable_mobile_cart_icon?.value === 'true',
                sticky_button_text_color: settings.sticky_button_text_color?.value || '#FFFFFF',
                sticky_button_bg_color: settings.sticky_button_bg_color?.value || '#141414',
                sticky_custom_css: settings.sticky_custom_css?.value || '',
            };

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

        } catch (fallbackError) {
            console.error('=== FALLBACK ALSO FAILED ===');
            console.error('Fallback error:', fallbackError);
            return json({ error: 'Failed to load settings' }, { status: 500 });
        }
    }
};

// Handle OPTIONS requests for CORS
export const action = async ({ request }) => {

    if (request.method === 'OPTIONS') {
        console.log('Handling OPTIONS request for CORS');
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }

    // Simple test endpoint to verify database connection
    const { getSetting } = await import("../models/settings.server");

    console.log('🧪 Testing database connection...');
    const testStatus = await getSetting("sticky_bar_status");
    console.log('🧪 Test sticky_bar_status from database:', testStatus);

    return Response.json({
        test: true,
        sticky_bar_status: testStatus?.value,
        timestamp: new Date().toISOString()
    });
}; 
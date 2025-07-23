import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    console.log('=== SETTINGS ROUTE (REDIRECT) ===');
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);

    try {
        // Try to authenticate the request using Shopify's app proxy authentication
        const { storefront, liquid } = await authenticate.public.appProxy(request);
        console.log('App proxy authentication successful');

        // Get the shop from the request parameters (as per Shopify docs)
        const url = new URL(request.url);
        const shop = url.searchParams.get('shop');
        const pathPrefix = url.searchParams.get('path_prefix');
        const timestamp = url.searchParams.get('timestamp');
        const signature = url.searchParams.get('signature');
        const loggedInCustomerId = url.searchParams.get('logged_in_customer_id');

        console.log('Shopify proxy parameters:');
        console.log('- shop:', shop);
        console.log('- path_prefix:', pathPrefix);
        console.log('- timestamp:', timestamp);
        console.log('- signature:', signature ? 'present' : 'missing');
        console.log('- logged_in_customer_id:', loggedInCustomerId);

        if (!shop) {
            console.log('ERROR: Shop parameter required');
            return json({ error: 'Shop parameter required' }, { status: 400 });
        }

        console.log('Loading settings from database for shop:', shop);

        // Import the getSetting function
        const { getSetting } = await import("../models/settings.server");

        // Load all sticky bar settings from database
        const settings = {
            sticky_bar_color: await getSetting("sticky_bar_color"),
            sticky_visibility: await getSetting("sticky_visibility"),
            sticky_trigger: await getSetting("sticky_trigger"),
            sticky_content_display_image: await getSetting("sticky_content_display_image"),
            sticky_content_display_title: await getSetting("sticky_content_display_title"),
            sticky_content_display_price: await getSetting("sticky_content_display_price"),
            sticky_content_display_quantity: await getSetting("sticky_content_display_quantity"),
            sticky_bar_width: await getSetting("sticky_bar_width"),
            sticky_max_width: await getSetting("sticky_max_width"),
            sticky_max_width_unit: await getSetting("sticky_max_width_unit"),
            sticky_alignment: await getSetting("sticky_alignment"),
            sticky_outer_spacing: await getSetting("sticky_outer_spacing"),
            sticky_outer_spacing_unit: await getSetting("sticky_outer_spacing_unit"),
            sticky_inner_spacing: await getSetting("sticky_inner_spacing"),
            sticky_inner_spacing_unit: await getSetting("sticky_inner_spacing_unit"),
            sticky_background_color: await getSetting("sticky_background_color"),
            sticky_border_color: await getSetting("sticky_border_color"),
            sticky_product_name_color: await getSetting("sticky_product_name_color"),
            sticky_image_size: await getSetting("sticky_image_size"),
            sticky_quantity_color: await getSetting("sticky_quantity_color"),
            sticky_quantity_border_color: await getSetting("sticky_quantity_border_color"),
            sticky_button_behavior: await getSetting("sticky_button_behavior"),
            sticky_button_text: await getSetting("sticky_button_text"),
            sticky_enable_cart_icon: await getSetting("sticky_enable_cart_icon"),
            sticky_button_text_color: await getSetting("sticky_button_text_color"),
            sticky_button_bg_color: await getSetting("sticky_button_bg_color"),
            sticky_custom_css: await getSetting("sticky_custom_css"),
        };

        console.log('=== RAW DATABASE SETTINGS ===');
        console.log(JSON.stringify(settings, null, 2));

        // Convert to a clean settings object with default values
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
            sticky_product_name_color: settings.sticky_product_name_color?.value || '#141414',
            sticky_image_size: settings.sticky_image_size?.value || 'medium',
            sticky_quantity_color: settings.sticky_quantity_color?.value || '#141414',
            sticky_quantity_border_color: settings.sticky_quantity_border_color?.value || '#dfdfdf',
            sticky_button_behavior: settings.sticky_button_behavior?.value || 'add',
            sticky_button_text: settings.sticky_button_text?.value || 'Add to cart',
            sticky_enable_cart_icon: settings.sticky_enable_cart_icon?.value === 'true',
            sticky_button_text_color: settings.sticky_button_text_color?.value || '#bc2f2f',
            sticky_button_bg_color: settings.sticky_button_bg_color?.value || '#141414',
            sticky_custom_css: settings.sticky_custom_css?.value || '',
        };

        console.log('=== CLEAN SETTINGS TO RETURN ===');
        console.log(JSON.stringify(cleanSettings, null, 2));

        return json(cleanSettings);

    } catch (error) {
        console.error('Error in settings route:', error);

        // Return fallback settings if there's an error
        const fallbackSettings = {
            sticky_bar_color: '#fff',
            sticky_visibility: 'all',
            sticky_trigger: 'after-summary',
            sticky_content_display_image: false,
            sticky_content_display_title: true,
            sticky_content_display_price: false,
            sticky_content_display_quantity: true,
            sticky_bar_width: 'full',
            sticky_max_width: '555',
            sticky_max_width_unit: 'px',
            sticky_alignment: 'center',
            sticky_outer_spacing: '',
            sticky_outer_spacing_unit: 'px',
            sticky_inner_spacing: '16',
            sticky_inner_spacing_unit: 'px',
            sticky_background_color: '#ffffff',
            sticky_border_color: '#000000',
            sticky_product_name_color: '#141414',
            sticky_image_size: 'medium',
            sticky_quantity_color: '#141414',
            sticky_quantity_border_color: '#dfdfdf',
            sticky_button_behavior: 'add',
            sticky_button_text: 'Add to cart',
            sticky_enable_cart_icon: false,
            sticky_button_text_color: '#bc2f2f',
            sticky_button_bg_color: '#141414',
            sticky_custom_css: '',
        };

        console.log('=== FALLBACK SETTINGS TO RETURN ===');
        console.log(JSON.stringify(fallbackSettings, null, 2));

        return json(fallbackSettings);
    }
}; 
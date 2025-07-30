import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    await authenticate.admin(request);

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

    return json({
        message: "Database settings debug",
        settings: settings,
        timestamp: new Date().toISOString()
    });
}; 
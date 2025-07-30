import {
    Page,
    Layout,
    Card,
    ChoiceList,
    Checkbox,
    Select,
    Text,
    Button,
    BlockStack,
    InlineStack,
    Tabs,
    Divider,
    Badge,
    Box,
    Icon,
    InlineGrid,
    ButtonGroup,
    TextField,
    ColorPicker,
    Modal,
    RangeSlider
} from '@shopify/polaris';
import {
    ArrowLeftIcon,
    DesktopIcon,
    MobileIcon,
    CartIcon
} from '@shopify/polaris-icons';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLoaderData } from '@remix-run/react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { getSetting } from "../models/settings.server";
import "./app.customize.scss";

export const loader = async ({ request }) => {
    await authenticate.admin(request);
    // Load all settings from database
    const barColorSetting = await getSetting("sticky_bar_color");
    const visibilitySetting = await getSetting("sticky_visibility");
    const triggerSetting = await getSetting("sticky_trigger");
    const imageSetting = await getSetting("sticky_content_display_image");
    const titleSetting = await getSetting("sticky_content_display_title");
    const priceSetting = await getSetting("sticky_content_display_price");
    const quantitySetting = await getSetting("sticky_content_display_quantity");
    const mobileImageSetting = await getSetting("sticky_content_display_mobile_image");
    const mobileTitleSetting = await getSetting("sticky_content_display_mobile_title");
    const mobilePriceSetting = await getSetting("sticky_content_display_mobile_price");
    const mobileQuantitySetting = await getSetting("sticky_content_display_mobile_quantity");
    const barWidthSetting = await getSetting("sticky_bar_width");
    const mobileBarWidthSetting = await getSetting("sticky_bar_width_mobile");
    const mobileMaxWidthSetting = await getSetting("sticky_max_width_mobile");
    const mobileMaxWidthUnitSetting = await getSetting("sticky_max_width_mobile_unit");
    const mobileAlignmentSetting = await getSetting("sticky_alignment_mobile");
    const mobileOuterSpacingSetting = await getSetting("sticky_outer_spacing_mobile");
    const mobileOuterSpacingUnitSetting = await getSetting("sticky_outer_spacing_mobile_unit");
    const mobileInnerSpacingSetting = await getSetting("sticky_inner_spacing_mobile");
    const maxWidthSetting = await getSetting("sticky_max_width");
    const maxWidthUnitSetting = await getSetting("sticky_max_width_unit");
    const alignmentSetting = await getSetting("sticky_alignment");
    const outerSpacingSetting = await getSetting("sticky_outer_spacing");
    const outerSpacingUnitSetting = await getSetting("sticky_outer_spacing_unit");
    const innerSpacingSetting = await getSetting("sticky_inner_spacing");
    const innerSpacingUnitSetting = await getSetting("sticky_inner_spacing_unit");
    const backgroundColorSetting = await getSetting("sticky_background_color");
    const borderColorSetting = await getSetting("sticky_border_color");
    const productNameColorSetting = await getSetting("sticky_product_name_color");
    const imageSizeSetting = await getSetting("sticky_image_size");
    const mobileImageSizeSetting = await getSetting("sticky_image_size_mobile");
    const quantityColorSetting = await getSetting("sticky_quantity_color");
    const quantityBorderColorSetting = await getSetting("sticky_quantity_border_color");
    const buttonBehaviorSetting = await getSetting("sticky_button_behavior");
    const buttonTextSetting = await getSetting("sticky_button_text");
    const enableCartIconSetting = await getSetting("sticky_enable_cart_icon");
    const enableMobileCartIconSetting = await getSetting("sticky_enable_mobile_cart_icon");
    const buttonTextColorSetting = await getSetting("sticky_button_text_color");
    const buttonBgColorSetting = await getSetting("sticky_button_bg_color");
    const customCssSetting = await getSetting("sticky_custom_css");
    const borderRadiusSetting = await getSetting("sticky_border_radius");
    return json({
        sticky_bar_color: barColorSetting?.value || '#fff',
        sticky_visibility: visibilitySetting?.value || 'all',
        sticky_trigger: triggerSetting?.value || 'after-summary',
        sticky_content_display_image: imageSetting?.value === 'true',
        sticky_content_display_title: titleSetting?.value === 'true',
        sticky_content_display_price: priceSetting?.value === 'true',
        sticky_content_display_quantity: quantitySetting?.value === 'true',
        sticky_content_display_mobile_image: mobileImageSetting?.value === 'true',
        sticky_content_display_mobile_title: mobileTitleSetting?.value === 'true',
        sticky_content_display_mobile_price: mobilePriceSetting?.value === 'true',
        sticky_content_display_mobile_quantity: mobileQuantitySetting?.value === 'true',
        sticky_bar_width: barWidthSetting?.value || 'contained',
        sticky_bar_width_mobile: mobileBarWidthSetting?.value || 'full',
        sticky_max_width_mobile: mobileMaxWidthSetting?.value || '',
        sticky_max_width_mobile_unit: mobileMaxWidthUnitSetting?.value || 'px',
        sticky_alignment_mobile: mobileAlignmentSetting?.value || 'right',
        sticky_outer_spacing_mobile: mobileOuterSpacingSetting?.value || '',
        sticky_outer_spacing_mobile_unit: mobileOuterSpacingUnitSetting?.value || 'px',
        sticky_inner_spacing_mobile: mobileInnerSpacingSetting?.value || '16',
        sticky_max_width: maxWidthSetting?.value || '',
        sticky_max_width_unit: maxWidthUnitSetting?.value || 'px',
        sticky_alignment: alignmentSetting?.value || 'right',
        sticky_outer_spacing: outerSpacingSetting?.value || '',
        sticky_outer_spacing_unit: outerSpacingUnitSetting?.value || 'px',
        sticky_inner_spacing: innerSpacingSetting?.value || '12',
        sticky_inner_spacing_unit: innerSpacingUnitSetting?.value || 'px',
        sticky_background_color: backgroundColorSetting?.value || '#FFFFFF',
        sticky_border_color: borderColorSetting?.value || '#000000',
        sticky_border_radius: borderRadiusSetting?.value || '12',
        sticky_product_name_color: productNameColorSetting?.value || '#141414',
        sticky_image_size: imageSizeSetting?.value || 'medium',
        sticky_image_size_mobile: mobileImageSizeSetting?.value || 'medium',
        sticky_quantity_color: quantityColorSetting?.value || '#141414',
        sticky_quantity_border_color: quantityBorderColorSetting?.value || '#DFDFDF',
        sticky_button_behavior: buttonBehaviorSetting?.value || 'add',
        sticky_button_text: buttonTextSetting?.value || 'Add to cart',
        sticky_enable_cart_icon: enableCartIconSetting?.value === 'true',
        sticky_enable_mobile_cart_icon: enableMobileCartIconSetting?.value === 'true',
        sticky_button_text_color: buttonTextColorSetting?.value || '#FFFFFF',
        sticky_button_bg_color: buttonBgColorSetting?.value || '#141414',
        sticky_custom_css: customCssSetting?.value || '<div>Hello World</div>\n<div>Hello World</div>\n<div>Hello World</div>\n<div>Hello World</div>\n<div>Hello World</div>'
    });
};

export const action = async ({ request }) => {
    await authenticate.admin(request);
    const formData = await request.formData();

    // Debug: Log all form data
    console.log('=== FORM DATA RECEIVED ===');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
    // Debug mobile cart icon specifically
    console.log('sticky_enable_mobile_cart_icon from formData:', formData.get("sticky_enable_mobile_cart_icon"));

    const { upsertSetting } = await import("../models/settings.server");
    const { setShopMetafields } = await import("../utils/metafields.server");

    // Get the shop GID
    const { admin } = await authenticate.admin(request);
    const shopIdResponse = await admin.graphql(`query { shop { id } }`);
    const { data: { shop: { id: shopId } } } = await shopIdResponse.json();

    // Check if this is a general settings submission (only visibility and trigger)
    const isGeneralSettings = formData.has("sticky_visibility") && formData.has("sticky_trigger") &&
        !formData.has("sticky_content_display_image") && !formData.has("sticky_bar_width");

    if (isGeneralSettings) {
        // Handle only general settings
        const generalSettings = {
            sticky_visibility: formData.get("sticky_visibility") || "all",
            sticky_trigger: formData.get("sticky_trigger") || "after-summary",
        };

        console.log('=== GENERAL SETTINGS TO SAVE ===');
        console.log(JSON.stringify(generalSettings, null, 2));
        console.log('=== END GENERAL SETTINGS ===');

        // Save to database
        await upsertSetting("sticky_visibility", generalSettings.sticky_visibility);
        await upsertSetting("sticky_trigger", generalSettings.sticky_trigger);

        // Save to metafields for backward compatibility
        await setShopMetafields(admin, shopId, generalSettings);

        return Response.json({ ok: true });
    }

    // Handle appearance settings (existing logic)
    const settings = {
        sticky_bar_color: formData.get("sticky_bar_color") || "#fff",
        sticky_visibility: formData.get("sticky_visibility") || "all",
        sticky_trigger: formData.get("sticky_trigger") || "after-summary",
        sticky_content_display_image: formData.get("sticky_content_display_image") === 'on' ? 'true' : 'false',
        sticky_content_display_title: formData.get("sticky_content_display_title") === 'on' ? 'true' : 'false',
        sticky_content_display_price: formData.get("sticky_content_display_price") === 'on' ? 'true' : 'false',
        sticky_content_display_quantity: formData.get("sticky_content_display_quantity") === 'on' ? 'true' : 'false',
        sticky_content_display_mobile_image: formData.get("sticky_content_display_mobile_image") === 'on' ? 'true' : 'false',
        sticky_content_display_mobile_title: formData.get("sticky_content_display_mobile_title") === 'on' ? 'true' : 'false',
        sticky_content_display_mobile_price: formData.get("sticky_content_display_mobile_price") === 'on' ? 'true' : 'false',
        sticky_content_display_mobile_quantity: formData.get("sticky_content_display_mobile_quantity") === 'on' ? 'true' : 'false',
        sticky_bar_width: formData.get("sticky_bar_width") || "contained",
        sticky_bar_width_mobile: formData.get("sticky_bar_width_mobile") || "full",
        sticky_max_width_mobile: formData.get("sticky_max_width_mobile") || "",
        sticky_max_width_mobile_unit: formData.get("sticky_max_width_mobile_unit") || "px",
        sticky_alignment_mobile: formData.get("sticky_alignment_mobile") || "right",
        sticky_outer_spacing_mobile: formData.get("sticky_outer_spacing_mobile") || "",
        sticky_outer_spacing_mobile_unit: formData.get("sticky_outer_spacing_mobile_unit") || "px",
        sticky_inner_spacing_mobile: formData.get("sticky_inner_spacing_mobile") || "16",
        sticky_max_width: formData.get("sticky_max_width") || "",
        sticky_max_width_unit: formData.get("sticky_max_width_unit") || "px",
        sticky_alignment: formData.get("sticky_alignment") || "right",
        sticky_outer_spacing: formData.get("sticky_outer_spacing") || "",
        sticky_outer_spacing_unit: formData.get("sticky_outer_spacing_unit") || "px",
        sticky_inner_spacing: formData.get("sticky_inner_spacing") || "16",
        sticky_inner_spacing_unit: formData.get("sticky_inner_spacing_unit") || "px",
        sticky_background_color: formData.get("sticky_background_color") || "#FFFFFF",
        sticky_border_color: formData.get("sticky_border_color") || "#000000",
        sticky_border_radius: formData.get("sticky_border_radius") || "12",
        sticky_product_name_color: formData.get("sticky_product_name_color") || "#141414",
        sticky_image_size: formData.get("sticky_image_size") || "medium",
        sticky_image_size_mobile: formData.get("sticky_image_size_mobile") || "medium",
        sticky_quantity_color: formData.get("sticky_quantity_color") || "#141414",
        sticky_quantity_border_color: formData.get("sticky_quantity_border_color") || "#DFDFDF",
        sticky_button_behavior: formData.get("sticky_button_behavior") || "add",
        sticky_button_text: formData.get("sticky_button_text") || "Add to cart",
        sticky_enable_cart_icon: formData.get("sticky_enable_cart_icon") === 'on' ? 'true' : 'false',
        sticky_enable_mobile_cart_icon: formData.get("sticky_enable_mobile_cart_icon") === 'on' ? 'true' : 'false',
        sticky_button_text_color: formData.get("sticky_button_text_color") || "#FFFFFF",
        sticky_button_bg_color: formData.get("sticky_button_bg_color") || "#141414",
        sticky_custom_css: formData.get("sticky_custom_css") || '',
    };

    console.log('=== APPEARANCE SETTINGS TO SAVE ===');
    console.log(JSON.stringify(settings, null, 2));
    console.log('=== END APPEARANCE SETTINGS ===');

    // Save to database
    await upsertSetting("sticky_bar_color", settings.sticky_bar_color);
    await upsertSetting("sticky_visibility", settings.sticky_visibility);
    await upsertSetting("sticky_trigger", settings.sticky_trigger);
    await upsertSetting("sticky_content_display_image", settings.sticky_content_display_image);
    await upsertSetting("sticky_content_display_title", settings.sticky_content_display_title);
    await upsertSetting("sticky_content_display_price", settings.sticky_content_display_price);
    await upsertSetting("sticky_content_display_quantity", settings.sticky_content_display_quantity);
    await upsertSetting("sticky_content_display_mobile_image", settings.sticky_content_display_mobile_image);
    await upsertSetting("sticky_content_display_mobile_title", settings.sticky_content_display_mobile_title);
    await upsertSetting("sticky_content_display_mobile_price", settings.sticky_content_display_mobile_price);
    await upsertSetting("sticky_content_display_mobile_quantity", settings.sticky_content_display_mobile_quantity);
    await upsertSetting("sticky_bar_width", settings.sticky_bar_width);
    await upsertSetting("sticky_bar_width_mobile", settings.sticky_bar_width_mobile);
    await upsertSetting("sticky_max_width_mobile", settings.sticky_max_width_mobile);
    await upsertSetting("sticky_max_width_mobile_unit", settings.sticky_max_width_mobile_unit);
    await upsertSetting("sticky_alignment_mobile", settings.sticky_alignment_mobile);
    await upsertSetting("sticky_outer_spacing_mobile", settings.sticky_outer_spacing_mobile);
    await upsertSetting("sticky_outer_spacing_mobile_unit", settings.sticky_outer_spacing_mobile_unit);
    await upsertSetting("sticky_inner_spacing_mobile", settings.sticky_inner_spacing_mobile);
    await upsertSetting("sticky_max_width", settings.sticky_max_width);
    await upsertSetting("sticky_max_width_unit", settings.sticky_max_width_unit);
    await upsertSetting("sticky_alignment", settings.sticky_alignment);
    await upsertSetting("sticky_outer_spacing", settings.sticky_outer_spacing);
    await upsertSetting("sticky_outer_spacing_unit", settings.sticky_outer_spacing_unit);
    await upsertSetting("sticky_inner_spacing", settings.sticky_inner_spacing);
    await upsertSetting("sticky_inner_spacing_unit", settings.sticky_inner_spacing_unit);
    await upsertSetting("sticky_background_color", settings.sticky_background_color);
    await upsertSetting("sticky_border_color", settings.sticky_border_color);
    await upsertSetting("sticky_border_radius", settings.sticky_border_radius);
    await upsertSetting("sticky_product_name_color", settings.sticky_product_name_color);
    await upsertSetting("sticky_image_size", settings.sticky_image_size);
    await upsertSetting("sticky_image_size_mobile", settings.sticky_image_size_mobile);
    await upsertSetting("sticky_quantity_color", settings.sticky_quantity_color);
    await upsertSetting("sticky_quantity_border_color", settings.sticky_quantity_border_color);
    await upsertSetting("sticky_button_behavior", settings.sticky_button_behavior);
    await upsertSetting("sticky_button_text", settings.sticky_button_text);
    await upsertSetting("sticky_enable_cart_icon", settings.sticky_enable_cart_icon);
    await upsertSetting("sticky_enable_mobile_cart_icon", settings.sticky_enable_mobile_cart_icon);
    console.log('=== SAVING MOBILE CART ICON ===');
    console.log('saving sticky_enable_mobile_cart_icon:', settings.sticky_enable_mobile_cart_icon);
    console.log('=== END SAVING MOBILE CART ICON ===');
    await upsertSetting("sticky_button_text_color", settings.sticky_button_text_color);
    await upsertSetting("sticky_button_bg_color", settings.sticky_button_bg_color);
    await upsertSetting("sticky_custom_css", settings.sticky_custom_css);

    // Save to metafields for backward compatibility
    await setShopMetafields(admin, shopId, settings);

    return Response.json({ ok: true });
};

export default function Customize() {
    const savedSettings = useLoaderData();

    const [selectedTab, setSelectedTab] = useState(1);
    const [appearanceView, setAppearanceView] = useState('desktop');
    const [visibility, setVisibility] = useState(savedSettings.sticky_visibility);
    const [trigger, setTrigger] = useState(savedSettings.sticky_trigger);
    const [imageDisplay, setImageDisplay] = useState(savedSettings.sticky_content_display_image);
    const [titleDisplay, setTitleDisplay] = useState(savedSettings.sticky_content_display_title);
    const [priceDisplay, setPriceDisplay] = useState(savedSettings.sticky_content_display_price);
    const [quantityDisplay, setQuantityDisplay] = useState(savedSettings.sticky_content_display_quantity);
    const [mobileImageDisplay, setMobileImageDisplay] = useState(savedSettings.sticky_content_display_mobile_image);
    const [mobileTitleDisplay, setMobileTitleDisplay] = useState(savedSettings.sticky_content_display_mobile_title);
    const [mobilePriceDisplay, setMobilePriceDisplay] = useState(savedSettings.sticky_content_display_mobile_price);
    const [mobileQuantityDisplay, setMobileQuantityDisplay] = useState(savedSettings.sticky_content_display_mobile_quantity);
    const [barWidth, setBarWidth] = useState(savedSettings.sticky_bar_width);
    const [mobileBarWidth, setMobileBarWidth] = useState(savedSettings.sticky_bar_width_mobile);
    const [mobileMaxWidth, setMobileMaxWidth] = useState(savedSettings.sticky_max_width_mobile);
    const [mobileMaxWidthUnit, setMobileMaxWidthUnit] = useState(savedSettings.sticky_max_width_mobile_unit);
    const [mobileAlignment, setMobileAlignment] = useState(savedSettings.sticky_alignment_mobile);
    const [mobileOuterSpacing, setMobileOuterSpacing] = useState(savedSettings.sticky_outer_spacing_mobile);
    const [mobileOuterSpacingUnit, setMobileOuterSpacingUnit] = useState(savedSettings.sticky_outer_spacing_mobile_unit);
    const [mobileInnerSpacing, setMobileInnerSpacing] = useState(savedSettings.sticky_inner_spacing_mobile);
    const [maxWidth, setMaxWidth] = useState(savedSettings.sticky_max_width);
    const [maxWidthUnit, setMaxWidthUnit] = useState(savedSettings.sticky_max_width_unit);
    const [alignment, setAlignment] = useState(savedSettings.sticky_alignment);
    const [outerSpacing, setOuterSpacing] = useState(savedSettings.sticky_outer_spacing);
    const [outerSpacingUnit, setOuterSpacingUnit] = useState(savedSettings.sticky_outer_spacing_unit);
    const [innerSpacing, setInnerSpacing] = useState(savedSettings.sticky_inner_spacing);
    const [innerSpacingUnit, setInnerSpacingUnit] = useState(savedSettings.sticky_inner_spacing_unit);
    const [backgroundColor, setBackgroundColor] = useState(savedSettings.sticky_background_color);
    const [borderColor, setBorderColor] = useState(savedSettings.sticky_border_color);
    const [borderRadius, setBorderRadius] = useState(savedSettings.sticky_border_radius);
    const [productNameColor, setProductNameColor] = useState(savedSettings.sticky_product_name_color);
    const [imageSize, setImageSize] = useState(savedSettings.sticky_image_size);
    const [mobileImageSize, setMobileImageSize] = useState(savedSettings.sticky_image_size_mobile);
    const [quantityColor, setQuantityColor] = useState(savedSettings.sticky_quantity_color);
    const [quantityBorderColor, setQuantityBorderColor] = useState(savedSettings.sticky_quantity_border_color);
    const [buttonBehavior, setButtonBehavior] = useState(savedSettings.sticky_button_behavior);
    const [buttonText, setButtonText] = useState(savedSettings.sticky_button_text);
    const [enableCartIcon, setEnableCartIcon] = useState(savedSettings.sticky_enable_cart_icon);
    const [enableMobileCartIcon, setEnableMobileCartIcon] = useState(savedSettings.sticky_enable_mobile_cart_icon);
    const [buttonTextColor, setButtonTextColor] = useState(savedSettings.sticky_button_text_color);
    const [buttonBgColor, setButtonBgColor] = useState(savedSettings.sticky_button_bg_color);
    const [customCss, setCustomCss] = useState(savedSettings.sticky_custom_css);
    const [showResetModal, setShowResetModal] = useState(false);
    const [previewQuantity, setPreviewQuantity] = useState(1);

    const shopify = useAppBridge();
    const fetcher = useFetcher();
    const generalFetcher = useFetcher();
    const navigate = useNavigate();

    useEffect(() => {
        if (fetcher.data?.ok) {
            shopify.toast.show("Sticky bar settings saved!");
        }
    }, [fetcher.data, shopify]);

    useEffect(() => {
        if (generalFetcher.data?.ok) {
            shopify.toast.show("General settings saved!");
        }
    }, [generalFetcher.data, shopify]);

    // Auto-save mobile cart icon setting when it changes
    useEffect(() => {
        if (appearanceView === 'mobile') {
            const formData = new FormData();
            // Add all required form fields
            formData.append("sticky_bar_color", savedSettings.sticky_bar_color);
            formData.append("sticky_visibility", visibility);
            formData.append("sticky_trigger", trigger);
            formData.append("sticky_content_display_image", imageDisplay ? 'on' : 'off');
            formData.append("sticky_content_display_title", titleDisplay ? 'on' : 'off');
            formData.append("sticky_content_display_price", priceDisplay ? 'on' : 'off');
            formData.append("sticky_content_display_quantity", quantityDisplay ? 'on' : 'off');
            formData.append("sticky_bar_width", barWidth);
            formData.append("sticky_max_width", maxWidth);
            formData.append("sticky_max_width_unit", maxWidthUnit);
            formData.append("sticky_alignment", alignment);
            formData.append("sticky_outer_spacing", outerSpacing);
            formData.append("sticky_outer_spacing_unit", outerSpacingUnit);
            formData.append("sticky_inner_spacing", innerSpacing);
            formData.append("sticky_inner_spacing_unit", innerSpacingUnit);
            formData.append("sticky_background_color", backgroundColor);
            formData.append("sticky_border_color", borderColor);
            formData.append("sticky_border_radius", borderRadius);
            formData.append("sticky_product_name_color", productNameColor);
            formData.append("sticky_image_size", imageSize);
            formData.append("sticky_quantity_color", quantityColor);
            formData.append("sticky_quantity_border_color", quantityBorderColor);
            formData.append("sticky_button_behavior", buttonBehavior);
            formData.append("sticky_button_text", buttonText);
            formData.append("sticky_enable_cart_icon", enableCartIcon ? 'on' : 'off');
            formData.append("sticky_enable_mobile_cart_icon", enableMobileCartIcon ? 'on' : 'off');
            formData.append("sticky_button_text_color", buttonTextColor);
            formData.append("sticky_button_bg_color", buttonBgColor);
            formData.append("sticky_custom_css", customCss);

            // Submit the form
            fetcher.submit(formData, { method: 'post' });
        }
    }, [enableMobileCartIcon, appearanceView]);

    // Auto-save desktop cart icon setting when it changes
    useEffect(() => {
        if (appearanceView === 'desktop') {
            const formData = new FormData();
            // Add all required form fields
            formData.append("sticky_bar_color", savedSettings.sticky_bar_color);
            formData.append("sticky_visibility", visibility);
            formData.append("sticky_trigger", trigger);
            formData.append("sticky_content_display_image", imageDisplay ? 'on' : 'off');
            formData.append("sticky_content_display_title", titleDisplay ? 'on' : 'off');
            formData.append("sticky_content_display_price", priceDisplay ? 'on' : 'off');
            formData.append("sticky_content_display_quantity", quantityDisplay ? 'on' : 'off');
            formData.append("sticky_bar_width", barWidth);
            formData.append("sticky_max_width", maxWidth);
            formData.append("sticky_max_width_unit", maxWidthUnit);
            formData.append("sticky_alignment", alignment);
            formData.append("sticky_outer_spacing", outerSpacing);
            formData.append("sticky_outer_spacing_unit", outerSpacingUnit);
            formData.append("sticky_inner_spacing", innerSpacing);
            formData.append("sticky_inner_spacing_unit", innerSpacingUnit);
            formData.append("sticky_background_color", backgroundColor);
            formData.append("sticky_border_color", borderColor);
            formData.append("sticky_border_radius", borderRadius);
            formData.append("sticky_product_name_color", productNameColor);
            formData.append("sticky_image_size", imageSize);
            formData.append("sticky_quantity_color", quantityColor);
            formData.append("sticky_quantity_border_color", quantityBorderColor);
            formData.append("sticky_button_behavior", buttonBehavior);
            formData.append("sticky_button_text", buttonText);
            formData.append("sticky_enable_cart_icon", enableCartIcon ? 'on' : 'off');
            formData.append("sticky_enable_mobile_cart_icon", enableMobileCartIcon ? 'on' : 'off');
            formData.append("sticky_button_text_color", buttonTextColor);
            formData.append("sticky_button_bg_color", buttonBgColor);
            formData.append("sticky_custom_css", customCss);

            // Submit the form
            fetcher.submit(formData, { method: 'post' });
        }
    }, [enableCartIcon, appearanceView]);

    // Auto-save mobile display settings when they change
    useEffect(() => {
        if (appearanceView === 'mobile') {
            const formData = new FormData();
            // Add all required form fields
            formData.append("sticky_bar_color", savedSettings.sticky_bar_color);
            formData.append("sticky_visibility", visibility);
            formData.append("sticky_trigger", trigger);
            formData.append("sticky_content_display_image", imageDisplay ? 'on' : 'off');
            formData.append("sticky_content_display_title", titleDisplay ? 'on' : 'off');
            formData.append("sticky_content_display_price", priceDisplay ? 'on' : 'off');
            formData.append("sticky_content_display_quantity", quantityDisplay ? 'on' : 'off');
            formData.append("sticky_content_display_mobile_image", mobileImageDisplay ? 'on' : 'off');
            formData.append("sticky_content_display_mobile_title", mobileTitleDisplay ? 'on' : 'off');
            formData.append("sticky_content_display_mobile_price", mobilePriceDisplay ? 'on' : 'off');
            formData.append("sticky_content_display_mobile_quantity", mobileQuantityDisplay ? 'on' : 'off');
            formData.append("sticky_bar_width", barWidth);
            formData.append("sticky_bar_width_mobile", mobileBarWidth);
            formData.append("sticky_max_width_mobile", mobileMaxWidth);
            formData.append("sticky_max_width_mobile_unit", mobileMaxWidthUnit);
            formData.append("sticky_alignment_mobile", mobileAlignment);
            formData.append("sticky_outer_spacing_mobile", mobileOuterSpacing);
            formData.append("sticky_outer_spacing_mobile_unit", mobileOuterSpacingUnit);
            formData.append("sticky_inner_spacing_mobile", mobileInnerSpacing);
            formData.append("sticky_max_width", maxWidth);
            formData.append("sticky_max_width_unit", maxWidthUnit);
            formData.append("sticky_alignment", alignment);
            formData.append("sticky_outer_spacing", outerSpacing);
            formData.append("sticky_outer_spacing_unit", outerSpacingUnit);
            formData.append("sticky_inner_spacing", innerSpacing);
            formData.append("sticky_inner_spacing_unit", innerSpacingUnit);
            formData.append("sticky_background_color", backgroundColor);
            formData.append("sticky_border_color", borderColor);
            formData.append("sticky_border_radius", borderRadius);
            formData.append("sticky_product_name_color", productNameColor);
            formData.append("sticky_image_size", imageSize);
            formData.append("sticky_image_size_mobile", mobileImageSize);
            formData.append("sticky_quantity_color", quantityColor);
            formData.append("sticky_quantity_border_color", quantityBorderColor);
            formData.append("sticky_button_behavior", buttonBehavior);
            formData.append("sticky_button_text", buttonText);
            formData.append("sticky_enable_cart_icon", enableCartIcon ? 'on' : 'off');
            formData.append("sticky_enable_mobile_cart_icon", enableMobileCartIcon ? 'on' : 'off');
            formData.append("sticky_button_text_color", buttonTextColor);
            formData.append("sticky_button_bg_color", buttonBgColor);
            formData.append("sticky_custom_css", customCss);

            // Submit the form
            fetcher.submit(formData, { method: 'post' });
        }
    }, [mobileImageDisplay, mobileTitleDisplay, mobilePriceDisplay, mobileQuantityDisplay, mobileBarWidth, mobileInnerSpacing, mobileImageSize, appearanceView]);

    const handleQuantityIncrease = useCallback(() => {
        setPreviewQuantity(prev => Math.min(prev + 1, 99));
    }, []);

    const handleQuantityDecrease = useCallback(() => {
        setPreviewQuantity(prev => Math.max(prev - 1, 1));
    }, []);

    const handleResetClick = useCallback(() => {
        setShowResetModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowResetModal(false);
    }, []);

    const handleResetAppearance = useCallback(() => {
        const getDefaultSettings = (view) => {
            if (view === 'mobile') {
                return {
                    sticky_content_display_image: true,
                    sticky_content_display_title: true,
                    sticky_content_display_price: true,
                    sticky_content_display_quantity: true,
                    sticky_bar_width: 'full',
                    sticky_max_width: '',
                    sticky_max_width_unit: 'px',
                    sticky_alignment: 'right',
                    sticky_outer_spacing: '',
                    sticky_outer_spacing_unit: 'px',
                    sticky_inner_spacing: '12',
                    sticky_inner_spacing_unit: 'px',
                    sticky_background_color: '#FFFFFF',
                    sticky_border_color: '#000000',
                    sticky_border_radius: '12',
                    sticky_product_name_color: '#141414',
                    sticky_image_size: 'medium',
                    sticky_image_size_mobile: 'medium',
                    sticky_quantity_color: '#141414',
                    sticky_quantity_border_color: '#DFDFDF',
                    sticky_button_behavior: 'add',
                    sticky_button_text: 'Add to cart',
                    sticky_enable_cart_icon: true,
                    sticky_enable_mobile_cart_icon: true,
                    sticky_button_text_color: '#FFFFFF',
                    sticky_button_bg_color: '#141414'
                };
            } else {
                return {
                    sticky_content_display_image: true,
                    sticky_content_display_title: true,
                    sticky_content_display_price: true,
                    sticky_content_display_quantity: true,
                    sticky_bar_width: 'contained',
                    sticky_max_width: '600',
                    sticky_max_width_unit: 'px',
                    sticky_alignment: 'right',
                    sticky_outer_spacing: '0',
                    sticky_outer_spacing_unit: 'px',
                    sticky_inner_spacing: '16',
                    sticky_inner_spacing_unit: 'px',
                    sticky_background_color: '#FFFFFF',
                    sticky_border_color: '#000000',
                    sticky_border_radius: '12',
                    sticky_product_name_color: '#141414',
                    sticky_image_size: 'medium',
                    sticky_quantity_color: '#141414',
                    sticky_quantity_border_color: '#DFDFDF',
                    sticky_button_behavior: 'add',
                    sticky_button_text: 'Add to cart',
                    sticky_enable_cart_icon: true,
                    sticky_enable_mobile_cart_icon: true,
                    sticky_button_text_color: '#FFFFFF',
                    sticky_button_bg_color: '#141414'
                };
            }
        };

        const defaultSettings = getDefaultSettings(appearanceView);

        // Update local state immediately
        setImageDisplay(defaultSettings.sticky_content_display_image);
        setTitleDisplay(defaultSettings.sticky_content_display_title);
        setPriceDisplay(defaultSettings.sticky_content_display_price);
        setQuantityDisplay(defaultSettings.sticky_content_display_quantity);
        setBarWidth(defaultSettings.sticky_bar_width);
        setMaxWidth(defaultSettings.sticky_max_width);
        setMaxWidthUnit(defaultSettings.sticky_max_width_unit);
        setAlignment(defaultSettings.sticky_alignment);
        setOuterSpacing(defaultSettings.sticky_outer_spacing);
        setOuterSpacingUnit(defaultSettings.sticky_outer_spacing_unit);
        setInnerSpacing(defaultSettings.sticky_inner_spacing);
        setInnerSpacingUnit(defaultSettings.sticky_inner_spacing_unit);
        setBackgroundColor(defaultSettings.sticky_background_color);
        setBorderColor(defaultSettings.sticky_border_color);
        setBorderRadius(defaultSettings.sticky_border_radius);
        setProductNameColor(defaultSettings.sticky_product_name_color);
        setImageSize(defaultSettings.sticky_image_size);
        setQuantityColor(defaultSettings.sticky_quantity_color);
        setQuantityBorderColor(defaultSettings.sticky_quantity_border_color);
        setButtonBehavior(defaultSettings.sticky_button_behavior);
        setButtonText(defaultSettings.sticky_button_text);
        setEnableCartIcon(defaultSettings.sticky_enable_cart_icon);
        setEnableMobileCartIcon(defaultSettings.sticky_enable_mobile_cart_icon);
        setButtonTextColor(defaultSettings.sticky_button_text_color);
        setButtonBgColor(defaultSettings.sticky_button_bg_color);

        // Create FormData with all default settings
        const formData = new FormData();
        Object.entries(defaultSettings).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
                formData.append(key, value ? 'on' : 'off');
            } else {
                formData.append(key, value);
            }
        });

        console.log('Resetting to defaults for:', appearanceView);
        console.log('Default settings:', defaultSettings);

        // Submit the form data to trigger save bar
        fetcher.submit(formData, { method: 'post' });

        // Close the modal
        setShowResetModal(false);
    }, [appearanceView, fetcher]);

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handleTabChange = useCallback((selectedTabIndex) => setSelectedTab(selectedTabIndex), []);

    const tabs = [
        { id: 'general', content: 'General', panelID: 'general-content' },
        { id: 'appearance', content: 'Appearance', panelID: 'appearance-content' },
        { id: 'advanced', content: 'Advanced', panelID: 'advanced-content' },
    ];

    const editingViewTabs = [
        { id: 'desktop', content: 'Desktop', panelID: 'desktop' },
        { id: 'mobile', content: 'Mobile', panelID: 'mobile' },
    ];

    let alignmentStyles = {};
    if (alignment === 'left') {
        alignmentStyles = {
            left: 0,
            right: 'auto',

        };
    } else if (alignment === 'center') {
        alignmentStyles = {
            left: '50%',
            transform: 'translateX(-50%)'
        };
    } else if (alignment === 'right') {
        alignmentStyles = {
            left: 'auto',
            right: 0
        };
    }



    return (
        <Page fullWidth>
            {/* Header Section */}
            <Box paddingBlockEnd="400">
                <InlineStack align="space-between" gap="400">
                    <InlineStack gap="200" blockAlign="center">
                        <Button icon={ArrowLeftIcon} variant="tertiary" onClick={handleBack} />
                        <span style={{ fontWeight: 600, fontSize: 20 }}>Customize</span>
                    </InlineStack>
                </InlineStack>
            </Box>
            <InlineGrid columns={['oneThird', 'twoThirds']} alignItems="start" gap="400">
                <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
                    <div style={{ marginBottom: '8px' }}></div>
                    {selectedTab === 0 && (
                        <generalFetcher.Form method="post" data-save-bar>
                            <Layout>
                                <Layout.Section>
                                    <BlockStack gap="400">
                                        <Card>
                                            <InlineStack gap="400" align="space-between" blockAlign="center">
                                                <Text variant="headingSm" tone="success">Sticky Bar <span style={{ marginLeft: 8 }}><span style={{ background: '#E3F1DF', color: '#108043', borderRadius: 4, padding: '2px 8px', fontSize: 12 }}>Live</span></span></Text>
                                                <Button tone="critical">Pause</Button>
                                            </InlineStack>
                                        </Card>
                                        <Card>
                                            <Box>
                                                <div style={{ marginBottom: '16px' }}>
                                                    <Text variant="headingSm" as="h3">Visibility</Text>
                                                </div>
                                                <Box style={{ margin: '4px 0' }}>
                                                    <input
                                                        type="hidden"
                                                        name="sticky_visibility"
                                                        value={visibility}
                                                    />
                                                    <Select
                                                        label="Show on"
                                                        options={[
                                                            { label: 'All devices', value: 'all' },
                                                            { label: 'Desktop only', value: 'desktop' },
                                                            { label: 'Mobile only', value: 'mobile' },
                                                        ]}
                                                        value={visibility}
                                                        onChange={setVisibility}
                                                    />
                                                </Box>

                                                <Text variant="bodySm" tone="subdued" style={{ marginTop: 4 }}>Control where the Sticky Bar is shown.</Text>
                                            </Box>
                                            <Box style={{ margin: '16px 0' }}>
                                                <Divider />
                                            </Box>
                                            <BlockStack >
                                                <Box style={{ marginBottom: '16px' }}>
                                                    <Text variant="headingSm" as="h3">Trigger</Text>
                                                </Box>
                                                <input
                                                    type="hidden"
                                                    name="sticky_trigger"
                                                    value={trigger}
                                                />
                                                <ChoiceList
                                                    title="Display trigger"
                                                    choices={[
                                                        { label: 'Always visible', value: 'always' },
                                                        { label: 'On scroll up', value: 'scroll-up' },
                                                        { label: 'After X seconds', value: 'after-x-seconds' },
                                                        { label: 'After scrolling down X pixels', value: 'after-x-pixels' },
                                                        { label: 'After product summary', value: 'after-summary' },
                                                        { label: 'When add to cart button is out of view', value: 'out-of-view' },
                                                    ]}
                                                    selected={[trigger]}
                                                    onChange={([value]) => setTrigger(value)}
                                                />
                                            </BlockStack>
                                        </Card>
                                    </BlockStack>
                                </Layout.Section>
                            </Layout>
                        </generalFetcher.Form>
                    )}
                    {selectedTab === 1 && (
                        <BlockStack gap="400">
                            <Card>
                                <InlineStack blockAlign='center' align="space-between">
                                    <Text>Editing view</Text>
                                    <ButtonGroup variant="segmented">
                                        <Button
                                            icon={DesktopIcon}
                                            pressed={appearanceView === 'desktop'} onClick={() => setAppearanceView('desktop')}
                                        >
                                            Desktop
                                        </Button>
                                        <Button
                                            icon={MobileIcon}
                                            pressed={appearanceView === 'mobile'} onClick={() => setAppearanceView('mobile')}
                                        >
                                            Mobile
                                        </Button>
                                    </ButtonGroup>
                                </InlineStack>
                            </Card>
                            {appearanceView === 'desktop' && (
                                <fetcher.Form method="post" data-save-bar>
                                    <BlockStack gap="400">
                                        <Card>
                                            <Box style={{ marginBottom: '16px' }}>
                                                <BlockStack gap="100">
                                                    <Text variant="headingSm" as="h3" style={{ marginBottom: 8 }}>Content display</Text>
                                                    <Text variant="bodySm" tone="subdued">
                                                        Control which product elements are displayed.
                                                    </Text>
                                                </BlockStack>
                                            </Box>
                                            <BlockStack gap="0">
                                                <input
                                                    type="hidden"
                                                    name="sticky_content_display_image"
                                                    value={imageDisplay ? 'on' : 'off'}
                                                />
                                                <Checkbox
                                                    label="Show image"
                                                    checked={imageDisplay}
                                                    onChange={(checked) => setImageDisplay(checked)}
                                                />

                                                <input
                                                    type="hidden"
                                                    name="sticky_content_display_title"
                                                    value={titleDisplay ? 'on' : 'off'}
                                                />
                                                <Checkbox
                                                    label="Show title"
                                                    checked={titleDisplay}
                                                    onChange={(checked) => setTitleDisplay(checked)}
                                                />

                                                <input
                                                    type="hidden"
                                                    name="sticky_content_display_price"
                                                    value={priceDisplay ? 'on' : 'off'}
                                                />
                                                <Checkbox
                                                    label="Show price"
                                                    checked={priceDisplay}
                                                    onChange={(checked) => setPriceDisplay(checked)}
                                                />

                                                <input
                                                    type="hidden"
                                                    name="sticky_content_display_quantity"
                                                    value={quantityDisplay ? 'on' : 'off'}
                                                />
                                                <Checkbox
                                                    label="Show quantity selector"
                                                    checked={quantityDisplay}
                                                    onChange={(checked) => setQuantityDisplay(checked)}
                                                />
                                            </BlockStack>
                                        </Card>
                                        <Card>
                                            <BlockStack gap="100">
                                                <Text as="h3" variant="headingMd">Bar</Text>
                                                <Text variant="bodySm" tone="subdued">
                                                    Manage layout, spacing, and visual design for the sticky bar container.
                                                </Text>
                                            </BlockStack>
                                            <Box paddingBlock="400">
                                                <Box style={{ marginBottom: '8px' }}>
                                                    <ChoiceList
                                                        title="Width"
                                                        choices={[
                                                            { label: 'Full', value: 'full' },
                                                            { label: 'Contained', value: 'contained' },
                                                        ]}
                                                        selected={[barWidth]}
                                                        onChange={([value]) => setBarWidth(value)}
                                                        allowMultiple={false}
                                                        name="sticky_bar_width"
                                                    />
                                                </Box>
                                                {barWidth === 'contained' && (
                                                    <>
                                                        <Box style={{ marginBottom: '8px' }}>
                                                            <BlockStack gap="100">
                                                                <Text variant="bodySm" as="div" style={{ fontWeight: 500, marginTop: 16, marginBottom: 4 }}>Max width</Text>
                                                                <div className='input-and-unit-wrapper'>
                                                                    <input
                                                                        type="hidden"
                                                                        name="sticky_max_width"
                                                                        value={maxWidth}
                                                                    />
                                                                    <TextField
                                                                        className='max-width-input-type-number'
                                                                        type="number"
                                                                        placeholder="e.g., 600"
                                                                        value={maxWidth}
                                                                        onChange={setMaxWidth}
                                                                        style={{ flex: 1 }}
                                                                    />
                                                                    <Select
                                                                        options={[
                                                                            { label: 'px', value: 'px' },
                                                                            { label: '%', value: '%' }
                                                                        ]}
                                                                        onChange={setMaxWidthUnit}
                                                                        value={maxWidthUnit}
                                                                        name="sticky_max_width_unit"
                                                                        style={{ padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                                    />
                                                                </div>
                                                                <Text variant="bodySm" tone="subdued">Leave empty for auto</Text>
                                                            </BlockStack>
                                                        </Box>
                                                        <Box style={{ marginBottom: "16px" }}>
                                                            <BlockStack gap="100">
                                                                <Text variant="bodySm" as="div">Alignment</Text>
                                                                <Select
                                                                    options={[
                                                                        { label: 'Left', value: 'left' },
                                                                        { label: 'Center', value: 'center' },
                                                                        { label: 'Right', value: 'right' }
                                                                    ]}
                                                                    onChange={setAlignment}
                                                                    value={alignment}
                                                                    name="sticky_alignment"
                                                                    style={{ width: '100%', padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                                />
                                                            </BlockStack>
                                                        </Box>
                                                        <Box style={{ marginBottom: "16px" }}>
                                                            <BlockStack gap="100">
                                                                <Text variant="bodySm" as="div" style={{ fontWeight: 500 }}>Outer spacing</Text>
                                                                <div className='input-and-unit-wrapper'>
                                                                    <input
                                                                        type="hidden"
                                                                        name="sticky_outer_spacing"
                                                                        value={outerSpacing}
                                                                    />
                                                                    <TextField
                                                                        className='outer-spacing-input-type-number'
                                                                        type="number"
                                                                        placeholder="e.g., 20"
                                                                        value={outerSpacing}
                                                                        onChange={setOuterSpacing}
                                                                    />
                                                                    <Select
                                                                        options={[
                                                                            { label: 'px', value: 'px' },
                                                                            { label: '%', value: '%' }
                                                                        ]}
                                                                        onChange={setOuterSpacingUnit}
                                                                        value={outerSpacingUnit}
                                                                        name="sticky_outer_spacing_unit"
                                                                        style={{ padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                                    />
                                                                </div>
                                                                <Text variant="bodySm" tone="subdued">Distance between the bar and the screen edges.</Text>
                                                            </BlockStack>
                                                        </Box>
                                                    </>
                                                )}
                                                <BlockStack gap="100">
                                                    <Text variant="bodySm" as="div" style={{ fontWeight: 500, marginBottom: 4 }}>Inner spacing</Text>
                                                    <div className='input-and-unit-wrapper'>
                                                        <input
                                                            type="hidden"
                                                            name="sticky_inner_spacing"
                                                            value={innerSpacing}
                                                        />
                                                        <TextField
                                                            className='inner-spacing-input-type-number'
                                                            type="number"
                                                            placeholder="e.g., 16"
                                                            value={innerSpacing}
                                                            onChange={setInnerSpacing}
                                                        />
                                                        <Select
                                                            options={[
                                                                { label: 'px', value: 'px' }
                                                            ]}
                                                            value="px"
                                                            disabled
                                                            name="sticky_inner_spacing_unit"
                                                            style={{ padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                        />
                                                    </div>
                                                    <Text variant="bodySm" tone="subdued">Padding inside the sticky bar</Text>
                                                </BlockStack>
                                            </Box>
                                            <BlockStack gap="400">
                                                <BlockStack gap="100">
                                                    <Text variant="bodySm" as="div" style={{ fontWeight: 500 }}>Background color</Text>
                                                    <div
                                                        className='color-input-wrapper'
                                                    >
                                                        <input
                                                            className='color-input-type-color'
                                                            type="color"
                                                            value={backgroundColor}
                                                            onChange={e => setBackgroundColor(e.target.value)}
                                                            name="sticky_background_color"
                                                        />
                                                        <input
                                                            className='color-input-type-text'
                                                            type="text"
                                                            value={backgroundColor}
                                                            onChange={e => setBackgroundColor(e.target.value)}
                                                            name="sticky_background_color"
                                                        />
                                                    </div>
                                                </BlockStack>
                                                <BlockStack gap="100">
                                                    <Text variant="bodySm" as="div" style={{ fontWeight: 500 }}>Border color</Text>
                                                    <div
                                                        className='color-input-wrapper'
                                                    >
                                                        <input
                                                            className='color-input-type-color'
                                                            type="color"
                                                            value={borderColor}
                                                            onChange={e => setBorderColor(e.target.value)}
                                                            name="sticky_border_color"
                                                        />
                                                        <input
                                                            className='color-input-type-text'
                                                            type="text"
                                                            value={borderColor}
                                                            onChange={e => setBorderColor(e.target.value)}
                                                            name="sticky_border_color"
                                                        />
                                                    </div>
                                                </BlockStack>
                                                <BlockStack gap="100">
                                                    <Text variant="bodySm" as="div" style={{ fontWeight: 500 }}>Corner radius</Text>
                                                    <div
                                                        className='sy-range-slider-wrapper'
                                                    >
                                                        <RangeSlider
                                                            label="Corner radius"
                                                            labelHidden
                                                            value={parseInt(borderRadius) || 12}
                                                            min={0}
                                                            max={24}
                                                            step={1}
                                                            onChange={value => setBorderRadius(value.toString())}
                                                            name="sticky_border_radius"
                                                            style={{ flex: 1 }}
                                                        />
                                                        <div className='sy-range-slider-unit-wrapper'>
                                                            <input
                                                                className='sy-border-radius-input-number'
                                                                type="number"
                                                                min="0"
                                                                max="24"
                                                                value={borderRadius || '12'}
                                                                onChange={e => setBorderRadius(e.target.value)}
                                                                name="sticky_border_radius"
                                                            />
                                                            <span className='unit'>px</span>
                                                        </div>
                                                    </div>
                                                </BlockStack>
                                            </BlockStack>
                                        </Card>
                                        <Card>
                                            <Box style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <Text as="h3" variant="headingMd">Content</Text>
                                                <Text variant="bodySm" tone="subdued" style={{ marginBottom: 16 }}>
                                                    Customize fonts, colors, and spacing for product content inside the sticky bar.
                                                </Text>
                                            </Box>
                                            <Box style={{ margin: '16px 0' }}>
                                                <Divider />
                                            </Box>
                                            <Box>
                                                <Box style={{ marginBottom: '8px' }}>
                                                    <Text as="h4" variant="headingSm">Product name</Text>
                                                </Box>
                                                <Box style={{ marginBottom: '4px' }}>
                                                    <Text variant="bodySm" as="div" style={{ fontWeight: 500 }}>Color</Text>
                                                </Box>
                                                <div
                                                    className='color-input-wrapper'
                                                >
                                                    <input
                                                        className='color-input-type-color'
                                                        type="color"
                                                        value={productNameColor}
                                                        onChange={e => setProductNameColor(e.target.value)}
                                                        name="sticky_product_name_color"
                                                    />
                                                    <input
                                                        className='color-input-type-text'
                                                        type="text"
                                                        value={productNameColor}
                                                        onChange={e => setProductNameColor(e.target.value)}
                                                        name="sticky_product_name_color"
                                                    />
                                                </div>
                                            </Box>
                                            <Box style={{ margin: '16px 0' }}>
                                                <Divider />
                                            </Box>
                                            <Box style={{ marginBottom: 8 }}>
                                                <Text variant="headingSm" as="h4" style={{ marginBottom: 8 }}>Image</Text>
                                            </Box>
                                            <Box style={{ marginBottom: 4 }}>
                                                <Text variant="bodySm" as="div" style={{ fontWeight: 500, marginBottom: 4 }}>Size</Text>
                                            </Box>
                                            <input
                                                type="hidden"
                                                name="sticky_image_size"
                                                value={imageSize}
                                            />
                                            <Select
                                                options={[
                                                    { label: 'Small', value: 'small' },
                                                    { label: 'Medium', value: 'medium' },
                                                    { label: 'Large', value: 'large' }
                                                ]}
                                                onChange={setImageSize}
                                                value={imageSize}
                                            />
                                            <Box style={{ margin: '16px 0' }}>
                                                <Divider />
                                            </Box>
                                            <Box style={{ marginBottom: 8 }}>
                                                <Text variant="headingSm" as="h4" style={{ marginBottom: 8 }}>Quantity</Text>
                                            </Box>
                                            <Box style={{ marginBottom: 4 }}>
                                                <Text variant="bodySm" as="div" style={{ fontWeight: 500, marginBottom: 4 }}>Color</Text>
                                            </Box>
                                            <Box style={{ marginBottom: 8 }}>
                                                <div
                                                    className='color-input-wrapper'
                                                >
                                                    <input
                                                        className='color-input-type-color'
                                                        type="color"
                                                        value={quantityColor}
                                                        onChange={e => setQuantityColor(e.target.value)}
                                                        name="sticky_quantity_color"
                                                    />
                                                    <input
                                                        className='color-input-type-text'
                                                        type="text"
                                                        value={quantityColor}
                                                        onChange={e => setQuantityColor(e.target.value)}
                                                        name="sticky_quantity_color"
                                                        style={{ flex: 1, borderRadius: 8, fontSize: 16 }}
                                                    />
                                                </div>
                                            </Box>
                                            <Box style={{ marginBottom: 4 }}>
                                                <Text variant="bodySm" as="div" style={{ fontWeight: 500, marginBottom: 4 }}>Border color</Text>
                                            </Box>
                                            <div
                                                className='color-input-wrapper'
                                            >
                                                <input
                                                    className='color-input-type-color'
                                                    type="color"
                                                    value={quantityBorderColor}
                                                    onChange={e => setQuantityBorderColor(e.target.value)}
                                                    name="sticky_quantity_border_color"
                                                />
                                                <input
                                                    className='color-input-type-text'
                                                    type="text"
                                                    value={quantityBorderColor}
                                                    onChange={e => setQuantityBorderColor(e.target.value)}
                                                    name="sticky_quantity_border_color"
                                                />
                                            </div>
                                        </Card>
                                        <Card>
                                            <BlockStack gap="400">
                                                <Box>
                                                    <Text as="h3" variant="headingMd" style={{ marginBottom: 4 }}>Button</Text>
                                                    <Text variant="bodySm" tone="subdued" style={{ marginBottom: 16 }}>
                                                        Customize the look and behavior of "Add to cart" button inside the sticky bar.
                                                    </Text>
                                                </Box>
                                                <Box>
                                                    <Text variant="bodySm" as="div" style={{ fontWeight: 500, marginBottom: 4 }}>On click behavior</Text>
                                                    <input
                                                        type="hidden"
                                                        name="sticky_button_behavior"
                                                        value={buttonBehavior}
                                                    />
                                                    <Select
                                                        options={[
                                                            { label: 'Add to cart', value: 'add' },
                                                            { label: 'Buy now', value: 'buy' },
                                                            { label: 'Custom action', value: 'custom' }
                                                        ]}
                                                        onChange={setButtonBehavior}
                                                        value={buttonBehavior}
                                                    />
                                                </Box>
                                                <Box>
                                                    <Text variant="bodySm" as="div" style={{ fontWeight: 500, marginBottom: 4 }}>Text</Text>
                                                    <input
                                                        type="hidden"
                                                        name="sticky_button_text"
                                                        value={buttonText}
                                                    />
                                                    <div style={{ position: 'relative', marginBottom: 4 }}>
                                                        <TextField
                                                            type="text"
                                                            value={buttonText}
                                                            onChange={setButtonText}
                                                            maxLength={40}
                                                            placeholder="Add to cart"
                                                        />
                                                        <span style={{ position: 'absolute', right: 12, top: 8, color: '#6D7175', fontSize: 14 }}>{buttonText.length}/40</span>
                                                    </div>
                                                    <Text variant="bodySm" tone="subdued">
                                                        To add the price inline, use {'{price}'} token
                                                    </Text>
                                                </Box>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                                                    <input
                                                        type="hidden"
                                                        name="sticky_enable_cart_icon"
                                                        value={enableCartIcon ? 'on' : 'off'}
                                                    />
                                                    <Checkbox
                                                        label="Show cart icon"
                                                        labelHidden
                                                        checked={enableCartIcon}
                                                        onChange={setEnableCartIcon}
                                                    />
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                        <Text variant="bodySm" as="span" style={{ fontWeight: 500 }}>Show cart icon</Text>
                                                        <Text variant="bodySm" tone="subdued" style={{ marginLeft: 8 }}>
                                                            Choose whether to display the icon or not
                                                        </Text>
                                                    </div>
                                                </div>
                                                <Box>
                                                    <BlockStack gap="100">
                                                        <Text variant="bodySm" as="div" style={{ fontWeight: 500, marginBottom: 4 }}>Text color</Text>
                                                        <div
                                                            className='color-input-wrapper'
                                                        >
                                                            <input
                                                                className='color-input-type-color'
                                                                type="color"
                                                                value={buttonTextColor}
                                                                onChange={e => setButtonTextColor(e.target.value)}
                                                                name="sticky_button_text_color"
                                                            />
                                                            <input
                                                                className='color-input-type-text'
                                                                type="text"
                                                                value={buttonTextColor}
                                                                onChange={e => setButtonTextColor(e.target.value)}
                                                                name="sticky_button_text_color"
                                                            />
                                                        </div>
                                                    </BlockStack>
                                                </Box>
                                                <Box>
                                                    <BlockStack gap="100">
                                                        <Text variant="bodySm" as="div" style={{ fontWeight: 500 }}>Background color</Text>
                                                        <div className='color-input-wrapper'>
                                                            <input
                                                                className='color-input-type-color'
                                                                type="color"
                                                                value={buttonBgColor}
                                                                onChange={e => setButtonBgColor(e.target.value)}
                                                                name="sticky_button_bg_color"
                                                            />
                                                            <input
                                                                className='color-input-type-text'
                                                                type="text"
                                                                value={buttonBgColor}
                                                                onChange={e => setButtonBgColor(e.target.value)}
                                                                name="sticky_button_bg_color"
                                                            />
                                                        </div>
                                                    </BlockStack>
                                                </Box>
                                                <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                                                    <Text variant="bodySm" tone="subdued">
                                                        Hover styles apply a slight opacity to the background automatically.
                                                    </Text>
                                                </Box>
                                            </BlockStack>
                                        </Card>
                                    </BlockStack>

                                </fetcher.Form>
                            )}
                            {appearanceView === 'mobile' && (
                                <fetcher.Form method="post" data-save-bar>
                                    <BlockStack gap="400">
                                        <Card>
                                            <Box style={{ marginBottom: '16px' }}>
                                                <BlockStack gap="100">
                                                    <Text variant="headingSm" as="h3" style={{ marginBottom: 8 }}>Content display</Text>
                                                    <Text variant="bodySm" tone="subdued">
                                                        Control which product elements are displayed.
                                                    </Text>
                                                </BlockStack>
                                            </Box>
                                            <BlockStack gap="0">
                                                <input
                                                    type="hidden"
                                                    name="sticky_content_display_mobile_image"
                                                    value={mobileImageDisplay ? 'on' : 'off'}
                                                />
                                                <Checkbox
                                                    label="Show image"
                                                    checked={mobileImageDisplay}
                                                    onChange={(checked) => setMobileImageDisplay(checked)}
                                                />

                                                <input
                                                    type="hidden"
                                                    name="sticky_content_display_mobile_title"
                                                    value={mobileTitleDisplay ? 'on' : 'off'}
                                                />
                                                <Checkbox
                                                    label="Show title"
                                                    checked={mobileTitleDisplay}
                                                    onChange={(checked) => setMobileTitleDisplay(checked)}
                                                />

                                                <input
                                                    type="hidden"
                                                    name="sticky_content_display_mobile_price"
                                                    value={mobilePriceDisplay ? 'on' : 'off'}
                                                />
                                                <Checkbox
                                                    label="Show price"
                                                    checked={mobilePriceDisplay}
                                                    onChange={(checked) => setMobilePriceDisplay(checked)}
                                                />

                                                <input
                                                    type="hidden"
                                                    name="sticky_content_display_mobile_quantity"
                                                    value={mobileQuantityDisplay ? 'on' : 'off'}
                                                />
                                                <Checkbox
                                                    label="Show quantity selector"
                                                    checked={mobileQuantityDisplay}
                                                    onChange={(checked) => setMobileQuantityDisplay(checked)}
                                                />
                                            </BlockStack>
                                        </Card>

                                        <Card>
                                            <BlockStack gap="400">
                                                <BlockStack gap="100">
                                                    <Text as="h3" variant="headingMd">Bar</Text>
                                                    <Text variant="bodySm" tone="subdued">
                                                        Manage layout, spacing, and visual design for the sticky bar container.
                                                    </Text>
                                                </BlockStack>
                                                <Box>
                                                    <Box style={{ marginBottom: '8px' }}>
                                                        <ChoiceList
                                                            title="Width"
                                                            choices={[
                                                                { label: 'Full', value: 'full' },
                                                                { label: 'Contained', value: 'contained' },
                                                            ]}
                                                            selected={[mobileBarWidth]}
                                                            onChange={([value]) => setMobileBarWidth(value)}
                                                            allowMultiple={false}
                                                            name="sticky_bar_width_mobile"
                                                        />
                                                    </Box>
                                                    {mobileBarWidth === 'contained' && (
                                                        <>
                                                            <Box style={{ marginBottom: '8px' }}>
                                                                <BlockStack gap="100">
                                                                    <Text variant="bodySm" as="div" style={{ fontWeight: 500, marginTop: 16, marginBottom: 4 }}>Max width</Text>
                                                                    <div className='input-and-unit-wrapper'>
                                                                        <input
                                                                            type="hidden"
                                                                            name="sticky_max_width_mobile"
                                                                            value={mobileMaxWidth}
                                                                        />
                                                                        <TextField
                                                                            className='max-width-input-type-number'
                                                                            type="number"
                                                                            placeholder="e.g., 600"
                                                                            value={mobileMaxWidth}
                                                                            onChange={setMobileMaxWidth}
                                                                            style={{ flex: 1 }}
                                                                        />
                                                                        <Select
                                                                            options={[
                                                                                { label: 'px', value: 'px' },
                                                                                { label: '%', value: '%' }
                                                                            ]}
                                                                            onChange={setMobileMaxWidthUnit}
                                                                            value={mobileMaxWidthUnit}
                                                                            name="sticky_max_width_mobile_unit"
                                                                            style={{ padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                                        />
                                                                    </div>
                                                                    <Text variant="bodySm" tone="subdued">Leave empty for auto</Text>
                                                                </BlockStack>
                                                            </Box>
                                                            <Box style={{ marginBottom: "16px" }}>
                                                                <BlockStack gap="100">
                                                                    <Text variant="bodySm" as="div">Alignment</Text>
                                                                    <Select
                                                                        options={[
                                                                            { label: 'Left', value: 'left' },
                                                                            { label: 'Center', value: 'center' },
                                                                            { label: 'Right', value: 'right' }
                                                                        ]}
                                                                        onChange={setMobileAlignment}
                                                                        value={mobileAlignment}
                                                                        name="sticky_alignment_mobile"
                                                                        style={{ width: '100%', padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                                    />
                                                                </BlockStack>
                                                            </Box>
                                                            <Box style={{ marginBottom: "16px" }}>
                                                                <BlockStack gap="100">
                                                                    <Text variant="bodySm" as="div" style={{ fontWeight: 500 }}>Outer spacing</Text>
                                                                    <div className='input-and-unit-wrapper'>
                                                                        <input
                                                                            type="hidden"
                                                                            name="sticky_outer_spacing_mobile"
                                                                            value={mobileOuterSpacing}
                                                                        />
                                                                        <TextField
                                                                            className='outer-spacing-input-type-number'
                                                                            type="number"
                                                                            placeholder="e.g., 20"
                                                                            value={mobileOuterSpacing}
                                                                            onChange={setMobileOuterSpacing}
                                                                        />
                                                                        <Select
                                                                            options={[
                                                                                { label: 'px', value: 'px' },
                                                                                { label: '%', value: '%' }
                                                                            ]}
                                                                            onChange={setMobileOuterSpacingUnit}
                                                                            value={mobileOuterSpacingUnit}
                                                                            name="sticky_outer_spacing_mobile_unit"
                                                                            style={{ padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                                        />
                                                                    </div>
                                                                    <Text variant="bodySm" tone="subdued">Distance between the bar and the screen edges.</Text>
                                                                </BlockStack>
                                                            </Box>
                                                        </>
                                                    )}
                                                    <BlockStack gap="100">
                                                        <Text variant="bodySm" as="div" style={{ fontWeight: 500, marginBottom: 4 }}>Inner spacing</Text>
                                                        <div className='input-and-unit-wrapper'>
                                                            <input
                                                                type="hidden"
                                                                name="sticky_inner_spacing_mobile"
                                                                value={mobileInnerSpacing}
                                                            />
                                                            <TextField
                                                                className='inner-spacing-input-type-number'
                                                                type="number"
                                                                placeholder="e.g., 16"
                                                                value={mobileInnerSpacing}
                                                                onChange={setMobileInnerSpacing}
                                                            />
                                                            <Select
                                                                options={[
                                                                    { label: 'px', value: 'px' }
                                                                ]}
                                                                value="px"
                                                                disabled
                                                                name="sticky_inner_spacing_mobile_unit"
                                                                style={{ padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                            />
                                                        </div>
                                                        <Text variant="bodySm" tone="subdued">Padding inside the sticky bar</Text>
                                                    </BlockStack>
                                                </Box>
                                            </BlockStack>
                                        </Card>
                                        <Card>
                                            <Box style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <Text as="h3" variant="headingMd">Content</Text>
                                                <Text variant="bodySm" tone="subdued" style={{ marginBottom: 16 }}>
                                                    Customize fonts, colors, and spacing for product content inside the sticky bar.
                                                </Text>
                                            </Box>
                                            <Box style={{ margin: '16px 0' }}>
                                                <Divider />
                                            </Box>
                                            <Box style={{ marginBottom: 8 }}>
                                                <Text variant="headingSm" as="h4" style={{ marginBottom: 8 }}>Image</Text>
                                            </Box>
                                            <Box style={{ marginBottom: 4 }}>
                                                <Text variant="bodySm" as="div" style={{ fontWeight: 500, marginBottom: 4 }}>Size</Text>
                                            </Box>
                                            <input
                                                type="hidden"
                                                name="sticky_image_size_mobile"
                                                value={mobileImageSize}
                                            />
                                            <Select
                                                options={[
                                                    { label: 'Small', value: 'small' },
                                                    { label: 'Medium', value: 'medium' },
                                                    { label: 'Large', value: 'large' }
                                                ]}
                                                onChange={setMobileImageSize}
                                                value={mobileImageSize}
                                                name="sticky_image_size_mobile"
                                                style={{ width: '100%', padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                            />
                                        </Card>
                                        <Card>
                                            <BlockStack gap="400">
                                                <BlockStack gap="100">
                                                    <Text as="h3" variant="headingMd">Button settings</Text>
                                                    <Text variant="bodySm" tone="subdued">
                                                        Configure the appearance and behavior of the add to cart button.
                                                    </Text>
                                                </BlockStack>
                                                <BlockStack gap="200">
                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                                                        <input
                                                            type="hidden"
                                                            name="sticky_enable_mobile_cart_icon"
                                                            value={enableMobileCartIcon ? 'on' : 'off'}
                                                        />
                                                        <Checkbox
                                                            label="Show cart icon"
                                                            labelHidden
                                                            checked={enableMobileCartIcon}
                                                            onChange={setEnableMobileCartIcon}
                                                        />
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                            <Text variant="bodySm" as="span" style={{ fontWeight: 500 }}>Show cart icon</Text>
                                                            <Text variant="bodySm" tone="subdued" style={{ marginLeft: 8 }}>
                                                                Choose whether to display the icon or not
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </BlockStack>
                                            </BlockStack>
                                        </Card>
                                    </BlockStack>
                                </fetcher.Form>
                            )}
                            <Card>
                                <Text as="h3" variant="headingMd">Reset appearance settings</Text>
                                <Text variant="bodySm" tone="subdued">
                                    Revert appearance settings to their original defaults.<br />This action cannot be undone.
                                </Text>
                                <Button onClick={handleResetClick} >
                                    Reset to defaults
                                </Button>
                            </Card>

                        </BlockStack>
                    )}

                    {selectedTab === 2 && (
                        <Card>
                            <BlockStack gap="400">
                                <BlockStack gap="100">
                                    <Text as="h3" variant="headingMd">Custom CSS</Text>
                                    <Text variant="bodySm" tone="subdued">
                                        Add your own CSS to override or extend the default bar styling.
                                    </Text>
                                </BlockStack>
                                <div style={{ display: 'flex', border: '1px solid #DFDFDF', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
                                    <div style={{ background: '#F6F6F7', color: '#6D7175', fontFamily: 'monospace', fontSize: 14, padding: '8px 4px', textAlign: 'right', userSelect: 'none' }}>
                                        {Array.from({ length: customCss.split('\n').length || 1 }, (_, i) => (
                                            <div key={i} style={{ height: 20 }}>{i + 1}</div>
                                        ))}
                                    </div>
                                    <textarea
                                        value={customCss}
                                        onChange={e => setCustomCss(e.target.value)}
                                        rows={5}
                                        style={{
                                            width: '100%',
                                            border: 'none',
                                            outline: 'none',
                                            fontFamily: 'monospace',
                                            fontSize: 14,
                                            color: '#228B22',
                                            background: '#fff',
                                            padding: 8,
                                            resize: 'vertical',
                                            minHeight: 100,
                                        }}
                                        spellCheck={false}
                                    />
                                </div>
                            </BlockStack>
                        </Card>
                    )}
                </Tabs>
                <div style={{
                    position: 'sticky',
                    top: '16px'
                }}>
                    <Card title={appearanceView === 'mobile' ? "Live preview (375px)" : "Live preview"}>
                        <div style={{
                            minHeight: 300,
                            position: 'relative',
                            borderRadius: '8px',
                            background: '#f8f9fa',
                            padding: '20px',
                            width: appearanceView === 'mobile' ? '375px' : '100%',
                            margin: appearanceView === 'mobile' ? '0 auto' : '0'
                        }}>
                            <div
                                className='sy-sticky-add-to-cart-preview'
                                style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    right: appearanceView === 'mobile' ?
                                        (mobileBarWidth === 'contained' ?
                                            (mobileAlignment === 'left' ? 'auto' : mobileAlignment === 'center' ? 'auto' : '20px') : '20px') :
                                        (barWidth === 'contained' ?
                                            (alignment === 'left' ? 'auto' : alignment === 'center' ? 'auto' : '20px') : '20px'),
                                    left: appearanceView === 'mobile' ?
                                        (mobileBarWidth === 'contained' ?
                                            (mobileAlignment === 'left' ? '20px' : mobileAlignment === 'center' ? '50%' : 'auto') : '20px') :
                                        (barWidth === 'contained' ?
                                            (alignment === 'left' ? '20px' : alignment === 'center' ? '50%' : 'auto') : '20px'),
                                    transform: appearanceView === 'mobile' ?
                                        (mobileBarWidth === 'contained' && mobileAlignment === 'center' ? 'translateX(-50%)' : 'none') :
                                        (barWidth === 'contained' && alignment === 'center' ? 'translateX(-50%)' : 'none'),
                                    borderRadius: borderRadius + 'px' || '12px',
                                    border: `1px solid ${borderColor}`,
                                    backgroundColor: backgroundColor,
                                    padding: appearanceView === 'mobile' ?
                                        `${mobileInnerSpacing}px` :
                                        `${innerSpacing}${innerSpacingUnit}`,
                                    width: appearanceView === 'mobile' ?
                                        (mobileBarWidth === 'full' ? 'calc(100% - 40px)' : 'auto') :
                                        (barWidth === 'full' ? 'calc(100% - 40px)' : 'auto'),
                                    maxWidth: appearanceView === 'mobile' ?
                                        (mobileBarWidth === 'contained' ? (mobileMaxWidth === '' ? '600px' : `${mobileMaxWidth}${mobileMaxWidthUnit}`) : 'none') :
                                        (barWidth === 'contained' ? (maxWidth === '' ? '600px' : `${maxWidth}${maxWidthUnit}`) : 'none'),
                                    margin: appearanceView === 'mobile' ?
                                        (mobileOuterSpacing === '' ? 'unset' : `${mobileOuterSpacing}${mobileOuterSpacingUnit}`) :
                                        (outerSpacing === '' ? 'unset' : `${outerSpacing}${outerSpacingUnit}`),
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>

                                {appearanceView === 'mobile' ?
                                    (mobileImageDisplay && (
                                        <img
                                            src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-2_large.png"
                                            alt="Product"
                                            style={{
                                                width: mobileImageSize === 'small' ? '48px' : mobileImageSize === 'medium' ? '60px' : '72px',
                                                height: mobileImageSize === 'small' ? '48px' : mobileImageSize === 'medium' ? '60px' : '72px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                border: '1px solid #e1e3e5'
                                            }}
                                        />
                                    )) :
                                    (imageDisplay && (
                                        <img
                                            src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-2_large.png"
                                            alt="Product"
                                            style={{
                                                width: imageSize === 'small' ? '48px' : imageSize === 'medium' ? '60px' : '72px',
                                                height: imageSize === 'small' ? '48px' : imageSize === 'medium' ? '60px' : '72px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                border: '1px solid #e1e3e5'
                                            }}
                                        />
                                    ))
                                }

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    {appearanceView === 'mobile' ?
                                        (mobileTitleDisplay && (
                                            <div style={{
                                                color: productNameColor,
                                                fontWeight: 600,
                                                fontSize: '14px',
                                                marginBottom: '2px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                Taupe One Loafers
                                            </div>
                                        )) :
                                        (titleDisplay && (
                                            <div style={{
                                                color: productNameColor,
                                                fontWeight: 600,
                                                fontSize: '14px',
                                                marginBottom: '2px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                Taupe One Loafers
                                            </div>
                                        ))
                                    }
                                    {appearanceView === 'mobile' ?
                                        (mobilePriceDisplay && (
                                            <div style={{ fontSize: '13px', color: '#6d7175' }}>
                                                <span style={{ textDecoration: 'line-through', marginRight: '8px' }}>$296</span>
                                                <span style={{ fontWeight: 600, color: '#141414' }}>$100</span>
                                            </div>
                                        )) :
                                        (priceDisplay && (
                                            <div style={{ fontSize: '13px', color: '#6d7175' }}>
                                                <span style={{ textDecoration: 'line-through', marginRight: '8px' }}>$296</span>
                                                <span style={{ fontWeight: 600, color: '#141414' }}>$100</span>
                                            </div>
                                        ))
                                    }
                                </div>

                                {appearanceView === 'mobile' ?
                                    (mobileQuantityDisplay && (
                                        <div className='sy-quantity-wrapper'
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                color: quantityColor,
                                                border: `1px solid ${quantityBorderColor}`,
                                                borderRadius: '20px',
                                                overflow: 'hidden',
                                                background: '#fff',
                                                height: '36px',
                                                minWidth: '120px'
                                            }}
                                        >
                                            <button style={{
                                                border: 'none',
                                                background: 'transparent',
                                                padding: '0 16px',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: '40px',
                                                transition: 'background-color 0.2s'
                                            }} onClick={handleQuantityDecrease}>
                                                −
                                            </button>
                                            <span style={{
                                                padding: '0 16px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                background: '#fff',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: '40px',
                                                flex: 1
                                            }}>
                                                {previewQuantity}
                                            </span>
                                            <button style={{
                                                border: 'none',
                                                background: 'transparent',
                                                padding: '0 16px',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: '40px',
                                                transition: 'background-color 0.2s'
                                            }} onClick={handleQuantityIncrease}>
                                                +
                                            </button>
                                        </div>
                                    )) :
                                    (quantityDisplay && (
                                        <div className='sy-quantity-wrapper'
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                color: quantityColor,
                                                border: `1px solid ${quantityBorderColor}`,
                                                borderRadius: '20px',
                                                overflow: 'hidden',
                                                background: '#fff',
                                                height: '36px',
                                                minWidth: '120px'
                                            }}
                                        >
                                            <button style={{
                                                border: 'none',
                                                background: 'transparent',
                                                padding: '0 16px',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: '40px',
                                                transition: 'background-color 0.2s'
                                            }} onClick={handleQuantityDecrease}>
                                                −
                                            </button>
                                            <span style={{
                                                padding: '0 16px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                background: '#fff',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: '40px',
                                                flex: 1
                                            }}>
                                                {previewQuantity}
                                            </span>
                                            <button style={{
                                                border: 'none',
                                                background: 'transparent',
                                                padding: '0 16px',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: '40px',
                                                transition: 'background-color 0.2s'
                                            }} onClick={handleQuantityIncrease}>
                                                +
                                            </button>
                                        </div>
                                    ))
                                }

                                <button style={{
                                    color: buttonTextColor,
                                    backgroundColor: buttonBgColor,
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '10px 16px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {appearanceView === 'mobile' ?
                                        (enableMobileCartIcon && (
                                            <Icon source={CartIcon} color="base" />
                                        )) :
                                        (enableCartIcon && (
                                            <Icon source={CartIcon} color="base" />
                                        ))
                                    }
                                    {buttonText}
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            </InlineGrid>

            {showResetModal && (
                <Modal
                    open={showResetModal}
                    onClose={handleCloseModal}
                    title={`Reset ${appearanceView} appearance settings?`}
                    primaryAction={{
                        content: "Reset",
                        onAction: handleResetAppearance,
                        destructive: true,
                    }}
                    secondaryActions={[
                        {
                            content: "Cancel",
                            onAction: handleCloseModal,
                        },
                    ]}
                >
                    <Modal.Section>
                        <Text>
                            This will reset all appearance settings for the {appearanceView.charAt(0).toUpperCase() + appearanceView.slice(1)} view. This action cannot be undone.
                        </Text>
                    </Modal.Section>
                </Modal>
            )}
        </Page>
    );
}
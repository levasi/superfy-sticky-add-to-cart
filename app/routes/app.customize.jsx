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
    RangeSlider,
    Popover
} from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';
import {
    ArrowLeftIcon,
    DesktopIcon,
    MobileIcon,
    CartIcon
} from '@shopify/polaris-icons';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLoaderData } from '@remix-run/react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { getSetting } from "../models/settings.server";
import "./app.customize.scss";
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { css } from '@codemirror/lang-css';

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
    const mobileInnerSpacingUnitSetting = await getSetting("sticky_inner_spacing_mobile_unit");
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
    const triggerSecondsSetting = await getSetting("sticky_trigger_seconds");
    const triggerPixelsSetting = await getSetting("sticky_trigger_pixels");
    const stickyBarStatusSetting = await getSetting("sticky_bar_status");
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
        sticky_inner_spacing_mobile_unit: mobileInnerSpacingUnitSetting?.value || 'px',
        sticky_max_width: maxWidthSetting?.value || '',
        sticky_max_width_unit: maxWidthUnitSetting?.value || 'px',
        sticky_alignment: alignmentSetting?.value || 'right',
        sticky_outer_spacing: outerSpacingSetting?.value || '',
        sticky_outer_spacing_unit: outerSpacingUnitSetting?.value || 'px',
        sticky_inner_spacing: innerSpacingSetting?.value || '12',
        sticky_inner_spacing_unit: innerSpacingUnitSetting?.value || 'px',
        sticky_background_color: backgroundColorSetting?.value || '#FFFFFF',
        sticky_border_color: borderColorSetting?.value || '#DFDFDF',
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
        sticky_custom_css: customCssSetting?.value || '<div>Hello World</div>\n<div>Hello World</div>\n<div>Hello World</div>\n<div>Hello World</div>\n<div>Hello World</div>',
        sticky_trigger_seconds: triggerSecondsSetting?.value || '3',
        sticky_trigger_pixels: triggerPixelsSetting?.value || '300',
        sticky_bar_status: stickyBarStatusSetting?.value || 'active'
    });
};

export const action = async ({ request }) => {
    await authenticate.admin(request);
    const formData = await request.formData();

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
            sticky_trigger_seconds: formData.get("sticky_trigger_seconds") || "3",
            sticky_trigger_pixels: formData.get("sticky_trigger_pixels") || "300",
        };

        // Save to database
        await upsertSetting("sticky_visibility", generalSettings.sticky_visibility);
        await upsertSetting("sticky_trigger", generalSettings.sticky_trigger);
        await upsertSetting("sticky_trigger_seconds", generalSettings.sticky_trigger_seconds);
        await upsertSetting("sticky_trigger_pixels", generalSettings.sticky_trigger_pixels);

        // Save to metafields for backward compatibility
        await setShopMetafields(admin, shopId, generalSettings);

        return Response.json({ ok: true });
    }

    // Handle sticky buy status toggle
    if (formData.has("sticky_bar_status")) {
        const stickyBarStatus = formData.get("sticky_bar_status") || "active";
        await upsertSetting("sticky_bar_status", stickyBarStatus);

        // Save to metafields for backward compatibility
        await setShopMetafields(admin, shopId, { sticky_bar_status: stickyBarStatus });

        return Response.json({ ok: true });
    }

    // Handle appearance settings - save all settings that are present in the form
    const settings = {};

    // Get all form data entries
    for (const [key, value] of formData.entries()) {
        if (key.startsWith('sticky_')) {
            // Convert checkbox values to string format
            if (typeof value === 'string' && (value === 'on' || value === 'off')) {
                settings[key] = value === 'on' ? 'true' : 'false';
            } else {
                settings[key] = value || '';
            }
        }
    }

    // Save to database - only save settings that are present
    for (const [key, value] of Object.entries(settings)) {
        await upsertSetting(key, value);
    }

    // Save to metafields for backward compatibility - only include settings that are present
    await setShopMetafields(admin, shopId, settings);

    return Response.json({ ok: true });
};

export default function Customize() {
    const savedSettings = useLoaderData();

    const [selectedTab, setSelectedTab] = useState(0);
    const [appearanceView, setAppearanceView] = useState('desktop');
    const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false);
    const [showBorderColorPicker, setShowBorderColorPicker] = useState(false);
    const [showProductNameColorPicker, setShowProductNameColorPicker] = useState(false);
    const [showQuantityColorPicker, setShowQuantityColorPicker] = useState(false);
    const [showQuantityBorderColorPicker, setShowQuantityBorderColorPicker] = useState(false);
    const [showButtonTextColorPicker, setShowButtonTextColorPicker] = useState(false);
    const [showButtonBgColorPicker, setShowButtonBgColorPicker] = useState(false);
    const [visibility, setVisibility] = useState(savedSettings.sticky_visibility);
    const [trigger, setTrigger] = useState(savedSettings.sticky_trigger);
    const [stickyBarStatus, setStickyBarStatus] = useState(savedSettings.sticky_bar_status);
    const [triggerSeconds, setTriggerSeconds] = useState(parseInt(savedSettings.sticky_trigger_seconds) || 3);
    const [triggerPixels, setTriggerPixels] = useState(parseInt(savedSettings.sticky_trigger_pixels) || 300);
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
    const [mobileInnerSpacingUnit, setMobileInnerSpacingUnit] = useState(savedSettings.sticky_inner_spacing_mobile_unit);
    const [backgroundColor, setBackgroundColor] = useState(savedSettings.sticky_background_color);

    // ColorPicker state in HSBA format
    // Helper function to convert hex to HSBA
    const hexToHSBA = (hex) => {
        const cleanHex = hex.replace('#', '');
        const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
        const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
        const b = parseInt(cleanHex.substr(4, 2), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;

        let h = 0;
        if (diff !== 0) {
            switch (max) {
                case r: h = ((g - b) / diff) % 6; break;
                case g: h = (b - r) / diff + 2; break;
                case b: h = (r - g) / diff + 4; break;
            }
            h = Math.round(h * 60);
            if (h < 0) h += 360;
        }

        const s = max === 0 ? 0 : diff / max;
        const v = max;

        return {
            hue: h,
            saturation: s,
            brightness: v,
            alpha: 1
        };
    };

    // Helper function to convert HSBA to hex
    const hsbaToHex = (hsba) => {
        const { hue, saturation, brightness } = hsba;

        const c = brightness * saturation;
        const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
        const m = brightness - c;

        let r, g, b;

        if (hue >= 0 && hue < 60) {
            r = c; g = x; b = 0;
        } else if (hue >= 60 && hue < 120) {
            r = x; g = c; b = 0;
        } else if (hue >= 120 && hue < 180) {
            r = 0; g = c; b = x;
        } else if (hue >= 180 && hue < 240) {
            r = 0; g = x; b = c;
        } else if (hue >= 240 && hue < 300) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }

        const rValue = Math.round((r + m) * 255);
        const gValue = Math.round((g + m) * 255);
        const bValue = Math.round((b + m) * 255);

        const toHex = (value) => {
            const hex = value.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(rValue)}${toHex(gValue)}${toHex(bValue)}`;
    };

    // ColorPicker states in HSBA format
    const [backgroundColorHSBA, setBackgroundColorHSBA] = useState(() => hexToHSBA(savedSettings.sticky_background_color));
    const [borderColorHSBA, setBorderColorHSBA] = useState(() => hexToHSBA(savedSettings.sticky_border_color));
    const [productNameColorHSBA, setProductNameColorHSBA] = useState(() => hexToHSBA(savedSettings.sticky_product_name_color));
    const [quantityColorHSBA, setQuantityColorHSBA] = useState(() => hexToHSBA(savedSettings.sticky_quantity_color));
    const [quantityBorderColorHSBA, setQuantityBorderColorHSBA] = useState(() => hexToHSBA(savedSettings.sticky_quantity_border_color));
    const [buttonTextColorHSBA, setButtonTextColorHSBA] = useState(() => hexToHSBA(savedSettings.sticky_button_text_color));
    const [buttonBgColorHSBA, setButtonBgColorHSBA] = useState(() => hexToHSBA(savedSettings.sticky_button_bg_color));


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
    const [isInitialized, setIsInitialized] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const cssEditorRef = useRef(null);
    const cssEditorViewRef = useRef(null);
    const previewAreaRef = useRef(null);
    const previewStyleRef = useRef(null);

    const shopify = useAppBridge();
    const fetcher = useFetcher();
    const navigate = useNavigate();



    // Placeholder functions that will be defined later
    let handleSaveRef = null;
    let handleDiscardRef = null;

    // Function to show the Shopify save bar
    const showSaveBar = useCallback(() => {
        const saveBar = document.getElementById('shopify-save-bar');
        if (saveBar) {
            saveBar.show();
        }
    }, []);

    // Function to hide the Shopify save bar
    const hideSaveBar = useCallback(() => {
        const saveBar = document.getElementById('shopify-save-bar');
        if (saveBar) {
            saveBar.hide();
        }
    }, []);

    // Function to check if settings have changed from saved values
    const checkForChanges = useCallback(() => {
        const currentSettings = {
            sticky_visibility: visibility,
            sticky_trigger: trigger,
            sticky_trigger_seconds: triggerSeconds,
            sticky_trigger_pixels: triggerPixels,
            sticky_content_display_image: imageDisplay,
            sticky_content_display_title: titleDisplay,
            sticky_content_display_price: priceDisplay,
            sticky_content_display_quantity: quantityDisplay,
            sticky_content_display_mobile_image: mobileImageDisplay,
            sticky_content_display_mobile_title: mobileTitleDisplay,
            sticky_content_display_mobile_price: mobilePriceDisplay,
            sticky_content_display_mobile_quantity: mobileQuantityDisplay,
            sticky_bar_width: barWidth,
            sticky_bar_width_mobile: mobileBarWidth,
            sticky_max_width_mobile: mobileMaxWidth,
            sticky_max_width_mobile_unit: mobileMaxWidthUnit,
            sticky_alignment_mobile: mobileAlignment,
            sticky_outer_spacing_mobile: mobileOuterSpacing,
            sticky_outer_spacing_mobile_unit: mobileOuterSpacingUnit,
            sticky_inner_spacing_mobile: mobileInnerSpacing,
            sticky_inner_spacing_mobile_unit: mobileInnerSpacingUnit,
            sticky_max_width: maxWidth,
            sticky_max_width_unit: maxWidthUnit,
            sticky_alignment: alignment,
            sticky_outer_spacing: outerSpacing,
            sticky_outer_spacing_unit: outerSpacingUnit,
            sticky_inner_spacing: innerSpacing,
            sticky_inner_spacing_unit: innerSpacingUnit,
            sticky_background_color: backgroundColor,
            sticky_border_color: borderColor,
            sticky_border_radius: borderRadius,
            sticky_product_name_color: productNameColor,
            sticky_image_size: imageSize,
            sticky_image_size_mobile: mobileImageSize,
            sticky_quantity_color: quantityColor,
            sticky_quantity_border_color: quantityBorderColor,
            sticky_button_behavior: buttonBehavior,
            sticky_button_text: buttonText,
            sticky_enable_cart_icon: enableCartIcon,
            sticky_enable_mobile_cart_icon: enableMobileCartIcon,
            sticky_button_text_color: buttonTextColor,
            sticky_button_bg_color: buttonBgColor,
            sticky_custom_css: customCss,
        };

        const savedSettingsObj = {
            sticky_visibility: savedSettings.sticky_visibility,
            sticky_trigger: savedSettings.sticky_trigger,
            sticky_trigger_seconds: parseInt(savedSettings.sticky_trigger_seconds) || 3,
            sticky_trigger_pixels: parseInt(savedSettings.sticky_trigger_pixels) || 300,
            sticky_content_display_image: savedSettings.sticky_content_display_image,
            sticky_content_display_title: savedSettings.sticky_content_display_title,
            sticky_content_display_price: savedSettings.sticky_content_display_price,
            sticky_content_display_quantity: savedSettings.sticky_content_display_quantity,
            sticky_content_display_mobile_image: savedSettings.sticky_content_display_mobile_image,
            sticky_content_display_mobile_title: savedSettings.sticky_content_display_mobile_title,
            sticky_content_display_mobile_price: savedSettings.sticky_content_display_mobile_price,
            sticky_content_display_mobile_quantity: savedSettings.sticky_content_display_mobile_quantity,
            sticky_bar_width: savedSettings.sticky_bar_width,
            sticky_bar_width_mobile: savedSettings.sticky_bar_width_mobile,
            sticky_max_width_mobile: savedSettings.sticky_max_width_mobile,
            sticky_max_width_mobile_unit: savedSettings.sticky_max_width_mobile_unit,
            sticky_alignment_mobile: savedSettings.sticky_alignment_mobile,
            sticky_outer_spacing_mobile: savedSettings.sticky_outer_spacing_mobile,
            sticky_outer_spacing_mobile_unit: savedSettings.sticky_outer_spacing_mobile_unit,
            sticky_inner_spacing_mobile: savedSettings.sticky_inner_spacing_mobile,
            sticky_inner_spacing_mobile_unit: savedSettings.sticky_inner_spacing_mobile_unit,
            sticky_max_width: savedSettings.sticky_max_width,
            sticky_max_width_unit: savedSettings.sticky_max_width_unit,
            sticky_alignment: savedSettings.sticky_alignment,
            sticky_outer_spacing: savedSettings.sticky_outer_spacing,
            sticky_outer_spacing_unit: savedSettings.sticky_outer_spacing_unit,
            sticky_inner_spacing: savedSettings.sticky_inner_spacing,
            sticky_inner_spacing_unit: savedSettings.sticky_inner_spacing_unit,
            sticky_background_color: savedSettings.sticky_background_color,
            sticky_border_color: savedSettings.sticky_border_color,
            sticky_border_radius: savedSettings.sticky_border_radius,
            sticky_product_name_color: savedSettings.sticky_product_name_color,
            sticky_image_size: savedSettings.sticky_image_size,
            sticky_image_size_mobile: savedSettings.sticky_image_size_mobile,
            sticky_quantity_color: savedSettings.sticky_quantity_color,
            sticky_quantity_border_color: savedSettings.sticky_quantity_border_color,
            sticky_button_behavior: savedSettings.sticky_button_behavior,
            sticky_button_text: savedSettings.sticky_button_text,
            sticky_enable_cart_icon: savedSettings.sticky_enable_cart_icon,
            sticky_enable_mobile_cart_icon: savedSettings.sticky_enable_mobile_cart_icon,
            sticky_button_text_color: savedSettings.sticky_button_text_color,
            sticky_button_bg_color: savedSettings.sticky_button_bg_color,
            sticky_custom_css: savedSettings.sticky_custom_css,
        };

        const hasChanges = JSON.stringify(currentSettings) !== JSON.stringify(savedSettingsObj);
        setHasUnsavedChanges(hasChanges);

        if (hasChanges) {
            showSaveBar();
        } else {
            hideSaveBar();
        }
    }, [
        visibility, trigger, triggerSeconds, triggerPixels, imageDisplay, titleDisplay, priceDisplay, quantityDisplay,
        mobileImageDisplay, mobileTitleDisplay, mobilePriceDisplay, mobileQuantityDisplay,
        barWidth, mobileBarWidth, mobileMaxWidth, mobileMaxWidthUnit, mobileAlignment,
        mobileOuterSpacing, mobileOuterSpacingUnit, mobileInnerSpacing, maxWidth,
        maxWidthUnit, alignment, outerSpacing, outerSpacingUnit, innerSpacing,
        innerSpacingUnit, backgroundColor, borderColor, borderRadius, productNameColor,
        imageSize, mobileImageSize, quantityColor, quantityBorderColor, buttonBehavior,
        buttonText, enableCartIcon, enableMobileCartIcon, buttonTextColor, buttonBgColor,
        customCss, savedSettings, showSaveBar, hideSaveBar
    ]);

    // Helper function to generate positioning classes
    const getPositioningClasses = () => {
        const view = appearanceView === 'mobile' ? 'mobile' : 'desktop';
        const barWidthValue = appearanceView === 'mobile' ? mobileBarWidth : barWidth;
        const alignmentValue = appearanceView === 'mobile' ? mobileAlignment : alignment;

        let classes = `sy-sticky-add-to-cart-preview sy-sticky-add-to-cart-preview--${view}`;

        if (barWidthValue === 'full') {
            classes += ` sy-sticky-add-to-cart-preview--${view}--full-width`;
        } else if (barWidthValue === 'contained') {
            classes += ` sy-sticky-add-to-cart-preview--${view}--contained--${alignmentValue}`;
        }

        return classes;
    };

    // Handle save action
    const handleSave = useCallback(async () => {
        const formData = new FormData();

        // Add all current settings to form data
        formData.append('sticky_visibility', visibility);
        formData.append('sticky_trigger', trigger);
        formData.append('sticky_trigger_seconds', triggerSeconds);
        formData.append('sticky_trigger_pixels', triggerPixels);
        formData.append('sticky_content_display_image', imageDisplay ? 'on' : 'off');
        formData.append('sticky_content_display_title', titleDisplay ? 'on' : 'off');
        formData.append('sticky_content_display_price', priceDisplay ? 'on' : 'off');
        formData.append('sticky_content_display_quantity', quantityDisplay ? 'on' : 'off');
        formData.append('sticky_content_display_mobile_image', mobileImageDisplay ? 'on' : 'off');
        formData.append('sticky_content_display_mobile_title', mobileTitleDisplay ? 'on' : 'off');
        formData.append('sticky_content_display_mobile_price', mobilePriceDisplay ? 'on' : 'off');
        formData.append('sticky_content_display_mobile_quantity', mobileQuantityDisplay ? 'on' : 'off');
        formData.append('sticky_bar_width', barWidth);
        formData.append('sticky_bar_width_mobile', mobileBarWidth);
        formData.append('sticky_max_width_mobile', mobileMaxWidth);
        formData.append('sticky_max_width_mobile_unit', mobileMaxWidthUnit);
        formData.append('sticky_alignment_mobile', mobileAlignment);
        formData.append('sticky_outer_spacing_mobile', mobileOuterSpacing);
        formData.append('sticky_outer_spacing_mobile_unit', mobileOuterSpacingUnit);
        formData.append('sticky_inner_spacing_mobile', mobileInnerSpacing);
        formData.append('sticky_inner_spacing_mobile_unit', mobileInnerSpacingUnit);
        formData.append('sticky_max_width', maxWidth);
        formData.append('sticky_max_width_unit', maxWidthUnit);
        formData.append('sticky_alignment', alignment);
        formData.append('sticky_outer_spacing', outerSpacing);
        formData.append('sticky_outer_spacing_unit', outerSpacingUnit);
        formData.append('sticky_inner_spacing', innerSpacing);
        formData.append('sticky_inner_spacing_unit', innerSpacingUnit);
        formData.append('sticky_background_color', backgroundColor);
        formData.append('sticky_border_color', borderColor);
        formData.append('sticky_border_radius', borderRadius);
        formData.append('sticky_product_name_color', productNameColor);
        formData.append('sticky_image_size', imageSize);
        formData.append('sticky_image_size_mobile', mobileImageSize);
        formData.append('sticky_quantity_color', quantityColor);
        formData.append('sticky_quantity_border_color', quantityBorderColor);
        formData.append('sticky_button_behavior', buttonBehavior);
        formData.append('sticky_button_text', buttonText);
        formData.append('sticky_enable_cart_icon', enableCartIcon ? 'on' : 'off');
        formData.append('sticky_enable_mobile_cart_icon', enableMobileCartIcon ? 'on' : 'off');
        formData.append('sticky_button_text_color', buttonTextColor);
        formData.append('sticky_button_bg_color', buttonBgColor);
        formData.append('sticky_custom_css', customCss);

        fetcher.submit(formData, { method: 'post' });
    }, [
        visibility, trigger, triggerSeconds, triggerPixels, imageDisplay, titleDisplay, priceDisplay, quantityDisplay,
        mobileImageDisplay, mobileTitleDisplay, mobilePriceDisplay, mobileQuantityDisplay,
        barWidth, mobileBarWidth, mobileMaxWidth, mobileMaxWidthUnit, mobileAlignment,
        mobileOuterSpacing, mobileOuterSpacingUnit, mobileInnerSpacing, mobileInnerSpacingUnit, maxWidth,
        maxWidthUnit, alignment, outerSpacing, outerSpacingUnit, innerSpacing,
        innerSpacingUnit, backgroundColor, borderColor, borderRadius, productNameColor,
        imageSize, mobileImageSize, quantityColor, quantityBorderColor, buttonBehavior,
        buttonText, enableCartIcon, enableMobileCartIcon, buttonTextColor, buttonBgColor,
        customCss, fetcher
    ]);

    // Set the refs after handleSave is defined
    handleSaveRef = handleSave;

    // Handle discard action
    const handleDiscard = useCallback(() => {
        // Reset all settings to saved values
        setVisibility(savedSettings.sticky_visibility);
        setTrigger(savedSettings.sticky_trigger);
        setTriggerSeconds(parseInt(savedSettings.sticky_trigger_seconds) || 3);
        setTriggerPixels(parseInt(savedSettings.sticky_trigger_pixels) || 300);
        setImageDisplay(savedSettings.sticky_content_display_image);
        setTitleDisplay(savedSettings.sticky_content_display_title);
        setPriceDisplay(savedSettings.sticky_content_display_price);
        setQuantityDisplay(savedSettings.sticky_content_display_quantity);
        setMobileImageDisplay(savedSettings.sticky_content_display_mobile_image);
        setMobileTitleDisplay(savedSettings.sticky_content_display_mobile_title);
        setMobilePriceDisplay(savedSettings.sticky_content_display_mobile_price);
        setMobileQuantityDisplay(savedSettings.sticky_content_display_mobile_quantity);
        setBarWidth(savedSettings.sticky_bar_width);
        setMobileBarWidth(savedSettings.sticky_bar_width_mobile);
        setMobileMaxWidth(savedSettings.sticky_max_width_mobile);
        setMobileMaxWidthUnit(savedSettings.sticky_max_width_mobile_unit);
        setMobileAlignment(savedSettings.sticky_alignment_mobile);
        setMobileOuterSpacing(savedSettings.sticky_outer_spacing_mobile);
        setMobileOuterSpacingUnit(savedSettings.sticky_outer_spacing_mobile_unit);
        setMobileInnerSpacing(savedSettings.sticky_inner_spacing_mobile);
        setMobileInnerSpacingUnit(savedSettings.sticky_inner_spacing_mobile_unit);
        setMaxWidth(savedSettings.sticky_max_width);
        setMaxWidthUnit(savedSettings.sticky_max_width_unit);
        setAlignment(savedSettings.sticky_alignment);
        setOuterSpacing(savedSettings.sticky_outer_spacing);
        setOuterSpacingUnit(savedSettings.sticky_outer_spacing_unit);
        setInnerSpacing(savedSettings.sticky_inner_spacing);
        setInnerSpacingUnit(savedSettings.sticky_inner_spacing_unit);
        setBackgroundColor(savedSettings.sticky_background_color);
        setBorderColor(savedSettings.sticky_border_color);
        setBorderRadius(savedSettings.sticky_border_radius);
        setProductNameColor(savedSettings.sticky_product_name_color);
        setImageSize(savedSettings.sticky_image_size);
        setMobileImageSize(savedSettings.sticky_image_size_mobile);
        setQuantityColor(savedSettings.sticky_quantity_color);
        setQuantityBorderColor(savedSettings.sticky_quantity_border_color);
        setButtonBehavior(savedSettings.sticky_button_behavior);
        setButtonText(savedSettings.sticky_button_text);
        setEnableCartIcon(savedSettings.sticky_enable_cart_icon);
        setEnableMobileCartIcon(savedSettings.sticky_enable_mobile_cart_icon);
        setButtonTextColor(savedSettings.sticky_button_text_color);
        setButtonBgColor(savedSettings.sticky_button_bg_color);
        setCustomCss(savedSettings.sticky_custom_css);
        hideSaveBar();
    }, [savedSettings, hideSaveBar]);

    // Set the refs after both functions are defined
    handleSaveRef = handleSave;
    handleDiscardRef = handleDiscard;



    useEffect(() => {
        if (fetcher.data?.ok) {
            shopify.toast.show("Sticky buy settings saved!");
            hideSaveBar();
        }
    }, [fetcher.data, shopify, hideSaveBar]);

    // Set initialization flag after component mounts
    useEffect(() => {
        setIsInitialized(true);
    }, []);

    // Check for changes whenever any setting changes
    useEffect(() => {
        if (isInitialized) {
            checkForChanges();
        }
    }, [isInitialized, checkForChanges]);

    // Initialize CodeMirror editor for CSS
    useEffect(() => {
        // Only initialize when CSS tab (tab 2) is selected and editor ref is available
        if (selectedTab !== 2 || !cssEditorRef.current || cssEditorViewRef.current) return;

        const startState = EditorState.create({
            doc: customCss,
            extensions: [
                basicSetup,
                css(),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        const newValue = update.state.doc.toString();
                        setCustomCss(newValue);
                    }
                }),
                EditorView.theme({
                    '&': {
                        height: '300px',
                        fontSize: '14px',
                    },
                }),
            ],
        });

        const view = new EditorView({
            state: startState,
            parent: cssEditorRef.current,
        });

        cssEditorViewRef.current = view;

        return () => {
            if (cssEditorViewRef.current) {
                cssEditorViewRef.current.destroy();
                cssEditorViewRef.current = null;
            }
        };
    }, [selectedTab]); // Initialize when tab is selected

    // Update editor when customCss changes externally (but not from editor itself)
    useEffect(() => {
        if (cssEditorViewRef.current && customCss !== cssEditorViewRef.current.state.doc.toString()) {
            const transaction = cssEditorViewRef.current.state.update({
                changes: {
                    from: 0,
                    to: cssEditorViewRef.current.state.doc.length,
                    insert: customCss,
                },
            });
            cssEditorViewRef.current.dispatch(transaction);
        }
    }, [customCss]);

    // Apply custom CSS to preview area
    useEffect(() => {
        if (!previewAreaRef.current) return;

        // Remove existing custom CSS style tag
        if (previewStyleRef.current) {
            previewStyleRef.current.remove();
            previewStyleRef.current = null;
        }

        // Add custom CSS if provided
        if (customCss && customCss.trim()) {
            const styleElement = document.createElement('style');
            styleElement.id = 'preview-custom-css';
            styleElement.textContent = customCss;
            previewAreaRef.current.insertBefore(styleElement, previewAreaRef.current.firstChild);
            previewStyleRef.current = styleElement;
        }

        return () => {
            if (previewStyleRef.current) {
                previewStyleRef.current.remove();
                previewStyleRef.current = null;
            }
        };
    }, [customCss]);

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
                    // Mobile-specific settings only
                    sticky_content_display_mobile_image: true,
                    sticky_content_display_mobile_title: true,
                    sticky_content_display_mobile_price: true,
                    sticky_content_display_mobile_quantity: true,
                    sticky_bar_width_mobile: 'full',
                    sticky_max_width_mobile: '',
                    sticky_max_width_mobile_unit: 'px',
                    sticky_alignment_mobile: 'right',
                    sticky_outer_spacing_mobile: '',
                    sticky_outer_spacing_mobile_unit: 'px',
                    sticky_inner_spacing_mobile: '12',
                    sticky_image_size_mobile: 'medium',
                    sticky_enable_mobile_cart_icon: true
                };
            } else {
                return {
                    // Desktop-specific settings only
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
                    sticky_inner_spacing: '12',
                    sticky_inner_spacing_unit: 'px',
                    sticky_background_color: '#FFFFFF',
                    sticky_border_color: '#DFDFDF',
                    sticky_border_radius: '12',
                    sticky_product_name_color: '#141414',
                    sticky_image_size: 'medium',
                    sticky_quantity_color: '#141414',
                    sticky_quantity_border_color: '#DFDFDF',
                    sticky_button_behavior: 'add',
                    sticky_button_text: 'Add to cart',
                    sticky_enable_cart_icon: true,
                    sticky_button_text_color: '#FFFFFF',
                    sticky_button_bg_color: '#141414'
                };
            }
        };

        const defaultSettings = getDefaultSettings(appearanceView);

        // Update only the settings for the current view
        if (appearanceView === 'mobile') {
            // Reset only mobile settings
            setMobileImageDisplay(defaultSettings.sticky_content_display_mobile_image);
            setMobileTitleDisplay(defaultSettings.sticky_content_display_mobile_title);
            setMobilePriceDisplay(defaultSettings.sticky_content_display_mobile_price);
            setMobileQuantityDisplay(defaultSettings.sticky_content_display_mobile_quantity);
            setMobileBarWidth(defaultSettings.sticky_bar_width_mobile);
            setMobileMaxWidth(defaultSettings.sticky_max_width_mobile);
            setMobileMaxWidthUnit(defaultSettings.sticky_max_width_mobile_unit);
            setMobileAlignment(defaultSettings.sticky_alignment_mobile);
            setMobileOuterSpacing(defaultSettings.sticky_outer_spacing_mobile);
            setMobileOuterSpacingUnit(defaultSettings.sticky_outer_spacing_mobile_unit);
            setMobileInnerSpacing(defaultSettings.sticky_inner_spacing_mobile);
            setMobileImageSize(defaultSettings.sticky_image_size_mobile);
            setEnableMobileCartIcon(defaultSettings.sticky_enable_mobile_cart_icon);
        } else {
            // Reset only desktop settings
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
            setButtonTextColor(defaultSettings.sticky_button_text_color);
            setButtonBgColor(defaultSettings.sticky_button_bg_color);
        }

        // Create FormData with only the settings for the current view
        const formData = new FormData();
        Object.entries(defaultSettings).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
                formData.append(key, value ? 'on' : 'off');
            } else {
                formData.append(key, value);
            }
        });

        // Submit the form data to trigger save bar
        fetcher.submit(formData, { method: 'post' });

        // Close the modal
        setShowResetModal(false);
    }, [appearanceView, fetcher]);

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handleTabChange = useCallback((selectedTabIndex) => setSelectedTab(selectedTabIndex), []);

    // Handle pause/resume sticky buy
    const handleToggleStickyBar = useCallback(async () => {
        const newStatus = stickyBarStatus === 'active' ? 'paused' : 'active';
        setStickyBarStatus(newStatus);

        // Save to database
        const formData = new FormData();
        formData.append('sticky_bar_status', newStatus);

        fetcher.submit(formData, { method: 'post' });
    }, [stickyBarStatus, fetcher]);

    const tabs = [
        { id: 'general', content: 'General', panelID: 'general-content' },
        { id: 'appearance', content: 'Appearance', panelID: 'appearance-content' },
        { id: 'advanced', content: 'Advanced', panelID: 'advanced-content' },
    ];

    return (
        <Page fullWidth>
            <TitleBar title="Sticky buy - Customize" />
            <InlineStack align="space-between" gap="400">
                <InlineStack gap="200" blockAlign="center">
                    <Button icon={ArrowLeftIcon} variant="tertiary" onClick={handleBack} />
                    <span className="customize-header-title">Customize</span>
                </InlineStack>
            </InlineStack>

            <div className="customize-tabs-wrapper">
                <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange} />
            </div>

            <InlineGrid columns={{ xs: 1, md: ['oneThird', 'twoThirds'] }} gap="400" alignItems="start">
                <Box maxWidth="360px">
                    {selectedTab === 0 && (
                        <Layout>
                            <Layout.Section>
                                <BlockStack gap="400">
                                    <Card>
                                        <InlineStack gap="400" align="space-between" blockAlign="center">
                                            <InlineStack gap="150">
                                                <Text variant="headingSm">Sticky Buy</Text>
                                                <Badge tone={stickyBarStatus === 'active' ? 'success' : 'warning'}>
                                                    {stickyBarStatus === 'active' ? 'Live' : 'Paused'}
                                                </Badge>
                                            </InlineStack>
                                            <Button
                                                tone={stickyBarStatus === 'active' ? 'critical' : 'success'}
                                                onClick={handleToggleStickyBar}
                                                loading={fetcher.state === 'submitting'}
                                            >
                                                {stickyBarStatus === 'active' ? 'Pause' : 'Resume'}
                                            </Button>
                                        </InlineStack>
                                    </Card>
                                    <Card>
                                        <BlockStack gap="400">
                                            <BlockStack gap="400">
                                                <Text variant="headingSm" as="h3">Visibility</Text>
                                                <BlockStack gap="100">
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
                                                    <Text variant="bodySm" tone="subdued">Control where the Sticky Buy is shown.</Text>
                                                </BlockStack>
                                            </BlockStack>
                                            <Divider />
                                            <BlockStack gap="400">
                                                <Text variant="headingSm" as="h3">Trigger</Text>

                                                <BlockStack gap="200">
                                                    <Text variant="bodyMd" as="p" fontWeight="medium">Display trigger</Text>
                                                    {/* Always visible */}
                                                    <Box>
                                                        <label className="radio-label">
                                                            <input
                                                                type="radio"
                                                                name="trigger"
                                                                value="always"
                                                                checked={trigger === 'always'}
                                                                onChange={(e) => setTrigger(e.target.value)}
                                                                className="radio-input"
                                                            />
                                                            <Text>Always visible</Text>
                                                        </label>
                                                    </Box>

                                                    {/* On scroll up */}
                                                    <Box>
                                                        <label className="radio-label">
                                                            <input
                                                                type="radio"
                                                                name="trigger"
                                                                value="scroll-up"
                                                                checked={trigger === 'scroll-up'}
                                                                onChange={(e) => setTrigger(e.target.value)}
                                                                className="radio-input"
                                                            />
                                                            <Text>On scroll up</Text>
                                                        </label>
                                                    </Box>

                                                    {/* After X seconds */}
                                                    <Box>
                                                        <label className="radio-label">
                                                            <input
                                                                type="radio"
                                                                name="trigger"
                                                                value="after-x-seconds"
                                                                checked={trigger === 'after-x-seconds'}
                                                                onChange={(e) => setTrigger(e.target.value)}
                                                                className="radio-input"
                                                            />
                                                            <Text>After X seconds</Text>
                                                        </label>
                                                        {trigger === 'after-x-seconds' && (
                                                            <Box className="indented-content">
                                                                <TextField
                                                                    label="Seconds"
                                                                    type="number"
                                                                    value={triggerSeconds.toString()}
                                                                    onChange={(value) => setTriggerSeconds(parseInt(value) || 3)}
                                                                    min="1"
                                                                    max="60"
                                                                    suffix="seconds"
                                                                />
                                                            </Box>
                                                        )}
                                                    </Box>

                                                    {/* After X pixels */}
                                                    <Box>
                                                        <label className="radio-label">
                                                            <input
                                                                type="radio"
                                                                name="trigger"
                                                                value="after-x-pixels"
                                                                checked={trigger === 'after-x-pixels'}
                                                                onChange={(e) => setTrigger(e.target.value)}
                                                                className="radio-input"
                                                            />
                                                            <Text>After scrolling down X pixels</Text>
                                                        </label>
                                                        {trigger === 'after-x-pixels' && (
                                                            <Box className="indented-content">
                                                                <TextField
                                                                    label="Pixels"
                                                                    type="number"
                                                                    value={triggerPixels.toString()}
                                                                    onChange={(value) => setTriggerPixels(parseInt(value) || 300)}
                                                                    min="50"
                                                                    max="2000"
                                                                    suffix="pixels"
                                                                />
                                                            </Box>
                                                        )}
                                                    </Box>

                                                    {/* After product summary */}
                                                    <Box>
                                                        <label className="radio-label">
                                                            <input
                                                                type="radio"
                                                                name="trigger"
                                                                value="after-summary"
                                                                checked={trigger === 'after-summary'}
                                                                onChange={(e) => setTrigger(e.target.value)}
                                                                className="radio-input"
                                                            />
                                                            <Text>After product summary</Text>
                                                        </label>
                                                    </Box>

                                                    {/* When add to cart button is out of view */}
                                                    <Box>
                                                        <label className="radio-label">
                                                            <input
                                                                type="radio"
                                                                name="trigger"
                                                                value="out-of-view"
                                                                checked={trigger === 'out-of-view'}
                                                                onChange={(e) => setTrigger(e.target.value)}
                                                                className="radio-input"
                                                            />
                                                            <Text>When add to cart button is out of view</Text>
                                                        </label>
                                                    </Box>
                                                </BlockStack>
                                            </BlockStack>
                                        </BlockStack>
                                    </Card>
                                </BlockStack>
                            </Layout.Section>
                        </Layout>
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
                                <BlockStack gap="400">
                                    <Card>
                                        <BlockStack gap="400">
                                            <BlockStack gap="100">
                                                <Text variant="headingSm" as="h3" className="form-label-bold"
                                                >Content display</Text>
                                                <Text variant="bodySm" tone="subdued">Control which product elements are displayed.</Text>
                                            </BlockStack>

                                            <BlockStack gap="0">
                                                <Checkbox
                                                    label="Show image"
                                                    checked={imageDisplay}
                                                    onChange={(checked) => setImageDisplay(checked)}
                                                />
                                                <Checkbox
                                                    label="Show title"
                                                    checked={titleDisplay}
                                                    onChange={(checked) => setTitleDisplay(checked)}
                                                />
                                                <Checkbox
                                                    label="Show price"
                                                    checked={priceDisplay}
                                                    onChange={(checked) => setPriceDisplay(checked)}
                                                />
                                                <Checkbox
                                                    label="Show quantity selector"
                                                    checked={quantityDisplay}
                                                    onChange={(checked) => setQuantityDisplay(checked)}
                                                />
                                            </BlockStack>
                                        </BlockStack>
                                    </Card>
                                    <Card>
                                        <BlockStack gap="400">
                                            <BlockStack gap="100">
                                                <Text as="h3" variant="headingMd">Bar</Text>
                                                <Text variant="bodySm" tone="subdued">Manage layout, spacing, and visual design for the sticky buy container.</Text>
                                            </BlockStack>

                                            <ChoiceList
                                                title="Width"
                                                choices={[
                                                    { label: 'Full', value: 'full' },
                                                    { label: 'Contained', value: 'contained' },
                                                ]}
                                                selected={[barWidth]}
                                                onChange={([value]) => setBarWidth(value)}
                                                allowMultiple={false}
                                            />
                                            {barWidth === 'contained' && (
                                                <>
                                                    <BlockStack gap="100">
                                                        <Text variant="bodySm" as="div" className="form-label-bold">Max width</Text>
                                                        <TextField
                                                            labelHidden
                                                            fullWidth
                                                            type="number"
                                                            placeholder="e.g., 600"
                                                            value={maxWidth}
                                                            onChange={setMaxWidth}
                                                            connectedRight={<Select
                                                                labelHidden
                                                                options={[
                                                                    { label: 'px', value: 'px' },
                                                                    { label: '%', value: '%' }
                                                                ]}
                                                                onChange={setMaxWidthUnit}
                                                                value={maxWidthUnit}
                                                                className="input-styled unit-input"
                                                            />}
                                                            helpText="Leave empty for auto"
                                                        />
                                                    </BlockStack>
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
                                                            className="input-styled input-full-width"
                                                        />
                                                    </BlockStack>
                                                    <BlockStack gap="100">
                                                        <Text variant="bodySm" as="div" className="form-label-bold-simple">Outer spacing</Text>
                                                        <input
                                                            type="hidden"
                                                            name="sticky_outer_spacing"
                                                            value={outerSpacing}
                                                        />
                                                        <TextField
                                                            labelHidden
                                                            className='outer-spacing-input-type-number'
                                                            type="number"
                                                            placeholder="e.g., 20"
                                                            value={outerSpacing}
                                                            onChange={setOuterSpacing}
                                                            helpText="Distance between the bar and the screen edges."
                                                            connectedRight={<Select
                                                                labelHidden
                                                                options={[
                                                                    { label: 'px', value: 'px' },
                                                                    { label: '%', value: '%' }
                                                                ]}
                                                                onChange={setOuterSpacingUnit}
                                                                value={outerSpacingUnit}
                                                                name="sticky_outer_spacing_unit"
                                                                className="input-styled unit-input"
                                                            />}
                                                        />
                                                    </BlockStack>
                                                </>
                                            )}
                                            <BlockStack gap="100">
                                                <Text variant="bodySm" as="div" className="form-label-bold-simple">Inner spacing</Text>
                                                <input
                                                    type="hidden"
                                                    name="sticky_inner_spacing"
                                                    value={innerSpacing}
                                                />
                                                <TextField
                                                    labelHidden
                                                    className='inner-spacing-input-type-number'
                                                    type="number"
                                                    placeholder="e.g., 16"
                                                    value={innerSpacing}
                                                    onChange={setInnerSpacing}
                                                    connectedRight={<Select
                                                        labelHidden
                                                        options={[
                                                            { label: 'px', value: 'px' },
                                                            { label: '%', value: '%' }
                                                        ]}
                                                        onChange={setInnerSpacingUnit}
                                                        value={innerSpacingUnit}
                                                        name="sticky_inner_spacing_unit"
                                                        className="input-styled unit-input"
                                                    />}
                                                />
                                                <Text variant="bodySm" tone="subdued">Padding inside the sticky buy</Text>
                                            </BlockStack>
                                            <BlockStack gap="100">
                                                <Text variant="bodySm" as="div" className="form-label-bold-simple">Background color</Text>
                                                <Popover
                                                    active={showBackgroundColorPicker}
                                                    activator={
                                                        <div className="color-input-wrapper">
                                                            <div
                                                                className="color-swatch color-picker-preview"
                                                                style={{
                                                                    backgroundColor: backgroundColor,
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => setShowBackgroundColorPicker(true)}
                                                            />
                                                            <input
                                                                className="color-input-type-color color-input-text"
                                                                type="text"
                                                                value={backgroundColor}
                                                                onChange={(e) => {
                                                                    const newColor = e.target.value;
                                                                    // Allow typing by always updating the input value
                                                                    setBackgroundColor(newColor);
                                                                    // Only update HSBA and apply color if it's a valid hex
                                                                    if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
                                                                        setBackgroundColorHSBA(hexToHSBA(newColor));
                                                                    }
                                                                }}
                                                                placeholder="#FFFFFF"
                                                            />
                                                        </div>
                                                    }
                                                    onClose={() => setShowBackgroundColorPicker(false)}
                                                    preferredPosition="below"
                                                    preferredAlignment="left"
                                                    fullWidth={false}
                                                    sectioned={false}
                                                >
                                                    <ColorPicker
                                                        onChange={(color) => {
                                                            setBackgroundColorHSBA(color);
                                                            setBackgroundColor(hsbaToHex(color));
                                                        }}
                                                        color={backgroundColorHSBA}
                                                        allowAlpha={false}
                                                    />
                                                </Popover>
                                            </BlockStack>
                                            <BlockStack gap="100">
                                                <Text variant="bodySm" as="div" className="form-label-bold-simple">Border color</Text>
                                                <Popover
                                                    active={showBorderColorPicker}
                                                    activator={
                                                        <div className="color-input-wrapper">
                                                            <div
                                                                className="color-swatch color-picker-preview"
                                                                style={{
                                                                    backgroundColor: borderColor,
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => setShowBorderColorPicker(true)}
                                                            />
                                                            <input
                                                                className="color-input-type-color color-input-text"
                                                                type="text"
                                                                value={borderColor}
                                                                onChange={(e) => {
                                                                    const newColor = e.target.value;
                                                                    // Allow typing by always updating the input value
                                                                    setBorderColor(newColor);
                                                                    // Only update HSBA and apply color if it's a valid hex
                                                                    if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
                                                                        setBorderColorHSBA(hexToHSBA(newColor));
                                                                    }
                                                                }}
                                                                placeholder="#DFDFDF"
                                                            />
                                                        </div>
                                                    }
                                                    onClose={() => setShowBorderColorPicker(false)}
                                                    preferredPosition="below"
                                                    preferredAlignment="left"
                                                    fullWidth={false}
                                                    sectioned={false}
                                                >
                                                    <ColorPicker
                                                        onChange={(color) => {
                                                            setBorderColorHSBA(color);
                                                            setBorderColor(hsbaToHex(color));
                                                        }}
                                                        color={borderColorHSBA}
                                                        allowAlpha={false}
                                                    />
                                                </Popover>
                                            </BlockStack>
                                            <BlockStack gap="100">
                                                <Text variant="bodySm" as="div" className="form-label-bold-simple">Corner radius</Text>
                                                <div
                                                    className='sy-range-slider-wrapper'
                                                >
                                                    <RangeSlider
                                                        label="Corner radius"
                                                        labelHidden
                                                        value={parseInt(borderRadius) ?? 12}
                                                        min={0}
                                                        max={24}
                                                        step={1}
                                                        onChange={value => setBorderRadius(value.toString())}
                                                        name="sticky_border_radius"
                                                    />
                                                    <div className='sy-range-slider-unit-wrapper'>
                                                        <input
                                                            className='sy-border-radius-input-number'
                                                            type="number"
                                                            min="0"
                                                            max="24"
                                                            value={borderRadius ?? '12'}
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
                                        <BlockStack gap="400">
                                            <BlockStack gap="100">
                                                <Text as="h3" variant="headingMd">Content</Text>
                                                <Text variant="bodySm" tone="subdued">Customize fonts, colors, and spacing for product content inside the sticky buy.</Text>
                                            </BlockStack>
                                            <BlockStack gap="100">
                                                <Divider />
                                            </BlockStack>
                                            <BlockStack gap="100">
                                                <Text as="h4" variant="headingSm">Product name</Text>
                                                <Text variant="bodySm" as="div" className="form-label-bold-simple">Color</Text>
                                                <Popover
                                                    active={showProductNameColorPicker}
                                                    activator={
                                                        <div className="color-input-wrapper">
                                                            <div
                                                                className="color-swatch color-picker-preview"
                                                                style={{
                                                                    backgroundColor: productNameColor,
                                                                    border: '1px solid #DFDFDF',
                                                                    borderRadius: '4px',
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => setShowProductNameColorPicker(true)}
                                                            />
                                                            <input
                                                                className="color-input-type-color color-input-text"
                                                                type="text"
                                                                value={productNameColor}
                                                                onChange={(e) => {
                                                                    const newColor = e.target.value;
                                                                    // Allow typing by always updating the input value
                                                                    setProductNameColor(newColor);
                                                                    // Only update HSBA and apply color if it's a valid hex
                                                                    if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
                                                                        setProductNameColorHSBA(hexToHSBA(newColor));
                                                                    }
                                                                }}
                                                                placeholder="#141414"
                                                            />
                                                        </div>
                                                    }
                                                    onClose={() => setShowProductNameColorPicker(false)}
                                                    preferredPosition="below"
                                                    preferredAlignment="left"
                                                    fullWidth={false}
                                                    sectioned={false}
                                                >
                                                    <ColorPicker
                                                        onChange={(color) => {
                                                            setProductNameColorHSBA(color);
                                                            setProductNameColor(hsbaToHex(color));
                                                        }}
                                                        color={productNameColorHSBA}
                                                        allowAlpha={false}
                                                    />
                                                </Popover>
                                            </BlockStack>
                                            <BlockStack gap="100">
                                                <Divider />
                                            </BlockStack>
                                            <BlockStack gap="100">
                                                <Text variant="headingSm" as="h4" className="form-label-bold">Image</Text>
                                                <Text variant="bodySm" as="div" className="form-label-bold-simple">Size</Text>
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
                                            </BlockStack>
                                            <BlockStack gap="100">
                                                <Divider />
                                            </BlockStack>
                                            <BlockStack gap="200">
                                                <Text variant="headingSm" as="h4" className="form-label-bold">Quantity</Text>
                                                <BlockStack gap="100">
                                                    <Text variant="bodySm" as="div" className="form-label-bold-simple">Color</Text>
                                                    <Popover
                                                        active={showQuantityColorPicker}
                                                        activator={
                                                            <div className="color-input-wrapper">
                                                                <div
                                                                    className="color-swatch color-picker-preview"
                                                                    style={{
                                                                        backgroundColor: quantityColor,
                                                                        border: '1px solid #DFDFDF',
                                                                        borderRadius: '4px',
                                                                        width: '20px',
                                                                        height: '20px',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                    onClick={() => setShowQuantityColorPicker(true)}
                                                                />
                                                                <input
                                                                    className="color-input-type-color color-input-text"
                                                                    type="text"
                                                                    value={quantityColor}
                                                                    onChange={(e) => {
                                                                        const newColor = e.target.value;
                                                                        // Allow typing by always updating the input value
                                                                        setQuantityColor(newColor);
                                                                        // Only update HSBA and apply color if it's a valid hex
                                                                        if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
                                                                            setQuantityColorHSBA(hexToHSBA(newColor));
                                                                        }
                                                                    }}
                                                                    placeholder="#141414"
                                                                />
                                                            </div>
                                                        }
                                                        onClose={() => setShowQuantityColorPicker(false)}
                                                        preferredPosition="below"
                                                        preferredAlignment="left"
                                                        fullWidth={false}
                                                        sectioned={false}
                                                    >
                                                        <ColorPicker
                                                            onChange={(color) => {
                                                                setQuantityColorHSBA(color);
                                                                setQuantityColor(hsbaToHex(color));
                                                            }}
                                                            color={quantityColorHSBA}
                                                            allowAlpha={false}
                                                        />
                                                    </Popover>
                                                </BlockStack>
                                                <BlockStack gap="100">
                                                    <Text variant="bodySm" as="div" className="form-label-bold-simple">Border color</Text>
                                                    <Popover
                                                        active={showQuantityBorderColorPicker}
                                                        activator={
                                                            <div className="color-input-wrapper">
                                                                <div
                                                                    className="color-swatch color-picker-preview"
                                                                    style={{
                                                                        backgroundColor: quantityBorderColor,
                                                                        border: '1px solid #DFDFDF',
                                                                        borderRadius: '4px',
                                                                        width: '20px',
                                                                        height: '20px',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                    onClick={() => setShowQuantityBorderColorPicker(true)}
                                                                />
                                                                <input
                                                                    className="color-input-type-color color-input-text"
                                                                    type="text"
                                                                    value={quantityBorderColor}
                                                                    onChange={(e) => {
                                                                        const newColor = e.target.value;
                                                                        // Allow typing by always updating the input value
                                                                        setQuantityBorderColor(newColor);
                                                                        // Only update HSBA and apply color if it's a valid hex
                                                                        if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
                                                                            setQuantityBorderColorHSBA(hexToHSBA(newColor));
                                                                        }
                                                                    }}
                                                                    placeholder="#DFDFDF"
                                                                />
                                                            </div>
                                                        }
                                                        onClose={() => setShowQuantityBorderColorPicker(false)}
                                                        preferredPosition="below"
                                                        preferredAlignment="left"
                                                        fullWidth={false}
                                                        sectioned={false}
                                                    >
                                                        <ColorPicker
                                                            onChange={(color) => {
                                                                setQuantityBorderColorHSBA(color);
                                                                setQuantityBorderColor(hsbaToHex(color));
                                                            }}
                                                            color={quantityBorderColorHSBA}
                                                            allowAlpha={false}
                                                        />
                                                    </Popover>
                                                </BlockStack>
                                            </BlockStack>
                                        </BlockStack>
                                    </Card>
                                    <Card>
                                        <BlockStack gap="400">
                                            <BlockStack gap="100">
                                                <Text as="h3" variant="headingMd" >Button</Text>
                                                <Text variant="bodySm" tone="subdued" style={{ marginBottom: 16 }}>
                                                    Customize the look and behavior of "Add to cart" button inside the sticky buy.
                                                </Text>
                                            </BlockStack>
                                            <BlockStack gap="100">
                                                <Text variant="bodySm" as="div" className="form-label-bold-simple">On click behavior</Text>
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
                                            </BlockStack>
                                            <BlockStack gap="100">
                                                <Text variant="bodySm" as="div" className="form-label-bold-simple">Text</Text>
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
                                            </BlockStack>
                                            <InlineStack gap="200">
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
                                                    <Text variant="bodySm" as="span" className="form-label-bold-simple">Show cart icon</Text>
                                                    <Text variant="bodySm" tone="subdued" style={{ marginLeft: 8 }}>
                                                        Choose whether to display the icon or not
                                                    </Text>
                                                </div>
                                            </InlineStack>
                                            <BlockStack gap="100">
                                                <BlockStack gap="100">
                                                    <Text variant="bodySm" as="div" className="form-label-bold-simple">Text color</Text>
                                                    <Popover
                                                        active={showButtonTextColorPicker}
                                                        activator={
                                                            <div className="color-input-wrapper">
                                                                <div
                                                                    className="color-swatch color-picker-preview"
                                                                    style={{
                                                                        backgroundColor: buttonTextColor,
                                                                        border: '1px solid #DFDFDF',
                                                                        borderRadius: '4px',
                                                                        width: '20px',
                                                                        height: '20px',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                    onClick={() => setShowButtonTextColorPicker(true)}
                                                                />
                                                                <input
                                                                    className="color-input-type-color color-input-text"
                                                                    type="text"
                                                                    value={buttonTextColor}
                                                                    onChange={(e) => {
                                                                        const newColor = e.target.value;
                                                                        // Allow typing by always updating the input value
                                                                        setButtonTextColor(newColor);
                                                                        // Only update HSBA and apply color if it's a valid hex
                                                                        if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
                                                                            setButtonTextColorHSBA(hexToHSBA(newColor));
                                                                        }
                                                                    }}
                                                                    placeholder="#FFFFFF"
                                                                />
                                                            </div>
                                                        }
                                                        onClose={() => setShowButtonTextColorPicker(false)}
                                                        preferredPosition="below"
                                                        preferredAlignment="left"
                                                        fullWidth={false}
                                                        sectioned={false}
                                                    >
                                                        <ColorPicker
                                                            onChange={(color) => {
                                                                setButtonTextColorHSBA(color);
                                                                setButtonTextColor(hsbaToHex(color));
                                                            }}
                                                            color={buttonTextColorHSBA}
                                                            allowAlpha={false}
                                                        />
                                                    </Popover>
                                                </BlockStack>
                                            </BlockStack>
                                            <BlockStack gap="100">
                                                <Text variant="bodySm" as="div" className="form-label-bold-simple">Background color</Text>
                                                <Popover
                                                    active={showButtonBgColorPicker}
                                                    activator={
                                                        <div className="color-input-wrapper">
                                                            <div
                                                                className="color-swatch color-picker-preview"
                                                                style={{
                                                                    backgroundColor: buttonBgColor,
                                                                    border: '1px solid #DFDFDF',
                                                                    borderRadius: '4px',
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => setShowButtonBgColorPicker(true)}
                                                            />
                                                            <input
                                                                className="color-input-type-color color-input-text"
                                                                type="text"
                                                                value={buttonBgColor}
                                                                onChange={(e) => {
                                                                    const newColor = e.target.value;
                                                                    // Allow typing by always updating the input value
                                                                    setButtonBgColor(newColor);
                                                                    // Only update HSBA and apply color if it's a valid hex
                                                                    if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
                                                                        setButtonBgColorHSBA(hexToHSBA(newColor));
                                                                    }
                                                                }}
                                                                placeholder="#141414"
                                                            />
                                                        </div>
                                                    }
                                                    onClose={() => setShowButtonBgColorPicker(false)}
                                                    preferredPosition="below"
                                                    preferredAlignment="left"
                                                    fullWidth={false}
                                                    sectioned={false}
                                                >
                                                    <ColorPicker
                                                        onChange={(color) => {
                                                            setButtonBgColorHSBA(color);
                                                            setButtonBgColor(hsbaToHex(color));
                                                        }}
                                                        color={buttonBgColorHSBA}
                                                        allowAlpha={false}
                                                    />
                                                </Popover>
                                            </BlockStack>
                                            <BlockStack background="bg-surface-secondary" padding="200" borderRadius="200">
                                                <Text variant="bodySm" tone="subdued">
                                                    Hover styles apply a slight opacity to the background automatically.
                                                </Text>
                                            </BlockStack>
                                        </BlockStack>
                                    </Card>
                                </BlockStack>
                            )}
                            {appearanceView === 'mobile' && (
                                <BlockStack gap="400">
                                    <Card>
                                        <BlockStack gap="400">
                                            <BlockStack gap="100">
                                                <Text variant="headingSm" as="h3" className="form-label-bold">Content display</Text>
                                                <Text variant="bodySm" tone="subdued">Control which product elements are displayed.</Text>
                                            </BlockStack>

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
                                        </BlockStack>
                                    </Card>

                                    <Card>
                                        <BlockStack gap="400">
                                            <BlockStack gap="100">
                                                <Text as="h3" variant="headingMd">Bar</Text>
                                                <Text variant="bodySm" tone="subdued">
                                                    Manage layout, spacing, and visual design for the sticky buy container.
                                                </Text>
                                            </BlockStack>

                                            <BlockStack gap="100">
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
                                                {mobileBarWidth === 'contained' && (
                                                    <>
                                                        <BlockStack gap="100">
                                                            <Text variant="bodySm" as="div" className="form-label-bold">Max width</Text>
                                                            <input
                                                                type="hidden"
                                                                name="sticky_max_width_mobile"
                                                                value={mobileMaxWidth}
                                                            />
                                                            <TextField
                                                                labelHidden
                                                                fullWidth
                                                                type="number"
                                                                placeholder="e.g., 600"
                                                                value={mobileMaxWidth}
                                                                onChange={setMobileMaxWidth}
                                                                connectedRight={<Select
                                                                    labelHidden
                                                                    options={[
                                                                        { label: 'px', value: 'px' },
                                                                        { label: '%', value: '%' }
                                                                    ]}
                                                                    onChange={setMobileMaxWidthUnit}
                                                                    value={mobileMaxWidthUnit}
                                                                    name="sticky_max_width_mobile_unit"
                                                                    className="input-styled unit-input"
                                                                />}
                                                                helpText="Leave empty for auto"
                                                            />
                                                        </BlockStack>
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
                                                                className="input-styled input-full-width"
                                                            />
                                                        </BlockStack>
                                                        <BlockStack gap="100">
                                                            <Text variant="bodySm" as="div" className="form-label-bold-simple">Outer spacing</Text>
                                                            <input
                                                                type="hidden"
                                                                name="sticky_outer_spacing_mobile"
                                                                value={mobileOuterSpacing}
                                                            />
                                                            <TextField
                                                                labelHidden
                                                                className='outer-spacing-input-type-number'
                                                                type="number"
                                                                placeholder="e.g., 20"
                                                                value={mobileOuterSpacing}
                                                                onChange={setMobileOuterSpacing}
                                                                connectedRight={<Select
                                                                    labelHidden
                                                                    options={[
                                                                        { label: 'px', value: 'px' },
                                                                        { label: '%', value: '%' }
                                                                    ]}
                                                                    onChange={setMobileOuterSpacingUnit}
                                                                    value={mobileOuterSpacingUnit}
                                                                    name="sticky_outer_spacing_mobile_unit"
                                                                    className="input-styled unit-input"
                                                                />}
                                                            />
                                                            <Text variant="bodySm" tone="subdued">Distance between the bar and the screen edges.</Text>
                                                        </BlockStack>
                                                    </>
                                                )}
                                            </BlockStack>
                                            <BlockStack gap="100">
                                                <Text variant="bodySm" as="div" className="form-label-bold-simple">Inner spacing</Text>
                                                <input
                                                    type="hidden"
                                                    name="sticky_inner_spacing_mobile"
                                                    value={mobileInnerSpacing}
                                                />
                                                <TextField
                                                    labelHidden
                                                    className='inner-spacing-input-type-number'
                                                    type="number"
                                                    placeholder="e.g., 16"
                                                    value={mobileInnerSpacing}
                                                    onChange={setMobileInnerSpacing}
                                                    connectedRight={<Select
                                                        labelHidden
                                                        options={[
                                                            { label: 'px', value: 'px' },
                                                            { label: '%', value: '%' }
                                                        ]}
                                                        onChange={setMobileInnerSpacingUnit}
                                                        value={mobileInnerSpacingUnit}
                                                        name="sticky_inner_spacing_mobile_unit"
                                                        className="input-styled unit-input"
                                                    />}
                                                />
                                                <Text variant="bodySm" tone="subdued">Padding inside the sticky buy</Text>
                                            </BlockStack>
                                        </BlockStack>
                                    </Card>
                                    <Card>
                                        <BlockStack gap="400">
                                            <BlockStack gap="100">
                                                <Text as="h3" variant="headingMd">Content</Text>
                                                <Text variant="bodySm" tone="subdued">
                                                    Customize fonts, colors, and spacing for product content inside the sticky buy.
                                                </Text>
                                            </BlockStack>
                                            <BlockStack gap="100">
                                                <Divider />
                                            </BlockStack>
                                            <BlockStack gap="100">
                                                <Text variant="headingSm" as="h4" className="form-label-bold">Image</Text>
                                                <Text variant="bodySm" as="div" className="form-label-bold-simple">Size</Text>
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
                                                    className="input-styled input-full-width"
                                                />
                                            </BlockStack>
                                        </BlockStack>
                                    </Card>
                                    <Card>
                                        <BlockStack gap="400">
                                            <BlockStack gap="100">
                                                <Text as="h3" variant="headingMd">Button settings</Text>
                                                <Text variant="bodySm" tone="subdued">
                                                    Configure the appearance and behavior of the add to cart button.
                                                </Text>
                                            </BlockStack>
                                            <InlineStack gap="200">
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
                                                <BlockStack gap="100">
                                                    <Text variant="bodySm" as="span" className="form-label-bold-simple">Show cart icon</Text>
                                                    <Text variant="bodySm" tone="subdued">
                                                        Choose whether to display the icon or not
                                                    </Text>
                                                </BlockStack>
                                            </InlineStack>
                                        </BlockStack>
                                    </Card>
                                </BlockStack>
                            )}
                            <Card>
                                <BlockStack gap="200" marginBlockEnd="100">
                                    <BlockStack gap="100">
                                        <Text as="h3" variant="headingMd">Reset appearance settings</Text>
                                        <Text variant="bodySm" tone="subdued">
                                            Revert appearance settings to their original defaults.<br />This action cannot be undone.
                                        </Text>
                                    </BlockStack>

                                    <Button onClick={handleResetClick} >
                                        Reset to defaults
                                    </Button>
                                </BlockStack>
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
                                <div className="css-editor-container">
                                    <div ref={cssEditorRef} className="css-editor-codemirror"></div>
                                </div>
                            </BlockStack>
                        </Card>
                    )}
                </Box>

                <Box className="preview-sidebar">
                    <Card>
                        <div className="section-margin-bottom">
                            <Text as="h3"
                                variant="headingMd"
                                marginBlockEnd="400"
                                className="preview-title">
                                Live preview
                            </Text>
                        </div>
                        <div ref={previewAreaRef} className={`preview-area ${appearanceView === 'mobile' ? 'preview-area-mobile' : ''}`}>
                            <div
                                className={getPositioningClasses()}
                                style={{
                                    borderRadius: borderRadius + 'px' || '12px',
                                    border: `1px solid ${borderColor}`,
                                    backgroundColor: backgroundColor,
                                    padding: appearanceView === 'mobile' ?
                                        `${mobileInnerSpacing}px` :
                                        `${innerSpacing}${innerSpacingUnit}`,
                                    width: appearanceView === 'mobile' ?
                                        (mobileBarWidth === 'full' ? '100%' : '100%') :
                                        (barWidth === 'full' ? 'calc(100% - 40px)' : 'calc(100% - 40px)'),
                                    maxWidth: appearanceView === 'mobile' ?
                                        (mobileBarWidth === 'contained' ? (mobileMaxWidth === '' ? '600px' : `${mobileMaxWidth}${mobileMaxWidthUnit}`) : 'none') :
                                        (barWidth === 'contained' ? (maxWidth === '' ? '600px' : `${maxWidth}${maxWidthUnit}`) : 'none'),
                                    margin: appearanceView === 'mobile' ?
                                        (mobileOuterSpacing === '' ? 'unset' : `${mobileOuterSpacing}${mobileOuterSpacingUnit}`) :
                                        (outerSpacing === '' ? 'unset' : `${outerSpacing}${outerSpacingUnit}`),
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                <div className="sy-sticky-add-to-cart-preview__content">

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
                                </div>
                                <div className="sy-sticky-add-to-cart-preview__actions">
                                    {appearanceView === 'mobile' ?
                                        (mobileQuantityDisplay && (
                                            <div className='sy-quantity-wrapper'
                                                style={{
                                                    border: `1px solid ${quantityBorderColor}`,
                                                }}
                                            >
                                                <button className="sy-sticky-add-to-cart-preview__quantity-button"
                                                    onClick={handleQuantityDecrease}
                                                    style={{
                                                        color: quantityColor
                                                    }}>
                                                    −
                                                </button>
                                                <span
                                                    className="sy-sticky-add-to-cart-preview__quantity-text"
                                                    style={{
                                                        color: quantityColor
                                                    }}
                                                >
                                                    {previewQuantity}
                                                </span>
                                                <button
                                                    className="sy-sticky-add-to-cart-preview__quantity-button"
                                                    onClick={handleQuantityIncrease}
                                                    style={{
                                                        color: quantityColor
                                                    }}>
                                                    +
                                                </button>
                                            </div>
                                        )) :
                                        (quantityDisplay && (
                                            <div className='sy-quantity-wrapper'
                                                style={{
                                                    border: `1px solid ${quantityBorderColor}`,
                                                }}
                                            >
                                                <button className="sy-sticky-add-to-cart-preview__quantity-button"
                                                    onClick={handleQuantityDecrease}
                                                    style={{
                                                        color: quantityColor
                                                    }}>
                                                    −
                                                </button>
                                                <span className="sy-sticky-add-to-cart-preview__quantity-text"
                                                    style={{
                                                        color: quantityColor
                                                    }}>
                                                    {previewQuantity}
                                                </span>
                                                <button className="sy-sticky-add-to-cart-preview__quantity-button"
                                                    onClick={handleQuantityIncrease}
                                                    style={{
                                                        color: quantityColor
                                                    }}>
                                                    +
                                                </button>
                                            </div>
                                        ))
                                    }
                                    <button className="sy-sticky-add-to-cart-preview__button" style={{
                                        color: buttonTextColor,
                                        backgroundColor: buttonBgColor,
                                    }}>
                                        {appearanceView === 'mobile' ?
                                            (enableMobileCartIcon && (
                                                <Icon className="sy-sticky-add-to-cart-preview__cart-icon" source={CartIcon} color="base" />
                                            )) :
                                            (enableCartIcon && (
                                                <Icon className="sy-sticky-add-to-cart-preview__cart-icon" source={CartIcon} color="base" />
                                            ))
                                        }
                                        {buttonText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Box>
            </InlineGrid>

            {
                showResetModal && (
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
                )
            }

            {/* Shopify Save Bar Web Component */}
            <ui-save-bar id="shopify-save-bar">
                <button variant="primary" onClick={handleSave}>Save</button>
                <button onClick={handleDiscard}>Discard</button>
            </ui-save-bar>
        </Page >
    );
}
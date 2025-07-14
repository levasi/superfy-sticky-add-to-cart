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
    ColorPicker
} from '@shopify/polaris';
import {
    ArrowLeftIcon,
    DesktopIcon,
    MobileIcon
} from '@shopify/polaris-icons';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLoaderData } from '@remix-run/react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { getSetting } from "../models/settings.server";

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
    const barWidthSetting = await getSetting("sticky_bar_width");
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
    const quantityColorSetting = await getSetting("sticky_quantity_color");
    const quantityBorderColorSetting = await getSetting("sticky_quantity_border_color");
    const buttonBehaviorSetting = await getSetting("sticky_button_behavior");
    const buttonTextSetting = await getSetting("sticky_button_text");
    const enableCartIconSetting = await getSetting("sticky_enable_cart_icon");
    const buttonTextColorSetting = await getSetting("sticky_button_text_color");
    const buttonBgColorSetting = await getSetting("sticky_button_bg_color");
    const customCssSetting = await getSetting("sticky_custom_css");
    return json({
        sticky_bar_color: barColorSetting?.value || '#fff',
        sticky_visibility: visibilitySetting?.value || 'all',
        sticky_trigger: triggerSetting?.value || 'after-summary',
        sticky_content_display_image: imageSetting?.value === 'true',
        sticky_content_display_title: titleSetting?.value === 'true',
        sticky_content_display_price: priceSetting?.value === 'true',
        sticky_content_display_quantity: quantitySetting?.value === 'true',
        sticky_bar_width: barWidthSetting?.value || 'contained',
        sticky_max_width: maxWidthSetting?.value || '',
        sticky_max_width_unit: maxWidthUnitSetting?.value || 'px',
        sticky_alignment: alignmentSetting?.value || 'left',
        sticky_outer_spacing: outerSpacingSetting?.value || '',
        sticky_outer_spacing_unit: outerSpacingUnitSetting?.value || 'px',
        sticky_inner_spacing: innerSpacingSetting?.value || '16',
        sticky_inner_spacing_unit: innerSpacingUnitSetting?.value || 'px',
        sticky_background_color: backgroundColorSetting?.value || '#FFFFFF',
        sticky_border_color: borderColorSetting?.value || '#000000',
        sticky_product_name_color: productNameColorSetting?.value || '#141414',
        sticky_image_size: imageSizeSetting?.value || 'medium',
        sticky_quantity_color: quantityColorSetting?.value || '#141414',
        sticky_quantity_border_color: quantityBorderColorSetting?.value || '#DFDFDF',
        sticky_button_behavior: buttonBehaviorSetting?.value || 'add',
        sticky_button_text: buttonTextSetting?.value || 'Add to cart',
        sticky_enable_cart_icon: enableCartIconSetting?.value === 'true',
        sticky_button_text_color: buttonTextColorSetting?.value || '#FFFFFF',
        sticky_button_bg_color: buttonBgColorSetting?.value || '#141414',
        sticky_custom_css: customCssSetting?.value || '<div>Hello World</div>\n<div>Hello World</div>\n<div>Hello World</div>\n<div>Hello World</div>\n<div>Hello World</div>'
    });
};

export const action = async ({ request }) => {
    await authenticate.admin(request);
    const formData = await request.formData();
    const { upsertSetting } = await import("../models/settings.server");
    // Save all settings
    await upsertSetting("sticky_bar_color", formData.get("sticky_bar_color") || "#fff");
    await upsertSetting("sticky_visibility", formData.get("sticky_visibility") || "all");
    await upsertSetting("sticky_trigger", formData.get("sticky_trigger") || "after-summary");
    await upsertSetting("sticky_content_display_image", formData.get("sticky_content_display_image") === 'on' ? 'true' : 'false');
    await upsertSetting("sticky_content_display_title", formData.get("sticky_content_display_title") === 'on' ? 'true' : 'false');
    await upsertSetting("sticky_content_display_price", formData.get("sticky_content_display_price") === 'on' ? 'true' : 'false');
    await upsertSetting("sticky_content_display_quantity", formData.get("sticky_content_display_quantity") === 'on' ? 'true' : 'false');
    await upsertSetting("sticky_bar_width", formData.get("sticky_bar_width") || "contained");
    await upsertSetting("sticky_max_width", formData.get("sticky_max_width") || "");
    await upsertSetting("sticky_max_width_unit", formData.get("sticky_max_width_unit") || "px");
    await upsertSetting("sticky_alignment", formData.get("sticky_alignment") || "left");
    await upsertSetting("sticky_outer_spacing", formData.get("sticky_outer_spacing") || "");
    await upsertSetting("sticky_outer_spacing_unit", formData.get("sticky_outer_spacing_unit") || "px");
    await upsertSetting("sticky_inner_spacing", formData.get("sticky_inner_spacing") || "16");
    await upsertSetting("sticky_inner_spacing_unit", formData.get("sticky_inner_spacing_unit") || "px");
    await upsertSetting("sticky_background_color", formData.get("sticky_background_color") || "#FFFFFF");
    await upsertSetting("sticky_border_color", formData.get("sticky_border_color") || "#000000");
    await upsertSetting("sticky_product_name_color", formData.get("sticky_product_name_color") || "#141414");
    await upsertSetting("sticky_image_size", formData.get("sticky_image_size") || "medium");
    await upsertSetting("sticky_quantity_color", formData.get("sticky_quantity_color") || "#141414");
    await upsertSetting("sticky_quantity_border_color", formData.get("sticky_quantity_border_color") || "#DFDFDF");
    await upsertSetting("sticky_button_behavior", formData.get("sticky_button_behavior") || "add");
    await upsertSetting("sticky_button_text", formData.get("sticky_button_text") || "Add to cart");
    await upsertSetting("sticky_enable_cart_icon", formData.get("sticky_enable_cart_icon") === 'on' ? 'true' : 'false');
    await upsertSetting("sticky_button_text_color", formData.get("sticky_button_text_color") || "#FFFFFF");
    await upsertSetting("sticky_button_bg_color", formData.get("sticky_button_bg_color") || "#141414");
    await upsertSetting("sticky_custom_css", formData.get("sticky_custom_css") || '');
    return Response.json({ ok: true });
};

export default function Customize() {
    const savedSettings = useLoaderData();

    const [selectedTab, setSelectedTab] = useState(1);
    const [editingViewTab, setEditingViewTab] = useState(1);
    const [visibility, setVisibility] = useState(savedSettings.sticky_visibility);
    const [trigger, setTrigger] = useState(savedSettings.sticky_trigger);
    const [imageDisplay, setImageDisplay] = useState(savedSettings.sticky_content_display_image);
    const [titleDisplay, setTitleDisplay] = useState(savedSettings.sticky_content_display_title);
    const [priceDisplay, setPriceDisplay] = useState(savedSettings.sticky_content_display_price);
    const [quantityDisplay, setQuantityDisplay] = useState(savedSettings.sticky_content_display_quantity);
    const [canPublish] = useState(false); // Set to true if there are unpublished changes
    const [appearanceView, setAppearanceView] = useState('desktop');
    const [barWidth, setBarWidth] = useState(savedSettings.sticky_bar_width);
    const [maxWidth, setMaxWidth] = useState(savedSettings.sticky_max_width);
    const [maxWidthUnit, setMaxWidthUnit] = useState(savedSettings.sticky_max_width_unit);
    const [alignment, setAlignment] = useState(savedSettings.sticky_alignment);
    const [outerSpacing, setOuterSpacing] = useState(savedSettings.sticky_outer_spacing);
    const [outerSpacingUnit, setOuterSpacingUnit] = useState(savedSettings.sticky_outer_spacing_unit);
    const [innerSpacing, setInnerSpacing] = useState(savedSettings.sticky_inner_spacing);
    const [innerSpacingUnit, setInnerSpacingUnit] = useState(savedSettings.sticky_inner_spacing_unit);
    const [backgroundColor, setBackgroundColor] = useState(savedSettings.sticky_background_color);
    const [borderColor, setBorderColor] = useState(savedSettings.sticky_border_color);
    const [productNameColor, setProductNameColor] = useState(savedSettings.sticky_product_name_color);
    const [imageSize, setImageSize] = useState(savedSettings.sticky_image_size);
    const [quantityColor, setQuantityColor] = useState(savedSettings.sticky_quantity_color);
    const [quantityBorderColor, setQuantityBorderColor] = useState(savedSettings.sticky_quantity_border_color);
    const [buttonBehavior, setButtonBehavior] = useState(savedSettings.sticky_button_behavior);
    const [buttonText, setButtonText] = useState(savedSettings.sticky_button_text);
    const [enableCartIcon, setEnableCartIcon] = useState(savedSettings.sticky_enable_cart_icon);
    const [buttonTextColor, setButtonTextColor] = useState(savedSettings.sticky_button_text_color);
    const [buttonBgColor, setButtonBgColor] = useState(savedSettings.sticky_button_bg_color);
    const [customCss, setCustomCss] = useState(savedSettings.sticky_custom_css);

    const handleTabChange = useCallback((selectedTabIndex) => setSelectedTab(selectedTabIndex), []);
    const handleEditingViewTabChange = useCallback((selectedIndex) => setEditingViewTab(selectedIndex), []);
    const shopify = useAppBridge();

    const fetcher = useFetcher();

    useEffect(() => {
        if (fetcher.data?.ok) {
            shopify.toast.show("Sticky bar settings saved!");
        }
    }, [fetcher.data, shopify]);

    const tabs = [
        {
            id: 'general',
            content: 'General',
            panelID: 'general-content',
        },
        {
            id: 'appearance',
            content: 'Appearance',
            panelID: 'appearance-content',
        },
        {
            id: 'advanced',
            content: 'Advanced',
            panelID: 'advanced-content',
        },
    ];

    const editingViewTabs = [
        {
            id: 'desktop',
            content: 'Desktop',
            panelID: 'desktop',
        },
        {
            id: 'mobile',
            content: 'Mobile',
            panelID: 'mobile',
        },
    ];

    const navigate = useNavigate();

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handlePublish = useCallback(() => {
        // Implement your publish logic here
    }, []);

    const handleSetMaxWidth = useCallback((e) => {
        setMaxWidth(e)
    })

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

    function handleResetAppearance() {
        setBarWidth('full');
        setMaxWidth('');
        setMaxWidthUnit('px');
        setAlignment('left');
        setOuterSpacing('');
        setOuterSpacingUnit('px');
        setInnerSpacing('');
        setInnerSpacingUnit('px');
        setBackgroundColor('#FFFFFF');
        setBorderColor('#000000');
        setProductNameColor('#141414');
        setImageSize('medium');
        setQuantityColor('#141414');
        setQuantityBorderColor('#DFDFDF');
        setButtonBehavior('add');
        setButtonText('Add to cart');
        setEnableCartIcon(true);
        setButtonTextColor('#FFFFFF');
        setButtonBgColor('#141414');
        setCustomCss('<div>Hello World</div>\n<div>Hello World</div>\n<div>Hello World</div>\n<div>Hello World</div>\n<div>Hello World</div>');
    }

    return (
        <Page fullWidth>
            {/* Header Section */}
            <Box paddingBlockEnd="400">
                <InlineStack align="space-between" gap="400">
                    <InlineStack gap="200" blockAlign="center">
                        <Button icon={ArrowLeftIcon} variant="tertiary" onClick={handleBack} />
                        <span style={{ fontWeight: 600, fontSize: 20 }}>Customize</span>
                        <Badge tone="subdued">No published</Badge>
                    </InlineStack>
                    <Button disabled={!canPublish} onClick={handlePublish}>
                        Publish
                    </Button>
                </InlineStack>
            </Box>
            <InlineGrid columns={['oneThird', 'twoThirds']} alignItems="start" gap="400">
                <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
                    <div style={{ marginBottom: '8px' }}></div>
                    {selectedTab === 0 && (
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
                                        <Box style={{ margin: '16px 0' }}>
                                            <Divider />
                                        </Box>
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
                                <fetcher.Form method="post" data-save-bar>
                                    <BlockStack gap="400">
                                        <Card>
                                            <Box style={{ marginBottom: '16px' }}>
                                                <Text variant="headingSm" as="h3" style={{ marginBottom: 8 }}>Content display</Text>
                                            </Box>
                                            <BlockStack gap="0">
                                                <input
                                                    type="checkbox"
                                                    name="sticky_content_display_image"
                                                    value="on"
                                                    checked={imageDisplay}
                                                    onChange={e => setImageDisplay(e.target.checked)}
                                                    style={{ width: 20, height: 20 }}
                                                />
                                                <label htmlFor="sticky_content_display_image">Show image</label>

                                                <input
                                                    type="checkbox"
                                                    id="sticky_content_display_title"
                                                    name="sticky_content_display_title"
                                                    value="on"
                                                    checked={titleDisplay}
                                                    onChange={e => setTitleDisplay(e.target.checked)}
                                                    style={{ width: 20, height: 20 }}
                                                />
                                                <label htmlFor="sticky_content_display_title">Show title</label>

                                                <input
                                                    type="checkbox"
                                                    id="sticky_content_display_price"
                                                    name="sticky_content_display_price"
                                                    value="on"
                                                    checked={priceDisplay}
                                                    onChange={e => setPriceDisplay(e.target.checked)}
                                                    style={{ width: 20, height: 20 }}
                                                />
                                                <label htmlFor="sticky_content_display_price">Show price</label>

                                                <input
                                                    type="checkbox"
                                                    id="sticky_content_display_quantity"
                                                    name="sticky_content_display_quantity"
                                                    value="on"
                                                    checked={quantityDisplay}
                                                    onChange={e => setQuantityDisplay(e.target.checked)}
                                                    style={{ width: 20, height: 20 }}
                                                />
                                                <label htmlFor="sticky_content_display_quantity">Show quantity selector</label>
                                            </BlockStack>
                                        </Card>
                                        <Card>
                                            <BlockStack gap="100">
                                                <Text as="h3" variant="headingMd" style={{ marginBottom: 4 }}>Bar</Text>
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
                                                <Box style={{ marginBottom: '8px' }}>
                                                    <BlockStack gap="100">
                                                        <Text variant="bodySm" as="div" style={{ fontWeight: 500, marginTop: 16, marginBottom: 4 }}>Max width</Text>
                                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                                                            <TextField
                                                                type="number"
                                                                placeholder="e.g., 600"
                                                                value={maxWidth}
                                                                onChange={handleSetMaxWidth}
                                                                name="sticky_max_width"
                                                                style={{ flex: 1, padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                            />
                                                            <Select
                                                                options={[
                                                                    {
                                                                        label: 'px',
                                                                        value: 'px'
                                                                    },
                                                                    {
                                                                        label: '%',
                                                                        value: '%'
                                                                    }
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
                                                                {
                                                                    label: 'Left',
                                                                    value: 'left'
                                                                },
                                                                {
                                                                    label: 'Center',
                                                                    value: 'center'
                                                                },
                                                                {
                                                                    label: 'Right',
                                                                    value: 'right'
                                                                }
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
                                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                            <input
                                                                type="number"
                                                                value={outerSpacing}
                                                                placeholder="e.g., 600"
                                                                onChange={e => setOuterSpacing(e.target.value)}
                                                                name="sticky_outer_spacing"
                                                                style={{ flex: 1, padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                            />
                                                            <select
                                                                value={outerSpacingUnit}
                                                                onChange={e => setOuterSpacingUnit(e.target.value)}
                                                                name="sticky_outer_spacing_unit"
                                                                style={{ padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                            >
                                                                <option value="px">px</option>
                                                                <option value="%">%</option>
                                                            </select>
                                                        </div>
                                                        <Text variant="bodySm" tone="subdued">Distance between the bar and the screen edges.</Text>
                                                    </BlockStack>
                                                </Box>
                                                <BlockStack gap="100">
                                                    <Text variant="bodySm" as="div" style={{ fontWeight: 500, marginBottom: 4 }}>Inner spacing</Text>
                                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                                                        <input
                                                            type="number"
                                                            value={innerSpacing}
                                                            onChange={e => setInnerSpacing(e.target.value)}
                                                            name="sticky_inner_spacing"
                                                            style={{ flex: 1, padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                        />
                                                        <select
                                                            value={innerSpacingUnit}
                                                            onChange={e => setInnerSpacingUnit(e.target.value)}
                                                            name="sticky_inner_spacing_unit"
                                                            style={{ padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                        >
                                                            <option value="px">px</option>
                                                            <option value="%">%</option>
                                                        </select>
                                                    </div>
                                                    <Text variant="bodySm" tone="subdued">Padding inside the sticky bar</Text>
                                                </BlockStack>
                                            </Box>
                                            <BlockStack gap="400">
                                                <BlockStack gap="100">
                                                    <Text variant="bodySm" as="div" style={{ fontWeight: 500 }}>Background color</Text>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <input
                                                            type="color"
                                                            value={backgroundColor}
                                                            onChange={e => setBackgroundColor(e.target.value)}
                                                            name="sticky_background_color"
                                                            style={{ width: 32, height: 32, border: '1px solid #DFDFDF', borderRadius: 8 }}
                                                        />
                                                        <input
                                                            type="text"
                                                            value={backgroundColor}
                                                            onChange={e => setBackgroundColor(e.target.value)}
                                                            name="sticky_background_color"
                                                            style={{ flex: 1, padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                        />
                                                    </div>
                                                </BlockStack>
                                                <BlockStack gap="100">
                                                    <Text variant="bodySm" as="div" style={{ fontWeight: 500 }}>Border color</Text>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <input
                                                            type="color"
                                                            value={borderColor}
                                                            onChange={e => setBorderColor(e.target.value)}
                                                            name="sticky_border_color"
                                                            style={{ width: 32, height: 32, border: '1px solid #DFDFDF', borderRadius: 8 }}
                                                        />
                                                        <input
                                                            type="text"
                                                            value={borderColor}
                                                            onChange={e => setBorderColor(e.target.value)}
                                                            name="sticky_border_color"
                                                            style={{ flex: 1, padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                        />
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
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                                    <input
                                                        type="color"
                                                        value={productNameColor}
                                                        onChange={e => setProductNameColor(e.target.value)}
                                                        name="sticky_product_name_color"
                                                        style={{ width: 32, height: 32, border: '1px solid #DFDFDF', borderRadius: 8 }}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={productNameColor}
                                                        onChange={e => setProductNameColor(e.target.value)}
                                                        name="sticky_product_name_color"
                                                        style={{ flex: 1, padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
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
                                            <select
                                                value={imageSize}
                                                onChange={e => setImageSize(e.target.value)}
                                                name="sticky_image_size"
                                                style={{ width: '100%', padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                            >
                                                <option value="small">Small</option>
                                                <option value="medium">Medium</option>
                                                <option value="large">Large</option>
                                            </select>
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
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <input
                                                        type="color"
                                                        value={quantityColor}
                                                        onChange={e => setQuantityColor(e.target.value)}
                                                        name="sticky_quantity_color"
                                                        style={{ width: 32, height: 32, s: '1px solid #DFDFDF', borderRadius: 8 }}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={quantityColor}
                                                        onChange={e => setQuantityColor(e.target.value)}
                                                        name="sticky_quantity_color"
                                                        style={{ flex: 1, padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                    />
                                                </div>
                                            </Box>
                                            <Box style={{ marginBottom: 4 }}>
                                                <Text variant="bodySm" as="div" style={{ fontWeight: 500, marginBottom: 4 }}>Border color</Text>
                                            </Box>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <input
                                                    type="color"
                                                    value={quantityBorderColor}
                                                    onChange={e => setQuantityBorderColor(e.target.value)}
                                                    name="sticky_quantity_border_color"
                                                    style={{ width: 32, height: 32, border: '1px solid #DFDFDF', borderRadius: 8 }}
                                                />
                                                <input
                                                    type="text"
                                                    value={quantityBorderColor}
                                                    onChange={e => setQuantityBorderColor(e.target.value)}
                                                    name="sticky_quantity_border_color"
                                                    style={{ flex: 1, padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
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
                                                    <select
                                                        value={buttonBehavior}
                                                        onChange={e => setButtonBehavior(e.target.value)}
                                                        name="sticky_button_behavior"
                                                        style={{ width: '100%', padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                    >
                                                        <option value="add">Add to cart</option>
                                                        <option value="buy">Buy now</option>
                                                        <option value="custom">Custom action</option>
                                                    </select>
                                                </Box>
                                                <Box>
                                                    <Text variant="bodySm" as="div" style={{ fontWeight: 500, marginBottom: 4 }}>Text</Text>
                                                    <div style={{ position: 'relative', marginBottom: 4 }}>
                                                        <input
                                                            type="text"
                                                            value={buttonText}
                                                            maxLength={40}
                                                            onChange={e => setButtonText(e.target.value)}
                                                            name="sticky_button_text"
                                                            style={{ width: '100%', padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                        />
                                                        <span style={{ position: 'absolute', right: 12, top: 8, color: '#6D7175', fontSize: 14 }}>{buttonText.length}/40</span>
                                                    </div>
                                                    <Text variant="bodySm" tone="subdued">
                                                        To add the price inline, use {'{price}'} token
                                                    </Text>
                                                </Box>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                    <InlineStack wrap={false} gap="150">
                                                        <input
                                                            type="checkbox"
                                                            checked={enableCartIcon}
                                                            onChange={e => setEnableCartIcon(e.target.checked)}
                                                            name="sticky_enable_cart_icon"
                                                            style={{ width: 20, height: 20 }}
                                                        />
                                                        <Box>
                                                            <Text variant="bodySm" as="span" style={{ fontWeight: 500 }}>Show cart icon</Text>
                                                            <Text variant="bodySm" tone="subdued" style={{ marginLeft: 28 }}>
                                                                Choose whether to display the icon or not
                                                            </Text>
                                                        </Box>
                                                    </InlineStack>
                                                </div>
                                                <Box>
                                                    <BlockStack gap="100">
                                                        <Text variant="bodySm" as="div" style={{ fontWeight: 500, marginBottom: 4 }}>Text color</Text>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                            <input
                                                                type="color"
                                                                value={buttonTextColor}
                                                                onChange={e => setButtonTextColor(e.target.value)}
                                                                name="sticky_button_text_color"
                                                                style={{ width: 32, height: 32, border: '1px solid #DFDFDF', borderRadius: 8 }}
                                                            />
                                                            <input
                                                                type="text"
                                                                value={buttonTextColor}
                                                                onChange={e => setButtonTextColor(e.target.value)}
                                                                name="sticky_button_text_color"
                                                                style={{ flex: 1, padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                            />
                                                        </div>
                                                    </BlockStack>
                                                </Box>
                                                <Box>
                                                    <BlockStack gap="100">
                                                        <Text variant="bodySm" as="div" style={{ fontWeight: 500 }}>Background color</Text>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                            <input
                                                                type="color"
                                                                value={buttonBgColor}
                                                                onChange={e => setButtonBgColor(e.target.value)}
                                                                name="sticky_button_bg_color"
                                                                style={{ width: 32, height: 32, border: '1px solid #DFDFDF', borderRadius: 8 }}
                                                            />
                                                            <input
                                                                type="text"
                                                                value={buttonBgColor}
                                                                onChange={e => setButtonBgColor(e.target.value)}
                                                                name="sticky_button_bg_color"
                                                                style={{ flex: 1, padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
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
                                        <Button submit primary>Save</Button>
                                    </BlockStack>
                                </fetcher.Form>
                            )}
                            {appearanceView === 'mobile' && (
                                <div className="mobile-view">
                                    <Card>
                                        mobile soon
                                    </Card>
                                </div>
                            )}
                            <Card>
                                <Text as="h3" variant="headingMd">Reset appearance settings</Text>
                                <Text variant="bodySm" tone="subdued">
                                    Revert appearance settings to their original defaults.<br />This action cannot be undone.
                                </Text>
                                <Button onClick={handleResetAppearance} >
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
                    <Card title="Live preview">
                        <div style={{
                            minHeight: 300,
                            position: 'relative'
                        }}>
                            <div
                                className='sy-sticky-add-to-cart-preview'
                                style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    ...alignmentStyles,
                                    borderRadius: 4,
                                    border: '1px solid' + borderColor,
                                    backgroundColor: backgroundColor,
                                    padding: innerSpacing + innerSpacingUnit,
                                    width: barWidth === 'full' ? '100%' : 'auto',
                                    maxWidth: maxWidth === '' ? 'none' : `${maxWidth}${maxWidthUnit}`,
                                    margin: outerSpacing === '' ? 'unset' : `${outerSpacing}${outerSpacingUnit}`,
                                    flexWrap: 'nowrap'
                                }}>

                                <InlineStack gap="400" blockAlign="center" style={{ whiteSpace: 'nowrap' }}>
                                    {imageDisplay && (
                                        <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-2_large.png" alt="Product" style={{ width: 60, height: 60, objectFit: 'cover', border: '3px solid #9B51E0', borderRadius: 8, boxSizing: 'border-box' }} />
                                    )}
                                    <BlockStack gap="100">
                                        {titleDisplay && <p style={{ color: productNameColor, fontWeight: 700 }}>Taupe One Loafers</p>}
                                        {priceDisplay && (
                                            <p>
                                                <s>$296</s> $189
                                            </p>
                                        )}
                                    </BlockStack>
                                    {quantityDisplay && (
                                        <div className='sy-quantity-wrapper'
                                            style={{
                                                display: 'flex',
                                                flexWrap: 'nowrap',
                                                alignItems: 'center',
                                                color: quantityColor,
                                                border: `1px solid ${quantityBorderColor}`,
                                                borderRadius: 8
                                            }}
                                        >
                                            <Button variant="tertiary">
                                                <span style={{
                                                    color: quantityColor
                                                }}>
                                                    -
                                                </span>
                                            </Button>
                                            <Text>
                                                <span style={{
                                                    color: quantityColor
                                                }}>
                                                    1
                                                </span>
                                            </Text>
                                            <Button variant="tertiary">
                                                <span style={{
                                                    color: quantityColor
                                                }}>
                                                    -
                                                </span>
                                            </Button>
                                        </div>
                                    )}
                                    <button style={{
                                        color: buttonTextColor,
                                        backgroundColor: buttonBgColor,
                                        borderRadius: 8,
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}>
                                        {buttonText}
                                    </button>
                                </InlineStack>
                            </div>
                        </div>
                    </Card>
                </div>
            </InlineGrid >


        </Page >
    );
}
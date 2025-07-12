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
import { useState, useCallback } from 'react';
import { useNavigate } from '@remix-run/react';
import { useAppBridge } from '@shopify/app-bridge-react';

export default function Customize() {
    const [selectedTab, setSelectedTab] = useState(1);
    const [editingViewTab, setEditingViewTab] = useState(1);
    const [visibility, setVisibility] = useState('all');
    const [trigger, setTrigger] = useState('after-summary');
    const [contentDisplay, setContentDisplay] = useState({
        image: true,
        title: true,
        price: true,
        quantity: true,
    });
    const [canPublish] = useState(false); // Set to true if there are unpublished changes
    const [appearanceView, setAppearanceView] = useState('desktop');
    const [barWidth, setBarWidth] = useState('contained');
    const [maxWidth, setMaxWidth] = useState('');
    const [maxWidthUnit, setMaxWidthUnit] = useState('px');
    const [alignment, setAlignment] = useState('left');
    const [outerSpacing, setOuterSpacing] = useState('');
    const [outerSpacingUnit, setOuterSpacingUnit] = useState('px');
    const [innerSpacing, setInnerSpacing] = useState('16');
    const [innerSpacingUnit, setInnerSpacingUnit] = useState('px');
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
    const [borderColor, setBorderColor] = useState('#000000');
    const [productNameColor, setProductNameColor] = useState('#141414');
    const [imageSize, setImageSize] = useState('medium');
    const [quantityColor, setQuantityColor] = useState('#141414');
    const [quantityBorderColor, setQuantityBorderColor] = useState('#DFDFDF');
    const [buttonBehavior, setButtonBehavior] = useState('add');
    const [buttonText, setButtonText] = useState('Add to cart');
    const [enableCartIcon, setEnableCartIcon] = useState(true);
    const [buttonTextColor, setButtonTextColor] = useState('#FFFFFF');
    const [buttonBgColor, setButtonBgColor] = useState('#141414');
    const [customCss, setCustomCss] = useState('<div>Hello World</div>\n<div>Hello World</div>\n<div>Hello World</div>\n<div>Hello World</div>\n<div>Hello World</div>');

    const handleTabChange = useCallback((selectedTabIndex) => setSelectedTab(selectedTabIndex), []);
    const handleEditingViewTabChange = useCallback((selectedIndex) => setEditingViewTab(selectedIndex), []);

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
    const app = useAppBridge();

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
                            {appearanceView === 'desktop' &&
                                <div className="desktop-view">
                                    <BlockStack gap="400">
                                        <Card>
                                            <Box style={{ marginBottom: '16px' }}>
                                                <Text variant="headingSm" as="h3" style={{ marginBottom: 8 }}>Content display</Text>
                                            </Box>
                                            <BlockStack gap="0">
                                                <Checkbox
                                                    label="Show image"
                                                    checked={contentDisplay.image}
                                                    onChange={val => setContentDisplay(cd => ({ ...cd, image: val }))}
                                                />
                                                <Checkbox
                                                    label="Show title"
                                                    checked={contentDisplay.title}
                                                    onChange={val => setContentDisplay(cd => ({ ...cd, title: val }))}
                                                />
                                                <Checkbox
                                                    label="Show price"
                                                    checked={contentDisplay.price}
                                                    onChange={val => setContentDisplay(cd => ({ ...cd, price: val }))}
                                                />
                                                <Checkbox
                                                    label="Show quantity selector"
                                                    checked={contentDisplay.quantity}
                                                    onChange={val => setContentDisplay(cd => ({ ...cd, quantity: val }))}
                                                />
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
                                                                style={{ flex: 1, padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                            />
                                                            <select
                                                                value={outerSpacingUnit}
                                                                onChange={e => setOuterSpacingUnit(e.target.value)}
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
                                                            style={{ flex: 1, padding: 8, border: '1px solid #DFDFDF', borderRadius: 8, fontSize: 16 }}
                                                        />
                                                        <select
                                                            value={innerSpacingUnit}
                                                            onChange={e => setInnerSpacingUnit(e.target.value)}
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
                                                            style={{ width: 32, height: 32, border: '1px solid #DFDFDF', borderRadius: 8 }}
                                                        />
                                                        <input
                                                            type="text"
                                                            value={backgroundColor}
                                                            onChange={e => setBackgroundColor(e.target.value)}
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
                                                            style={{ width: 32, height: 32, border: '1px solid #DFDFDF', borderRadius: 8 }}
                                                        />
                                                        <input
                                                            type="text"
                                                            value={borderColor}
                                                            onChange={e => setBorderColor(e.target.value)}
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
                                                        style={{ width: 32, height: 32, border: '1px solid #DFDFDF', borderRadius: 8 }}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={productNameColor}
                                                        onChange={e => setProductNameColor(e.target.value)}
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
                                                        style={{ width: 32, height: 32, s: '1px solid #DFDFDF', borderRadius: 8 }}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={quantityColor}
                                                        onChange={e => setQuantityColor(e.target.value)}
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
                                                    style={{ width: 32, height: 32, border: '1px solid #DFDFDF', borderRadius: 8 }}
                                                />
                                                <input
                                                    type="text"
                                                    value={quantityBorderColor}
                                                    onChange={e => setQuantityBorderColor(e.target.value)}
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
                                                                style={{ width: 32, height: 32, border: '1px solid #DFDFDF', borderRadius: 8 }}
                                                            />
                                                            <input
                                                                type="text"
                                                                value={buttonTextColor}
                                                                onChange={e => setButtonTextColor(e.target.value)}
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
                                                                style={{ width: 32, height: 32, border: '1px solid #DFDFDF', borderRadius: 8 }}
                                                            />
                                                            <input
                                                                type="text"
                                                                value={buttonBgColor}
                                                                onChange={e => setButtonBgColor(e.target.value)}
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
                                        <Card>
                                            <Box padding="400">
                                                <Text as="h3" variant="headingMd">Custom CSS</Text>
                                                <Text variant="bodySm" tone="subdued">
                                                    Add your own CSS to override or extend the default bar styling.
                                                </Text>
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
                                            </Box>
                                        </Card>
                                    </BlockStack>
                                </div>
                            }
                            {appearanceView === 'mobile' &&
                                <div className="mobile-view">
                                    <Card>
                                        mobile soon
                                    </Card>
                                </div>
                            }
                            <Card>
                                <Box padding="400">
                                    <Text as="h3" variant="headingMd">Reset appearance settings</Text>
                                    <Text variant="bodySm" tone="subdued">
                                        Revert appearance settings to their original defaults.<br />This action cannot be undone.
                                    </Text>
                                    <Button onClick={handleResetAppearance} >
                                        Reset to defaults
                                    </Button>
                                </Box>
                            </Card>

                        </BlockStack>
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

                                <InlineStack gap="400" style={{ whiteSpace: 'nowrap' }}>
                                    {contentDisplay.image && (
                                        <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-2_large.png" alt="Product" style={{ width: 60, height: 60, objectFit: 'cover', border: '3px solid #9B51E0', borderRadius: 8, boxSizing: 'border-box' }} />
                                    )}

                                    <BlockStack gap="100">
                                        {contentDisplay.title && <Text variant="bodyMd">Taupe One Loafers</Text>}
                                        {contentDisplay.price && (
                                            <Text variant="bodySm" tone="subdued">
                                                <s>$296</s> $189
                                            </Text>
                                        )}
                                    </BlockStack>
                                    {contentDisplay.quantity && (
                                        <InlineStack gap="100" blockAlign="center" wrap={false}>
                                            <Button variant="tertiary">-</Button>
                                            <Text>1</Text>
                                            <Button variant="tertiary">+</Button>
                                        </InlineStack>
                                    )}
                                    <Button primary>Add to cart</Button>
                                </InlineStack>
                            </div>
                        </div>
                    </Card>
                </div>
            </InlineGrid >
        </Page >
    );
}

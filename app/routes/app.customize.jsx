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
    InlineGrid
} from '@shopify/polaris';
import {
    ArrowLeftIcon
} from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';
import { useNavigate } from '@remix-run/react';
import { useAppBridge } from '@shopify/app-bridge-react';


export default function Customize() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [visibility, setVisibility] = useState('all');
    const [trigger, setTrigger] = useState('after-summary');
    const [contentDisplay, setContentDisplay] = useState({
        image: true,
        title: true,
        price: true,
        quantity: true,
    });
    const [canPublish] = useState(false); // Set to true if there are unpublished changes

    const handleTabChange = useCallback((selectedTabIndex) => setSelectedTab(selectedTabIndex), []);

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

    const navigate = useNavigate();
    const app = useAppBridge();

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handlePublish = useCallback(() => {
        // Implement your publish logic here
    }, []);

    return (
        <Page>
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
            <InlineGrid columns={['oneThird', 'twoThirds']} alignItems="start">
                <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
                    {selectedTab === 0 && (
                        <Layout>
                            {/* Left column: Settings */}
                            <Layout.Section>
                                <BlockStack gap="200">
                                    <Card>
                                        <InlineStack gap="400" align="space-between">
                                            <Text variant="bodyMd" tone="success">Sticky Bar <span style={{ marginLeft: 8 }}><span style={{ background: '#E3F1DF', color: '#108043', borderRadius: 4, padding: '2px 8px', fontSize: 12 }}>Live</span></span></Text>
                                            <Button tone="critical" variant="tertiary">Pause</Button>
                                        </InlineStack>
                                    </Card>
                                    <Card>
                                        {/* Visibility Section */}
                                        <BlockStack gap="0">
                                            <Text variant="headingSm" as="h3" style={{ marginBottom: 8 }}>Visibility</Text>
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
                                            <Text variant="bodySm" tone="subdued" style={{ marginTop: 4 }}>Control where the Sticky Bar is shown.</Text>
                                        </BlockStack>
                                        <Divider />
                                        {/* Trigger Section */}
                                        <BlockStack gap="0" style={{ marginTop: 16 }}>
                                            <Text variant="headingSm" as="h3" style={{ marginBottom: 8 }}>Trigger</Text>
                                            <Text variant="bodyMd" as="div" style={{ marginBottom: 8 }}>Display trigger</Text>
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
                                        <Divider />
                                        {/* Content display Section */}
                                        <BlockStack gap="0" style={{ marginTop: 16 }}>
                                            <Text variant="headingSm" as="h3" style={{ marginBottom: 8 }}>Content display</Text>
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
                                        </BlockStack>
                                    </Card>
                                </BlockStack>
                            </Layout.Section>
                        </Layout>
                    )}
                    {selectedTab === 1 && (
                        <Layout>
                            <Layout.Section>
                                <Card sectioned>
                                    <Text variant="bodyMd">Appearance settings coming soon...</Text>
                                </Card>
                            </Layout.Section>
                        </Layout>
                    )}
                </Tabs>


                <Card title="Live preview">
                    <div style={{ minHeight: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        <Card>
                            <InlineStack gap="400" align="center">
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
                                    <InlineStack gap="100" align="center">
                                        <Button variant="tertiary">-</Button>
                                        <Text>1</Text>
                                        <Button variant="tertiary">+</Button>
                                    </InlineStack>
                                )}
                                <Button primary>Add to cart</Button>
                            </InlineStack>
                        </Card>
                    </div>
                </Card>
            </InlineGrid>
        </Page>
    );
}

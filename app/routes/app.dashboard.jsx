import {
    Page,
    Card,
    ProgressBar,
    List,
    Badge,
    Button,
    InlineStack,
    BlockStack,
    Text,
} from '@shopify/polaris';

export default function Dashboard() {
    return (
        <Page title="Dashboard">
            {/* Task Progress */}
            <Card sectioned>
                <Text variant="headingMd">Get started</Text>
                <ProgressBar progress={25} size="small" />
                <BlockStack gap="200">
                    <InlineStack align="space-between">
                        <Text>Enable the app embed</Text>
                        <Badge status="success">Done</Badge>
                    </InlineStack>
                    <InlineStack align="space-between">
                        <Text>Customize the sticky bar</Text>
                        <Button>Open theme</Button>
                        <Button variant="plain">Setup guide</Button>
                    </InlineStack>
                    <InlineStack align="space-between">
                        <Text>Choose where it appears</Text>
                    </InlineStack>
                    <InlineStack align="space-between">
                        <Text>Preview and publish</Text>
                    </InlineStack>
                </BlockStack>
            </Card>

            {/* Quick Status */}
            <Card sectioned>
                <InlineStack gap="400">
                    <BlockStack>
                        <Text variant="headingSm">App embed</Text>
                        <Badge status="success">Active</Badge>
                        <Text>Controls whether the app can inject the sticky bar into your theme.</Text>
                        <Button>Preview in theme</Button>
                    </BlockStack>
                    <BlockStack>
                        <Text variant="headingSm">Sticky bar</Text>
                        <Badge status="attention">Paused</Badge>
                        <Text>Turn the sticky bar on or off without uninstalling the app.</Text>
                        <Button>Activate</Button>
                    </BlockStack>
                </InlineStack>
            </Card>

            {/* What's New */}
            <Card title="What's new" sectioned>
                <List>
                    <List.Item>
                        <Text variant="bodyMd">
                            <b>Enhanced features & fixes</b> • June 13 <Badge status="new">New</Badge>
                            <br />
                            New Heritage/Pitch themes, fixed collection/checkout issues, improved Okrestro.
                        </Text>
                    </List.Item>
                </List>
                <Button variant="plain">View changelog</Button>
            </Card>

            {/* Need Help */}
            <Card sectioned>
                <InlineStack gap="400">
                    <BlockStack>
                        <Text variant="headingSm">Contact support</Text>
                        <Text>Have a question or hit a snag? We usually reply within 24 hours.</Text>
                        <Button>Send email</Button>
                    </BlockStack>
                    <BlockStack>
                        <Text variant="headingSm">Live chat</Text>
                        <Text>Chat with us during business hours or leave a message.</Text>
                        <Button>Start chat</Button>
                    </BlockStack>
                    <BlockStack>
                        <Text variant="headingSm">Help center</Text>
                        <Text>All you need to get the sticky bar working on your store.</Text>
                        <Button>View docs</Button>
                    </BlockStack>
                </InlineStack>
            </Card>
        </Page>
    );
} 
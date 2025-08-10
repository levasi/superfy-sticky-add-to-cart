import { Page, Text, Card, Button, Badge } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useEffect } from "react";

export const loader = async ({ request }) => {
    await authenticate.admin(request);
    return null;
};

export default function GeneralSettings() {
    useEffect(() => {
        console.log("GeneralSettings component mounted!");
    }, []);

    return (
        <Page>
            <TitleBar title="General Settings" />

            <div style={{
                display: 'flex',
                gap: '32px',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px'
            }}>
                {/* Left Section - Theme Integration Description */}
                <div style={{ flex: 1, maxWidth: '400px' }}>
                    <div style={{ padding: '20px 0' }}>
                        <Text variant="headingLg" style={{
                            fontWeight: 600,
                            marginBottom: '12px',
                            color: '#202223'
                        }}>
                            Theme integration
                        </Text>
                        <Text variant="bodyMd" style={{
                            color: '#6d7175',
                            lineHeight: 1.5
                        }}>
                            Enable the app embed to activate the Sticky Bar on your storefront.
                        </Text>
                    </div>
                </div>

                {/* Right Section - App Embed Card */}
                <div style={{ flex: 1, maxWidth: '500px' }}>
                    <Card>
                        <div style={{ padding: '24px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '16px'
                            }}>
                                <Text variant="headingMd">App embed</Text>
                                <Badge status="success">Live</Badge>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <Text variant="bodyMd" style={{
                                    color: '#6d7175',
                                    lineHeight: 1.5,
                                    marginBottom: '8px'
                                }}>
                                    The Sticky Bar requires app embed to be active in your theme in order to display.
                                </Text>

                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <Button variant="primary">Check status</Button>
                                    <Button variant="plain" tone="critical">Disable</Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Page>
    );
}

import { Card, Text, Button, InlineStack, BlockStack } from "@shopify/polaris";
import { EmailIcon } from "@shopify/polaris-icons";
import "./NeedHelp.scss";

export const NeedHelp = () => {
    return (
        <Card padding="400">
            <BlockStack gap="400">
                {/* Header */}
                <InlineStack align="space-between" blockAlign="center">
                    <Text variant="headingMd" fontWeight="semibold">
                        Need help?
                    </Text>
                </InlineStack>

                {/* Help Items */}
                <InlineStack gap="400">
                    <div className="help-item">
                        <div className="help-item-content">
                            <div className="help-item-main">
                                <InlineStack gap="200" blockAlign="center" wrap={false}>
                                    <Text variant="bodyMd" fontWeight="semibold">
                                        Contact support
                                    </Text>
                                </InlineStack>
                                <Text variant="bodySm" tone="subdued" className="help-description">
                                    Have a question or hit a snag? We usually reply within 24 hours.
                                </Text>
                            </div>
                            <div className="help-actions">
                                <Button
                                    icon={EmailIcon}
                                >
                                    Send email
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="help-item">
                        <div className="help-item-content">
                            <div className="help-item-main">
                                <InlineStack gap="200" blockAlign="center" wrap={false}>
                                    <Text variant="bodyMd" fontWeight="semibold">
                                        Help center
                                    </Text>
                                </InlineStack>
                                <Text variant="bodySm" tone="subdued" className="help-description">
                                    All you need to get the sticky bar working on your store.
                                </Text>
                            </div>
                            <div className="help-actions">
                                <Button>
                                    View docs
                                </Button>
                            </div>
                        </div>
                    </div>
                </InlineStack>
            </BlockStack>
        </Card>
    );
};

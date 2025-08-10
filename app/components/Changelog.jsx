import { Card, Text, Link, InlineStack, BlockStack, Badge, Icon } from "@shopify/polaris";
import { ChevronRightIcon } from "@shopify/polaris-icons";
import { useNavigate } from "@remix-run/react";
import "./Changelog.scss";

export const Changelog = ({ items }) => {
    const navigate = useNavigate();

    const handleChangelogClick = (changelogId) => {
        navigate(`/app/changelog/${changelogId}`);
    };

    return (
        <Card padding="400">
            <BlockStack gap="400">
                {/* Header */}
                <InlineStack align="space-between" blockAlign="center">
                    <Text variant="headingMd" fontWeight="semibold">
                        What's new
                    </Text>
                    <Link url="/app/changelog" monochrome>
                        View changelog
                    </Link>
                </InlineStack>

                {/* Changelog Items */}
                <BlockStack gap="0">
                    <div className="changelog-items">
                        {items.map((item, index) => (
                            <div key={item.id} className="changelog-item">
                                <div
                                    className="changelog-item-content"
                                    onClick={() => handleChangelogClick(item.id)}
                                >
                                    <div className="changelog-item-main">
                                        <div className="changelog-item-header">
                                            <InlineStack gap="200" blockAlign="center" wrap={false}>
                                                <Text variant="bodyMd" fontWeight="semibold">
                                                    {item.title}
                                                </Text>
                                                <Text variant="bodySm" tone="subdued">
                                                    •
                                                </Text>
                                                <Text variant="bodySm" tone="subdued">
                                                    {item.date}
                                                </Text>
                                                {item.isNew && (
                                                    <Badge tone="success" size="small">
                                                        New
                                                    </Badge>
                                                )}
                                            </InlineStack>
                                            <Text variant="bodySm" tone="subdued" className="changelog-description">
                                                {item.description}
                                            </Text>
                                        </div>
                                        <div className="changelog-arrow">
                                            <Icon source={ChevronRightIcon} tone="subdued" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </BlockStack>
            </BlockStack>
        </Card>
    );
};

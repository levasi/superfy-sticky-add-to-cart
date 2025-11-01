import {
    Box,
    Page,
    BlockStack,
    Layout,
    Card,
    Text,
    InlineStack,
    Button,
    Icon,
    Divider,
    Link
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { SettingsIcon, LanguageIcon } from "@shopify/polaris-icons";
import { useNavigate } from "@remix-run/react";
import { Link as RemixLink } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import "./app.settings.scss";

export const loader = async ({ request }) => {
    await authenticate.admin(request);
    return null;
};

export default function Settings() {
    const navigate = useNavigate();
    const handleTranslations = () => {
        console.log("Navigate to translations");
    };

    return (
        <Page>
            <TitleBar title="Settings" />
            <Layout>
                <Layout.Section>
                    <Card>
                        <Box padding="400" className="settings-page">
                            <Text as="h2" variant="headingMd" className="settings-header">
                                App settings
                            </Text>

                            <BlockStack gap="200">

                                {/* Original Settings Sections */}
                                <div>
                                    {/* General Settings Section */}
                                    <RemixLink to="/app/settings" style={{ textDecoration: 'none' }}>
                                        <Box
                                            as="div"
                                            className="settings-section"
                                        >
                                            <InlineStack align="space-between" blockAlign="center">
                                                <InlineStack gap="300" blockAlign="center">
                                                    <Box className="section-icon">
                                                        <Icon source={SettingsIcon} />
                                                    </Box>
                                                    <BlockStack gap="100" className="section-content">
                                                        <Text variant="bodyMd" className="section-title">
                                                            General settings
                                                        </Text>
                                                        <Text variant="bodySm" className="section-description">
                                                            View and update your settings
                                                        </Text>
                                                    </BlockStack>
                                                </InlineStack>
                                                <Box className="arrow-icon">
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </Box>
                                            </InlineStack>
                                        </Box>
                                    </RemixLink>

                                    {/* Translations Section */}
                                    <Box
                                        as="button"
                                        onClick={handleTranslations}
                                        className="settings-section"
                                    >
                                        <InlineStack align="space-between" blockAlign="center">
                                            <InlineStack gap="300" blockAlign="center">
                                                <Box className="section-icon">
                                                    <Icon source={LanguageIcon} />
                                                </Box>
                                                <BlockStack gap="100" className="section-content">
                                                    <InlineStack gap="200" blockAlign="center">
                                                        <Text variant="bodyMd" className="section-title">
                                                            Translations
                                                        </Text>
                                                    </InlineStack>
                                                    <Text variant="bodySm" className="section-description">
                                                        Change customer facing copy
                                                    </Text>
                                                </BlockStack>
                                            </InlineStack>
                                            <Box className="arrow-icon">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Box>
                                        </InlineStack>
                                    </Box>
                                </div>
                            </BlockStack>
                        </Box>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

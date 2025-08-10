import { Page, Text, Card, Button } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useParams, useNavigate } from "@remix-run/react";
import { useEffect } from "react";

export const loader = async ({ request }) => {
    await authenticate.admin(request);
    return null;
};

export default function ChangelogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("ChangelogDetail component mounted with id:", id);
    }, [id]);

    // Mock changelog data - in a real app, this would come from an API or database
    const changelogData = {
        'enhanced-features-june-13': {
            title: 'Enhanced features & fixes',
            date: 'June 13, 2024',
            version: 'v2.1.0',
            description: 'New Heritage/Pitch themes, fixed collection/checkout issues, improved Okrestro.',
            details: [
                'Added support for Heritage and Pitch themes',
                'Fixed collection page loading issues',
                'Resolved checkout process bugs',
                'Improved Okrestro integration performance',
                'Enhanced mobile responsiveness',
                'Updated documentation and guides'
            ],
            isNew: true
        },
        'enhanced-features-june-10': {
            title: 'Enhanced features & fixes',
            date: 'June 10, 2024',
            version: 'v2.0.5',
            description: 'New Heritage/Pitch themes, fixed collection/checkout issues, improved Okrestro.',
            details: [
                'Performance optimizations',
                'Bug fixes for theme compatibility',
                'Improved error handling',
                'Enhanced user experience'
            ],
            isNew: false
        },
        'enhanced-features-june-7': {
            title: 'Enhanced features & fixes',
            date: 'June 7, 2024',
            version: 'v2.0.4',
            description: 'New Heritage/Pitch themes, fixed collection/checkout issues, improved Okrestro.',
            details: [
                'Initial release of new features',
                'Theme integration improvements',
                'Collection page enhancements',
                'Checkout process optimizations'
            ],
            isNew: false
        }
    };

    const changelog = changelogData[id];

    if (!changelog) {
        return (
            <Page>
                <TitleBar title="Changelog Not Found" />
                <Card>
                    <div style={{ padding: '24px', textAlign: 'center' }}>
                        <Text variant="headingMd">Changelog entry not found</Text>
                        <div style={{ marginTop: '16px' }}>
                            <Button onClick={() => navigate('/app/settings-general')}>
                                Back to General Settings
                            </Button>
                        </div>
                    </div>
                </Card>
            </Page>
        );
    }

    return (
        <Page>
            <TitleBar title="Changelog" />

            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '20px'
            }}>
                <Card>
                    <div style={{ padding: '24px' }}>
                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '24px',
                            paddingBottom: '16px',
                            borderBottom: '1px solid #E1E3E5'
                        }}>
                            <div>
                                <Text variant="headingLg" style={{ fontWeight: 600, color: '#202223', marginBottom: '8px' }}>
                                    {changelog.title}
                                </Text>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Text variant="bodyMd" style={{ color: '#6d7175' }}>
                                        {changelog.date}
                                    </Text>
                                    <Text variant="bodyMd" style={{ color: '#6d7175' }}>
                                        •
                                    </Text>
                                    <Text variant="bodyMd" style={{ color: '#6d7175' }}>
                                        {changelog.version}
                                    </Text>
                                    {changelog.isNew && (
                                        <div style={{
                                            backgroundColor: '#008060',
                                            color: 'white',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 600
                                        }}>
                                            New
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Button onClick={() => navigate('/app/settings-general')} variant="plain">
                                Back
                            </Button>
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: '24px' }}>
                            <Text variant="bodyMd" style={{ color: '#6d7175', lineHeight: 1.6 }}>
                                {changelog.description}
                            </Text>
                        </div>

                        {/* Details */}
                        <div>
                            <Text variant="headingMd" style={{ fontWeight: 600, color: '#202223', marginBottom: '16px' }}>
                                What's included in this update:
                            </Text>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0
                            }}>
                                {changelog.details.map((detail, index) => (
                                    <li key={index} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        marginBottom: '12px',
                                        paddingLeft: '20px',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            backgroundColor: '#008060',
                                            marginTop: '8px',
                                            marginRight: '12px',
                                            flexShrink: 0
                                        }} />
                                        <Text variant="bodyMd" style={{ color: '#202223', lineHeight: 1.5 }}>
                                            {detail}
                                        </Text>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>
        </Page>
    );
}

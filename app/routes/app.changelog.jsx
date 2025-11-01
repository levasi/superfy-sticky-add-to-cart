import { Page, Text, Card, Button, Link } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";

export const loader = async ({ request }) => {
    await authenticate.admin(request);
    return null;
};

export default function Changelog() {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Changelog component mounted!");
    }, []);

    const handleChangelogClick = (changelogId) => {
        navigate(`/app/changelog/${changelogId}`);
    };

    const changelogItems = [
        {
            id: 'enhanced-features-june-13',
            title: 'Enhanced features & fixes',
            date: 'June 13, 2024',
            version: 'v2.1.0',
            description: 'New Heritage/Pitch themes, fixed collection/checkout issues, improved Okrestro.',
            isNew: true
        },
        {
            id: 'enhanced-features-june-10',
            title: 'Enhanced features & fixes',
            date: 'June 10, 2024',
            version: 'v2.0.5',
            description: 'New Heritage/Pitch themes, fixed collection/checkout issues, improved Okrestro.',
            isNew: false
        },
        {
            id: 'enhanced-features-june-7',
            title: 'Enhanced features & fixes',
            date: 'June 7, 2024',
            version: 'v2.0.4',
            description: 'New Heritage/Pitch themes, fixed collection/checkout issues, improved Okrestro.',
            isNew: false
        },
        {
            id: 'performance-updates-may-30',
            title: 'Performance updates & bug fixes',
            date: 'May 30, 2024',
            version: 'v2.0.3',
            description: 'Improved loading times and resolved several minor bugs.',
            isNew: false
        },
        {
            id: 'new-features-may-20',
            title: 'New features release',
            date: 'May 20, 2024',
            version: 'v2.0.0',
            description: 'Major update with new customization options and improved user interface.',
            isNew: false
        }
    ];

    return (
        <Page>
            <TitleBar title="Changelog" />

            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '20px'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px'
                }}>
                    <div>
                        <Text variant="headingLg" style={{ fontWeight: 600, color: '#202223', marginBottom: '8px' }}>
                            What's new
                        </Text>
                        <Text variant="bodyMd" style={{ color: '#6d7175' }}>
                            Stay up to date with the latest features and improvements
                        </Text>
                    </div>
                    <Button onClick={() => navigate('/app/settings')} variant="plain">
                        Back to Settings
                    </Button>
                </div>

                {/* Changelog Items */}
                <Card>
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {changelogItems.map((item, index) => (
                                <div key={item.id}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            padding: '20px 0',
                                            cursor: 'pointer',
                                            borderBottom: index < changelogItems.length - 1 ? '1px solid #E1E3E5' : 'none'
                                        }}
                                        onClick={() => handleChangelogClick(item.id)}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '8px',
                                                flexWrap: 'wrap'
                                            }}>
                                                <Text variant="bodyMd" style={{ fontWeight: 600, color: '#202223' }}>
                                                    {item.title}
                                                </Text>
                                                <Text variant="bodySm" style={{ color: '#6d7175' }}>
                                                    •
                                                </Text>
                                                <Text variant="bodySm" style={{ color: '#6d7175' }}>
                                                    {item.date}
                                                </Text>
                                                <Text variant="bodySm" style={{ color: '#6d7175' }}>
                                                    •
                                                </Text>
                                                <Text variant="bodySm" style={{ color: '#6d7175' }}>
                                                    {item.version}
                                                </Text>
                                                {item.isNew && (
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
                                            <Text variant="bodySm" style={{ color: '#6d7175', lineHeight: 1.4 }}>
                                                {item.description}
                                            </Text>
                                        </div>
                                        <div style={{
                                            marginLeft: '16px',
                                            color: '#6d7175',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </Page>
    );
}

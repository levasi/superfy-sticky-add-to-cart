import { useState } from 'react';
import { Card, Text, InlineStack, Button, Icon, Popover, ActionList } from '@shopify/polaris';
import { MenuHorizontalIcon, ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";

export const DashboardProgress = ({ completedCount, totalCount, onExpand, onDismiss }) => {
    const [popoverActive, setPopoverActive] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const progress = (completedCount / totalCount) * 100;

    const handleExpand = () => {
        setIsExpanded(!isExpanded);
        if (onExpand) {
            onExpand(!isExpanded);
        }
    };

    return (
        <Card padding="400">
            <InlineStack align="space-between" blockAlign="center">
                <InlineStack gap="300" blockAlign="center">
                    {/* Progress Circle */}
                    <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: `conic-gradient(#008060 ${progress * 3.6}deg, #E1E3E5 0deg)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: 'white'
                        }} />
                    </div>

                    {/* Progress Text */}
                    <Text variant="bodyMd" tone="subdued">
                        {completedCount} of {totalCount} tasks complete
                    </Text>

                    {/* Progress Bar */}
                    <div style={{
                        width: '100px',
                        height: '4px',
                        backgroundColor: '#E1E3E5',
                        borderRadius: '2px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            backgroundColor: '#008060',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                </InlineStack>

                {/* Action Buttons */}
                <InlineStack gap="100">
                    {/* More Options Menu */}
                    <Popover
                        active={popoverActive}
                        onClose={() => setPopoverActive(false)}
                        activator={
                            <Button
                                onClick={() => setPopoverActive(!popoverActive)}
                                variant="tertiary"
                                icon={MenuHorizontalIcon}
                            />
                        }
                    >
                        <ActionList
                            actionRole="menuitem"
                            items={[
                                {
                                    content: 'Dismiss',
                                    onAction: onDismiss,
                                }
                            ]}
                        />
                    </Popover>

                    {/* Expand/Collapse Button */}
                    <Button
                        variant="tertiary"
                        icon={isExpanded ? ChevronUpIcon : ChevronDownIcon}
                        onClick={handleExpand}
                    />
                </InlineStack>
            </InlineStack>
        </Card>
    );
};

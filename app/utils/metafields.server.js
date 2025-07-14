export async function getShopMetafields(admin, shopId) {
    const response = await admin.graphql(
        `query getShopMetafields {
            shop {
                metafields(namespace: "superfy_sticky", first: 50) {
                    nodes {
                        key
                        value
                        type
                    }
                }
            }
        }`
    );

    const { data } = await response.json();
    const metafields = data.shop.metafields.nodes;

    // Convert metafields to settings object
    const settings = {};
    metafields.forEach(metafield => {
        if (metafield.type === 'json') {
            try {
                settings[metafield.key] = JSON.parse(metafield.value);
            } catch {
                settings[metafield.key] = metafield.value;
            }
        } else {
            settings[metafield.key] = metafield.value;
        }
    });

    return settings;
}

export async function setShopMetafields(admin, shopId, settings) {
    const metafields = Object.entries(settings).map(([key, value]) => ({
        ownerId: shopId,
        namespace: "superfy_sticky",
        key: key,
        type: typeof value === 'object' ? 'json' : 'single_line_text_field',
        value: typeof value === 'object' ? JSON.stringify(value) : String(value),
    }));

    await admin.graphql(
        `mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
            metafieldsSet(metafields: $metafields) {
                metafields { id, key, namespace, value }
                userErrors { field, message }
            }
        }`,
        {
            variables: {
                metafields: metafields,
            },
        }
    );
}

// Legacy function for backward compatibility
export async function setShopMetafieldsLegacy(admin, shopId, color, position) {
    await setShopMetafields(admin, shopId, {
        bar_color: color,
        bar_position: position,
    });
} 
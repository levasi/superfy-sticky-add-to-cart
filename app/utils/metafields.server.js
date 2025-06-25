export async function setShopMetafields(admin, shopId, color, position) {
    await admin.graphql(
        `mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id, key, namespace, value }
        userErrors { field, message }
      }
    }`,
        {
            variables: {
                metafields: [
                    {
                        ownerId: shopId,
                        namespace: "superfy_sticky",
                        key: "bar_color",
                        type: "single_line_text_field",
                        value: color,
                    },
                    {
                        ownerId: shopId,
                        namespace: "superfy_sticky",
                        key: "bar_position",
                        type: "single_line_text_field",
                        value: position,
                    },
                ],
            },
        }
    );
} 
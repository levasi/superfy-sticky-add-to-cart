import "@shopify/shopify-app-remix/adapters/node";
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

import {
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

// export const shopifyApiClient = shopifyApi({
//   apiKey: process.env.SHOPIFY_API_KEY,
//   apiSecretKey: process.env.SHOPIFY_API_SECRET,
//   scopes: ['read_products', 'write_products'],
//   hostName: process.env.HOST.replace(/^https?:\/\//, ''),
//   apiVersion: LATEST_API_VERSION,
// });

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: LATEST_API_VERSION,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "https://superfy-sticky-add-to-cart.fly.dev",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  hooks: {
    async afterAuth({ session, admin }) {
      shopify.registerWebhooks({ session });

      try {
        // Get the shop's GID for the metafield owner
        const shopIdResponse = await admin.graphql(`query { shop { id } }`);
        const { data: { shop: { id: shopId } } } = await shopIdResponse.json();

        // Define the metafield to be created
        const metafieldDefinition = {
          name: "Sticky App URL",
          namespace: "superfy_sticky",
          key: "app_url",
          type: "url",
          description: "URL of the Superfy Sticky Add to Cart app.",
          ownerType: "SHOP",
        };

        // Create the metafield definition
        await admin.graphql(
          `mutation CreateShopMetafieldDefinition($definition: MetafieldDefinitionInput!) {
            metafieldDefinitionCreate(definition: $definition) {
              createdDefinition { id }
              userErrors { field, message }
            }
          }`,
          { variables: { definition: metafieldDefinition } },
        );

        // Set the metafield value on the shop
        await admin.graphql(
          `mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
            metafieldsSet(metafields: $metafields) {
              metafields { id, key, namespace, value }
              userErrors { field, message }
            }
          }`,
          {
            variables: {
              metafields: [{
                ownerId: shopId,
                namespace: "superfy_sticky",
                key: "app_url",
                type: "url",
                value: process.env.SHOPIFY_APP_URL,
              }],
            },
          },
        );
      } catch (error) {
        console.error("Error setting up app URL metafield:", error);
      }
    },
  },
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;

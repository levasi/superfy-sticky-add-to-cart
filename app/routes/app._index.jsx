import { useEffect, useState } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { getSetting, upsertSetting } from "../models/settings.server";
import { setShopMetafields } from "../utils/metafields.server";

// Sticky Add to Cart bar: When a product is generated, a sticky bar appears at the bottom of the page showing product info and an Add to Cart button with a local cart count.

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  // Fetch sticky bar color and position from settings
  const colorSetting = await getSetting("sticky_bar_color");
  const positionSetting = await getSetting("sticky_bar_position");
  return Response.json({
    stickyBarColor: colorSetting?.value || "#fff",
    stickyBarPosition: positionSetting?.value || "bottom",
  });
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const color = formData.get("stickyColor");
  const position = formData.get("stickyPosition");
  if (typeof color !== "string" || typeof position !== "string") return Response.json({ ok: false });

  await upsertSetting("sticky_bar_color", color);
  await upsertSetting("sticky_bar_position", position);

  // Get the shop GID
  const shopIdResponse = await admin.graphql(`query { shop { id } }`);
  const { data: { shop: { id: shopId } } } = await shopIdResponse.json();

  await setShopMetafields(admin, shopId, color, position);

  return Response.json({ ok: true });
};

export default function Index() {
  const fetcher = useFetcher();
  const loaderData = fetcher.data || useLoaderData();
  const shopify = useAppBridge();
  const [cartCount, setCartCount] = useState(0);
  const [stickyColor, setStickyColor] = useState(loaderData.stickyBarColor || "#fff");
  const [stickyPosition, setStickyPosition] = useState(loaderData.stickyBarPosition || "bottom");
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id?.replace(
    "gid://shopify/Product/",
    "",
  );
  const product = fetcher.data?.product;
  const variant = fetcher.data?.variant?.[0];

  useEffect(() => {
    if (fetcher.data?.ok) {
      shopify.toast.show("Sticky bar color saved!");
    }
  }, [fetcher.data, shopify]);

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);

  const generateProduct = () => fetcher.submit({}, { method: "POST" });

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <fetcher.Form method="post" data-save-bar>
              <Text as="label" variant="bodyMd" htmlFor="sticky-color-picker">
                Sticky Bar Color
              </Text>
              <input
                id="sticky-color-picker"
                type="color"
                name="stickyColor"
                value={stickyColor}
                onChange={e => setStickyColor(e.target.value)}
                style={{ marginLeft: 12, verticalAlign: "middle", width: 40, height: 32, border: "none", background: "none" }}
              />
              <Text as="label" variant="bodyMd" htmlFor="sticky-position-select" style={{ marginLeft: 24 }}>
                Sticky Bar Position
              </Text>
              <select
                id="sticky-position-select"
                name="stickyPosition"
                value={stickyPosition}
                onChange={e => setStickyPosition(e.target.value)}
                style={{ marginLeft: 12, verticalAlign: "middle", width: 120, height: 32 }}
              >
                <option value="top">Top</option>
                <option value="middle">Middle</option>
                <option value="bottom">Bottom</option>
              </select>
            </fetcher.Form>
          </Card>
        </Layout.Section>
      </Layout>

      {product && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            background: stickyColor,
            borderTop: "1px solid #eee",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
            zIndex: 1000,
            padding: "1rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "64px",
            transition: "background 0.2s"
          }}
        >
          <div>
            <Text as="span" variant="headingMd">
              {product.title}
            </Text>
            {variant && (
              <Text as="span" variant="bodyMd" style={{ marginLeft: 16 }}>
                ${variant.price}
              </Text>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button
              primary
              onClick={() => setCartCount((c) => c + 1)}
            >
              Add to Cart
            </Button>
            {cartCount > 0 && (
              <Text as="span" variant="bodyMd">
                In cart: {cartCount}
              </Text>
            )}
          </div>
        </div>
      )}
    </Page>
  );
}

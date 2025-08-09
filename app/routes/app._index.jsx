import { useEffect, useState } from "react";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";

import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { getSetting, upsertSetting } from "../models/settings.server";
import { setShopMetafields } from "../utils/metafields.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  // Fetch sticky bar color, position, and status from settings
  const colorSetting = await getSetting("sticky_bar_color");
  const positionSetting = await getSetting("sticky_bar_position");
  const statusSetting = await getSetting("sticky_bar_status");
  console.log('📥 Dashboard loading sticky bar status:', statusSetting?.value);
  return Response.json({
    stickyBarColor: colorSetting?.value || "#fff",
    stickyBarPosition: positionSetting?.value || "bottom",
    stickyBarStatus: statusSetting?.value || "live",
  });
};

export const action = async ({ request }) => {

  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const color = formData.get("stickyColor");
  const position = formData.get("stickyPosition");
  const status = formData.get("stickyStatus");
  console.log('💾 Dashboard saving sticky bar status:', status);

  // Handle status toggle if provided (this should always work)
  if (typeof status === "string") {
    await upsertSetting("sticky_bar_status", status);
    console.log('✅ Dashboard saved sticky bar status to database:', status);
  }

  // Only update color and position if they are valid strings
  if (typeof color === "string") {
    await upsertSetting("sticky_bar_color", color);
  }

  if (typeof position === "string") {
    await upsertSetting("sticky_bar_position", position);
  }

  // Get the shop GID
  const shopIdResponse = await admin.graphql(`query { shop { id } }`);
  const { data: { shop: { id: shopId } } } = await shopIdResponse.json();

  // Update metafields with all settings
  const settings = {
    sticky_bar_color: color,
    sticky_bar_position: position,
    sticky_bar_status: status,
  };
  
  await setShopMetafields(admin, shopId, settings);

  return Response.json({ ok: true });
};

export default function Index() {
  const fetcher = useFetcher();
  const loaderData = useLoaderData();
  const shopify = useAppBridge();
  const [cartCount, setCartCount] = useState(0);
  const [stickyColor, setStickyColor] = useState(loaderData.stickyBarColor || "#fff");
  const [stickyPosition, setStickyPosition] = useState(loaderData.stickyBarPosition || "bottom");
  const [stickyStatus, setStickyStatus] = useState(loaderData.stickyBarStatus || "live");

  const product = fetcher.data?.product;
  const variant = fetcher.data?.variant?.[0];

  useEffect(() => {
    if (fetcher.data?.ok) {
      shopify.toast.show("Sticky bar settings saved!");
    }
  }, [fetcher.data, shopify]);

  // Handle sticky bar status toggle
  const handleStatusToggle = () => {
    const newStatus = stickyStatus === "live" ? "paused" : "live";
    console.log("Toggling status from", stickyStatus, "to", newStatus);

    // Update local state immediately
    setStickyStatus(newStatus);

    const formData = new FormData();
    formData.append("stickyColor", stickyColor);
    formData.append("stickyPosition", stickyPosition);
    formData.append("stickyStatus", newStatus);

    fetcher.submit(formData, { method: "post" });
  };

  // Navigate to customize page
  const navigate = useNavigate();
  const handleCustomizeClick = () => {
    navigate("/app/customize");
  };

  return (
    <Polaris.Page fullWidth>
      <Polaris.Layout>
        <Polaris.Layout.Section>
          {/* Task Progress */}
          <Polaris.Card>
            <Polaris.Text variant="headingMd">Get started</Polaris.Text>
            <Polaris.ProgressBar progress={25} size="small" />
            <Polaris.BlockStack gap="200">
              <Polaris.InlineStack align="space-between">
                <Polaris.Text>Enable the app embed</Polaris.Text>
                <Polaris.Badge status="success">Done</Polaris.Badge>
              </Polaris.InlineStack>
              <Polaris.InlineStack align="space-between">
                <Polaris.Text>Customize the sticky bar</Polaris.Text>
                <Polaris.Button onClick={handleCustomizeClick}>Open theme</Polaris.Button>
                <Polaris.Button variant="plain">Setup guide</Polaris.Button>
              </Polaris.InlineStack>
              <Polaris.InlineStack align="space-between">
                <Polaris.Text>Choose where it appears</Polaris.Text>
              </Polaris.InlineStack>
              <Polaris.InlineStack align="space-between">
                <Polaris.Text>Preview and publish</Polaris.Text>
              </Polaris.InlineStack>
            </Polaris.BlockStack>
          </Polaris.Card>
        </Polaris.Layout.Section>
        <Polaris.Layout.Section>
          <Polaris.BlockStack gap="200">
            <Polaris.Text variant="headingMd" as="h6">
              Quick status
            </Polaris.Text>

            {/* Quick Status */}
            <Polaris.Grid columns={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }}>
              <Polaris.Grid.Cell columnSpan={{ xs: 2, md: 1 }}>
                <Polaris.Card>
                  <Polaris.Text as="h2" variant="headingMd">
                    App embed
                  </Polaris.Text>
                  <Polaris.BlockStack gap="200">
                    <Polaris.BlockStack gap="100">
                      <Polaris.InlineStack gap="200">
                        <Polaris.Text variant="headingSm">App embed</Polaris.Text>
                        <Polaris.Badge status="success">Active</Polaris.Badge>
                      </Polaris.InlineStack>
                      <Polaris.Text>Controls whether the app can inject the sticky bar into your theme.</Polaris.Text>
                    </Polaris.BlockStack>
                    <Polaris.InlineStack>
                      <Polaris.Button>Preview in theme</Polaris.Button>
                    </Polaris.InlineStack>
                  </Polaris.BlockStack>
                </Polaris.Card>
              </Polaris.Grid.Cell>

              <Polaris.Grid.Cell columnSpan={{ xs: 2, md: 1 }}>
                <Polaris.Card>
                  <Polaris.Text as="h2" variant="headingMd">
                    Sticky bar
                  </Polaris.Text>
                  <Polaris.BlockStack gap="200">
                    <Polaris.BlockStack gap="100">
                      <Polaris.InlineStack gap="200">
                        <Polaris.Text variant="headingSm">Sticky bar</Polaris.Text>
                        <Polaris.Badge status={stickyStatus === "live" ? "success" : "warning"}>
                          {stickyStatus === "live" ? "Live" : "Paused"}
                        </Polaris.Badge>
                      </Polaris.InlineStack>
                      <Polaris.Text>
                        {stickyStatus === "live"
                          ? "The sticky bar is currently active and visible to customers."
                          : "The sticky bar is paused and hidden from customers."
                        }
                      </Polaris.Text>
                    </Polaris.BlockStack>
                    <Polaris.InlineStack>
                      <Polaris.Button
                        onClick={handleStatusToggle}
                        loading={fetcher.state === "submitting"}
                        variant={stickyStatus === "live" ? "secondary" : "primary"}
                      >
                        {stickyStatus === "live" ? "Pause" : "Activate"}
                      </Polaris.Button>
                      <Polaris.Button variant="plain" onClick={handleCustomizeClick}>Customize</Polaris.Button>
                    </Polaris.InlineStack>
                  </Polaris.BlockStack>
                </Polaris.Card>
              </Polaris.Grid.Cell>
            </Polaris.Grid>
          </Polaris.BlockStack>
        </Polaris.Layout.Section>
        <Polaris.Layout.Section>
          <Polaris.Card title="What's new" sectioned>
            <Polaris.List>
              <Polaris.List.Item>
                <Polaris.Text variant="bodyMd">
                  <b>Enhanced features & fixes</b> • June 13 <Polaris.Badge status="new">New</Polaris.Badge>
                  <br />
                  New Heritage/Pitch themes, fixed collection/checkout issues, improved Okrestro.
                </Polaris.Text>
              </Polaris.List.Item>
            </Polaris.List>
            <Polaris.Button variant="plain">View changelog</Polaris.Button>
          </Polaris.Card>
        </Polaris.Layout.Section>
        <Polaris.Layout.Section>
          {/* Need Help */}
          <Polaris.Card sectioned>
            <Polaris.InlineStack gap="400">
              <Polaris.BlockStack>
                <Polaris.Text variant="headingSm">Contact support</Polaris.Text>
                <Polaris.Text>Have a question or hit a snag? We usually reply within 24 hours.</Polaris.Text>
                <Polaris.Button>Send email</Polaris.Button>
              </Polaris.BlockStack>
              <Polaris.BlockStack>
                <Polaris.Text variant="headingSm">Help center</Polaris.Text>
                <Polaris.Text>All you need to get the sticky bar working on your store.</Polaris.Text>
                <Polaris.Button>View docs</Polaris.Button>
              </Polaris.BlockStack>
            </Polaris.InlineStack>
          </Polaris.Card>
        </Polaris.Layout.Section>
      </Polaris.Layout>


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
            <Polaris.Text as="span" variant="headingMd">
              {product.title}
            </Polaris.Text>
            {variant && (
              <Polaris.Text as="span" variant="bodyMd" style={{ marginLeft: 16 }}>
                ${variant.price}
              </Polaris.Text>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Polaris.Button
              primary
              onClick={() => setCartCount((c) => c + 1)}
            >
              Add to Cart
            </Polaris.Button>
            {cartCount > 0 && (
              <Polaris.Text as="span" variant="bodyMd">
                In cart: {cartCount}
              </Polaris.Text>
            )}
          </div>
        </div>
      )}
    </Polaris.Page>
  );
}

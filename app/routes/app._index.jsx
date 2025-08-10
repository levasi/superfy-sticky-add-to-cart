import { useEffect, useState } from "react";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";

import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { getSetting, upsertSetting } from "../models/settings.server";
import { setShopMetafields } from "../utils/metafields.server";
import { SetupGuide } from "../components/SetupGuide";
import { DashboardProgress } from "../components/DashboardProgress";
import { Changelog } from "../components/Changelog";
import { NeedHelp } from "../components/NeedHelp";

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

// Setup guide items
const SETUP_ITEMS = [
  {
    id: 0,
    title: "Enable app embed",
    description:
      "Enable the app embed to activate the Sticky Bar on your storefront. This allows the app to inject the sticky bar into your theme.",
    image: {
      url: "https://cdn.shopify.com/shopifycloud/shopify/assets/admin/home/onboarding/shop_pay_task-70830ae12d3f01fed1da23e607dc58bc726325144c29f96c949baca598ee3ef6.svg",
      alt: "Illustration highlighting app embed integration",
    },
    complete: false,
    primaryButton: {
      content: "Enable embed",
      props: {
        onAction: () => console.log("enabling app embed..."),
      },
    },
    secondaryButton: {
      content: "Learn more",
      props: {
        url: "https://help.shopify.com/en/manual/apps/app-embed",
        external: true,
      },
    },
  },
  {
    id: 1,
    title: "Customize sticky bar",
    description:
      "Customize the appearance and behavior of your sticky bar. Choose colors, position, and styling to match your store's design.",
    image: {
      url: "https://cdn.shopify.com/shopifycloud/shopify/assets/admin/home/onboarding/detail-images/home-onboard-share-store-b265242552d9ed38399455a5e4472c147e421cb43d72a0db26d2943b55bdb307.svg",
      alt: "Illustration showing sticky bar customization",
    },
    complete: false,
    primaryButton: {
      content: "Customize",
      props: {
        onAction: () => console.log("navigating to customize..."),
      },
    },
  },
  {
    id: 2,
    title: "Preview and publish",
    description:
      "Preview how your sticky bar will look on your store and publish the changes when you're satisfied with the results.",
    image: {
      url: "https://cdn.shopify.com/b/shopify-guidance-dashboard-public/nqjyaxwdnkg722ml73r6dmci3cpn.svgz",
      alt: "Illustration showing preview and publish",
    },
    complete: false,
    primaryButton: {
      content: "Preview",
      props: {
        onAction: () => console.log("opening preview..."),
      },
    },
  },
];

export default function Index() {
  const fetcher = useFetcher();
  const loaderData = useLoaderData();
  const shopify = useAppBridge();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [stickyColor, setStickyColor] = useState(loaderData.stickyBarColor || "#fff");
  const [stickyPosition, setStickyPosition] = useState(loaderData.stickyBarPosition || "bottom");
  const [showGuide, setShowGuide] = useState(true);
  const [showDashboardProgress, setShowDashboardProgress] = useState(true);

  const product = fetcher.data?.product;
  const variant = fetcher.data?.variant?.[0];



  const onStepComplete = async (id) => {
    try {
      // API call to update completion state in DB, etc.
      await new Promise((res) =>
        setTimeout(() => {
          res();
        }, [1000])
      );

      setSetupItems((prev) => prev.map((item) => (item.id === id ? { ...item, complete: !item.complete } : item)));
    } catch (e) {
      console.error(e);
    }
  };

  // Create setup items with navigation
  const setupItemsWithNavigation = SETUP_ITEMS.map(item => {
    if (item.id === 1) {
      return {
        ...item,
        primaryButton: {
          ...item.primaryButton,
          props: {
            onAction: () => navigate('/app/customize'),
          },
        },
      };
    }
    return item;
  });

  const [setupItems, setSetupItems] = useState(setupItemsWithNavigation);

  const changelogItems = [
    {
      id: 'enhanced-features-june-13',
      title: 'Enhanced features & fixes',
      date: 'June 13',
      description: 'New Heritage/Pitch themes, fixed collection/checkout issues, improved Okrestro.',
      isNew: true
    },
    {
      id: 'enhanced-features-june-10',
      title: 'Enhanced features & fixes',
      date: 'June 10',
      description: 'New Heritage/Pitch themes, fixed collection/checkout issues, improved Okrestro.',
      isNew: false
    },
    {
      id: 'enhanced-features-june-7',
      title: 'Enhanced features & fixes',
      date: 'June 7',
      description: 'New Heritage/Pitch themes, fixed collection/checkout issues, improved Okrestro.',
      isNew: false
    }
  ];

  useEffect(() => {
    if (fetcher.data?.ok) {
      shopify.toast.show("Sticky bar settings saved!");
    }
  }, [fetcher.data, shopify]);

  return (
    <Polaris.Page fullWidth>
      <Polaris.Layout>
        <Polaris.Layout.Section>
          {/* Dashboard Progress */}
          {showDashboardProgress && (
            <div style={{ marginBottom: '16px' }}>
              <DashboardProgress
                completedCount={setupItems.filter(item => item.complete).length}
                totalCount={setupItems.length}
                onDismiss={() => setShowDashboardProgress(false)}
                onExpand={(expanded) => {
                  if (expanded && !showGuide) {
                    setShowGuide(true);
                  }
                }}
              />
            </div>
          )}

          {/* Setup Guide */}
          {showGuide ? (
            <SetupGuide
              onDismiss={() => {
                setShowGuide(false);
                setSetupItems(setupItemsWithNavigation);
              }}
              onStepComplete={onStepComplete}
              items={setupItems}
            />
          ) : (
            <Polaris.Card>
              <div style={{ padding: '24px', textAlign: 'center' }}>
                <Polaris.Text variant="headingMd" style={{ marginBottom: '16px' }}>
                  Setup guide hidden
                </Polaris.Text>
                <Polaris.Button onClick={() => setShowGuide(true)}>
                  Show Setup Guide
                </Polaris.Button>
              </div>
            </Polaris.Card>
          )}
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
                  <Polaris.BlockStack gap="200">
                    <Polaris.BlockStack gap="100">
                      <Polaris.InlineStack gap="200">
                        <Polaris.Text variant="headingSm">Sticky bar</Polaris.Text>
                        <Polaris.Badge status="success">Paused</Polaris.Badge>
                      </Polaris.InlineStack>
                      <Polaris.Text>Turn the sticky bar on or off without uninstalling the app.</Polaris.Text>
                    </Polaris.BlockStack>
                    <Polaris.InlineStack>
                      <Polaris.Button>Activate</Polaris.Button>
                    </Polaris.InlineStack>
                  </Polaris.BlockStack>
                </Polaris.Card>
              </Polaris.Grid.Cell>
            </Polaris.Grid>
          </Polaris.BlockStack>
        </Polaris.Layout.Section>

        <Polaris.Layout.Section>
          {/* What's New Section */}
          <Changelog items={changelogItems} />
        </Polaris.Layout.Section>

        <Polaris.Layout.Section>
          {/* Need Help */}
          <NeedHelp />
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

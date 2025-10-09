import { useEffect, useState } from "react";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";

import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import { authenticate } from "../shopify.server";
import { getSetting, upsertSetting } from "../models/settings.server";
import { setShopMetafields } from "../utils/metafields.server";
import { SetupGuide } from "../components/SetupGuide";
import { Changelog } from "../components/Changelog";
import { NeedHelp } from "../components/NeedHelp";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  // Fetch sticky bar color, position, and status from settings
  const colorSetting = await getSetting("sticky_bar_color");
  const positionSetting = await getSetting("sticky_bar_position");
  const statusSetting = await getSetting("sticky_bar_status");
  return Response.json({
    stickyBarColor: colorSetting?.value || "#fff",
    stickyBarPosition: positionSetting?.value || "bottom",
    stickyBarStatus: statusSetting?.value || "active",
    apiKey: process.env.SHOPIFY_API_KEY || "",
  });
};

export const action = async ({ request }) => {

  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const color = formData.get("stickyColor");
  const position = formData.get("stickyPosition");
  const status = formData.get("stickyBarStatus");

  // Handle sticky bar status toggle
  if (status) {
    await upsertSetting("sticky_bar_status", status);

    // Get the shop GID
    const shopIdResponse = await admin.graphql(`query { shop { id } }`);
    const { data: { shop: { id: shopId } } } = await shopIdResponse.json();

    await setShopMetafields(admin, shopId, { sticky_bar_status: status });

    return Response.json({ ok: true });
  }

  // Handle color and position updates
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
        external: "true",
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

  // Function to create App Bridge v2 redirect instance
  const createRedirectInstance = () => {
    if (typeof window === 'undefined') return null;

    try {
      // Get shop origin and API key from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const shopOrigin = urlParams.get('shop') || shopify.shopOrigin;
      const apiKey = urlParams.get('api_key') || loaderData.apiKey;
      const host = urlParams.get('host');

      if (shopOrigin && host && apiKey) {
        const app = createApp({
          apiKey: apiKey,
          shopOrigin: shopOrigin,
          host: host,
        });

        return Redirect.create(app);
      }
    } catch (error) {
      console.error('Failed to create App Bridge v2 redirect:', error);
    }

    return null;
  };
  const [cartCount, setCartCount] = useState(0);
  const [stickyColor, setStickyColor] = useState(loaderData.stickyBarColor || "#fff");
  const [stickyPosition, setStickyPosition] = useState(loaderData.stickyBarPosition || "bottom");
  const [stickyBarStatus, setStickyBarStatus] = useState(loaderData.stickyBarStatus || "active");
  const [showGuide, setShowGuide] = useState(true);

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

  // Handle sticky bar status toggle
  const handleToggleStickyBar = async () => {
    const newStatus = stickyBarStatus === 'active' ? 'paused' : 'active';
    setStickyBarStatus(newStatus);

    // Save to database
    const formData = new FormData();
    formData.append('stickyBarStatus', newStatus);

    fetcher.submit(formData, { method: 'post' });
  };

  // Handle preview in theme button
  const handlePreviewInTheme = () => {
    try {
      // Create App Bridge v2 redirect instance on demand
      const redirectInstance = createRedirectInstance();

      if (redirectInstance) {
        console.log('Attempting App Bridge v2 redirect...');
        // Use App Bridge v2 Redirect to navigate to theme customizer in the same page
        redirectInstance.dispatch(Redirect.Action.ADMIN_PATH, '/themes/current/editor?context=apps');
        console.log('App Bridge v2 redirect dispatched successfully');
      } else {
        // Fallback: Use window.open to avoid X-Frame-Options issues
        const urlParams = new URLSearchParams(window.location.search);
        const shop = urlParams.get('shop');

        if (shop) {
          const themeEditorUrl = `https://${shop}/admin/themes/current/editor?context=apps`;
          window.open(themeEditorUrl, '_blank');
        } else {
          console.log('No shop parameter found for fallback navigation');
        }
      }
    } catch (error) {
      console.error('App Bridge v2 redirect failed:', error);
      // Fallback to window.open
      const urlParams = new URLSearchParams(window.location.search);
      const shop = urlParams.get('shop');

      if (shop) {
        const themeEditorUrl = `https://${shop}/admin/themes/current/editor?context=apps`;
        window.open(themeEditorUrl, '_blank');
      }
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
      <TitleBar title="Superfy sticky buy" />
      <Polaris.Layout>
        <Polaris.Layout.Section>
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
                        <Polaris.Badge tone="success">Active</Polaris.Badge>
                      </Polaris.InlineStack>
                      <Polaris.Text>Controls whether the app can inject the sticky bar into your theme.</Polaris.Text>
                    </Polaris.BlockStack>
                    <Polaris.InlineStack>
                      <Polaris.Button onClick={handlePreviewInTheme}>Preview in theme</Polaris.Button>
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
                        <Polaris.Badge tone={stickyBarStatus === 'active' ? 'success' : 'warning'}>
                          {stickyBarStatus === 'active' ? 'Live' : 'Paused'}
                        </Polaris.Badge>
                      </Polaris.InlineStack>
                      <Polaris.Text>Turn the sticky bar on or off without uninstalling the app.</Polaris.Text>
                    </Polaris.BlockStack>
                    <Polaris.InlineStack>
                      <Polaris.Button
                        tone={stickyBarStatus === 'active' ? 'critical' : 'success'}
                        onClick={handleToggleStickyBar}
                        loading={fetcher.state === 'submitting'}
                      >
                        {stickyBarStatus === 'active' ? 'Pause' : 'Activate'}
                      </Polaris.Button>
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

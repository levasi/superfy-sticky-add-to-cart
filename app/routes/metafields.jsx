import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    console.log('=== METAFIELDS ROUTE (REDIRECT) ===');
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);

    try {
        // Try to authenticate the request using Shopify's app proxy authentication
        const { storefront, liquid } = await authenticate.public.appProxy(request);
        console.log('App proxy authentication successful');

        // Get the shop from the request parameters (as per Shopify docs)
        const url = new URL(request.url);
        const shop = url.searchParams.get('shop');
        const pathPrefix = url.searchParams.get('path_prefix');
        const timestamp = url.searchParams.get('timestamp');
        const signature = url.searchParams.get('signature');
        const loggedInCustomerId = url.searchParams.get('logged_in_customer_id');

        console.log('Shopify proxy parameters:');
        console.log('- shop:', shop);
        console.log('- path_prefix:', pathPrefix);
        console.log('- timestamp:', timestamp);
        console.log('- signature:', signature ? 'present' : 'missing');
        console.log('- logged_in_customer_id:', loggedInCustomerId);

        if (!shop) {
            console.log('ERROR: Shop parameter required');
            return json({ error: 'Shop parameter required' }, { status: 400 });
        }

        console.log('Loading metafields for shop:', shop);

        // Import the getMetafields function
        const { getMetafields } = await import("../utils/metafields.server");

        // Get metafields for the current product
        const metafields = await getMetafields(shop);

        console.log('=== METAFIELDS TO RETURN ===');
        console.log(JSON.stringify(metafields, null, 2));

        return json(metafields);

    } catch (error) {
        console.error('Error in metafields route:', error);

        // Return empty metafields if there's an error
        const fallbackMetafields = {
            product: {},
            cart: {},
            customer: {}
        };

        console.log('=== FALLBACK METAFIELDS TO RETURN ===');
        console.log(JSON.stringify(fallbackMetafields, null, 2));

        return json(fallbackMetafields);
    }
}; 
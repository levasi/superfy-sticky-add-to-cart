import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {

    try {
        // Try to authenticate the request using Shopify's app proxy authentication
        const { storefront, liquid } = await authenticate.public.appProxy(request);

        // Get the shop from the request parameters (as per Shopify docs)
        const url = new URL(request.url);
        const shop = url.searchParams.get('shop');
        const pathPrefix = url.searchParams.get('path_prefix');
        const timestamp = url.searchParams.get('timestamp');
        const signature = url.searchParams.get('signature');
        const loggedInCustomerId = url.searchParams.get('logged_in_customer_id');

        if (!shop) {
            console.log('ERROR: Shop parameter required');
            return json({ error: 'Shop parameter required' }, { status: 400 });
        }

        // Import the getMetafields function
        const { getMetafields } = await import("../utils/metafields.server");

        // Get metafields for the current product
        const metafields = await getMetafields(shop);

        return json(metafields);

    } catch (error) {
        console.error('Error in metafields route:', error);

        // Return empty metafields if there's an error
        const fallbackMetafields = {
            product: {},
            cart: {},
            customer: {}
        };

        return json(fallbackMetafields);
    }
}; 
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    // Authenticate the app proxy request
    const { storefront, liquid } = await authenticate.public.appProxy(request);

    return json({
        message: "App proxy is working!",
        timestamp: new Date().toISOString(),
        url: request.url
    }, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
};

export const action = async ({ request }) => {
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }

    return new Response('Method not allowed', { status: 405 });
}; 
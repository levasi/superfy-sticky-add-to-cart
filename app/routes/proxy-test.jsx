import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
    return json({
        message: "Proxy test route is working!",
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
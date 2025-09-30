// App proxy route for /metafields (redirects to /apps/proxy/metafields)
import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
    // Redirect to the actual app proxy metafields route
    const url = new URL(request.url);
    url.pathname = "/apps/proxy/metafields";
    return redirect(url.toString());
};

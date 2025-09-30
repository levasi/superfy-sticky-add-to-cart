// App proxy route for /settings (redirects to /apps/proxy/settings)
import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
    // Redirect to the actual app proxy settings route
    const url = new URL(request.url);
    url.pathname = "/apps/proxy/settings";
    return redirect(url.toString());
};

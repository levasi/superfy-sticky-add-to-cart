import { useState } from "react";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));

  return { errors, polarisTranslations };
};

export const action = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));

  return {
    errors,
  };
};

export default function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const { errors } = actionData || loaderData;

  return (
    <Polaris.AppProvider i18n={loaderData.polarisTranslations}>
      <Polaris.Page>
        <Polaris.Card>
          <Polaris.Text as="h2" variant="headingMd">
            Log in
          </Polaris.Text>
          <Form method="post">
            <Polaris.FormLayout>
              <Polaris.TextField
                type="text"
                name="shop"
                label="Shop domain"
                helpText="example.myshopify.com"
                value={shop}
                onChange={setShop}
                autoComplete="on"
                error={errors.shop}
              />
              <Polaris.Button submit>Log in</Polaris.Button>
            </Polaris.FormLayout>
          </Form>
        </Polaris.Card>
      </Polaris.Page>
    </Polaris.AppProvider>
  );
}

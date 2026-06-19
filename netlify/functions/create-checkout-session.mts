import Stripe from "stripe";
import type { Config, Context } from "@netlify/functions";

declare const Netlify: {
  env: {
    get(name: string): string | undefined;
  };
};

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  const stripeSecretKey = Netlify.env.get("STRIPE_SECRET_KEY");
  const stripePriceId = Netlify.env.get("STRIPE_CHASE_PRICE_ID");
  const shippingAmountCents = getShippingAmountCents();
  const shippingDisplayName = Netlify.env.get("STRIPE_SHIPPING_DISPLAY_NAME") || "USPS Ground Advantage";

  if (!stripeSecretKey) {
    return json({ error: "Stripe is not configured." }, 500);
  }

  if (!stripePriceId) {
    return json({ error: "The Chase pack price is not configured." }, 500);
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2026-02-25.clover",
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ],
    automatic_tax: {
      enabled: true,
    },
    billing_address_collection: "required",
    shipping_address_collection: {
      allowed_countries: ["US"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: shippingAmountCents,
            currency: "usd",
          },
          display_name: shippingDisplayName,
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 2,
            },
            maximum: {
              unit: "business_day",
              value: 5,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${new URL(req.url).origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${new URL(req.url).origin}/?checkout=cancelled`,
  });

  return json({ url: session.url });
};

export const config: Config = {
  path: "/api/create-checkout-session",
};

function getShippingAmountCents() {
  const configuredAmount = Netlify.env.get("STRIPE_SHIPPING_AMOUNT_CENTS");
  const amount = configuredAmount ? Number(configuredAmount) : 600;

  if (!Number.isInteger(amount) || amount < 0) {
    return 600;
  }

  return amount;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

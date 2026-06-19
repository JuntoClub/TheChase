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
    billing_address_collection: "required",
    shipping_address_collection: {
      allowed_countries: ["US"],
    },
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

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

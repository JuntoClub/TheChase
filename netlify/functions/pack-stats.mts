import Stripe from "stripe";
import type { Config, Context } from "@netlify/functions";

declare const Netlify: {
  env: {
    get(name: string): string | undefined;
  };
};

export default async (req: Request, _context: Context) => {
  if (req.method !== "GET") {
    return json({ error: "Method not allowed." }, 405);
  }

  const stripeSecretKey = Netlify.env.get("STRIPE_SECRET_KEY");
  const stripePriceId = Netlify.env.get("STRIPE_CHASE_PRICE_ID");
  const totalPacks = getIntegerEnv("CHASE_TOTAL_PACKS", 105);
  const baselineSold = getIntegerEnv("CHASE_BASELINE_PACKS_SOLD", 0);

  if (!stripeSecretKey || !stripePriceId) {
    return json({ totalPacks, packsSold: baselineSold, packsRemaining: Math.max(totalPacks - baselineSold, 0) });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2026-02-25.clover",
  });

  const stripeSold = await countPaidStripePacks(stripe, stripePriceId);
  const packsSold = Math.min(baselineSold + stripeSold, totalPacks);

  return json({
    totalPacks,
    packsSold,
    packsRemaining: Math.max(totalPacks - packsSold, 0),
    stripeSold,
    baselineSold,
  });
};

export const config: Config = {
  path: "/api/pack-stats",
};

async function countPaidStripePacks(stripe: Stripe, stripePriceId: string) {
  let count = 0;

  const sessions = await stripe.checkout.sessions.list({
    limit: 100,
  });

  for (const session of sessions.data) {
    if (session.payment_status !== "paid") {
      continue;
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
    });

    for (const item of lineItems.data) {
      if (item.price?.id === stripePriceId) {
        count += item.quantity || 0;
      }
    }
  }

  return count;
}

function getIntegerEnv(name: string, fallback: number) {
  const value = Netlify.env.get(name);
  const parsed = value ? Number(value) : fallback;

  if (!Number.isInteger(parsed) || parsed < 0) {
    return fallback;
  }

  return parsed;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

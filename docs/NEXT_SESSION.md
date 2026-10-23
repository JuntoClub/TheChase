# Next session — static checkout

Changed on 2026-10-23 from commit `3f50a64`.

- Set `data.js` `buyPacksUrl` to Ben's supplied Stripe Payment Link. All three Buy Packs links use it in the same tab.
- Removed the checkout-session and live pack-stats requests from `script.js`. The counter now uses `totalPacks` and `packsSold` from `data.js`; `lastUpdated` is shown if set there.
- Deleted both Netlify functions and `package.json`, whose only dependencies served those functions. Checkout no longer runs account-authenticated server code on Netlify's managed Node.js runtime, following the runtime warning Ben reported on 2026-10-22.
- Updated README checkout and counter instructions. Kept the catalog, inventory values, design, page paths, and `success.html` unchanged.

DONE 2026-10-23: Stripe secret key rolled (old key expired) and all Stripe/Chase env vars removed from Netlify. The site holds no Stripe credentials.

STANDING: packsSold in data.js is updated by hand after sales. The Stripe Payment Link's payment limit is what prevents overselling.

Verification note: the mandated `buy.stripe.com` URL necessarily matches the requested lowercase `stripe` search. It must remain; the checkout SDK, server functions, secret-key usage, and API requests are removed. `success.html` also retains its existing receipt copy as required.

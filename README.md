# The Chase Website

Static website for The Chase.

## Files

- `index.html` — homepage
- `catalog.html` — product catalog page
- `style.css` — styling
- `script.js` — site behavior
- `data.js` — edit product links, inventory, and catalog data
- `assets/` — images and logo files

## Checkout and pack counter

- Checkout is a Stripe Payment Link set in `data.js` as `buyPacksUrl`.
- The pack counter is manual: update `packsSold` in `data.js` after sales.
- The site has no server functions and needs no Stripe keys.

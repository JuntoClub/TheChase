# The Chase Website

Static website for The Chase.

## Files

- `index.html` — homepage
- `catalog.html` — product catalog page
- `style.css` — styling
- `script.js` — site behavior
- `data.js` — edit product links, inventory, and catalog data
- `assets/` — images and logo files

## Quick edits

Most quick edits are in `data.js`.

Change your links:

```js
ebayStoreUrl: "YOUR LINK HERE",
buyPacksUrl: "YOUR LINK HERE",
```

Change packs sold:

```js
packsSold: 0,
```

## Netlify + GitHub

1. Create a new GitHub repository.
2. Upload all files from this folder.
3. In Netlify, choose **Add new site → Import an existing project**.
4. Connect GitHub.
5. Select this repository.
6. Build command: leave blank.
7. Publish directory: leave blank or use `/`.
8. Deploy.

After that, Netlify will automatically update whenever you update GitHub.

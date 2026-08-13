# Build notes — Purelane homepage → Shopify sections

## Store & theme

| Item | Value |
|------|-------|
| Dev store | `https://purelane-gkiia8sy.myshopify.com` |
| Theme base | **Stock Dawn 16.0.0** |
| Homepage template | `templates/index.json` |
| Product seed file | `notes/products-import.csv` (16 products) |

## Assignment scope (five sections)

| # | Section | File | Anchor |
|---|---------|------|--------|
| 01 | Hero | `sections/purelane-hero.liquid` | `#top` |
| 02 | Shop grid | `sections/purelane-shop-grid.liquid` | `#shop` |
| 03 | Combos | `sections/purelane-combos.liquid` | `#combos` |
| 04 | Bundles | `sections/purelane-bundles.liquid` | `#bundles` |
| 05 | Reviews rail | `sections/purelane-reviews-rail.liquid` | `#reviews` |

Homepage order matches the prototype scroll: **Hero → Reviews → Combos → Bundles → Shop**, wrapped in Purelane header/footer chrome sections.

## Shared assets

```
snippets/purelane-styles.liquid       — fonts + base tokens (loaded once)
snippets/purelane-icon.liquid         — inline SVG icons
snippets/purelane-product-media.liquid — product image OR prototype sprite fallback
snippets/purelane-scenes.liquid       — fixed gradient backdrop + wave overlay
assets/purelane-base.css              — design tokens, glass, buttons, reveal
assets/purelane-product-sprites.css   — prototype bottle illustrations (base64 SVG)
assets/purelane-scenes.css            — scroll-driven scene gradients
assets/purelane-chrome.css            — ticker, nav, footer, sticky CTA
assets/purelane-homepage.css          — hides Dawn header/footer on index
assets/purelane-homepage.js           — scenes, reveal, progress rail, mobile menu
assets/purelane-hero.js               — hero product-stage carousel
assets/purelane-shop-grid.js          — quick add-to-cart via Dawn cart drawer
```

## Real Shopify data (no hardcoded prices in Liquid)

- All prices, compare-at, savings, and `% off` come from product/variant fields.
- Shop badges from product **tags** (`Best Seller`, `New`, `Top Rated`).
- Star ratings from `product.metafields.reviews.rating` when a reviews app populates them.
- Aggregate rating strip uses section **settings** (no native store-wide rating field).
- Product visuals: featured image when uploaded; otherwise prototype sprite matched by handle via `purelane-product-media.liquid`.

## Production fixes vs prototype HTML

| Prototype | Theme change | Why |
|-----------|--------------|-----|
| Inline `<script>` on `<body>` | External `purelane-*.js` with `shopify:section:load` hooks | Theme editor safety |
| Hardcoded ₹ in HTML | `{{ variant.price \| money }}` | Merchant currency / price updates |
| `#voices` nav target | `#reviews` | Prototype anchor mismatch |
| Full water SVG + bubble parallax | CSS wave layers + 4-scene gradient crossfade | Core Web Vitals; same visual intent |
| Page-level `<header>` in HTML | `purelane-header` / `purelane-footer` sections | Merchant-editable chrome on Dawn |
| Duplicate marquee HTML | One block set rendered twice (`aria-hidden` on copy) | Theme editor + a11y |

## Tests

```bash
python -m unittest tests.test_purelane_theme -v
```

## Setup checklist

1. Import `notes/products-import.csv` (Products → Import).
2. Push theme: `shopify theme push --store purelane-gkiia8sy.myshopify.com`
3. Theme editor → Homepage → confirm product picks resolve (handles in `index.json`).
4. Visual QA at 375 / 768 / 1024 / 1440px against `purelane-homepage.html` and screenshots.

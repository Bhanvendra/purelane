# Build notes — Purelane homepage → Shopify sections

## Store & theme

| Item | Value |
|------|-------|
| Dev store | `https://purelane-gkiia8sy.myshopify.com` |
| Theme base | **Stock Dawn 16.0.0** |
| Homepage template | `templates/index.json` (five Purelane sections only) |
| Product seed file | `notes/products-import.csv` (16 products) |

## What's here

Five self-contained sections on stock Dawn, each with schema, CSS, and shared tokens:

```
sections/purelane-hero.liquid
sections/purelane-shop-grid.liquid
sections/purelane-combos.liquid
sections/purelane-bundles.liquid
sections/purelane-reviews-rail.liquid
snippets/purelane-styles.liquid
snippets/purelane-icon.liquid
assets/purelane-base.css (+ per-section CSS)
assets/purelane-shop-grid.js
assets/purelane-homepage.css
```

## Metafields / metaobjects

**None created.** The theme uses:

- Product **tags** for shop-grid badges (`Best Seller`, `New`, `Top Rated`)
- Standard **`reviews.rating`** and **`reviews.rating_count`** product metafields (Shopify Reviews / compatible apps)
- Section **settings** for aggregate rating copy (no native store-wide rating field)

See `notes/METAFIELDS.md` for details.

## What I'd flag about the original file

- Single 1,700-line HTML with inline base64 “photos”, hardcoded ₹ prices, and hand-written combo copy — most of the work is deciding what becomes Shopify data vs merchant copy.
- Page-level cinematic effects (scroll scene crossfade, water SVGs, bubbles, cursor parallax) live on `<body>`, not in reusable sections — left out intentionally for performance and theme-editor safety.
- Nav link `#voices` in the prototype does not match the reviews section (`id="reviews"`). Built against `#reviews`.

## What I changed in the code, and why

- **Real Shopify products** for every price, image, and title via `product` / `product_list` settings; savings computed from `compare_at_price - price`.
- **Add to cart** posts to Dawn's `/cart/add.js`, publishes `PUB_SUB_EVENTS.cartUpdate`, and refreshes the cart drawer.
- **Sold out / no image / long title** handled in shop grid (`variant.available`, placeholder SVG, `-webkit-line-clamp`).
- **Reviews marquee** renders blocks twice (second pass `aria-hidden`) for seamless scroll without duplicate editor entries.
- **Homepage shell** (`purelane-homepage.css`) sets dark `--pl-ink` canvas and hides default Dawn homepage sections so only the five Purelane blocks show.
- **Migrated base theme** from Horizon → stock Dawn per assignment brief.

## What I'd do with more time

- Wire aggregate rating to a reviews app's store-wide metafield when available.
- Shopify Functions discount for bundle tiers so flat bundle pricing is enforced at checkout.
- Percy/Playwright snapshot tests at 375 / 768 / 1024 / 1440px against `purelane-homepage.html`.
- Optional page-shell header/footer from the prototype (bonus scope).

## Setup checklist

1. Import `notes/products-import.csv` (Products → Import).
2. Confirm collection **Bestsellers** exists and contains the seeded products.
3. Push theme: `shopify theme push --store purelane-gkiia8sy.myshopify.com`
4. Theme editor → Homepage → verify product picks resolved (handles in `index.json`).
5. Visual QA from 375px up against the prototype file.

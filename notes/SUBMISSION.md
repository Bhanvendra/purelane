# Purelane homepage — submission checklist

## Assignment scope (five sections)

| # | Section | File | Anchor | Status |
|---|---------|------|--------|--------|
| 01 | Hero | `sections/purelane-hero.liquid` | `#top` | Built |
| 02 | Shop grid | `sections/purelane-shop-grid.liquid` | `#shop` | Built |
| 03 | Combos | `sections/purelane-combos.liquid` | `#combos` | Built |
| 04 | Bundles | `sections/purelane-bundles.liquid` | `#bundles` | Built |
| 05 | Reviews rail | `sections/purelane-reviews-rail.liquid` | `#reviews` | Built |

Homepage order in `templates/index.json`: **Hero → Shop → Combos → Bundles → Reviews**, then bonus sections.

## Setup

| Item | Detail |
|------|--------|
| Theme base | Stock **Dawn 16.0.0** (`config/settings_schema.json`) |
| Dev store | `https://purelane-gkiia8sy.myshopify.com` |
| Product seed | `notes/products-import.csv` — 19 products |

### Product seed edge cases

| Requirement | Handle |
|-------------|--------|
| ≥ 8 products | 19 rows in CSV |
| Sold out | `organic-dishwash-liquid-gel` (qty 0) |
| No image | `purelane-plant-powered-foaming-kitchen-cleaner-spray-extra-long-title` |
| Very long title | Same handle (> 80 chars) |

**Import:** Shopify Admin → Products → Import → upload `notes/products-import.csv`.

**Theme deploy:** `shopify theme push --store purelane-gkiia8sy.myshopify.com`

## Production fixes vs prototype HTML

| Prototype issue | Theme fix | Why |
|-----------------|-----------|-----|
| Inline `<script>` on `<body>` | External `purelane-*.js` + `shopify:section:load` hooks | Theme editor safety |
| Hardcoded ₹ in HTML | `{{ variant.price \| money }}` | Merchant currency |
| `#voices` nav target | `#reviews` | Prototype anchor mismatch |
| Full water SVG + bubble parallax | CSS scene gradients + wave layers | Core Web Vitals |
| Page-level `<header>` in HTML | `purelane-header` / `purelane-footer` sections | Merchant-editable chrome |
| Duplicate marquee HTML | One block set rendered twice (`aria-hidden` on copy) | Theme editor + a11y |
| `.hp.pl-pimg` wiped sprite backgrounds | Only apply `--pl-img` when inline style sets it | Hero bottles render without uploaded images |
| LOI redesign experiment | Removed — restored prototype glass / Outfit / scene system | Assignment spec is the prototype file |

## Real Shopify data

- Prices, compare-at, savings, and `% off` from variant fields.
- Badges from product tags (`Best Seller`, `New`, `Top Rated`).
- Star ratings from `product.metafields.reviews.rating` when populated.
- Aggregate rating strip uses section settings (no native store-wide field).
- Product visuals: featured image when set; else sprite matched by handle in `snippets/purelane-product-media.liquid`.

## Visual QA breakpoints

375 · 768 · 1024 · 1440 px — compare to `purelane-homepage.html`.

## Pre-launch checklist

- [ ] Import `notes/products-import.csv`
- [ ] Push theme to dev store
- [ ] Confirm product picks in theme editor resolve (handles in `index.json`)
- [ ] Test add-to-cart from shop grid (Dawn cart drawer)
- [ ] Test sold-out state on `organic-dishwash-liquid-gel`
- [ ] Test long-title / no-image product card layout
- [ ] Keyboard tab through nav, combos rail, hero carousel dots
- [ ] `prefers-reduced-motion`: marquee pauses, reveal/scenes degrade gracefully

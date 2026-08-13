# Purelane — assignment criteria checklist

How this theme meets the eight evaluation points from the brief.

## 1. Pixel-accurate

- Visual system ported from `purelane-homepage.html`: Outfit + Inter, glass surfaces, scroll scenes, prototype tokens in `assets/purelane-base.css`.
- Homepage section order matches prototype scroll: Hero → Reviews → Ingredients → How → Proof → Combos → Bundles → Shop → bonus sections (`templates/index.json`).
- Hero product stage uses prototype bottle sprites; mobile width `min(88vw, 420px)`.
- Known intentional delta: full SVG water caustics replaced with CSS scene gradients for Core Web Vitals (same colour story, lighter paint cost).

## 2. Merchant-editable

- All five core sections expose headings, kickers, CTAs, and blocks in the theme editor schema.
- Combo fine print, default CTA label/link, shop button labels, footer links, ticker, and nav are settings — not hardcoded in Liquid.
- Aggregate review stats use section settings (documented: no native store-wide rating field).

## 3. Real Shopify data

- Prices, compare-at, savings, and `% off` from variant fields (`| money` filters).
- Product picks via `product`, `product_list`, and `collection` settings.
- Badges from product tags; ratings from `product.metafields.reviews.*` when populated.
- Product images from Admin when uploaded; otherwise handle-matched sprites in `snippets/purelane-product-media.liquid`.

## 4. Reusable

- `snippets/purelane-product-media.liquid` — one media path for hero, stack, shop, tier, proof contexts.
- `snippets/purelane-icon.liquid` — shared SVG set.
- Shared tokens/utilities in `assets/purelane-base.css`; section CSS split per block for editor isolation.

## 5. Survives the theme editor

- Blank guards on hero stages, shop collection, combos, bundles, proof, pillars.
- External JS with `shopify:section:load` hooks: `purelane-hero.js`, `purelane-shop-grid.js`, `purelane-proof.js`, `purelane-homepage.js`.
- Marquee reviews rendered from one block set twice (`aria-hidden` on duplicate pass).

## 6. Fast

- Shared CSS/fonts/sprites load **once** from `layout/theme.liquid` (not per section).
- Dawn body/header font preloads skipped on homepage (Google fonts used instead).
- Scene backdrop is CSS-only; animations respect `prefers-reduced-motion`.
- Product sprites are CSS background images (no extra HTTP requests per bottle).

## 7. Accessible

- `:focus-visible` on buttons (`purelane-base.css`) and chrome links (`purelane-chrome.css`).
- Hero and proof carousels use keyboard-focusable tab buttons with `aria-selected`.
- Reviews marquee duplicate marked `aria-hidden="true"`.
- Reduced motion disables auto-rotators and scroll reveal (`purelane-proof.js`, `purelane-homepage.js`).

## 8. Clean and reviewable

- Stock **Dawn 16.0.0** base; Purelane code namespaced with `pl-` prefix.
- Product seed: `notes/products-import.csv` (19 products, sold-out / no-image / long-title edge cases).
- Commit history on `dev_1` with focused messages per milestone.

---

## Setup

| Step | Action |
|------|--------|
| 1 | Import `notes/products-import.csv` in Shopify Admin |
| 2 | `shopify theme push --store purelane-gkiia8sy.myshopify.com` |
| 3 | Theme editor → confirm product/collection picks resolve |
| 4 | Visual QA at 375 / 768 / 1024 / 1440 px vs prototype |

## Production fixes vs prototype (tell the reviewer)

| Prototype | Theme | Why |
|-----------|-------|-----|
| Inline scripts | External `purelane-*.js` | Theme editor + CSP safety |
| Hardcoded ₹ | `{{ variant.price \| money }}` | Merchant currency |
| `#voices` anchor | `#reviews` | Prototype nav typo |
| Water SVG parallax | CSS scene crossfade | CWV / paint cost |
| Page `<header>` | `purelane-header` section | Merchant-editable chrome |
| Duplicate marquee HTML | One block set ×2 | Editor-safe infinite scroll |

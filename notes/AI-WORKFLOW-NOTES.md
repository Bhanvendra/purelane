# AI workflow notes

## What I delegated

- Mapping the 1,700-line prototype: which classes are used, which are dead (`.voices`), which anchor IDs nav targets hit.
- Extracting inline SVG product placeholders and aspect-ratio pairings.
- First-pass Liquid/schema boilerplate once data-model decisions were made.
- Generating the product seed CSV and wired `index.json` from agreed handles.
- Automated theme validation tests (`tests/test_purelane_theme.py`).

## Where it needed a human call

- **Data model**: bundle price → real product, badges → tags, ratings → reviews metafield namespace, aggregate rating → merchant text with documented reason.
- **Scope**: cutting page-shell effects (parallax, scene crossfade, bubbles) rather than smuggling them into sections.
- **Theme base**: assignment requires stock Dawn — migrated off Horizon rather than pretending Horizon was acceptable.
- **Anchor mismatch** `#voices` vs `#reviews` in the prototype.

## Where it would have failed silently if I hadn't checked

- Marquee duplicated static HTML → rebuilt as one block set rendered twice with `aria-hidden` on the duplicate pass.
- Hardcoded `% off` badges → computed from live `compare_at_price` / `price`.
- Horizon `CartLinesUpdateEvent` import → rewritten for Dawn `publish(PUB_SUB_EVENTS.cartUpdate)`.
- Empty `bundle_product` in theme editor → `{% if bundle != blank %}` guards on combo/bundle tiers.

## What I'd systematise for twenty more of these

- Checklist on every visible number: Shopify field, computed value, or merchant setting?
- Up-front “page shell vs section content” filter before writing sections.
- Lint for orphaned CSS selectors and mismatched anchor targets in prototype files.

## Environment limits

- Dev store push and live theme-editor verification require Shopify CLI login on your machine (`shopify theme push`).
- Git push requires Git installed and authenticated to `https://github.com/Bhanvendra/purelane-shopify.git`.

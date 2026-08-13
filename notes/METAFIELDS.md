# Metafields & metaobjects

## Created in this build

**None.** No custom metafield definitions or metaobjects were added to the store.

## Used without custom setup

| Data | Source | Notes |
|------|--------|-------|
| Product price / compare-at | Native variant fields | Combos, bundles, hero stages |
| Bestseller / New / Top rated badges | Product **tags** | Editable on product admin |
| Star rating on cards | `product.metafields.reviews.rating` | Standard reviews namespace |
| Review count on cards | `product.metafields.reviews.rating_count` | Populated by reviews app |
| Aggregate “4.8 from 8,000+” | Section text settings | No native store-wide field |

## Optional follow-up

If Troopod runs a specific reviews app, map its store-wide rating metafield to the reviews rail section settings instead of static copy.

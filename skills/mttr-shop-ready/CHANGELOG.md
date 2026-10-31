# Changelog

Versions follow semantic versioning: a major version changes what the skill asks of the person or the agent, a minor one adds or tightens steps, a patch corrects wording. The version is in `SKILL.md` under `metadata`, as the Agent Skills format keeps anything it does not define.

## 1.2.0 (2026-10-18)

- A new reference, `references/markup.md`: before and after JSON-LD for a plain product, a product with variants, a sale price with a strikethrough price, and the shop's shipping and returns on its `Organization`, with the rules for availability, condition, GTIN, MPN, SKU, brand, ratings and escaping, and which source wins when a policy is stated twice.
- A new reference, `references/merchant-center.md`: the feed's attributes beside the page's fields, why they must agree (automatic item updates, disapproval on a mismatch), prices and tax by country, and the feed apps on Shopify and WooCommerce.
- A new reference, `references/verify.md`: a command that prints each JSON-LD block the server sends, what each part of the check's answer means and what a pass is, Google's own tools, and a troubleshooting table of symptom, cause and fix.
- The platform notes add BigCommerce's Cornerstone theme, Magento's core microdata and a way to add a JSON-LD block, headless storefronts, a whole replacement block in Liquid, a before and after for Next.js Commerce, and a WooCommerce filter that writes a `ProductGroup`.
- Step 1 recognizes BigCommerce and headless storefronts; step 2 searches the live HTML for blocks an app or tag manager writes; step 4 adds sale prices, default-variant products and a GTIN only when it is one; step 5 checks the page against the Merchant Center feed; step 7 turns to the troubleshooting table before changing more.
- The React escape now reads `\u003c`, as it should; it had lost its backslash sequence.
- mttr's check counts a shop-wide shipping or return policy only when the `Organization` block is in the product page's own HTML, and the skill says so.

## 1.1.1 (2026-10-16)

- Sources lists end `SKILL.md` and the platform notes, each by its page's own title, with what the skill takes from it.

## 1.1.0 (2026-10-16)

- The description names its triggers plainly, the platforms it works on, and what it is not for.
- How the change ships is decided before any file changes, from a table of four cases, and never revisited.
- Each step opens with the one thing it does, and no file changes before step 4.
- The baseline check asks for a product with variants, one on sale and one out of stock where the shop has them.
- Step 5 reads the data from the HTML the server sends, and checks a sold-out variant and the variant the address selects.
- A refused rescan, or a site mttr has not read before, is said and reported from the product checks alone.
- A report template ends the skill, with the line that Merchant Center and Google decide.
- The platform notes were checked against current sources: Shopify's filter gives a `ProductGroup` for products with variants; Hydrogen 2026.10 no longer supports `getSeoMeta`; Next.js Commerce does not escape its JSON; WooCommerce already writes the GTIN and a `priceValidUntil`.

## 1.0.0 (2026-10-16)

- First release: seven steps from finding the platform to checking again, with `mttr_product_check` before and after, approval through `mttr_propose`, and notes for Shopify, Hydrogen, Next.js commerce, WooCommerce and Magento.

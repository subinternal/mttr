# Where each platform writes its product data

The names below are the usual ones, checked against each platform's own documentation or source on October 16 and 18, 2026. Themes and versions differ: confirm each one in this repository before you change it, and check the live page with `mttr_product_check` before and after. The JSON each example writes is the shape in [markup.md](markup.md).

## Shopify theme (Liquid)

- Where: most themes print the data in the product section, often `sections/main-product.liquid`, as `<script type="application/ld+json">{{ product | structured_data }}</script>`. The filter returns the JSON only; the template writes the script tag. Older themes write the data by hand in a snippet such as `snippets/structured-data.liquid` or in `layout/theme.liquid`. Apps can add their own through an app embed: search the live HTML, not only the theme.
- The `structured_data` filter is written by Shopify. Its documentation says it gives a `Product` for a product with no variants and a `ProductGroup` for one with variants, with `brand`, `category`, `description`, `image`, `name`, `url` and an `Offer` carrying `price`, `priceCurrency` and `availability`. It does not say it writes a GTIN, a SKU, shipping or returns. Check its output on the live page first. If it is right, leave it, and add only what it lacks where it belongs: a return and shipping policy once on the shop's `Organization` in `layout/theme.liquid`, or shipping and returns in Merchant Center. Replace it with your own block only when a required field is missing or wrong, and then remove the filter so there is one Product block.
- Values, written with `| json` so every string is escaped:
  - name: `product.title`; brand: `product.vendor`
  - image: `product.featured_image | image_url: width: 1200`, with `https:` before it (the filter gives an address that starts `//`); a variant's own is `variant.featured_image`
  - each variant: `variant.title`, `variant.sku`, `variant.barcode` (the GTIN, when it is one)
  - price: `variant.price | divided_by: 100.0`. Prices are in the currency's subunit; for a currency with none, such as JPY, Shopify still appends two places, so the same division holds. Do not use the money filters, which format for people.
  - currency: `cart.currency.iso_code`, the currency the page shows
  - availability: `variant.available`, as `https://schema.org/InStock` or `https://schema.org/OutOfStock`. A variant that sells while out of stock (`variant.inventory_policy` is `continue`) is still `available`: if the page says it ships later, write `BackOrder`.
  - the variant the address selects: `product.selected_or_first_available_variant`, which is the selected one even when sold out
  - a product with no options: `product.has_only_default_variant`, written as a plain `Product`
  - address: `request.origin | append: variant.url`

A replacement block, for a product with or without variants. The offer is a snippet so each variant writes the same one; the globals it needs are passed in.

```liquid
{%- comment -%} sections/main-product.liquid, in place of {{ product | structured_data }} {%- endcomment -%}
{%- capture varies -%}
  {%- for option in product.options_with_values -%}
    {%- assign o = option.name | downcase -%}
    {%- if o == 'color' or o == 'color' -%}https://schema.org/color|{%- elsif o == 'size' -%}https://schema.org/size|{%- elsif o == 'material' -%}https://schema.org/material|{%- elsif o == 'pattern' -%}https://schema.org/pattern|{%- endif -%}
  {%- endfor -%}
{%- endcapture -%}
{%- assign varies = varies | split: '|' -%}
{%- assign shown = product.selected_or_first_available_variant -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "name": {{ product.title | json }},
  "url": {{ request.origin | append: product.url | json }},
  "description": {{ product.description | strip_html | truncate: 5000 | json }},
  "image": {{ product.featured_image | image_url: width: 1200 | prepend: 'https:' | json }},
  {%- if product.vendor != blank %}
  "brand": { "@type": "Brand", "name": {{ product.vendor | json }} },
  {%- endif %}
  {%- if product.has_only_default_variant %}
  "@type": "Product",
  {%- if shown.sku != blank %}"sku": {{ shown.sku | json }},{% endif %}
  "offers": {% render 'ld-offer', variant: shown, origin: request.origin, currency: cart.currency.iso_code %}
  {%- else %}
  "@type": "ProductGroup",
  "productGroupID": "{{ product.id }}",
  "variesBy": {{ varies | json }},
  "hasVariant": [
    {%- for v in product.variants %}
    {
      "@type": "Product",
      "name": {{ product.title | append: ', ' | append: v.title | json }},
      {%- if v.sku != blank %}"sku": {{ v.sku | json }},{% endif %}
      {%- assign digits = v.barcode | remove: ' ' -%}
      {%- if digits.size == 8 or digits.size == 12 or digits.size == 13 or digits.size == 14 %}"gtin": {{ digits | json }},{% endif %}
      "image": {{ v.featured_image | default: product.featured_image | image_url: width: 1200 | prepend: 'https:' | json }},
      "offers": {% render 'ld-offer', variant: v, origin: request.origin, currency: cart.currency.iso_code %}
    }{% unless forloop.last %},{% endunless %}
    {%- endfor %}
  ]
  {%- endif %}
}
</script>
```

```liquid
{%- comment -%} snippets/ld-offer.liquid {%- endcomment -%}
{
  "@type": "Offer",
  "url": {{ origin | append: variant.url | json }},
  "price": {{ variant.price | divided_by: 100.0 | json }},
  "priceCurrency": {{ currency | json }},
  "availability": "https://schema.org/{% if variant.available %}InStock{% else %}OutOfStock{% endif %}"
}
```

Before shipping it: a product with more than 250 variants lists only the first 250 unless paginated; a barcode field may hold letters or a store code, which the length test lets through and mttr's check then marks invalid; and `itemCondition` belongs in the offer only where the shop states it (all new, or a metafield per product).

- Sources: https://shopify.dev/docs/api/liquid/filters/structured_data, https://shopify.dev/docs/api/liquid/objects/product and https://shopify.dev/docs/api/liquid/objects/variant

## Shopify Hydrogen

- Where: the product route, such as `app/routes/products.$handle.tsx` or `app/routes/($locale).products.$handle.tsx`.
- Which version: Hydrogen 2026.10 is built on React Router, and its documentation marks `getSeoMeta` as not supported in that version; its example product routes return a plain `meta` export with a title and a canonical link, and write no JSON-LD. In an earlier Hydrogen that still imports `getSeoMeta` from `@shopify/hydrogen`, its `jsonLd` field writes the block, and each route keeps its own. In 2026.10 and later, render `<script type="application/ld+json">` in the route's component from the loader's data, escaped as for Next.js below. Read `package.json` for the version before you choose.
- Values from the Storefront API query the route already makes: `product.title`, `product.vendor`, `selectedOrFirstAvailableVariant.price.amount` and `.price.currencyCode`, `.availableForSale`, `.sku`, `.barcode`, `.image.url`. Add fields to the query rather than hard-coding them. The Storefront API's `barcode` may be an ISBN, UPC or GTIN, so test its length as for Liquid. `currentlyNotInStock` is true for a variant that is out of stock but still sold, which is `BackOrder`.
- Sources: https://shopify.dev/docs/api/hydrogen/latest/utilities/getseometa, https://shopify.dev/docs/api/storefront/latest/objects/ProductVariant and the example routes in https://github.com/Shopify/hydrogen

## Next.js commerce

- Where: the product page, such as `app/product/[handle]/page.tsx` in Vercel's Next.js Commerce template, which builds a `productJsonLd` object and renders it in a script tag with `dangerouslySetInnerHTML` and `JSON.stringify`.
- That template writes `offers` as an `AggregateOffer` with `lowPrice` and `highPrice` from the product's price range, and `availability` from `product.availableForSale`. Change it to an `Offer` for each variant, or a `ProductGroup` with `hasVariant`, each variant's `price`, `priceCurrency` and `availability` from the commerce API's own fields.
- The template's `ProductVariant` type has `id`, `title`, `availableForSale`, `selectedOptions` and `price` (`amount`, `currencyCode`), and no SKU or barcode. Add `sku` and `barcode` to the variant fields the Storefront query asks for, and to the type, rather than using the variant's `id`, which is a Shopify global id and not a SKU.
- The template does not escape the JSON. Render it with `JSON.stringify(data).replace(/</g, '\\u003c')` so nothing in the data can close the tag.

Before, as the template writes it:

```tsx
offers: {
  '@type': 'AggregateOffer',
  availability: product.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
  priceCurrency: product.priceRange.minVariantPrice.currencyCode,
  highPrice: product.priceRange.maxVariantPrice.amount,
  lowPrice: product.priceRange.minVariantPrice.amount
}
```

After. `baseUrl` is the site's origin, and `variantUrl` stands for however this storefront selects a variant by address; every variant needs one.

```tsx
const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProductGroup',
  name: product.title,
  description: product.description,
  url: `${baseUrl}/product/${product.handle}`,
  productGroupID: product.handle,
  image: product.featuredImage?.url,
  hasVariant: product.variants.map((v) => ({
    '@type': 'Product',
    name: `${product.title}, ${v.title}`,
    ...(v.sku ? { sku: v.sku } : {}),
    ...(/^(\d{8}|\d{12,14})$/.test(v.barcode ?? '') ? { gtin: v.barcode } : {}),
    offers: {
      '@type': 'Offer',
      url: variantUrl(product, v),
      price: v.price.amount,
      priceCurrency: v.price.currencyCode,
      availability: v.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    }
  }))
};

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, '\\u003c') }}
/>
```

The page is a server component in this template, so the block is in the HTML the server sends. If yours renders the product on the client, move the block to the server part of the route.

- Sources: https://github.com/vercel/commerce/blob/main/app/product/%5Bhandle%5D/page.tsx and https://github.com/vercel/commerce/blob/main/lib/shopify/types.ts

## WooCommerce

- Where: WooCommerce prints Product JSON-LD itself on product pages (`WC_Structured_Data`). Change it through the `woocommerce_structured_data_product` filter, which hands you the markup and the `WC_Product`, in the theme's `functions.php` or a small plugin. Each offer passes through `woocommerce_structured_data_product_offer` first.
- An SEO plugin (Yoast WooCommerce SEO, Rank Math and others) may replace WooCommerce's output with its own. Find which one prints the block on the live page before you change anything, and change that one.
- A variable product whose variations differ in price comes out as an `AggregateOffer` with `lowPrice`, `highPrice` and `offerCount`, unless the address selects one variation, which gets a single `Offer`. Give an `Offer` for each variation, or a `ProductGroup`.
- WooCommerce already writes `gtin` from the product's GTIN, UPC, EAN or ISBN field when it is 8, 12, 13 or 14 digits, drops the parent's GTIN from a selected variation, and gives every price a `priceValidUntil` of the end of next year unless a sale ends sooner. It writes no `brand`, no `shippingDetails`, and a return policy only as an `OnlineStore` with `merchantReturnLink` on the refund and returns page itself (filter: `woocommerce_structured_data_online_store`).
- Values: `$product->get_name()`, `$product->get_price()`, `get_woocommerce_currency()`, `$product->is_in_stock()`, `$product->get_sku()`, and the GTIN from `$product->get_global_unique_id()` (in WooCommerce's source since 9.1; the field in the product editor came in 9.2), or the field the shop kept it in before.

A variable product as a `ProductGroup`, in a small plugin or `functions.php`:

```php
add_filter( 'woocommerce_structured_data_product', function ( $markup, $product ) {
	if ( ! $product->is_type( 'variable' ) ) {
		return $markup;
	}
	$variants = array();
	foreach ( $product->get_children() as $child_id ) {
		$variation = wc_get_product( $child_id );
		if ( ! $variation || '' === $variation->get_price() ) {
			continue;
		}
		$variant = array(
			'@type'  => 'Product',
			'name'   => $variation->get_name(),
			'offers' => array(
				'@type'         => 'Offer',
				'url'           => $variation->get_permalink(),
				'price'         => wc_format_decimal( $variation->get_price(), wc_get_price_decimals() ),
				'priceCurrency' => get_woocommerce_currency(),
				'availability'  => 'https://schema.org/' . ( $variation->is_on_backorder() ? 'BackOrder' : ( $variation->is_in_stock() ? 'InStock' : 'OutOfStock' ) ),
			),
		);
		if ( $variation->get_sku() ) {
			$variant['sku'] = $variation->get_sku();
		}
		$variants[] = $variant;
	}
	$markup['@type']          = 'ProductGroup';
	$markup['productGroupID'] = $product->get_sku() ? $product->get_sku() : (string) $product->get_id();
	$markup['hasVariant']     = $variants;
	unset( $markup['offers'] );
	return $markup;
}, 10, 2 );
```

WooCommerce encodes the result itself, so the strings need no escaping here. Check one variation's own address afterwards: WooCommerce gives a selected variation a single `Offer` of its own before this filter runs, and the block should still describe it.

- Source: `includes/class-wc-structured-data.php` and `includes/abstracts/abstract-wc-product.php` in https://github.com/woocommerce/woocommerce

## BigCommerce (Stencil, Cornerstone)

- Where: Cornerstone, BigCommerce's reference theme, writes Product JSON-LD in `templates/components/products/schema.html`, included from `templates/pages/product.html` with `{{> components/products/schema}}`. Themes built on it usually keep the same file.
- What it writes: a `Product` with `name`, `sku`, `mpn`, a GTIN under the property for its length (`gtin{{length product.gtin}}`), `url`, `brand`, `description`, `image`, ratings and reviews only when reviews are shown, and one `Offer` with `priceCurrency` from the active currency, `itemCondition`, `availability` (pre-order, out of stock or in stock) and a `priceValidUntil` a year ahead.
- What to fix: for a product with a price range, the offer has `minPrice` and `maxPrice` and no `price`, so the required price is missing. Write `price` from the price the page shows on load instead. `sku` and `mpn` are printed inside quotes without escaping: wrap them as the theme wraps the name, with `{{{JSONstringify product.sku}}}`.
- Source: https://github.com/bigcommerce/cornerstone/blob/master/templates/components/products/schema.html

## Magento and Adobe Commerce

- Where: Magento's own product page marks the product up as microdata, in Luma and any theme that keeps the core layout. `Magento_Catalog`'s `catalog_product_view.xml` puts `itemscope itemtype="http://schema.org/Product"` on the page and `itemprop` on the name, SKU and description, and the price template writes `itemprop="price"` and `itemprop="priceCurrency"` as `meta` tags. mttr's check reads JSON-LD only, and says `microdata` when that is all it finds; Google reads both. Prefer one JSON-LD block from a template of your own, and take out microdata that says something different.
- Adding the block, in the theme's `Magento_Catalog/layout/catalog_product_view.xml`:

```xml
<referenceContainer name="content">
  <block class="Magento\Catalog\Block\Product\View" name="product.jsonld" template="Magento_Catalog::product/jsonld.phtml"/>
</referenceContainer>
```

  and in the template, build an array and print it with `json_encode($data, JSON_UNESCAPED_SLASHES | JSON_HEX_TAG)`, so a `<` in the data cannot end the tag.
- Values: `$product->getName()`, `$product->getSku()`, the final price from `$product->getPriceInfo()->getPrice('final_price')->getAmount()->getValue()`, the store's current currency code, and `$product->isSaleable()` for stock. A configurable product's children are its variants.
- Not checked against current documentation: confirm the layout handle, the block class and the price call in this repository's Magento version.
- Source: https://github.com/magento/magento2/blob/2.4-develop/app/code/Magento/Catalog/view/frontend/layout/catalog_product_view.xml

## Headless and anything else

- Find the code that renders the product page on the server and the commerce API it reads. Write the block there, from the same response the page renders, never from a second request that can disagree.
- A page cached at the edge keeps its price and stock until the cache clears. If the page shows live stock from a later request, the data must come from the same place, or stock must be left at what the cached HTML shows.
- A static site rebuilt on a schedule can show a sale that has ended. Take `priceValidUntil` and sale prices from the build's own data, and say how often it rebuilds.

## Any platform

- One Product or ProductGroup per product page. Remove duplicates rather than adding to them.
- The data comes from the same fields the page renders, so the page and the data cannot drift apart.
- The block is in the HTML the server sends, not added by script after the page loads.
- Facts the shop does not have, such as a GTIN for a handmade product, stay out. Never fill a field to pass a check.

## Sources

- [Liquid filters: structured_data](https://shopify.dev/docs/api/liquid/filters/structured_data): what Shopify's filter writes for a product and a product with variants.
- [Liquid objects: product](https://shopify.dev/docs/api/liquid/objects/product): the selected or first available variant, the default-variant test, the 250 variant cap and the product's options.
- [Liquid objects: variant](https://shopify.dev/docs/api/liquid/objects/variant): prices in the currency's subunit, availability, barcode, SKU and the selling policy when out of stock.
- [getSeoMeta](https://shopify.dev/docs/api/hydrogen/latest/utilities/getseometa): the Hydrogen utility and the version that stops supporting it.
- [ProductVariant](https://shopify.dev/docs/api/storefront/latest/objects/ProductVariant): the Storefront API's variant fields, SKU, barcode, availability and the backorder flag.
- [Hydrogen](https://github.com/Shopify/hydrogen): the example product routes in Shopify's own repository.
- [commerce/app/product/[handle]/page.tsx](https://github.com/vercel/commerce/blob/main/app/product/%5Bhandle%5D/page.tsx): the product page in Vercel's Next.js Commerce template.
- [commerce/lib/shopify/types.ts](https://github.com/vercel/commerce/blob/main/lib/shopify/types.ts): the template's product and variant types, which carry no SKU or barcode.
- [WooCommerce Monorepo](https://github.com/woocommerce/woocommerce): the source of WooCommerce's structured data class and its filters.
- [cornerstone/templates/components/products/schema.html](https://github.com/bigcommerce/cornerstone/blob/master/templates/components/products/schema.html): the Product JSON-LD in BigCommerce's reference theme.
- [magento2/app/code/Magento/Catalog/view/frontend/layout/catalog_product_view.xml](https://github.com/magento/magento2/blob/2.4-develop/app/code/Magento/Catalog/view/frontend/layout/catalog_product_view.xml): the microdata Magento's product page layout adds.

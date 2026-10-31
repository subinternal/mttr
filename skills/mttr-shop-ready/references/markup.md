# Product data that states what the page shows

Worked JSON-LD for the cases a shop meets, and the rules for each field, from Google's merchant listing, variant, return policy and shipping policy pages, read on October 18, 2026. Every value below is a sample: in the template each one comes from the platform's own product fields, as [platforms.md](platforms.md) shows.

## One product, no variants

The smallest block that passes every required field, with the recommended ones a shop usually has.

Before, as many themes write it: a price with a symbol, a currency name, availability as a word, and no offer type.

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Linen shirt",
  "image": "//cdn.shop.example/linen-shirt.jpg",
  "offers": { "price": "$68", "priceCurrency": "Dollars", "availability": "in stock" }
}
```

After:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Linen shirt",
  "description": "A relaxed shirt in washed European linen.",
  "image": ["https://cdn.shop.example/linen-shirt-1200.jpg"],
  "sku": "LS-NAT-M",
  "gtin13": "4006381333931",
  "brand": { "@type": "Brand", "name": "Field and Loom" },
  "offers": {
    "@type": "Offer",
    "url": "https://shop.example/products/linen-shirt",
    "price": 68.00,
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition"
  }
}
```

What changed and why:

- `image` is a full https address. An address that starts `//` or `/` is not one a crawler is handed whole.
- `price` is a number with a dot for decimals and nothing else. The currency goes in `priceCurrency` as its ISO 4217 code in capitals. Merchant listings need a price above zero.
- `availability` and `itemCondition` are schema.org values, one each.
- `offers` is typed `Offer`: the shop is the seller.

## A product with variants

Google reads variants as a `ProductGroup` with `hasVariant`, each variant a `Product` with its own id and its own offer. Only `name` is required on the group; `productGroupID` (the parent SKU) and `variesBy` tell variants apart.

Before, as Next.js Commerce and WooCommerce write a variable product: one `AggregateOffer` with a range. Google's merchant listing page asks for an `Offer` because the merchant is the seller, and mttr's check reads an `AggregateOffer` as a range across sellers.

```json
{
  "@type": "Product",
  "name": "Linen shirt",
  "offers": { "@type": "AggregateOffer", "lowPrice": "68.00", "highPrice": "74.00", "priceCurrency": "USD" }
}
```

After, on a page whose address selects the medium natural shirt (`?variant=` on Shopify, the attribute query on WooCommerce):

```json
{
  "@context": "https://schema.org",
  "@type": "ProductGroup",
  "name": "Linen shirt",
  "productGroupID": "LS",
  "url": "https://shop.example/products/linen-shirt",
  "brand": { "@type": "Brand", "name": "Field and Loom" },
  "variesBy": ["https://schema.org/size", "https://schema.org/color"],
  "hasVariant": [
    {
      "@type": "Product",
      "name": "Linen shirt, natural, M",
      "sku": "LS-NAT-M",
      "gtin13": "4006381333931",
      "size": "M",
      "color": "Natural",
      "image": "https://cdn.shop.example/linen-shirt-natural.jpg",
      "offers": {
        "@type": "Offer",
        "url": "https://shop.example/products/linen-shirt?variant=101",
        "price": 68.00,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    },
    {
      "@type": "Product",
      "name": "Linen shirt, indigo, L",
      "sku": "LS-IND-L",
      "size": "L",
      "color": "Indigo",
      "image": "https://cdn.shop.example/linen-shirt-indigo.jpg",
      "offers": {
        "@type": "Offer",
        "url": "https://shop.example/products/linen-shirt?variant=102",
        "price": 74.00,
        "priceCurrency": "USD",
        "availability": "https://schema.org/OutOfStock"
      }
    }
  ]
}
```

Rules for variants:

- `variesBy` takes only the aspects Google reads: `https://schema.org/color`, `size`, `suggestedAge`, `suggestedGender`, `material` and `pattern`. A shop option called "Style" or "Scent" has no place in it; the variants still differ by name and id.
- Each variant has its own `sku` or GTIN, never the parent's. WooCommerce's own code drops the parent GTIN from a variation for this reason.
- If a variant names its group with `inProductGroupWithID`, it must equal `productGroupID`.
- Every variant must be selectable by its own address, and that address must show the variant's image, price and stock and let a shopper add it to the cart. Google's single page approach expects the markup not to change as the shopper picks variants; the multi page approach repeats the whole `ProductGroup` on each variant's page.
- A product with 200 variants does not need 200 full blocks: describe in full the variant the page shows, and list the others with their own offers or by `url` alone. mttr's check marks a group whose variants are all addresses as invalid, since no variant on the page then has its own price.
- A product whose only variant is the platform's default (Shopify's `has_only_default_variant`) is a plain `Product`, not a group.

## A sale price

Put the price the shopper pays in `price`. To show the price before the sale, add a `priceSpecification` with `priceType` set to `https://schema.org/StrikethroughPrice` on the higher price. Never mark the active price with a `priceType`. If both `price` and `priceSpecification.price` are given for the active price, `offers.price` wins.

```json
"offers": {
  "@type": "Offer",
  "price": 54.00,
  "priceCurrency": "USD",
  "priceSpecification": {
    "@type": "UnitPriceSpecification",
    "priceType": "https://schema.org/StrikethroughPrice",
    "price": 68.00,
    "priceCurrency": "USD"
  },
  "priceValidUntil": "2026-11-30",
  "availability": "https://schema.org/InStock"
}
```

`priceValidUntil` belongs only where the sale has an end date. A date that has passed may stop the listing showing, and mttr's check marks it invalid. WooCommerce and BigCommerce's Cornerstone theme both write a date a year or more ahead on every price; leave that unless it is false, and never write a past one.

## Shipping and returns, once for the whole shop

Google recommends one shipping policy and one return policy for the shop, on its `Organization` (or `OnlineStore`) with `hasShippingService` and `hasMerchantReturnPolicy`, and offer-level policies only where a product differs. You do not need them on every page for Google. mttr's check reads only the page it is given, so it counts a shop-wide policy only when that `Organization` block is in the product page's own HTML; putting it in the layout every page shares satisfies both.

```json
{
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  "@id": "https://shop.example/#store",
  "name": "Field and Loom",
  "url": "https://shop.example",
  "hasMerchantReturnPolicy": {
    "@type": "MerchantReturnPolicy",
    "applicableCountry": ["US"],
    "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
    "merchantReturnDays": 30,
    "returnMethod": "https://schema.org/ReturnByMail",
    "returnFees": "https://schema.org/FreeReturn"
  },
  "hasShippingService": {
    "@type": "ShippingService",
    "name": "Standard",
    "shippingConditions": [
      {
        "@type": "ShippingConditions",
        "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "US" },
        "orderValue": { "@type": "MonetaryAmount", "minValue": 0, "maxValue": 99.99, "currency": "USD" },
        "shippingRate": { "@type": "MonetaryAmount", "value": 6.00, "currency": "USD" },
        "transitTime": { "@type": "ServicePeriod", "duration": { "@type": "QuantitativeValue", "minValue": 2, "maxValue": 5, "unitCode": "DAY" } }
      },
      {
        "@type": "ShippingConditions",
        "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "US" },
        "orderValue": { "@type": "MonetaryAmount", "minValue": 100, "currency": "USD" },
        "shippingRate": { "@type": "MonetaryAmount", "value": 0, "currency": "USD" },
        "transitTime": { "@type": "ServicePeriod", "duration": { "@type": "QuantitativeValue", "minValue": 2, "maxValue": 5, "unitCode": "DAY" } }
      }
    ]
  }
}
```

Return policy rules:

- Required: `applicableCountry` (two-letter codes, up to 50) and `returnPolicyCategory`, one of `MerchantReturnFiniteReturnWindow`, `MerchantReturnNotPermitted` or `MerchantReturnUnlimitedWindow`. A finite window needs `merchantReturnDays`.
- On the `Organization`, Google also accepts `merchantReturnLink` alone, an address of the policy page. WooCommerce writes exactly that, and only on its refund and returns page. mttr's check asks for the countries and the category, so give those on any block meant for product pages.
- `returnFees` is `FreeReturn`, `ReturnFeesCustomerResponsibility` or `ReturnShippingFees`; the last needs `returnShippingFeesAmount`.
- At the offer, only `applicableCountry`, `returnPolicyCategory`, `merchantReturnDays`, `returnFees`, `returnMethod` and `returnShippingFeesAmount` are read, or an `@id` pointing at the shop's policy.

Shipping rules:

- At the offer, `shippingDetails` is an `OfferShippingDetails` with `shippingRate` (a `currency` that matches the offer's and a `value` or `maxValue`), `shippingDestination` and `deliveryTime`. One rate per object; give several objects for several rates. Free shipping is a `value` of `0`.
- `deliveryTime` holds `handlingTime` and `transitTime`, each a `QuantitativeValue` with whole-number `minValue` and `maxValue` and a `unitCode` of `DAY` or `d`.
- On the `Organization`, a `ShippingService` holds one or more `shippingConditions`. With no `shippingDestination`, a condition covers every destination. Where several match, Google uses the lowest cost.
- To point an offer at the shop's service, give `shippingDetails` only `hasShippingService` with its `@id`.

Which wins when the same policy is stated in more than one place, strongest first: product-level Merchant Center feeds, Content API for Shopping settings, Merchant Center or Search Console settings, product-level markup, then Organization-level markup. Where a shop has set shipping and returns in Merchant Center, the markup is not what Google uses, and saying so in the report is the right answer.

## Identifiers: GTIN, MPN, SKU, brand

- Use the most specific GTIN property for the number's length: `gtin8`, `gtin12` (UPC), `gtin13` (EAN), `gtin14`, or `gtin` for any. Digits only, never an address. mttr's check also tests the last digit, so a mistyped or made-up number shows as invalid.
- `isbn` is valid only on a `Book`; type the item as both `Book` and `Product`.
- A barcode field often holds things that are not GTINs: an internal code, a number starting with 2 (store-assigned), letters. Print the GTIN property only when the value is 8, 12, 13 or 14 digits, and leave it out otherwise.
- `mpn` is the manufacturer's part number, never the shop's own code. `sku` is the shop's, one value, no whitespace.
- `brand` is one `Brand` with a `name`. A shop that makes its own goods uses its own brand. A product with no brand has no `brand` at all: never "Generic", "N/A" or the shop's name on someone else's product.

## Ratings and reviews

- Mark up a rating only when the page shows it, from reviews of this product collected by the shop or its review app. Never aggregate ratings from other sites.
- `aggregateRating` needs `ratingValue` and `ratingCount` or `reviewCount` above zero; `bestRating` is 5 unless said.
- Each `review` needs an `author` that is a valid `Person` or `Team` with a real name ("Ana Ruiz", not "50% off on Black Friday"), and a `reviewRating` with a `ratingValue`.
- Google's rule against self-serving reviews is about `LocalBusiness` and `Organization` markup, not a shop's reviews of the products it sells.

## Writing the block safely

- One `Product` or `ProductGroup` per product page. Two blocks for one product give two answers.
- The block is in the HTML the server sends. Google can read JSON-LD added by script, but says markup generated by script can make Shopping crawls less frequent and less reliable, which matters most for price and stock, and mttr's check does not run script.
- Escape the JSON as the platform does: `| json` in Liquid, `wp_json_encode` in WordPress, `JSON.stringify(data).replace(/</g, '\\u003c')` in React, `json_encode` with the theme's escaping in Magento, `JSONstringify` in BigCommerce's Handlebars. A product description with `</script>` in it must not end the block.
- A block that does not parse is ignored whole. A trailing comma after the last variant in a template loop is the usual cause; mttr's answer lists each block with `parses` and the error.

## Sources

- [Merchant listing (Product, Offer) structured data](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing): the required and recommended fields, the availability and condition values, strikethrough prices, offer-level shipping and returns, identifiers, and the order in which policies win.
- [Product variant structured data (ProductGroup, Product)](https://developers.google.com/search/docs/appearance/structured-data/product-variants): ProductGroup, variesBy and its values, variant ids, and the single page and multi page approaches.
- [Merchant return policy (MerchantReturnPolicy) structured data](https://developers.google.com/search/docs/appearance/structured-data/return-policy): the return policy on the Organization, its required fields and values, and which source wins.
- [Merchant shipping policy (ShippingService) structured data](https://developers.google.com/search/docs/appearance/structured-data/shipping-policy): the shipping service on the Organization, its conditions, and the lowest-cost rule.
- [Review snippet (Review, AggregateRating) structured data](https://developers.google.com/search/docs/appearance/structured-data/review-snippet): ratings visible on the page, no ratings from other sites, and where self-serving reviews apply.

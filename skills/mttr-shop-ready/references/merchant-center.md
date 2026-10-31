# The feed and the page

What the Merchant Center feed is, how it and the page's Product data meet, and why the two must agree. Read on October 18, 2026, from Google's Merchant Center Help and Search Central. The feed and the account stay with the person: this file is so you can tell them what the code changed means for their feed, not so you change it.

## Two sources, one product

A shop tells Google about a product twice:

- The feed, sent to Merchant Center: one row per variant with `id`, `title`, `link`, `image_link`, `price`, `availability`, `gtin`, `mpn`, `brand`, `item_group_id` and more. On most platforms an app or extension writes it from the same catalog the store uses.
- The page's Product data, which Google reads when it crawls the product page.

Google uses the page to check the feed. Merchant Center's price attribute must match "the price on your landing page and the checkout pages", and its availability must match the landing page, checkout and structured data. With automatic item updates on (the default), Google reads the page's structured data to correct the feed's price, availability and condition, and may disapprove the product instead when it finds a mismatch. Google may also check merchant listing data before showing it.

So the code fix in this skill matters even to a shop that lives on its feed: a page whose data disagrees with what the page shows, or with the feed, is a reason for Google to distrust both.

## The fields side by side

| Feed attribute | Page's Product data | Keep in step |
|---|---|---|
| `id` | variant `sku` | Use the SKU as the feed id where possible, so one value names the variant everywhere |
| `item_group_id` | `productGroupID` | The parent SKU in both. Required in the feed for variants in the US, UK, Germany, France, Japan and Brazil, and for all variants in free listings |
| `price` (`68.00 USD`) | `price` `68.00`, `priceCurrency` `USD` | Same amount and currency as the page and checkout |
| `sale_price` | `price`, with the old price as a `StrikethroughPrice` | In the feed `price` stays the regular price and `sale_price` holds the sale; on the page `price` is what the shopper pays |
| `availability` (`in_stock`, `out_of_stock`, `preorder`, `backorder`) | `InStock`, `OutOfStock`, `PreOrder`, `BackOrder` | Same state for the same variant. Preorder and backorder in the feed need an `availability_date` |
| `condition` | `itemCondition` | Required in the feed for used and refurbished goods |
| `gtin` | `gtin8` to `gtin14` | Digits only, passing the check digit; a wrong GTIN gets the product disapproved |
| `mpn` | `mpn` | Only the manufacturer's number |
| `brand` | `brand.name` | Empty when there is none, never "Generic" or "N/A" |
| `identifier_exists` | (no field) | `no` only when the product truly lacks the identifiers its category needs; the page simply leaves them out |
| `shipping`, return settings | `shippingDetails`, `hasMerchantReturnPolicy` | Account settings in Merchant Center outrank the markup |

## Prices and tax

- In the US and Canada, the feed's price leaves out sales tax. In most other countries it includes VAT or GST, and so does the price the page shows. The page's `price` is the one the page shows, whichever that is.
- The currency is the target country's. A shop that shows prices in the shopper's currency (a currency switcher, or one storefront per market) writes the currency the HTML shows in that request, and the feed for each country carries that country's price.
- Prices must stay visible on the page when a product is out of stock.

## Platform feeds

- Shopify: the Google & YouTube sales channel, installed from the Shopify App Store, connects the store to Merchant Center and syncs its products. It is available only in some countries and currencies.
- WooCommerce: the Google for WooCommerce extension (once named Google Listings and Ads) syncs the product feed, prices and stock to Merchant Center and maps attributes by default. Its page tells merchants to set shipping in Merchant Center for each country they sell to.
- Other platforms have their own apps or a scheduled file. Ask the person which one they use; do not install or configure one.

## What to tell the person

- Where the markup now states something the feed does not, such as a GTIN the barcode field held all along, the feed may want the same value. Say which field and leave it to them.
- Where shipping and returns are set in Merchant Center, those settings are what Google uses, whatever the page says. The markup is still worth having for every other reader, and must not contradict the settings.
- Merchant Center's diagnostics and Search Console's Merchant listings report say what Google made of the data after it has crawled the pages again, which takes days. Neither is something you can read for them.

## Sources

- [Product data specification](https://support.google.com/merchants/answer/7052112): each feed attribute's format: price, sale price, availability, GTIN, MPN, brand, identifier_exists, item_group_id and condition.
- [Price [price]](https://support.google.com/merchants/answer/6324371): the price must match the landing page and checkout, and how tax is counted by country.
- [Allow Merchant Center to update product information automatically](https://support.google.com/merchants/answer/3246284): automatic item updates read the page's structured data for price, availability and condition, and mismatches can disapprove.
- [Google & YouTube](https://help.shopify.com/en/manual/online-sales-channels/google): Shopify's sales channel that syncs products to Merchant Center.
- [Google for WooCommerce for WooCommerce](https://woocommerce.com/products/google-listings-and-ads/): the WooCommerce extension that syncs the feed, and its note on shipping.

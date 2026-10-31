# Structured data for each kind of page

Write JSON-LD in one `<script type="application/ld+json">` block per page, in the HTML the server sends, built from the same data the page shows. Values here are samples: every one comes from the site's own data, never typed in by hand.

## How to write it

- One graph per page under `@graph`, each thing with an `@id` so others can point at it. The business is described once, on the home page, and other pages point at its `@id`.
- Full `https` addresses for `url`, `image` and `@id`.
- Escape the block the way the framework escapes JSON in a script tag, so nothing in the data can close the tag: `JSON.stringify(data).replace(/</g, '\\u003c')` in React and Next.js, `wp_json_encode` in WordPress, `| json` in Liquid for plain text values (Shopify says it escapes quotes and says nothing of `</script>`, so keep fields with HTML in them out).
- One block of each type per page. Two `Organization` blocks, or a plugin's and a template's, give two answers: keep one.
- Nothing the page does not state. Google's structured data policies say markup must describe content visible to the reader.

## Home: the business and the site

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://example.com/#business",
      "name": "Hollow Creek Drainage",
      "url": "https://example.com/",
      "logo": "https://example.com/logo.png",
      "image": "https://example.com/og.png",
      "telephone": "+1-314-555-0100",
      "address": { "@type": "PostalAddress", "streetAddress": "100 Main St", "addressLocality": "St. Louis", "addressRegion": "MO", "postalCode": "63101", "addressCountry": "US" },
      "areaServed": ["St. Louis", "St. Charles"],
      "sameAs": ["https://www.facebook.com/hollowcreekdrainage"]
    },
    { "@type": "WebSite", "@id": "https://example.com/#site", "url": "https://example.com/", "name": "Hollow Creek Drainage", "publisher": { "@id": "https://example.com/#business" } }
  ]
}
```

- Use `Organization` for a business with no place customers visit and no area it serves. Use the most specific `LocalBusiness` subtype schema.org has, such as `Plumber` or `GeneralContractor`, where one fits.
- A service area business with no public address leaves `address` out, or gives the locality only, as its own pages state it. Google lists `name` and `address` as required for its local business results, so such a business may not get that result; never give an address to earn it.
- `telephone` with the country and area code, as `+1-314-555-0100`. Google asks for both.
- `logo` is at least 112 by 112 pixels, a format Google Images supports, and looks right on white.
- Google suggests the business data on the home page or one page about the business, not on every page. Other pages point at its `@id`.
- Opening hours, where the page states them:

```json
"openingHoursSpecification": [
  { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "07:00", "closes": "17:00" }
]
```

A day closed all day is `"opens": "00:00", "closes": "00:00"`; open all day is `"00:00"` to `"23:59"`. `validFrom` and `validThrough` are only for a seasonal change.

## Service

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://example.com/services/french-drains#service",
      "name": "French drain installation",
      "serviceType": "Drainage",
      "description": "The page's own meta description.",
      "provider": { "@id": "https://example.com/#business" },
      "areaServed": ["St. Louis", "St. Charles"],
      "url": "https://example.com/services/french-drains"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://example.com/services" },
        { "@type": "ListItem", "position": 3, "name": "French drains" }
      ]
    }
  ]
}
```

- An `offers` with a price only where the page states that price.
- `Service` has no rich result of its own in Google. It tells any reader of the data what the page offers and who provides it, which is what mttr's `schema-fits` looks for.
- A `BreadcrumbList` has at least two items. The last, the page itself, needs no `item`. Google suggests the trail follow the way a person reaches the page rather than copy the address, so a page at `/french-drains` may still have Home, Services, French drains.

## Article

One graph for the page: the page itself, its trail and the article, each pointing at the others by `@id`.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://example.com/guides/french-drain-depth",
      "url": "https://example.com/guides/french-drain-depth",
      "name": "How deep should a french drain be?",
      "isPartOf": { "@id": "https://example.com/#site" },
      "breadcrumb": { "@id": "https://example.com/guides/french-drain-depth#trail" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://example.com/guides/french-drain-depth#trail",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
        { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://example.com/guides" },
        { "@type": "ListItem", "position": 3, "name": "How deep should a french drain be?" }
      ]
    },
    {
      "@type": "Article",
      "@id": "https://example.com/guides/french-drain-depth#article",
      "mainEntityOfPage": { "@id": "https://example.com/guides/french-drain-depth" },
      "headline": "How deep should a french drain be?",
      "image": [
        "https://example.com/img/drain-trench-16x9.jpg",
        "https://example.com/img/drain-trench-4x3.jpg",
        "https://example.com/img/drain-trench-1x1.jpg"
      ],
      "datePublished": "2026-03-02T09:00:00-06:00",
      "dateModified": "2026-10-16T14:20:00-05:00",
      "author": [{ "@type": "Person", "name": "Dana Ruiz", "url": "https://example.com/about#dana" }],
      "publisher": { "@id": "https://example.com/#business" }
    }
  ]
}
```

- No property is required for Google's article result; `headline`, `image`, `datePublished`, `dateModified` and `author` are the ones it recommends.
- Dates in ISO 8601 with the time zone. Without one, Google assumes Googlebot's.
- `dateModified` changes only when the content does, and matches the date shown on the page.
- Every author the page names is in `author`, each in an entry of its own, as a `Person` or an `Organization`. `author.name` is the name alone, no "By" and no job title; `author.url` is a page about that author, such as the about page's anchor.
- `image` is a picture of the article's subject, not the logo, at least 50,000 pixels in area (width times height). Google asks for 16 by 9, 4 by 3 and 1 by 1 versions; give the ones the site has.
- `BlogPosting` for a post, `NewsArticle` for news; the shape is the same.

## Product

`Product` with an `Offer` for each variant, or a `ProductGroup` with `hasVariant`. The `mttr-shop-ready` skill covers every field Google lists for merchant listings and checks it with `mttr_product_check`. Use it rather than writing Product data from here.

## FAQ, only where it is real

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Do you need a permit for a french drain?", "acceptedAnswer": { "@type": "Answer", "text": "The answer as the page shows it." } }
  ]
}
```

- Every question is on the page word for word, and every answer is the one the page shows. mttr's `faq-matches-page` checks the questions.
- Google no longer shows FAQ results in Search, and took down its documentation for them in June 2026. Mark up an FAQ because the page has one, for any reader of the data, never to win a result.

## Hub and plain page

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Services",
  "url": "https://example.com/services",
  "isPartOf": { "@id": "https://example.com/#site" }
}
```

Use `WebPage`, or `AboutPage` and `ContactPage` where they fit, for a plain page, with a `BreadcrumbList` below the home page.

## Building it from data, worked

Before: JSON typed into a template, so one stray quote breaks every page, and the values drift from the page.

```liquid
<script type="application/ld+json">
{ "@type": "Service", "name": "{{ page.title }}", "description": "{{ page.summary }}", }
</script>
```

After: an object built from the page's own fields and serialized once.

```js
const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Service', '@id': `${url}#service`, name: page.title, description: page.summary,
      provider: { '@id': `${origin}/#business` }, areaServed: page.towns, url },
    breadcrumbOf(page),
  ],
};
const html = `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>`;
```

- A field the page leaves empty is left out of the object, not written as `""`.
- `mttr_schema_create({ type: "Service", fields: { ... } })`, or the free schema creator at `https://mttr.si/schema-generator`, gives a block from the fields given, with the required ones left empty for you to fill, never made up.

## What breaks it

| Symptom | Cause | Fix |
|---|---|---|
| The block does not parse | A trailing comma, a raw quote or line break in a value, a template tag left in | Serialize an object; never assemble JSON as text |
| Two answers for the business | A plugin and the theme each write `Organization` | Keep one; turn the other off at its source |
| A type mttr does not see | `"@type": "service"` (case matters), or the block added by script after load | The exact schema.org type name, in the server's HTML |
| Addresses that point nowhere | Relative `url`, `image` or `@id` | Full `https` addresses |
| An `@id` used for two things | The page and the article share one `@id` | A fragment for each thing: `#article`, `#trail`, `#business` |
| A date with no zone, or the wrong day | `2026-10-16` from a server in another zone | A full ISO 8601 date and time with its offset |

## Never

- A rating or review count unless the reviews it counts are on the page.
- An address, phone, license, price, date or author the page does not state.
- Markup added by script after the page loads. mttr reads the HTML the server sends.

## Check it

- `https://mttr.si/schema-checker?url=<page>` reads every block on one page, or a block pasted in.
- Over MCP, `mttr_page({ site, path })` shows the structured data rules a page fails.
- Google's Rich Results Test, https://search.google.com/test/rich-results, is Google's own read of one page.
- From the command line, every block the server sends, parsed. Save the page first, then read the file:

```sh
curl -s -o page.html https://<page>
node -e '
  const html = require("fs").readFileSync("page.html", "utf8");
  for (const [, body] of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    try { const data = JSON.parse(body); console.log(JSON.stringify(data["@graph"] ?? data, null, 1).slice(0, 2000)); }
    catch (e) { console.log("does not parse:", e.message); }
  }'
```

A pass prints each graph with the types you expect. A fail prints "does not parse", or nothing at all when the block is added by script.

## Sources

- [Introduction to structured data markup in Google Search](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data): why JSON-LD, and how Google reads it.
- [General structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies): the rule that markup states only what the page shows.
- [Organization (Organization) structured data](https://developers.google.com/search/docs/appearance/structured-data/organization): the fields for the home page's Organization, the logo's size, and the home or about page as its place.
- [Local business (LocalBusiness) structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business): `name` and `address` as required, the phone with its country code, and the format of opening hours.
- [Article (Article, NewsArticle, BlogPosting) structured data](https://developers.google.com/search/docs/appearance/structured-data/article): the recommended properties, the author rules, dates with a time zone, and the image sizes.
- [Breadcrumb (BreadcrumbList) structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb): at least two items, no `item` needed on the last, and a trail that follows a person's path.
- [Latest documentation updates](https://developers.google.com/search/updates#removing-faq-rich-result): Google's note that FAQ results are no longer shown in Search.
- [Rich Results Test](https://search.google.com/test/rich-results): Google's own read of one page.
- [LocalBusiness](https://schema.org/LocalBusiness): the type and its properties.
- [Service](https://schema.org/Service): the type for a service page.
- [Article](https://schema.org/Article): the type for an article page.
- [BreadcrumbList](https://schema.org/BreadcrumbList): the type for the trail.
- [FAQPage](https://schema.org/FAQPage): the type for questions and answers the page shows.
- [OpeningHoursSpecification](https://schema.org/OpeningHoursSpecification): the type for opening hours, with `dayOfWeek`, `opens` and `closes`.
- [How to implement JSON-LD in your Next.js application](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/json-ld.mdx): the `\u003c` escape for a block written from React.

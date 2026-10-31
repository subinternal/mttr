# Bringing an existing site onto the page system

Most sites are not new. This is the order to move a live site onto the patterns without losing what it already ranks for, one template at a time, each proven before the next.

## The order

1. **Baseline.** `mttr_site({ site })`, `mttr_brief({ site })` and `mttr_pages({ site })`, kept as they came back. With no key, the site's report at `https://mttr.si/report/<domain>`. Save the list of live addresses too: the sitemap, and `mttr_map({ site })`.
2. **Group pages by template.** For each template, the addresses it makes and the kind mttr files them under (`mttr_pages({ site, kind: "service" })`). A template whose pages are filed under the wrong kind is checked against too few rules: fix the kind first (step 1 of the skill).
3. **Rank the templates.** Work first on the template with the most pages failing the heaviest rules. `mttr_pages({ site, failing: "<rule>" })` for each failing rule in the brief shows which template the failures share.
4. **The frame first.** The shared layout touches every page at once and changes no address: title, description, canonical, landmarks, share tags, one `h1` out of the header. Ship it alone and check it.
5. **One template at a time.** The outline, the structured data and the links for one kind of page; ship, rescan, compare; then the next.
6. **Addresses last, and only if they must change.** See below.

Each step is small enough to undo by reverting one change. Never mix a frame change and an address change in one release: if traffic moves, you will not know which did it.

## What not to change while migrating

- An address that already ranks, unless it is wrong in a way that costs more than the move.
- The copy's meaning, prices, policies or offers. Move a paragraph under its question; do not rewrite what it says without the person.
- `noindex` on a page that has it, until the person says the page should be found.
- Anything a second system owns: a plugin's markup, a CMS field, a theme's settings. Find where it is made and change it there, or turn the plugin's part off; never patch its output after the fact.

## When an address has to move

Google's guide to moving a site lays out the same steps for a few pages as for a whole domain.

1. Map every old address to its one new address, from the sitemap, the server logs and analytics. Images and files count.
2. Redirect each old address to its new one with a permanent, server-side redirect (301 or 308) in one hop. Never send a set of pages to the home page.
3. Change the links in the site's own pages, menus and sitemap to the new addresses, so nothing leans on the redirect (`direct-links`).
4. Each new page has a canonical to itself, and the sitemap lists the new addresses only.
5. Keep the redirects for as long as possible, generally at least a year.

Check every mapped address with `https://mttr.si/redirect-checker?url=<old address>`: one hop, permanent, landing on a page that answers 200.

## Where the parts live, by platform

Only what is genuinely different on each. Everywhere else the patterns are plain HTML.

### Next.js (App Router)

- Title, description, canonical (`alternates.canonical`) and share tags (`openGraph`, `twitter`) from `export const metadata` or `generateMetadata` in `layout` or `page`, so each page's values come from its own data. Both work only in server components.
- JSON-LD as a `<script type="application/ld+json">` in the page's server component, built from the page's data, with `JSON.stringify(data).replace(/</g, '\\u003c')` so no value can close the tag. Next.js's own guide gives exactly this.
- A server component sends its text in the HTML. A client component that fetches its text after load does not: keep the page's words out of `useEffect`.
- `app/sitemap.ts` and `app/robots.ts` make both files from the same data as the pages.

### Shopify (Liquid themes)

- The frame is `layout/theme.liquid`, the layout every template is drawn through: `content_for_layout` is where each page's own content goes, inside `<main>`.
- JSON-LD values through the `json` filter, `{{ product.title | json }}`, which quotes and escapes them. Shopify's documentation says it escapes quotes; it says nothing of `</script>`, so do not pass raw HTML fields such as a description with tags into it.
- Product data is the `mttr-shop-ready` skill's job.

### WordPress

- Before writing any JSON-LD or meta tags, view the page's source and see whether a plugin already writes them. Two plugins, or a plugin and the theme, each writing an `Organization` give two answers: keep one and turn the other off in its settings.
- Escape JSON-LD with `wp_json_encode`.

### A single page app

- Every page needs its own address the server can answer with that page's HTML: server rendering or prerendering, not a shell that a script fills in.
- `noindex` must not be in the HTML the server sends if the page should be found. Google may skip rendering a page that says `noindex`, so a script that removes it later may never run.
- A missing page answers 404 from the server, or the script sends it to an address that does.

## Proving each release

After each release goes live:

```
mttr_rescan({ site, reason: "frame: canonical, landmarks, one h1" })
mttr_job({ id })                                  until it is done
mttr_changes({ site })                            rules now passing, rules newly failing, pages added and removed
mttr_pages({ site, failing: "<rule>" })           any page of the template still failing
```

- A rule newly failing is the first thing to read. A frame change that adds a second `h1` site-wide, or a canonical with the wrong host, shows here on every page at once.
- Pages removed that should not be: an address that now redirects or answers 404. Check it before the next release.
- A site is read at most once every ten minutes.

## Sources

- [How to move a site](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes): mapping old addresses, permanent server-side redirects in one hop, updating links and sitemaps, and keeping redirects a year or more.
- [Redirects and Google Search](https://developers.google.com/search/docs/crawling-indexing/301-redirects): which redirects Google reads as permanent and which as temporary, and why server-side is best.
- [How to implement JSON-LD in your Next.js application](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/json-ld.mdx): Next.js's own guide to JSON-LD in a server component, with the `<` escape.
- [generateMetadata](https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/04-functions/generate-metadata.mdx): the metadata object and function, the canonical and share fields, and that they run only in server components.
- [sitemap.xml](https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.mdx): `app/sitemap.ts`, a sitemap made by a function from the site's data.
- [robots.txt](https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.mdx): `app/robots.ts`, with the line that names the sitemap.
- [Layouts](https://shopify.dev/docs/storefronts/themes/architecture/layouts): `theme.liquid` as the layout every template is drawn through.
- [Liquid filters: json](https://shopify.dev/docs/api/liquid/filters/json): what Shopify's `json` filter escapes, and what it does not say it escapes.

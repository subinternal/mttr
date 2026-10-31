# Links, hubs and the sitemap

The links between pages are how a crawler finds them and how it learns what each is about. This file is for step 5 of the skill. Every pattern here is drawn from the same data as the pages, so a new page is linked the day it is made.

## How mttr reads links

- `within-three-clicks` follows links from the home page and fails a page more than three clicks away.
- `linked-in-context` fails an article or service page that no other page links to from its content. A link in `nav` is a menu link and does not count, and nor does one in a form.
- `no-orphans` names pages mttr found (in the sitemap, say) that no link leads to. A read that stopped at its page limit names none, since it cannot know.
- `direct-links` fails a page reached through a redirect. The fix is in the link, not the page.
- `loads` fails any linked page that does not answer 200.
- `pages-are-distinct` compares pages of the same kind (articles with articles, service pages with service pages) and fails any pair that shares half or more of its main text.

## The tree

```
/                              home: links to every hub and the pages that matter most
├── /services                  hub: every service, title and one line
│   ├── /services/french-drains
│   └── /services/dry-wells
├── /service-area              hub: every town served
│   └── /service-area/st-charles
├── /guides                    hub: every guide, newest first, paged
│   └── /guides/french-drain-depth
├── /about  /contact  /pricing
```

- Home to hub is one click, hub to page is two. A page linked from a hub is within three clicks however deep its address is.
- The footer links every hub, so each hub is one click from every page.
- An address says where a page sits, in words, with hyphens: `/services/french-drains`, not `/p?id=1182`. Pick lower case and one trailing slash style, and redirect the other.

## Hub and spoke, worked

The hub lists every page of its kind from the same data that makes the pages. The pages link back to the hub through their breadcrumb, and across to their neighbors in the text.

```html
<!-- /services -->
<main>
  <h1>Drainage services</h1>
  <p>Every drainage job we take on, from a single downspout to a full yard.</p>
  <ul>
    <li><h2><a href="/services/french-drains">French drain installation</a></h2>
      <p>Trenches that carry surface and ground water away from a house.</p></li>
    <li><h2><a href="/services/dry-wells">Dry wells</a></h2>
      <p>A buried pit that takes a downspout's water where no outlet is near.</p></li>
  </ul>
</main>
```

```html
<!-- in the text of /services/french-drains -->
<p>Where the water comes from one downspout and there is no low ground to drain to, a
  <a href="/services/dry-wells">dry well</a> is often the simpler fix.</p>
```

- The link's words say what the other page is: "dry well", not "click here". Google asks for anchor text that is descriptive, reasonably concise and relevant to both pages.
- A link in a sentence counts for `linked-in-context`. A "Related" list in an `<aside>` inside `<main>` counts too; one inside a `nav` does not.
- Link a guide to the service it is about, and a service to the guides that answer its buyers' questions. That pair of links is the one most templates miss.

## Links a crawler can follow

- An `<a href="/real/path">`. A `<button>` or a `<div onclick>` that changes the address is not a link to Google's crawler, and a crawler does not click.
- A real address, never `#/page` or `javascript:`. A single page app uses the History API with real addresses, each of which the server can answer on its own.
- The final address. When a page moves, change the links that point at it, not only the redirect.
- Root-relative (`/services/dry-wells`) or full addresses, never `../dry-wells`, which can make addresses that do not exist.

## Paged hubs

```html
<!-- /guides?page=2 -->
<link rel="canonical" href="https://example.com/guides?page=2">
...
<nav aria-label="Pages">
  <a href="/guides">1</a> <a href="/guides?page=2" aria-current="page">2</a> <a href="/guides?page=3">3</a>
  <a href="/guides?page=3">Next</a>
</nav>
```

- Each page of the list has its own address and a canonical to itself, never to page one.
- Each links to the next with `<a href>`, and back to the first.
- "Load more" and infinite scroll give a crawler nothing past the first screen unless each step also has an address linked this way.
- A filter or sort that makes a new address of the same list is kept out with `noindex`, or out of the crawl in `robots.txt`.

## Town and location pages

A page for each town that swaps only the town's name is what Google's spam policies call doorway abuse, and mttr's `pages-are-distinct` catches it when half or more of the text is shared.

- Give each town page what is true of that town: jobs done there, the soil or the rules that differ, how far the crew travels, photos from there. If there is nothing, keep one service area page with the towns listed.
- Shared blocks inside `<main>`, such as a "Why choose us" paragraph on every page, count toward the shared text. Keep repeated copy short, or outside `<main>`.
- Check with `mttr_pages({ site, section: "/service-area" })` and the site's report: a failing `pages-are-distinct` names the closest pair and how much they share.

## The sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.com/services/french-drains</loc><lastmod>2026-10-16</lastmod></url>
</urlset>
```

```
# robots.txt
Sitemap: https://example.com/sitemap.xml
```

- Made from the same data as the pages, so it lists every page that should rank and nothing that should not: no `noindex` pages, no redirects, no filters.
- Full, canonical addresses only.
- `lastmod` only when it is the real date of the last change that mattered; Google uses it only when it is consistently accurate. It ignores `priority` and `changefreq`, so leave them out.
- Up to 50,000 addresses or 50 MB a file; past that, a sitemap index.

## Check it

| What | How | Pass | Fail |
|---|---|---|---|
| Clicks from home | `mttr_structure({ site })`, or `mttr_map({ site, view: "links" })` | Every section within three clicks | A section at four or more, or pages no link leads to |
| Links in content | `mttr_pages({ site, failing: "linked-in-context" })` | An empty list | The pages to link to from a related page's text |
| Redirected and broken links | `mttr_links({ site })`, `mttr_pages({ site, failing: "direct-links" })` | Nothing broken, nothing reached through a redirect | Each link to fix, with the page it is on |
| One page's redirects | `https://mttr.si/redirect-checker?url=<page>` | One hop or none | A chain, or a temporary redirect for a page that moved for good |
| The sitemap | `curl -s https://<domain>/sitemap.xml \| grep -c '<loc>'` against the count of pages that should rank | The same number | More (pages that redirect or are kept out) or fewer |

## Sources

- [Link best practices for Google](https://developers.google.com/search/docs/crawling-indexing/links-crawlable): what makes a link crawlable, anchor text, and a link to every page that matters.
- [URL structure best practices for Google Search](https://developers.google.com/search/docs/crawling-indexing/url-structure): words with hyphens, one case, no fragments for content, and root-relative links.
- [Pagination, incremental page loading, and their impact on Google Search](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading): a canonical for each page of a list, links to the next and the first, and load more given addresses.
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap): full canonical addresses, accurate lastmod, the size limits, and the robots.txt line.
- [Spam policies for Google web search](https://developers.google.com/search/docs/essentials/spam-policies): doorway abuse and scaled content abuse, the risk in town pages that swap only a name.

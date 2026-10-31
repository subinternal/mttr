# When a rule still fails

The fix is in place and mttr still reports the rule. Most often the change did not reach the HTML the server sends, or reached one template and not another. Start every case the same way:

1. Is the change live? `curl -s https://<page> | grep -c '<the thing you added>'`. Zero means it is not deployed, is cached, or is added by script after load.
2. Was the site read after it went live? `mttr_rescan({ site, reason })`, then `mttr_job({ id })` until done. A site is read at most once every ten minutes.
3. Which pages still fail? `mttr_pages({ site, failing: "<rule>" })`. If they share a template, the fix missed that template; if they share a CMS field, the field is empty.
4. What does the page itself say? `mttr_page({ site, path })` gives the rule's finding in words, such as "2 h1 headings" or "Canonical points to /services".

## By rule

| Rule | Symptom | Likely cause | Fix |
|---|---|---|---|
| `one-h1` | "2 h1 headings" on every page | The logo or site name is an `h1` in the header, or a mobile menu repeats one | The logo is a link; only the page's own heading is an `h1` |
| `one-h1` | "0 h1 headings" | The heading is drawn by script, or the template uses a styled `div` | An `h1` in the server's HTML |
| `canonical` | "Canonical points to /x" on many pages | The layout writes one canonical for all pages, or the home page's | Build it from the page's own final path |
| `canonical` | Fails on `/services/` but not `/services` | A trailing slash in one and not the other | One trailing slash style, the other redirected, the canonical matching |
| `indexable` | Pages marked `noindex` after launch | A staging setting or an environment flag left on, or an `X-Robots-Tag` header from the server or CDN | Set it per page from data; check headers with `curl -sI` |
| `title` | Too long on every page | The site name added twice, by the template and a plugin | One place adds the suffix. mttr leaves out of the count a suffix after `\|` or ` - ` that most pages share, so 15 to 65 characters is for the page's own part |
| `description` | Too short, or the same everywhere | A default in the layout, never set per page | From the page's own summary field, 70 to 165 characters |
| `content-in-html` | Few words, though the page looks full | The text arrives by script after load | Server render, or prerender the page |
| `depth` | Too few words on a service page | The page is a heading and a form | True detail: what is included, how the price is reached, the area. Never filler |
| `structured-data` | "JSON-LD block(s) do not parse" | A trailing comma, a raw quote or line break in a value, or a template tag left in | Build it from an object and serialize it; never assemble JSON by hand |
| `schema-fits` | No `Service` on a service page, though one is written | The block is on another page, inside a script that runs later, or its `@type` is misspelt | One server-rendered block on the page it describes |
| `breadcrumb` | No `BreadcrumbList` though a trail shows | The visible trail has no data beside it | Write both from the same list |
| `faq-matches-page` | Questions in the data not on the page | The FAQ data comes from another field than the text, or the answers sit in a panel the server never sends | Both from one list, every question in the HTML |
| `ratings-are-real` | Rating data with no reviews | A theme or app adds `aggregateRating` site-wide | Remove it, or show the reviews it counts on that page |
| `question-headings` | No question heading, though one reads as a question | It does not end in a question mark, or it is a `strong` or `h4`, not an `h2` or `h3` | Make it an `h2` or `h3` that ends in "?" |
| `answer-first` | "The paragraph under the first question is 0 words" | The answer is in a `div` or a list, not a `p`, or an image or button sits in a `p` first | The answer as the first `p` after the heading, 25 to 90 words |
| `image-alt` | Images with no alt text, though alt is set | The images are in a component that drops the attribute, or alt comes from an empty field | Pass alt through; mark true decoration `role="presentation"` |
| `has-image` | No image, though the page shows one | The picture is a CSS background | An `img` with alt text |
| `linked-in-context` | No page links here from its content | The only links are in the menu or footer | A link in the text of a related page |
| `direct-links` | Reached through a redirect | Links still point at the old address | Change the links, keep the redirect |
| `pages-are-distinct` | Two pages share most of their text | Town or product pages from one template, or a long block repeated in `<main>` | What is true of each, or one page for all; repeated copy short or out of `<main>` |
| `sources-shown` | "Sources are in the schema only" | `citation` in the data and no links in the text | Visible links to the sources, in `<main>` |
| `dated` | No update date | The date shows as plain text | A `<time datetime>` and `dateModified` |
| `compressed` | Sent uncompressed | Compression is on for CSS and JS but not HTML, or a proxy strips it | Turn on gzip or Brotli for `text/html` at the edge |

## Traps that look like success

- The browser's inspector shows the fix, but the server's HTML does not: the inspector shows the page after scripts ran. Check with `curl` or `https://mttr.si/agent-view?url=<page>`.
- The fix shows on the page you tested and not on others: a CDN cache or a static build that was not rebuilt. Purge or rebuild, then read again.
- A score went up and a page vanished: a page that now redirects or answers 404 has dropped out of the read. `mttr_changes({ site })` lists pages removed.
- Every rule passes. The pages are well formed; that does not say any assistant cites the site.

## Sources

- [General structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies): markup only for what the page shows, on the page it describes.
- [Block Search indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing): `noindex` in a meta tag or the `X-Robots-Tag` header.

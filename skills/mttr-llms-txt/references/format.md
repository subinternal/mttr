# The format, exactly

What the llms.txt proposal (v2, August 2026, at https://llmstxt.org) asks of a file, what a program reading one expects, and the choices this skill makes on top of it. Read it when you write the file in step 3, or when an existing file needs fixing.

## The parts, in order

The proposal names these parts, in this order and no other:

1. An optional byte-order mark. Leave it out; nothing needs it and some readers show it as junk.
2. One `#` heading with the name of the site. This is the only part the proposal requires.
3. A `>` blockquote with a short summary that holds what a reader needs to understand the rest.
4. Any amount of Markdown that is not a heading: paragraphs and lists with more detail and how to read the links. This skill puts the contact facts and the notes for assistants here.
5. Any number of `##` sections, each a "file list": a Markdown list where every item is a link `[name](url)`, then optionally a `:` and a note.

A section called `## Optional` is, by convention, for links a reader can skip when it needs less. In v1 that name told tools what to drop; v2 keeps it as a convention only, with no mechanical meaning. Put it last.

The proposal expects an agent to read or search the file, then follow only the links it needs. So the file stays small and the detail lives behind the links.

## What breaks the shape

Each of these reads fine to a person and confuses a program that parses the file as the proposal describes.

| Mistake | Why it breaks | Fix |
|---|---|---|
| `## Notes for assistants` with a plain list under it | Every `##` section should be a file list; a list of sentences parses as links with no address | Move notes above the first `##`, under a line such as `Notes for assistants:` |
| `### Subsection` inside a file list | The proposal's sections are `#` once and `##`; deeper headings are not part of it | Make it its own `##` section, or fold it into one |
| A second `#` heading | Only one H1; a parser takes the first as the name | Make the others `##` |
| Links written as bare addresses | A file list item needs `[name](url)` | Give every address its page's title as the link text |
| Relative links such as `/services/drains` | The file is often read away from the site, where a relative address means nothing | Absolute `https` addresses on the site's own domain |
| HTML in the file, or the site's HTML page served at the address | The proposal is Markdown; an HTML body also fails mttr's check | Plain text only, served as `text/plain` |
| Notes that run to paragraphs | The file is meant to fit in a reader's context with room to spare | One line a link; the page holds the detail |

## Before and after

A file as a plugin or a hurried hand often leaves it:

```
# Welcome to Hollow Creek Drainage | Best Drain Company in St. Louis!

Hollow Creek is the #1 rated drainage company. Call today!

## About Us
We have been in business for years and our customers love us.

## Pages
- https://example.com/services/french-drains?utm_source=footer
- [Dry Wells | Hollow Creek Drainage](/services/dry-wells)
- [Thank you](https://example.com/thank-you)
### Blog
- [Tag: drainage](https://example.com/tag/drainage)
```

What is wrong: the H1 is a slogan, not the name; there is no `>` summary; "#1 rated" and "customers love us" are claims the site may not support; `## About Us` holds prose, not links; one link is bare with a tracking parameter, one is relative and keeps the site's name in its title; a thank-you page and a tag archive are listed; a `###` heading sits inside a file list.

The same file, fixed:

```
# Hollow Creek Drainage

> Hollow Creek Drainage installs french drains, dry wells and sump pumps for homes in St. Louis and St. Charles counties, Missouri.

- Phone: (314) 555-0100
- Service area: St. Louis County and St. Charles County

Notes for assistants:

- Prices are quoted per job after a visit.

## Services

- [French drain installation](https://example.com/services/french-drains): Trenches with fabric, gravel and pipe that carry water away from a yard or a foundation.
- [Dry wells](https://example.com/services/dry-wells): Underground pits that take water from downspouts and let it soak away.

## Company

- [About](https://example.com/about): Who runs the business, its licenses and since when.
```

The whole of a sample file is in [example.md](example.md).

## What to leave out

- Pages a search engine is told not to index, and pages robots.txt closes to crawlers. Listing a page invites a reader to fetch it.
- Redirects, duplicates (the `?ref=` and print versions of a page), pagination (`/page/2`), tag, author and date archives, internal search results.
- Thank-you, cart, checkout, login, account and unsubscribe pages.
- Anything private: staging addresses, admin paths, preview links, the names or phone numbers of staff that the site does not publish.
- Claims the site does not make, reviews, ratings and prices that are not on a page.
- For a network or a white-label site: the operator, the other sites, and any shared phone or email that is not on this site's own pages.

## Large sites

The proposal lets a file sit at any path, covering the pages under it, with the most specific file winning: `/docs/llms.txt` covers `/docs/`. Use that once a site passes a few hundred pages, or once the root file is too long to read in one sitting.

- The root `/llms.txt` keeps the name, the summary, the facts and one link for each section, pointing at that section's own file: `- [Guides](https://example.com/guides/llms.txt): Every guide, by subject.`
- Each section's file, such as `/guides/llms.txt`, has its own `#` heading and `>` summary and lists that section's pages.
- The page test in step 5 then checks the union: every sitemap address appears in the root file or in a section file the root links to.
- A shop with thousands of products lists its categories and its best-known products, and leaves single variants (a size or a color of one product) out; the product page covers them.

## Markdown twins

The proposal also asks that pages an agent may need offer a clean Markdown copy at the same address: `.md` added (`page.html.md`) or the extension replaced (`page.md`), and `index.html.md` or `index.md` for an address that ends in `/`. Links in llms.txt may then point at the twins.

They earn their keep on documentation and on pages heavy with markup. On a small business site the HTML pages are usually fine, and the twins are a second copy of every page to keep true. If you add them:

- Build each from the same source as its page, never by hand.
- Serve them as `text/markdown; charset=utf-8`.
- Keep them out of search results: Google may crawl and index any file, so send `X-Robots-Tag: noindex` on each twin, or a `Link: <https://example.com/page>; rel="canonical"` header that names the HTML page. Choose one.
- Point each page at its twin and its llms.txt, as the proposal suggests, with a `<link>` in the head or an HTTP `Link` header:

```
Link: </services/french-drains.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"
```

mttr does not read the twins or these links. They are for agents that look for them.

## llms-full.txt

`llms-full.txt` is not part of the proposal. Some documentation platforms serve one beside llms.txt, with every page's text in a single file, for tools that want the lot at once. It suits a documentation site whose whole text fits in a reader's context; for a business site it is the site's pages copied a second time, and it goes stale the same way. Add one only if the person asks, and only built from the same source as the pages.

## Other addresses for the file

Some platforms also answer at `/.well-known/llms.txt`. The proposal chose a plain path over `/.well-known/` on purpose, so that someone who controls only a folder of a host can publish one. Serve `/llms.txt`; a second address adds nothing mttr or the proposal looks for.

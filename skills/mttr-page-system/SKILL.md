---
name: mttr-page-system
description: Builds a site's page templates and shared components so search engines and AI assistants read every page well, and proves each pattern with mttr. Covers one h1 and a real outline, landmarks, an answer-first opening, structured data for each kind of page, share tags, canonical and indexing, internal links and hubs, images, speed and contrast, spacing on one scale with an even rhythm, and moving an existing site onto it a template at a time. Use when building or reworking a site's layout, page templates, components or design system, adding a new kind of page, or when mttr findings point at a shared template. About the structure of pages and their spacing, not their color, type or brand.
metadata:
  author: subinternal
  version: "1.3.1"
---

<!-- subinternal:header -->
```
╭─────────────────────────────────────────────────────────────────╮
│        ▄                                                        │
│      ▄ █    mttr                                                │
│    ▄ █ █    page system                                         │
│  ▄ █ █ █                                                        │
│                                                                 │
│  skill 1.3.1  ·  by subinternal  ·  mttr.si/skills/page-system  │
╰─────────────────────────────────────────────────────────────────╯
```

Print this header once, exactly as it is, in a code block, as the first thing you show when this skill starts. Then go on.
<!-- /subinternal:header -->

# Page system

Build each kind of page once, as a template, so every page made from it is easy for crawlers and assistants to read: what it is, what it answers, who stands behind it, where it sits in the site, and what to do next. You work in the site's own repository. mttr reads the live pages and says which patterns hold.

This is about structure: the HTML a server sends, its headings, its data and its links, and the spacing that tells a reader what belongs together. It is not about color, type faces or the brand. Keep the site's own look; change what is underneath it.

Work the eight steps in order. Do not change a file before step 2. Each step links the reference that holds its depth:

- [references/page-kinds.md](references/page-kinds.md): a template for each kind of page, how mttr files a page, and a service template before and after.
- [references/components.md](references/components.md): each shared component as the HTML it should send.
- [references/outline-and-accessibility.md](references/outline-and-accessibility.md): headings, landmarks, language, focus, and how mttr reads the outline.
- [references/structured-data.md](references/structured-data.md): JSON-LD for each kind, built from data, and what breaks it.
- [references/links-and-hubs.md](references/links-and-hubs.md): the tree, hubs, paged lists, town pages and the sitemap.
- [references/images-and-speed.md](references/images-and-speed.md): alt text, the image element, and the speed that decides what a crawler reads.
- [references/spacing.md](references/spacing.md): finding the site's own scale, writing it as tokens, moving values onto it, and measuring a page.
- [references/spacing-traits.md](references/spacing-traits.md): the spacing rules, one to a section, each measured or judged, with a bad and a good example.
- [references/migration.md](references/migration.md): moving a live site onto the system a template at a time, with platform notes.
- [references/troubleshooting.md](references/troubleshooting.md): a rule that still fails after the fix, by symptom.

## Before you start

1. Ask the person for the site's live domain, or the local address of a site not yet live, and whether you may deploy or only open a pull request.
2. Find how pages are made: the framework, where the shared layout lives, where each template lives, and whether pages come from files, a CMS or a database. Check whether a plugin or app already writes meta tags or JSON-LD. Say what you found.
3. Take a baseline. With mttr connected over MCP (the `mttr` skill sets it up), call `mttr_site({ site })`, `mttr_brief({ site })` and `mttr_pages({ site })`. With no key, open `https://mttr.si/report/<domain>`, or check single pages with the free tools at `https://mttr.si/tools`. Keep the result: step 7 compares against it.
4. On a live site with pages that already rank, read [references/migration.md](references/migration.md) first: it sets the order of releases, and what not to change while you work.

## 1. Name each kind of page

List every template and say which kind of page each one makes.

| Kind | What it is | How mttr knows it |
|---|---|---|
| Home | The site's front page | The address `/` |
| Service or product | One offer: a service, a product, a location served | An address under `/services/`, `/service-area/`, `/locations/` or `/products/`, or `Service` or `Product` in its structured data |
| Article | A guide, a post, a how-to | An address under `/guides/`, `/blog/`, `/articles/`, `/news/`, `/resources/` or `/learn/`, or an `Article` type in its structured data |
| Hub | A list of pages of one kind, such as `/services` | Read as a plain page |
| Plain page | About, contact, pricing, policies, authors | Anything else |

mttr gives each kind its own rules, so a page it files under the wrong kind is checked against too few. Where the address cannot change, the structured data type tells mttr the kind. Never move a live address only to change its kind without a redirect and the person's leave.

Check: `mttr_pages({ site, kind: "page" })` lists what mttr filed as plain pages. A service or a guide in that list is filed wrong. The full order mttr uses is in [references/page-kinds.md](references/page-kinds.md).

## 2. Build the frame once

Put everything every page needs in the shared layout, so no template can forget it.

- `<html lang>`, a `<title>` and a meta description made per page from that page's own data.
- A canonical link to the page's own final address, and `noindex` only on pages meant to stay out of search.
- Share tags: `og:title`, `og:description`, `og:image` with `og:image:alt`, and `twitter:card` as `summary_large_image`. A share image 1200 by 630 pixels fits every site that shows one.
- Landmarks: one `<header>`, a `<nav>` for the menu, one `<main>` around the page's own content, and a `<footer>`, with a skip link to `<main>`. mttr counts the text inside `<main>` as the page and leaves menus, forms and scripts out.
- The logo is a link, not an `h1`. mttr counts every `h1` in the HTML, header included.
- The page's text in the HTML the server sends. Text added by script after load is not read by most AI crawlers.
- A footer with the way to get in touch, a tap-to-call link where the business takes calls, and a link to `/llms.txt`.
- One address for the site: http, https, www and the bare domain redirect to one of them.

The frame, as code, is the first pattern in [references/components.md](references/components.md); the landmarks and why each is there are in [references/outline-and-accessibility.md](references/outline-and-accessibility.md).

Check: `curl -s <page> | grep -c 'rel="canonical"'` is `1` on a page of every template, and `https://mttr.si/og-image-checker?url=<page>` shows the share image and its alt.

## 3. Give every page one outline

Each page has exactly one `h1` that says what the page is about, then `h2` and `h3` in order, never skipping a level for size.

- On articles and service pages, phrase at least one heading as the question a person would ask, and answer it in the paragraph right under it, before any detail. mttr counts the words of that first paragraph: 25 to 90.
- Put the answer in words, not in an image or a script.
- Use a list or a table where the content is a set of items or figures, and a table where it compares options.
- Headings come from the page's own data, never typed once into a template so every page shares them.

The outline before and after, accordions, and how mttr reads each heading rule are in [references/outline-and-accessibility.md](references/outline-and-accessibility.md).

Check: `https://mttr.si/h1-checker?url=<page>` shows one `h1` and no level skipped; `https://mttr.si/agent-view?url=<page>` shows the text an agent gets.

## 4. Write the structured data for its kind

Each template writes one JSON-LD graph that says what the page is, from the same data the page shows.

| Kind | Types |
|---|---|
| Home | `Organization`, or `LocalBusiness` or one of its subtypes for a business with a place or an area served, and `WebSite` |
| Service | `Service` with its `provider`, or `Product` for a thing sold; `BreadcrumbList` |
| Product | `Product` or `ProductGroup` with an `Offer`; `BreadcrumbList`. The `mttr-shop-ready` skill covers it field by field |
| Article | `Article` or `BlogPosting` with `headline`, `datePublished`, `dateModified`, `author` and `publisher`; `BreadcrumbList` |
| Hub and plain page | `WebPage` or `CollectionPage`, and `BreadcrumbList` below the home page |

`FAQPage` only where the questions and answers are on the page, word for word. A rating only where the reviews it counts are on the page. Never a fact the page does not state. Build the graph as an object from the page's fields and serialize it once; never type JSON into a template as text. Examples for each type, the escaping for each framework, and the failures that break a block are in [references/structured-data.md](references/structured-data.md). `mttr_schema_create({ type, fields })` gives a block from fields you supply and leaves the rest empty.

Check: `https://mttr.si/schema-checker?url=<page>` on a page of each template finds the types the table names, and every block parses.

## 5. Link the pages into hubs

Make the site a tree a crawler can walk: home, then hubs, then the pages under them.

- Every page that should rank sits within three clicks of the home page, and is linked from the text of a related page, not only from the menu.
- A hub for each kind of page with more than a few, linking to each one with its title and one line.
- A visible breadcrumb on every page below the home page, matching its `BreadcrumbList`.
- Links are `<a href>` to the final address, never to one that redirects, and never a button a crawler would have to click.
- Pages of one kind say different things. A page per town that swaps only the name is a doorway page.
- `/sitemap.xml` lists every page that should rank, made from the same data as the pages, and `robots.txt` names it.

Hub and spoke, paged lists, town pages and the sitemap, worked, are in [references/links-and-hubs.md](references/links-and-hubs.md).

Check: `mttr_structure({ site })` shows every section within three clicks; `mttr_pages({ site, failing: "linked-in-context" })` is empty.

## 6. Build the parts that carry weight

Each of these is a component with one job. The patterns are in [references/components.md](references/components.md).

- Images: an `<img>` with alt text that says what it shows, `width` and `height` set so the page does not move, and `loading="lazy"` on all but the first. A background image in CSS has no alt text and is not read as content. Which alt for which image is in [references/images-and-speed.md](references/images-and-speed.md).
- Dates and names: an article shows when it was last updated in a `<time datetime>` and names who wrote it, both in its structured data too, with a page about each author.
- Sources: an article links the sources for its facts where a reader can see them.
- Claims: a sales claim is a fact that can be checked, or it goes.
- Contact: every page has a form or a clear link to get in touch.
- Contrast: body text at least 4.5 to 1 against its background, in every theme the site has.
- Speed: HTML compressed with gzip or Brotli, pages cached, no script or font that blocks the first paint without need. Google's Core Web Vitals are the shared yardstick for how a page loads; the order of work and how to measure it are in [references/images-and-speed.md](references/images-and-speed.md).

Check: `mttr_pages({ site, failing: "image-alt" })` and the same for `dated` and `sources-shown` come back empty.

## 7. Set the spacing

Put every page on one spacing scale with an even rhythm, so a reader sees what belongs together and where each part ends.

- Find the scale the site already uses, from its tokens or from the values its stylesheets use most. Only a site with none takes 4, 8, 12, 16, 24, 32, 48, 64 and 96 pixels. Show the person the scale before changing anything.
- Name the roles once: the gap between sections, a card's padding, the gap under a heading, the gaps a list may use, each with one smaller value for phones.
- Write the scale as tokens in one place, and move every padding, margin and gap onto it, a shared component at a time.
- Space between siblings is the parent's `gap`; space between sections is set once on their container.
- Work through the traits in [references/spacing-traits.md](references/spacing-traits.md). Twelve are measured by code, four judged from screenshots, and a judged trait that is unsure goes to the person.

Finding the scale, the tokens, and the measure to run before and after are in [references/spacing.md](references/spacing.md).

Check: `node scripts/measure.mjs <page>` from this skill's folder, on a page of each template, passes the twelve measured traits; [references/spacing.md](references/spacing.md) says how to read what it prints.

## 8. Prove it with mttr

Ship as the person allows, then check each pattern on a live page of each template.

| Pattern | mttr rules | Check one page with no key |
|---|---|---|
| The frame | `title`, `description`, `canonical`, `indexable`, `share-image`, `content-in-html`, `one-address` | `https://mttr.si/og-image-checker?url=<page>` |
| One outline | `one-h1`, `question-headings`, `answer-first`, `answers-the-question`, `liftable-blocks`, `has-table` | `https://mttr.si/h1-checker?url=<page>` |
| Structured data | `structured-data`, `schema-fits`, `breadcrumb`, `faq-matches-page`, `ratings-are-real` | `https://mttr.si/schema-checker?url=<page>` |
| Links and hubs | `within-three-clicks`, `linked-in-context`, `no-orphans`, `direct-links`, `loads`, `sitemap` | `https://mttr.si/redirect-checker?url=<page>` |
| Distinct pages | `depth`, `pages-are-distinct` | `https://mttr.si/agent-view?url=<page>` |
| Parts that carry weight | `has-image`, `image-alt`, `dated`, `named-publisher`, `sources-shown`, `plain-claims`, `claims-supported`, `phone-link`, `next-step` | the site's report |
| Speed | `compressed`, `quick-to-answer` | `https://mttr.si/website-speed-test?url=<page>` |
| llms.txt | `llms-txt` | `https://mttr.si/ai-crawler-checker?url=<domain>` |

`answers-the-question` and `claims-supported` are read by mttr's model judge, which gives an opinion a person may need to check; the rest are read by code. `mttr_rules()`, or `https://mttr.si/rulebook` with no key, gives each rule's current wording and fix. Read it there rather than from this file.

Over MCP, once the change is live: `mttr_rescan({ site, reason: "page templates" })`, `mttr_job({ id })` until done, then `mttr_changes({ site })` against the baseline. `mttr_pages({ site, failing: "<rule>" })` lists any page a rule still fails, which usually points at a template step 1 missed. A rule that still fails after the fix is worked through by symptom in [references/troubleshooting.md](references/troubleshooting.md).

## Report back

```
Site: <domain>. Templates: <n>, each named with its kind.

| Template | Kind | Patterns added | Rules before | Rules after |
|---|---|---|---|---|
| <path> | <kind> | <frame, outline, data, links, parts> | <n> failing | <n> failing |

Left as it was, and why: <pattern: reason, such as "dated: the CMS keeps no edit date yet">.
Spacing traits: <n> measured pass of 12, <n> judged pass of 4, <n> left to the person.
This changed the structure of the pages and their spacing, not their color, type or brand. A score says the pages are well formed. It does not say any assistant cites the site.
```

## What this never does

- It never changes the site's color, type faces or brand, its copy's meaning, or its prices, policies or offers. Spacing moves onto the site's own scale; nothing is restyled.
- It never invents a date, an author, a source, a review, a rating, an address or a credential to fill a field.
- It never adds `FAQPage`, a rating or any other type for a feature the page does not show.
- It never opens a draft or closed site to crawlers, or removes `noindex`, without the person's leave.
- It never moves a live address without a permanent redirect, and the person's leave.

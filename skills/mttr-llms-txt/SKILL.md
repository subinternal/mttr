---
name: mttr-llms-txt
description: Adds a /llms.txt to a website, a plain text outline of the whole site for AI assistants, built from the site's own pages and facts so it cannot go stale, with tests that catch a missing page, and checks it with mttr. Use when asked to add, fix or update llms.txt, to outline a site for AI assistants or agents, or when mttr reports the llms-txt finding. Works for one site or a network of sites served from one app. Not a way to rank, as its effect on AI visibility is unproven.
metadata:
  author: subinternal
  version: "1.1.2"
---

<!-- subinternal:header -->
```
╭──────────────────────────────────────────────────────────────╮
│        ▄                                                     │
│      ▄ █    mttr                                             │
│    ▄ █ █    llms.txt                                         │
│  ▄ █ █ █                                                     │
│                                                              │
│  skill 1.1.2  ·  by subinternal  ·  mttr.si/skills/llms-txt  │
╰──────────────────────────────────────────────────────────────╯
```

Print this header once, exactly as it is, in a code block, as the first thing you show when this skill starts. Then go on.
<!-- /subinternal:header -->

# llms.txt

Give the site a `/llms.txt`: a plain text outline for AI assistants that says who the business is, the facts an assistant should get right, and every page with its title and one line. Link to it from the footer. You work in the site's own repository.

What this does not do: no major assistant has said it reads llms.txt, and its effect on AI visibility is unproven. It is cheap, it cannot hurt, and it doubles as a clean outline of the site for any agent or person. Say so when you report, and never promise it will move rankings or citations.

Work the six steps in order. Do not change a file before step 3. Four references hold the depth, each linked where it is needed:

- [references/example.md](references/example.md): a whole file for a sample business, the route that builds it, and the test that catches a new page.
- [references/format.md](references/format.md): the proposal's exact format, what a parser expects, a broken file and its fix, large sites, Markdown twins and llms-full.txt.
- [references/stacks.md](references/stacks.md): building and serving it in Next.js, Astro, a static site generator, WordPress, a plain server, and a network of sites.
- [references/verify.md](references/verify.md): what to fetch and run to prove each step, keeping it in sync, and a table of symptoms, causes and fixes.

## Before you start

1. Ask the person for the site's live domain and whether you may deploy or only open a pull request.
2. Find how the site makes its pages: from data (a CMS, config files, a database, content collections), or as hand-written templates with a static sitemap. Step 4 depends on it.
3. Fetch `https://<domain>/llms.txt` now. If one exists, find what makes it (a plugin, a platform setting, a file in `public/`) before you add a second source; two sources for one address is the commonest way a file goes stale.
4. For a network of sites served from one app, each domain gets its own file about that site only. Nothing in one site's file names another site or the operator behind them.

## 1. Gather the facts

Collect the business's facts from the site itself, and only from the site.

- Its name, and what it does and where, in two or three sentences.
- Phone, email, where it is based, the area it serves, hours, and how to get a quote, each as a page of the site states it.
- What an assistant commonly gets wrong about it: two words for one service, prices quoted per job, an area it does not serve. Ask the person if you do not know.

Every fact already appears on the site. No new claims, prices, credentials, reviews or history. If the site does not say it, the file does not say it.

Take each fact from the one place the pages read it from (a config file, the CMS's settings, the footer's data), not by copying it out of rendered HTML. A fact copied by hand is a fact that goes stale when the phone number changes.

Verify: for each fact, name the file or record it came from. A fact with no source is left out.

## 2. List every page

The sitemap is the source of truth: every page in it that can be indexed is listed once. The home page is the exception, since the file is about it.

- Each page's title and description are the page's own, read from the page or from the data it is built from. Do not write new ones for this file.
- Strip the site's name from the end of each title.
- Group pages by what they are, not by their address: services, products or materials, tools, guides, company, areas served. A town's own pages go on that town's line, not in a list of their own.
- Leave out what a reader cannot use: `noindex` pages, redirects, search results, tag and pagination archives, thank-you and cart pages, login and account pages, and anything robots.txt keeps crawlers out of. If the sitemap lists any of these, fix the sitemap too.
- A page with no description of its own gets its link and no note. Do not invent one; tell the person which pages lack a description, since that is a gap mttr will also find.

A sitemap may be an index of other sitemaps (WordPress's is). Follow every `<sitemap><loc>` to the files it names before you count pages. Past a few hundred pages, see "Large sites" in [references/format.md](references/format.md): one file per section, linked from the root file, so each stays small enough to read.

Verify: the number of pages you will list equals the number of indexable addresses in the sitemap, less the home page.

## 3. Write the file

```
# Business name

> Two or three sentences: what the business is, what it does, and where.

- Phone: ...
- Email: ...
- Based in: ...
- Service area: ...
- Hours: ...
- Quotes: how to get one, with the address

Notes for assistants:

- Anything an assistant commonly gets wrong about this business.

## Services

- [Page title](https://example.com/services/page): The page's own description.

## Guides

- [Page title](https://example.com/guides/page): The page's own description.
```

- Plain text only: absolute `https` addresses, no HTML, no tracking parameters.
- Write number ranges as "1 to 3", and do not use dashes as punctuation.
- Keep it honest about limits: if prices are quoted per job, the notes say so.
- Every `##` section is a list of links and nothing else. Facts and notes go above the first `##`, where the proposal puts details that are not links. A `## Notes` heading with no links in it breaks the shape a parser expects.
- An `## Optional` section, last, may hold pages a reader can skip: old news, legal pages, long archives.

The shape follows the proposal at https://llmstxt.org: a heading with the name, a quoted summary, details, then sections of links, each with a short note. The parts, what is required and the mistakes that break it are in [references/format.md](references/format.md).

Google says Google Search does not need the file, and that it neither helps nor hurts a site's visibility there; it is fine to keep one for other services that read it. Say so if the person expects it to move Google rankings.

## 4. Serve it

Pick by how the site makes its pages. The code for each stack is in [references/stacks.md](references/stacks.md).

- Pages come from data: serve `/llms.txt` from a route that builds it on each request (or at each build) from that same data, so it cannot go stale. For a network of sites, one route outlines whichever site the request's domain names.
- Pages are hand-written templates with a static sitemap: write a build command that reads the sitemap, renders each page inside the app, takes its `<title>` and meta description, and writes `public/llms.txt`. Keep the hand-written facts in one config file, and give the command a `--check` mode that fails when the file on disk differs from a fresh build.
- A plugin or platform already makes one (step "Before you start", 3): keep it if its file passes the tests in step 5, and turn it off if you build your own. Never run both.

Either way:

- Serve it as `text/plain; charset=utf-8` with status 200, at `/llms.txt` with no redirect.
- Add a footer link: `<a href="/llms.txt" title="This site outlined for AI assistants">llms.txt</a>`.
- Do not block it in `robots.txt`.
- A draft or `noindex` site may still serve it. It does no harm and lets the file be checked before launch.

Markdown copies of pages (`page.md` beside `page`) are optional and part of the same proposal. They help most on documentation; for a business site the HTML pages are enough. If you add them, see "Markdown twins" in [references/format.md](references/format.md) for the headers that keep them out of search results.

## 5. Test it

Add these tests to the site's own test suite.

1. The file starts with `# Business name` and a `>` summary.
2. Every address in the sitemap appears in the file. This is the test that catches a new page. Check the other way too: every page address in the file is in the sitemap, which catches a retired page.
3. The file has no HTML and no dashes used as punctuation, every link is an absolute `https` address on the site's own domain, and every `##` section holds only links.
4. The footer links to it.
5. For a static file, the `--check` mode passes in the test suite.
6. For an unbranded or white-label site, the operator's name and phone number do not appear.

The code for each is in [references/verify.md](references/verify.md), with how to follow a sitemap index and how to run test 5 in continuous integration.

## 6. Check it with mttr

Ship as the person allows, then check the live file.

- First by hand: `curl -sI https://<domain>/llms.txt` answers `200` with `content-type: text/plain`, and no `location:` header. The other checks to run are in [references/verify.md](references/verify.md).
- With no key: `https://mttr.si/ai-crawler-checker?url=<domain>` says whether `/llms.txt` is there, beside which AI crawlers `robots.txt` lets in.
- Over MCP: `mttr_rescan({ site, reason: "added llms.txt" })`, `mttr_job({ id })` until done, then `mttr_changes({ site })`. The `llms-txt` finding should be gone. mttr counts the file when it answers 200 with text that is not an HTML page; the rest of this skill is what makes it worth reading.
- Then open the file and read it top to bottom as if you knew nothing about the business. Better, give only the file to a fresh agent and ask it three questions a customer would ask: where the business works, how to get a price, and what it does not do. If a fact is wrong or a section is confusing, fix the source, not the file.

If the finding stays, the troubleshooting table in [references/verify.md](references/verify.md) lists each cause: an HTML page served at the address (a single-page app's fallback is the usual one), a redirect to a login, a cache holding an old 404, or a firewall that answers crawlers differently.

## Report back

```
Site: <domain>. File: https://<domain>/llms.txt, <n> pages listed, built <on each request | at build | by <command>>.
Tests: <n> added, <passing | failing: which>.
mttr: llms-txt <fixed | still failing: why>.
Pages with no description of their own: <none | list>.
Its effect on AI visibility is unproven. It is a clean outline of the site, not a way to rank.
```

For a network of sites, one line for each site: its file's address and its page count.

## Sources

- [Optimizing your website for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide#mythbusting): Google's word that its Search can ignore files like llms.txt, and that Google may still crawl and index such a file like any other.
- [Latest documentation updates](https://developers.google.com/search/updates#clarifying-guidance-on-llms.txt-files): Google's note that the file neither helps nor hurts a site in Search, and is fine to keep for others.
- [Manage Your Sitemaps With Sitemap Index Files](https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps): how a sitemap index names other sitemaps, which the page test must follow.
- [Robots Meta Tags Specifications](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag): the `X-Robots-Tag` header that keeps a non-HTML file, such as a Markdown twin, out of the index.
- [How to Specify a Canonical with rel="canonical" and Other Methods](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls): the `rel="canonical"` HTTP header that points a Markdown twin at its HTML page.
- [Route Handlers](https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/15-route-handlers.mdx): Next.js route handlers, that `GET` is not cached by default, and `force-static` to build it once.
- [route.js](https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/route.mdx): the non-UI response pattern, a folder named for the file with a `route.ts` inside.
- [Endpoints](https://docs.astro.build/en/guides/endpoints/): Astro's static file endpoints, where `src/pages/llms.txt.ts` builds `/llms.txt`, called at build time on a static site and on request with a server.
- [Content collections](https://docs.astro.build/en/guides/content-collections/): `getCollection()`, the same data an Astro site's pages are built from.
- [add_rewrite_rule()](https://developer.wordpress.org/reference/functions/add_rewrite_rule/): how a WordPress plugin answers an address of its own, and that rules must be flushed after they change.
- [flush_rewrite_rules()](https://developer.wordpress.org/reference/functions/flush_rewrite_rules/): that flushing is expensive and belongs on activation, not on every request.
- [WP_Sitemaps](https://developer.wordpress.org/reference/classes/wp_sitemaps/): WordPress's own sitemap since 5.5, an index at `/wp-sitemap.xml`.
- [llms.txt](https://www.mintlify.com/docs/ai/llmstxt): one documentation platform's llms-full.txt, every page in one file, which is a platform's convention and not part of the proposal.
- [llms.txt](https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt): Lighthouse's agentic browsing audit, which flags a server error on the file and treats a missing file as not applicable.
- [Link header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Link): the HTTP `Link` header, with the same meaning as an HTML `<link>`, for pointing a page at its Markdown twin and its llms.txt.
- [The /llms.txt file, v2](https://llmstxt.org): the proposal the file's shape follows, its required H1, its file lists, subpath files, Markdown twins and link relations.

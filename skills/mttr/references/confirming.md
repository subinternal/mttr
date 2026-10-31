# Confirming a finding before you change code

Step 3 of `SKILL.md` says to see each failure for yourself. This file says how: what to fetch, what a pass and a fail look like for the rules that come up most, how to find the one template behind many pages, and when the rule itself is the thing that is wrong. `example.com` stands for the person's site; `mttr_rules()` has every rule's current wording, and it wins over anything here.

## The three looks

1. **What mttr recorded.** `mttr_page({ site, path })` lists the rules the page fails, with the fix for each and what was found.
2. **What the server sends now.** mttr reads the HTML the server sends, before any script runs. Fetch the same:

```
curl -sL -A "mttr/0.1" https://example.com/guides/gravel -o page.html
curl -sIL -A "mttr/0.1" https://example.com/guides/gravel
```

   The first saves the page; the second shows each hop's status and headers. A page that changed since the read may already pass: if so, the fix is a fresh read, not a code change.
3. **What an agent reads.** `mttr_agent_view({ url })` gives the page's main text as Markdown and what helped or hurt reading it, with the rule for each where the rulebook has one. Use it when the finding is about text: `content-in-html`, `depth`, `answer-first`, `one-h1`.

Only change code once the first two agree that the page fails. On a site the person has in Search Console, they can also run the URL Inspection tool's live test, which fetches the page as Google does now rather than as Google last indexed it.

## Pass and fail, rule by rule

Run these against the saved `page.html` and the headers. Each line is what the rule checks, read from mttr's rulebook.

| Rule | Fails when | Quick look |
|---|---|---|
| `loads` | The page does not answer 200 | First line of `curl -sI` |
| `indexable` | `noindex` is in the robots meta tag or the `X-Robots-Tag` header | `grep -i noindex page.html` and the headers |
| `canonical` | No canonical link, or it points to another path | `grep -io '<link[^>]*canonical[^>]*>' page.html` |
| `one-h1` | Not exactly one `h1` | `grep -io '<h1' page.html \| wc -l` |
| `title` | Title under 15 or over 65 characters, not counting a site name most titles share | The `<title>` text |
| `description` | Meta description missing, or under 70 or over 165 characters | The `description` meta tag |
| `structured-data` | No JSON-LD, or a block that does not parse | Paste each `application/ld+json` block into a JSON parser |
| `content-in-html` | Fewer than 120 words of the page's own text before scripts run | `mttr_agent_view({ url })` word count |
| `answer-first` | On an article, the paragraph right under the first question heading is under 25 or over 90 words | Count the words of that one paragraph |
| `image-alt` | A content image has no alt text and is not marked decorative | `img` tags inside the main content |
| `dated` | An article has no `dateModified` in its schema and no `time` with `datetime` | Both, in `page.html` |
| `phone-link` | No `tel:` link | `grep -c 'href="tel:' page.html` |
| `next-step` | No form and no link to a contact, quote, booking or similar page | The page's forms and links |

For a site-wide rule (`robots-open`, `robots-open-to-ai`, `sitemap`, `one-address`, `llms-txt`), fetch the thing itself: `/robots.txt`, `/sitemap.xml`, `/llms.txt`, or `curl -sIL` on `http://`, `https://`, `www` and the bare domain to see where each lands.

## Find the one template

Most findings come from shared code. Before you edit a page, find what makes it:

1. Take the failing pages from `mttr_pages({ site, failing: "<rule>" })` and look for what they share: a section such as `/guides/`, a kind, a layout.
2. If every page of a kind fails, the cause is in its template. If only some do, the cause is in each page's own content.
3. Search the repository for a string the failing markup carries, such as the wrong canonical, the second `h1`'s text, or the meta tag:

```
grep -rn 'rel="canonical"' --exclude-dir=node_modules --exclude-dir=dist .
grep -rn 'noindex' --exclude-dir=node_modules --exclude-dir=dist .
```

4. Check that you are editing the source, not built output. A folder named `dist`, `build`, `out`, `.next` or `public` is often generated; the brief says to change the site's source.
5. On a CMS, the cause may be a setting rather than a file, such as a "discourage search engines" switch or an SEO plugin's default. Say so and ask before changing a setting.

## Worked examples

### A canonical hard-coded to the home page

The brief says `canonical` fails on 41 pages, and `mttr_page` on `/guides/gravel` says "Canonical points to /".

Before, in the shared head:

```html
<link rel="canonical" href="https://example.com/">
```

After, built from the page's own address:

```html
<link rel="canonical" href="https://example.com/guides/gravel">
```

Write it from the route or the page's URL in the template, as an absolute address. Google's canonical guide advises absolute addresses over relative ones.

### Two h1 headings, one of them the logo

`one-h1` fails on every page with "2 h1 headings." The header wraps the logo in `h1`.

Before:

```html
<header><h1 class="logo"><a href="/">Acme Gravel</a></h1></header>
<main><h1>Gravel delivery in Phoenix</h1>
```

After:

```html
<header><a class="logo" href="/">Acme Gravel</a></header>
<main><h1>Gravel delivery in Phoenix</h1>
```

Keep the logo's look in CSS. On the home page, the main heading still carries the business's name or what it does.

### noindex left over from a staging setup

`indexable` fails on every page, and the HTML has no robots meta tag. The headers show it:

```
HTTP/2 200
x-robots-tag: noindex
```

The cause is server or host config, not a template: a header rule meant for a preview address that also applies to production. Remove it for the live host only, and leave it on previews. Google's noindex guide says the meta tag and the header have the same effect, so check both.

### JSON-LD that does not parse

`structured-data` says "1 JSON-LD block(s) do not parse." A template adds a trailing comma when a field is empty.

Before:

```html
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"Gravel sizes",}</script>
```

After, built by serializing an object rather than by joining strings:

```html
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"Gravel sizes"}</script>
```

The `mttr-page-system` skill has the JSON-LD for each kind of page and how to escape it.

## When the rule is wrong about a page

A rule can misread an unusual page. Spot these before you bend a page to pass:

- **The page's kind is guessed.** mttr calls a page an article when it carries Article schema or sits under `/guides/`, `/blog/`, `/articles/`, `/news/`, `/resources/` or `/learn/`, and a service page when it carries Service or Product schema or sits under `/services/`, `/locations/`, `/products/` and similar. A service page at `/springfield/excavation` is read as a plain page and gets fewer rules. Adding Article or Service schema changes its kind, and the rules for that kind then apply. Say so in your report instead of moving pages to new addresses.
- **Length is all code checks for `answer-first`.** A paragraph of 40 words can still fail to answer. Write the answer for the reader; the judge's `answers-the-question` and a person decide whether it answers.
- **The judge reads comparisons as claims.** `claims-supported` can flag a fair comparison. Put a source beside it, or report it for a person.
- **`ai-crawlers-served` imitates crawler names.** It cannot see what a CDN does for the real crawlers. Confirm in the CDN's own settings, and never weaken a rule for one crawler without the person asking.
- **Text written by script is not seen.** If the words appear only after script runs, `content-in-html` and `depth` fail for good reason: most AI crawlers do not run scripts. Google's JavaScript SEO guide explains that a page whose first HTML is only a shell needs its script run before its text can be seen.

If you are sure a rule is wrong about a page, leave the page as it is, and say which rule, which page and why in your report.

## Log it

`mttr_log_work({ site, step: "checked", did, found, rules })`: what you confirmed, and in `found` what was true of the code, such as "canonical comes from layouts/head.html, hard-coded to the home page".

## Sources

- [How to Specify a Canonical with rel="canonical" and Other Methods](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls): the canonical link belongs in the head, and an absolute address is safer than a relative one.
- [Block Search Indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing): the robots meta tag and the X-Robots-Tag header have the same effect, so check both.
- [Understand JavaScript SEO Basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics): a page whose first HTML is an app shell needs its script run before its text can be seen.
- [URL Inspection tool](https://support.google.com/webmasters/answer/9012289): Search Console's live test fetches a page as Google does now, apart from the version Google last indexed, for a site the person has in Search Console.

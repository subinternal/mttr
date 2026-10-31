# Worked loops

Each loop is the six steps of `SKILL.md` cut to one job. The calls are mttr's own; [tools.md](tools.md) gives each one's inputs and who may call it. `example.com` stands for the person's site. For the detail behind a step, see [reading-the-brief.md](reading-the-brief.md), [confirming.md](confirming.md), [shipping.md](shipping.md), [after-a-rescan.md](after-a-rescan.md) and, when a call fails, [troubleshooting.md](troubleshooting.md).

## A new site, start to finish

For a site mttr has not read, or one the person has just handed you.

1. `mttr_site({ site: "example.com" })`. If mttr has no public report yet, `mttr_rescan({ site: "example.com", reason: "first read" })`, then `mttr_job({ id })` every minute or two until it says done.
2. `mttr_brief({ site: "example.com" })`. Read it top to bottom before you change anything. Note each blocker.
3. For the top fix, `mttr_pages({ site: "example.com", failing: "<rule>" })`, then `mttr_page({ site: "example.com", path })` on one of them. Find the template that makes those pages.
4. Fix that template. `mttr_log_work({ site: "example.com", step: "changed", did, files, rules })`.
5. Ship as the person allows. On a site set to approve, `mttr_propose` and wait for `mttr_proposal` to say approved.
6. Once it is live, `mttr_rescan`, `mttr_job`, then `mttr_changes({ site: "example.com" })`. The rule is fixed when the read finds it passing.
7. Go on to the next fix in the brief. Stop when the person's time or leave runs out, and report.

On a claimed site, open with `mttr_queue()` and `mttr_todo()` instead of step 2: the person may already have chosen what comes first.

## One page, before or after it ships

For a page you are writing or changing. mttr reads whole sites, so a page not yet live is checked with the free tools against a preview address, and in full once it is live.

1. Before it ships, on a public preview address:
   - `https://mttr.si/h1-checker?url=<page>`: one `h1` and the outline below it.
   - `https://mttr.si/schema-checker?url=<page>`: every structured data block, and whether it parses.
   - `https://mttr.si/og-image-checker?url=<page>`: the share tags and the size of the share image.
   - `https://mttr.si/redirect-checker?url=<page>`: every hop to the final address.
   - On a product page, `mttr_product_check({ url })`, or `https://mttr.si/tools/schema-markup-checker.json?url=<page>` with no key.
2. Once it is live, `mttr_rescan({ site, reason: "new page <path>" })`, `mttr_job({ id })`, then `mttr_page({ site, path })`: every rule the page fails, with the fix for each, and the pages that link to it.
3. If no page links to it, link it from the text of a related page and from its hub. `mttr_page` lists its links in.

The free tools read public addresses only. A preview behind a password or on a private network cannot be checked, and a local address is refused.

## Before a pull request is merged

For a change that touches templates, layouts or many pages.

1. Before you branch, keep the baseline: `mttr_site({ site })` and the rules the change should fix.
2. Make the change. On a preview deploy with a public address, run the one page checks above on one page of each template it touches.
3. In the pull request, write what it should fix by rule id, which templates it touches, the preview pages checked and what each check said, and the baseline score.
4. On a site set to approve, `mttr_propose({ site, title, summary, rule, pages, diff })` with the same, and say in the pull request that it waits for approval.
5. After the merge and deploy, `mttr_rescan`, `mttr_job`, `mttr_changes`, and add the result to the pull request. If a rule newly fails, say so first.

## A weekly check

For a site already worked on, so a fix that slipped back is caught.

1. `mttr_rescan({ site, reason: "weekly check" })`, then `mttr_job({ id })` until done.
2. `mttr_changes({ site })`. Read rules newly failing first: each is a regression, usually from a new page or a changed template.
3. On a claimed site, `mttr_todo()`: what slipped back, and sites changed since their last read.
4. On a claimed site with mttr added in Search Console, `mttr_traffic({ site })` and `mttr_queries({ site, show: "near" })`: pages losing clicks, and searches close to the top. On a site whose server sends its own counts, `mttr_visits({ site })`: AI crawler fetches and people an assistant sent. A crawler fetching a page is not a citation.
5. Report what moved and what to do next. Do not change anything in a weekly check unless the person asked you to.

## With no key at all

1. Open `https://mttr.si/report/<domain>`. If there is no report, or it is old, open `https://mttr.si/read?domain=<domain>`. It puts the site in line and sends you to `/reading/<token>`, which shows the read as it happens and ends on the report.
2. The report lists the fixes worth the most, each with its pages. The rulebook at `https://mttr.si/rulebook` says what each rule means.
3. Check single pages with the free tools at `https://mttr.si/tools`.
4. Fix and ship as the person allows, then ask for a fresh read the same way. A site is read at most once every ten minutes.
5. Say in your report that you worked without a key, so nothing was logged and no proposal was sent.

## A site closed to crawlers

For a brief that opens with "The site is closed to crawlers", or a score of 20 or less.

1. Read which rules the brief names: usually `robots-open`, `indexable` or `loads`.
2. Ask the person whether the site is meant to be found yet. A draft or a staging site is closed on purpose: say so, and stop. Going live is their call.
3. If it should be open, find where it is closed: a `Disallow: /` under `User-agent: *` in `/robots.txt`, an `x-robots-tag: noindex` header (`curl -sI` on a page), or a robots meta tag in the page's head. Google's guides note that robots.txt controls crawling and is not a way to keep a page out of search, and that a page blocked in robots.txt is never fetched, so its noindex is never seen. Fix the one that is meant.
4. Ship by the agreed path, then read again. Every other fix in the brief was measured on a site no crawler could reach: read the new brief before you work any of them.

## A site whose text is written by script

For a brief where `content-in-html` or `depth` fails on most pages, and a browser shows plenty of text.

1. `mttr_agent_view({ url })` on one failing page. Few words means the server sends a shell and script fills it in.
2. Confirm with `curl -sL` on the page: the text a person sees is missing from what comes back.
3. The fix is in how the site renders: render the page's text on the server or at build time. Which setting does that depends on the framework; find it in the site's own config and say what you found before changing it.
4. Read again. Once the text is in the HTML, rules that read it, such as `depth`, `question-headings` and `answer-first`, are judged on the real text.

## Several claimed sites

For a person with more than one site in mttr.

1. `mttr_todo()` lists the next fix across all of them, then every other fix by worth, what slipped back and which sites changed since their last read.
2. Work one site at a time, by the path each is set to. Call `mttr_proposals({ site })` for each: one may be `approve` and another `automatic`.
3. Log each site's work under its own name with `mttr_log_work`, so each reads true on the progress page.
4. `mttr_progress_link()` gives the person a private link to see it all. Hand it only to them.

## A site the person does not own

Any key reads the public parts of a site's report, so you can study a rival. Change nothing on a site that is not the person's. Comparing two sites rule by rule with `mttr_compare`, and finding rivals with `mttr_competitors` or `mttr_near`, need a site the person has claimed.

## Sources

- [Robots.txt Introduction and Guide](https://developers.google.com/search/docs/crawling-indexing/robots/intro): robots.txt controls which addresses a crawler may fetch, and is not a way to keep a page out of Google.
- [Block Search Indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing): the robots meta tag and the X-Robots-Tag header do the same, and a page blocked in robots.txt never shows its noindex.

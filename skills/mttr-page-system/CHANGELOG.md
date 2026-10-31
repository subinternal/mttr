# Changelog

Versions follow semantic versioning: a major version changes what the skill asks of the person or the agent, a minor one adds or tightens steps, a patch corrects wording. The version is in `SKILL.md` under `metadata`, as the Agent Skills format keeps anything it does not define.

## 1.3.1 (2026-10-23)

- The spacing measure says its sample paths are Claude Code's, and to use the folder the client keeps the skill in.
- The example of a service page filed as a plain page uses a sample town.

## 1.3.0 (2026-10-20)

- `scripts/measure.mjs` measures a page against the twelve measured spacing traits at 1440 and 375 wide, in the Chrome already on the machine, with nothing to install. It finds the page's own scale when none is given, prints each trait with where it failed, and exits 1 when one fails.
- Step 7's check runs the script; the console snippet stays for where Node or Chrome cannot run.
- A step on the scale is now a quarter larger than the one before from 16px up, not a third, so 24, 32 and 48 sit on one scale as they do on most sites.
- The space between sections counts the padding each keeps, since many sites space sections with padding and leave no gap between them.

## 1.2.0 (2026-10-20)

- New step 7, set the spacing: find the site's own scale, name the roles, write the scale as tokens, and move every padding, margin and gap onto it a component at a time. Proving it with mttr is now step 8.
- New reference on spacing and rhythm: finding the scale from the site's tokens or the values its stylesheets use most, tokens for CSS and Tailwind, the order of work, a measure to run in the browser before and after, and how to read the judged traits.
- New reference of spacing traits, one rule to a section with an id that stays the same: twelve measured by code and four judged from screenshots, each with a bad and a good example.
- The skill now covers spacing as part of a page's structure. Color, type faces and the brand still stay as they are.

## 1.1.0 (2026-10-18)

- Each step ends in a check: what to run or open, and what a pass looks like.
- The proof table names 38 rules, up from 32: `one-address`, `loads`, `depth`, `pages-are-distinct`, and the judge's `answers-the-question` and `claims-supported`, which it says a person may need to check.
- New reference on the outline and accessibility: how mttr reads each heading rule, an outline before and after, landmarks, the skip link, language, focus, and accordions.
- New reference on links, hubs and the sitemap: the tree, hub and spoke worked, links a crawler can follow, paged lists, town pages that read as doorways, and the sitemap.
- New reference on images and speed: alt text decided case by case, the image element before and after, the order of speed work, and `curl` checks for compression and first byte.
- New reference on moving a live site onto the system a template at a time, with what not to change, moving an address, and notes for Next.js, Shopify, WordPress and single page apps.
- New reference for a rule that still fails after the fix, by symptom, cause and fix, and the traps that look like success.
- Page kinds says how mttr files a page and the words each kind needs, with a service template before and after and an author page.
- Structured data has a full article graph, Google's required and recommended fields for each type, opening hours, building a block from data, what breaks it, and a command that parses every block a page sends.
- Liquid's `json` filter is no longer said to stop a value closing the script tag: Shopify says only that it escapes quotes.

## 1.0.1 (2026-10-16)

- Each source is listed by its page's own title, with what the skill takes from it, including the Rich Results Test, WCAG 2.2 and Web Vitals.
- Google no longer shows FAQ results in Search and removed their documentation in June 2026: the FAQ notes say so, and cite Google's update in place of the page that is gone.

## 1.0.0 (2026-10-16)

- First release: seven steps from naming each kind of page to proving each pattern with mttr.
- Templates for the home, service, product, article, hub and plain pages, with the structured data for each.
- Component patterns: the frame, breadcrumb, question and answer, table, image, byline, sources, contact block, footer and links in the text.

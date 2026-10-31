# Reading what changed after a rescan

Step 6 of `SKILL.md` reads the site again and compares. This file says what `mttr_changes` answers, how to tell a real result from a change in what was measured, and what to do when a fix does not show. `example.com` stands for the person's site.

## Before you ask for the read

A read of a change that is not live measures nothing. First confirm the deploy reached what the server sends:

```
curl -sL -A "mttr/0.1" https://example.com/guides/gravel | grep -io '<link[^>]*canonical[^>]*>'
```

If the old markup comes back, the deploy is not live or a cache still holds the old page. Wait, or ask the person about purging. Then `mttr_rescan({ site, reason })`, with what changed in a few words, and `mttr_job({ id })` until it says done. A site is read at most once every ten minutes.

## What `mttr_changes` answers

`mttr_changes({ site })` sets the latest read against the one before it. Under `changes`:

| Field | What it says |
|---|---|
| `score` | `before` and `after` |
| `stages` | `before` and `after` for access, understand, trust and act |
| `fixed` | Rules that failed before and fail on no page now, with how many pages failed (`was`) |
| `broke` | Rules that failed on no page before and fail now (`now`) |
| `moved` | Rules failing in both reads on a different number of pages (`was`, `now`) |
| `pages` | Pages read `before` and `after`, and pages `added` and `removed` (null when they cannot be known) |
| `partial` | True when either read stopped at its page limit. Pages added and removed are then not reported |
| `rulebookChanged` | True when the two reads were judged by different rulebooks |
| `draftChanged` | True when one read was of a draft and the other was not |

`changes` is null on a site's first read: there is nothing to compare it with. Each rule comes with its title. `visits`, for a site whose server sends its own counts, sets people, people an assistant sent and crawler fetches in the week before the read against the week since; until a week has passed it says the week since may not be over. A crawler fetching a page is not a citation.

## Reading it in order

1. **The three flags first.** If `rulebookChanged`, a rule can pass or fail because the rule changed, not the site. If `draftChanged`, some rules were set aside in one read and not the other. If `partial`, the reads may have covered different pages. Say which applies before you claim any result.
2. **`broke` next.** Each is a regression, or a rule that now applies. Say it first in your report.
3. **`fixed`.** These are the results to report, by rule and pages.
4. **`moved`.** Fewer pages is progress, not done. More pages is a regression to look into.
5. **The score last.** It follows from the rest.

## Why a rule broke

| What you see | Likely cause | What to do |
|---|---|---|
| A rule for articles broke right after you added Article schema | The schema made those pages articles, so article rules such as `dated`, `sources-shown` and `answer-first` now apply | Expected. Work those rules next, and say so |
| `loads` or `direct-links` broke | A changed address with no redirect, or links still pointing to an old one | Redirect the old address once, and point links at the new one |
| `one-h1` or `title` broke on every page | A shared layout changed | Find the layout change in the diff |
| `pages.added` is high and several rules moved up | New pages the read had not seen, often from a new section | Compare the failing pages with `added`; the new template may need the same fixes |
| Rules moved with no change from you | Someone else changed the site, or `rulebookChanged` | Check the flags, then `mttr_page` on one page |

## When a fix does not show

If a rule you fixed still fails, open the page with `mttr_page({ site, path })` before you change anything else:

- **The page still fails in what the server sends.** The deploy or a cache is the cause. Fetch it with `curl` as above.
- **The page passes, others fail.** The fix reached one template and not another. Find what the failing pages share.
- **The page is not in the read.** A read takes the first 100 pages; a page past them is not checked. `mttr_pages({ site, q: "<path>" })` says whether it was read.
- **The rule passes on the page, and `fixed` still does not list it.** `fixed` lists only rules no page fails. If one page still fails, the rule sits in `moved`.

A fix counts as done only once a later read finds it passing. On a claimed site, `mttr_todo()` shows what a read has checked fixed and what slipped back, and `mttr_queue_done({ id })` marks a queued task finished.

## Reporting it

Lead with what moved, then what broke, then what is next:

```
Score: 58 to 66 (access 70 to 82). Read 100 pages both times; neither read was partial; same rulebook.
Fixed: canonical (41 pages to 0).
Moved: answer-first, 12 pages to 5.
Broke: dated, now 12 pages. Expected: the guides now carry Article schema, so the article rules apply.
Next: dated, from the article template.
A score says the pages are well formed. It does not say any assistant cites the site.
```

Then `mttr_log_work({ site, step: "checked", did, rules })`.

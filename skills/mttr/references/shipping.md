# Shipping safely: proposals, approvals and pull requests

Step 5 of `SKILL.md` ships each change only by the path chosen before you started. This file has the detail: what a good proposal holds, what each answer means, how to wait for it, and what to do when the path is unclear. mttr never deploys anything and cannot stop a deploy. Approval is a promise you keep, and mttr records who approved what.

## Choosing the path, again in short

| The site | The person said | You |
|---|---|---|
| Claimed, set to `approve` | Anything | Propose each change, deploy only once approved |
| Claimed, set to `automatic` | You may deploy | Deploy |
| Claimed, set to `automatic` | Nothing about deploying | Open a pull request and stop |
| Not claimed, or no MCP | Anything | Open a pull request and stop |

`mttr_proposals({ site })` says which mode a site is set to. Read it before you start, and do not change it yourself. `mttr_approvals_set` is the person's choice: turning approve off is emailed to them, and you should call it only when they ask you to in so many words.

## A proposal the person can judge

`mttr_propose({ site, title, summary, rule, pages, diff })`. The person reads it in an email with an Approve and a Decline link, so write it for someone who has not seen your session.

| Input | Limit | Write |
|---|---|---|
| `title` | 120 characters, one line | What changes, as a plain sentence: "Give each guide its own canonical address" |
| `summary` | 2,000 characters | What the change does, why, what it touches, and how you checked it. It is shown as your words |
| `rule` | One rule id | The rule it answers, such as `canonical`. Leave it out for a change no rule names |
| `pages` | 20 paths, comma separated | A few of the pages it changes. None for a whole-site change |
| `diff` | 20,000 characters | The unified diff. Shown to the person, never applied by mttr |

A worked example:

```
mttr_propose({
  site: "example.com",
  title: "Give each guide its own canonical address",
  summary: "The shared head sets every page's canonical to the home page, so 41 pages say they are copies of it. This builds the canonical from each page's own address. One file: layouts/head.html. Checked on a preview: /guides/gravel and /services/delivery now point to themselves.",
  rule: "canonical",
  pages: "/guides/gravel,/guides/sand,/services/delivery",
  diff: "--- a/layouts/head.html\n+++ b/layouts/head.html\n@@ -4 +4 @@\n-<link rel=\"canonical\" href=\"https://example.com/\">\n+<link rel=\"canonical\" href=\"{{ page.url | absolute_url }}\">\n"
})
```

Keep the diff to the change itself. A diff over 20,000 characters is usually more than one change: split it, or describe the generated part in the summary.

## Waiting for the answer

`mttr_proposal({ id })` answers `state` and `deploy`, with a sentence under `says`:

| `state` | `deploy` | What you do |
|---|---|---|
| `pending` | false | Wait. Ask again in a few minutes. Meanwhile you may work on the next fix, but do not deploy this one |
| `approved` | true | Deploy this change, as proposed and nothing more, then read again with `mttr_rescan` |
| `declined` | false | Do not deploy. Read `decided.note` for the person's reason, and say what you will do instead |
| `expired` | false | No answer came within 72 hours. Do not deploy. Propose again only if it still matters |

Rules that keep it honest:

- Deploy exactly what was approved. If the change grows after approval, propose again.
- `emailed` false means no email went out; the proposal is kept and the person can still answer it on their account page. Tell them it is waiting.
- At most 20 proposals a site in an hour. Put related changes in one: one rule and its template is a good size.
- Name the proposal in `mttr_log_work({ site, step: "changed", did, proposal })` once you deploy it.

## Pull requests

When the path is a pull request, the pull request carries what a proposal would:

```
Answers: canonical (41 pages), from mttr's read of <date>, score <n>.
Touches: layouts/head.html, the shared head for every page.
Checked: on the preview, /guides/gravel and /services/delivery now have canonicals to themselves.
After merge: ask mttr to read the site again and compare (mttr_rescan, then mttr_changes).
mttr's score says pages are well formed. It does not say any assistant cites the site.
```

Then stop. Step 6 waits until the person has merged and deployed it. Do not merge your own pull request unless the person said you may.

## Shipping well, whatever the path

- **One rule a change.** The person judges each in one read, and a fresh read shows which change moved what.
- **Preview first when there is one.** Run the free one-page checks against a public preview address (see the one-page loop in [workflows.md](workflows.md)). A preview behind a password cannot be checked.
- **Keep previews closed.** A preview should keep its `noindex`. Removing it from production must not remove it from previews.
- **Mind caches.** A CDN can keep serving the old HTML after a deploy. Before you read again, fetch the page with `curl -sIL` and confirm the change is in what the server sends. MDN's `Cache-Control` page explains how `s-maxage` sets how long a shared cache keeps a page. Purge only what the change touched, and only with the person's leave.
- **Never deploy on your own judgment**, even when a fix is plainly right.

## Sources

- [Cache-Control header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control): how max-age and s-maxage set how long browsers and shared caches such as a CDN keep a response.

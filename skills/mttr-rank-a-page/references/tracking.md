# Tracking a campaign

Keep one log for each campaign, and write it the same way every time, so the person can read it at a glance and another agent can pick it up.

## With mttr

Every change goes to `mttr_log_work({ site, step, did })`: `planned` before you start on a gate, `changed` once it ships, `checked` once a read proved it and the gate opened, `stuck` when a read did not and why. `mttr_rescan` reads the site again and `mttr_changes` says what the read moved. Keep `campaign.md` as well: it is the one place the aim, the five gates, the status and the place over time sit together.

## Without mttr

Keep `campaign.md` at the top of the repository. Start it like this, and add to it; never rewrite what is there.

```markdown
# Campaign: /hiking-boots for "waterproof hiking boots"
Aim: top 3, from place 14 (Search Console, average position, last 28 days)
Started: 2026-10-18, day 0 of time to rank
Status: Climbing
Site: outdoor-shop.example, pull requests only

## Gates

| Gate | State | Since | Proof |
|---|---|---|---|
| 1. Clean up | closed | | |
| 2. One intent | closed | | |
| 3. Substance | closed | | |
| 4. Links inside | closed | | |
| 5. Links from outside | closed | | |

## Work

- 2026-10-18 1. Clean up, changed: fixed two links to retired products (404) and gave /hiking-boots?color=black a canonical to /hiking-boots. Pull request #212.
- 2026-10-19 1. Clean up, opened: the person loaded each link and saw a 200; the canonical is in the HTML. Proof by the person.

## Read-outs

(The weekly read-out goes here, newest first, written as references/report.md says.)

## Time to rank

(Written once, the first read-out the page is at its aim or better: the days from the start, with the dates and the source.)
```

## A gate's states

- **closed:** no proof yet. The first closed gate is the one being worked on; the ones after it wait.
- **open:** a read of the live site, or the person, proved what the gate asks. Write which, and when, in Proof.
- **slipped:** it was open and a later read found it failing again. It counts as closed until it is proved again, and it is worked on before any later gate.

Only a read or the person opens a gate. You may mark one slipped when a read says so, never open.

## A campaign's status

Setting up, Climbing, Stalled, Holding or Ended, as SKILL.md defines them. Change the Status line at each read-out, and write in the read-out why it changed.

## A worked log, eight weeks in

An illustration, not a real site's results. It shows how the parts read together once a campaign has run a while: proofs with their counts, a slip, a stuck read, and the clock stopping.

```markdown
# Campaign: /hiking-boots for "waterproof hiking boots"
Aim: top 3, from place 14.2 (Search Console, this page, this query's row, 2026-10-11 to 2026-10-17; 28 days: 15.1)
Started: 2026-10-18, day 0 of time to rank
Status: Holding
Site: outdoor-shop.example, pull requests only
Told the person: changes reach Google over days to weeks; no place or date is promised.

## Gates

| Gate | State | Since | Proof |
|---|---|---|---|
| 1. Clean up | open | 2026-11-09 | mttr's read on 2026-11-09: no access finding on the page, no broken link to it (slipped 2026-11-02, reopened) |
| 2. One intent | open | 2026-10-25 | mttr's read on 2026-10-25: title and first heading carry the search; 9 of the page's 10 top searches are to buy |
| 3. Substance | open | 2026-11-09 | mttr's read on 2026-11-09: passes every content rule checked on it; mttr_gaps lists 1 subject for it, down from 4 |
| 4. Links inside | open | 2026-11-16 | mttr's read on 2026-11-16: 4 of the 10 most linked pages link here in text, up from 1 |
| 5. Links from outside | closed | | (none yet: 3 linking sites, among those mttr has read, against the middle rival's 7) |

## Work

- 2026-10-18 1. Clean up, changed: fixed two links to retired products (404); /hiking-boots?color=black canonical to /hiking-boots. PR #212.
- 2026-10-20 1. Clean up, opened: mttr's read on 2026-10-20, no broken link or duplicate touching the page.
- 2026-10-22 2. One intent, changed: title and first heading; winter boots to /winter-boots. PR #215. Indexing requested 2026-10-23.
- 2026-10-25 2. One intent, opened: mttr's read on 2026-10-25.
- 2026-10-29 3. Substance, changed: fit guide, what waterproof means, care, why buy here, a table of styles. PR #219.
- 2026-11-01 3. Substance, stuck: mttr's read finds no heading is a question (question-headings). Headings rewritten as the reader's questions. PR #221.
- 2026-11-02 1. Clean up, slipped: mttr's read finds a new link to /hiking-boots/ with a trailing slash, from the new sale banner.
- 2026-11-05 1. Clean up, changed: the banner links to /hiking-boots. PR #223.
- 2026-11-09 1. Clean up, reopened; 3. Substance, opened: mttr's read on 2026-11-09.
- 2026-11-12 4. Links inside, changed: links in text from the layering, trails and care guides and the home page. PR #226.
- 2026-11-16 4. Links inside, opened: mttr's read on 2026-11-16.
- 2026-11-17 5. Links from outside, planned: list of 6 sites to ask, with a draft note each, sent to the person.

## Read-outs

(Newest first. references/report.md writes out weeks 2, 3 and 6 of this campaign.)

## Time to rank

36 days: from 2026-10-18 to the read-out of 2026-11-23, place 2.8 (Search Console, this page, this query's row, 2026-11-16 to 2026-11-22). Holding since the read-out of 2026-11-30.
```

Note what the log does not say: that any gate moved the place. The place sits in the read-outs, beside what was done.

## A person's mttr

Across campaigns, keep `campaigns.md` beside them, one line each: the page, the search, the aim, the start, the status, and the time to rank once there is one. The mean time to rank is the mean of the times written there, said with how many reached their aim of how many were run. A campaign that ended without reaching its aim stays on the list and in the count.

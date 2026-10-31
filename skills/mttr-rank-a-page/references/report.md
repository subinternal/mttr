# The read-out

Once a week, write the person a short read-out, the same shape every week, even when nothing moved. Add it to the top of the Read-outs part of `campaign.md`, and say it in the conversation.

## What it holds

1. **The place now against the aim and the start,** with the source, the dates it covers and the impressions behind it. With mttr connected and the site claimed, from `mttr_queries({ site, page })`. Without it, from the person's Search Console, read as [measuring with Search Console](search-console.md) says. If neither is there, say the place is unknown this week; an unknown week never stops the clock.
2. **The status,** and why it changed if it did.
3. **What was done this week,** a line for each change, with its gate.
4. **The gates,** each open one with its proof, and any that slipped.
5. **What is next,** the first closed gate and its first change.
6. **What needs the person,** such as a deploy to approve or a site to write to for a link.
7. **Time to rank,** once there is one; until then, the days since the start.

## How it reads

```markdown
### Week 2, 2026-10-26

Place: 9.0 for "waterproof hiking boots", 2026-10-19 to 2026-10-25, 204 impressions (Search Console). Aim: top 3. Start: 14.2.
Status: Climbing. Day 8.
Done: 2. One intent, changed: new title and first heading, winter boots moved to their own page.
Gates: 1. Clean up open (proof: mttr's read on 2026-10-20). 2. One intent open (proof: mttr's read on 2026-10-25). Nothing slipped.
Next: 3. Substance. A sizing guide on the page, from the brief.
Needs you: approve the pull request for the new title.
```

Say what was done and what was proved, and the place Google gave, side by side. Never say a change moved the place: Google's place moves for many reasons, and a week is short.

## More weeks, as they read

Illustrations of the same campaign as [tracking](tracking.md) logs it, each for a different kind of week.

**A week where something slipped and the place fell:**

```markdown
### Week 3, 2026-11-02

Place: 11.6 for "waterproof hiking boots", 2026-10-26 to 2026-11-01, 188 impressions (Search Console). Aim: top 3. Start: 14.2.
Status: Climbing. Day 15.
Done: 3. Substance, changed: fit guide, care, a table of styles. 3. Substance, stuck: no heading is a question; rewritten, PR #221.
Gates: 1. Clean up slipped: the new sale banner links to /hiking-boots/ with a trailing slash. 2. One intent open.
Next: 1. Clean up, the banner's link. Then 3. Substance, once PR #221 is live.
Needs you: approve PRs #221 and #223.
```

The place fell from 9 to 11.6. The read-out says so and does not explain it: two places on under 200 impressions is within a normal week's movement.

**The week the page first reaches its aim:**

```markdown
### Week 6, 2026-11-23

Place: 2.8 for "waterproof hiking boots", 2026-11-16 to 2026-11-22, 342 impressions (Search Console). Aim: top 3. Start: 14.2.
Status: Climbing. At the aim for the first time.
Done: 5. Links from outside, planned: the list of six sites, with a draft note each.
Gates: 1 to 4 open (latest proof: mttr's read on 2026-11-16). 5. Links from outside closed. Nothing slipped.
Next: 5. Links from outside, the notes.
Needs you: send the notes, or tell me who should.
Time to rank: 36 days (2026-10-18 to 2026-11-23). It holds once next week's read-out finds it at the aim again.
```

**A stalled week, asking the person:**

```markdown
### Week 10, 2026-12-20 (a different campaign: /services/drainage for "french drain installation")

Place: 17.3, 2026-12-13 to 2026-12-19, 61 impressions (Search Console). Aim: top 10. Start: 19.0.
Status: Stalled. No gate opened in three weeks; the place is short of the aim.
Done: nothing shipped. 4. Links inside waits on the home page template, which the person's developer owns.
Gates: 1 to 3 open. 4 closed.
Next: 4. Links inside: one sentence and link on the home page, two guides.
Needs you: should we go on? The work is ready; it needs the home page change approved. Or we can end this campaign and keep it in the count.
Day 63. No time to rank yet.
```

**An ended campaign's last read-out:**

```markdown
### Week 15, 2027-01-25, last read-out

Place: 2.4, 2027-01-18 to 2027-01-24, 410 impressions (Search Console). Aim: top 3.
Status: Ended. Held at the aim for eight weeks; the person moved on to "wide fit hiking boots".
Gates: 1 to 4 open at the last read (mttr's read on 2027-01-22). 5. Links from outside: 6 of the middle rival's 7 linking sites, among those mttr has read.
Time to rank: 36 days. The person’s mttr: 36 days, 1 of 1 campaigns reached its aim.
```

## What a read-out never says

- That a change caused the place. Write them side by side.
- A place from a person's own search, as if it were the measure.
- A place without its window, source and impressions.
- A promise of a place, or a date to reach it ([timelines and stopping](timelines-and-stopping.md)).

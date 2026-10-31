# Troubleshooting a campaign

Symptoms an agent meets while running a campaign, what usually causes each, and what to do. For trouble reading the figures themselves, see [measuring with Search Console](search-console.md).

## Gates and reads

| Symptom | Likely cause | Fix |
|---|---|---|
| The change shipped but mttr's read still fails the rule | The read came before the deploy reached the live site, a cache serves the old page, or the change is drawn by script after load | Fetch the live page with `curl -sL` and look for the change in the HTML. If it is there, `mttr_rescan` again (one read in ten minutes). If not, find the cache or the script. |
| `mttr_rescan` returns no new read | A site is read at most once every ten minutes | Watch the job with `mttr_job`, then call `mttr_changes` once it is done. |
| A gate opened, then a later read fails it | A deploy, a template or someone else's change undid the fix | It has slipped: close it in the log, say so in the read-out, and fix it before any later gate. Find the change that undid it in the repository's history. |
| `mttr_page` shows few rules for the page | mttr guessed the page is a plain page from its address and markup | Passing those rules proves less. Carry the gate with the brief's questions checked by the person, and say so in the proof. |
| The canonical is right in the HTML but URL Inspection shows a different Google-selected canonical | Copies of the page at other addresses, or links that point at another address | Gate one is not done. Find the copies (with and without a trailing slash, with filters, with tracking in the address), link only to the one address, and inspect again after Google crawls. |
| Gate four never opens: the strongest pages are the home page and the menu | A small site with little text on its main pages | Add one sentence with a link on the home page, and links from the two or three guides people land on. Three links in text is the floor; say in the proof which pages they are. |
| `mttr_backlinks` shows no linking sites, though the person knows some | mttr counts only links from sites it has read; it is not a full index | Write the known links in the log by hand, marked "known to the person, not read by mttr". Gate five's count uses mttr's figure, and the read-out says it is a floor. |

## The place

| Symptom | Likely cause | Fix |
|---|---|---|
| The place fell after a change | Many things move a place, the change among them or not | Do not undo the change on one week's figure. Check the change did not break anything (gate one again, URL Inspection). Read two more weeks before deciding. Never write that the change caused the fall. |
| The place jumps around week to week | Few impressions, so the average is jumpy | Write the impressions beside each place. Holding needs two read-outs in a row for this reason. |
| The person's own search shows the page higher or lower | Their results are personalized | The Search Console figure is the measure. |
| Clicks fell while the place held | Fewer people searched, or something above the ordinary results takes the clicks | Say it in the read-out. `mttr_traffic` gives the site's clicks against the days before as a baseline. |
| The page reached the aim, then fell back the next week | One good week | The time to rank stands; the status stays Climbing, and the read-out says the place fell back. |

## The person and the work

| Symptom | Likely cause | Fix |
|---|---|---|
| The person asks for several searches at once | Each search is its own campaign | Ask which matters most. List the others in `campaigns.md` as waiting. |
| The person asks to raise the aim once it is reached | A new aim is a new campaign | End this one with its time to rank, then start the new one from its own start date and place. |
| The person wants links bought or swapped | Those are link spam in Google's policies | Decline, say why, and offer the list of sites to ask with a draft note for each. |
| No deploy for weeks while work waits on review | The gate's change is ready but not live | Say it in "Needs you" every week. A change that is not live cannot open a gate. |

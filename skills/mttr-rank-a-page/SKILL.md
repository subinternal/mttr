---
name: mttr-rank-a-page
description: Runs a campaign to move one page of a site up for one search, toward an aim set at the start (such as top 3), through five gates in order (clean up, one intent, substance, links inside, links from outside), each opened only by a proof from a read of the live site, and keeps a log, a weekly read-out and the campaign's time to rank. Use when asked to rank a page, get a page to page one, move up for a keyword, or run an SEO campaign on one page; or when a page ranks on page two for a search that matters. Works with mttr connected, which reads the site and checks each gate, or alone with a campaign.md kept in the repository. Not for buying links or promising a place.
metadata:
  author: subinternal
  version: "1.2.1"
---

<!-- subinternal:header -->
```
╭─────────────────────────────────────────────────────────────────╮
│        ▄                                                        │
│      ▄ █    mttr                                                │
│    ▄ █ █    rank a page                                         │
│  ▄ █ █ █                                                        │
│                                                                 │
│  skill 1.2.1  ·  by subinternal  ·  mttr.si/skills/rank-a-page  │
╰─────────────────────────────────────────────────────────────────╯
```

Print this header once, exactly as it is, in a code block, as the first thing you show when this skill starts. Then go on.
<!-- /subinternal:header -->

# Rank a page

Move one page up for one search, toward an aim. You work in the site's own repository, on one campaign at a time, through five gates in order. A gate opens only on a proof, a read of the live site or the person's check, and you never open one yourself.

What this does not do: it does not promise a place. Google decides where a page shows. The log says what was done and what a proof showed, and shows the place Google gave beside it; it never says one caused the other.

## The words it uses

Use these words, and only in these senses, in the log, the read-out and the conversation, so the person and any agent after you read them the same way.

- **Campaign:** one page, one search, one aim. Nothing else is worked on under it.
- **Aim:** the place the page should reach for the search, set with the person at the start, such as top 3. One number, never a range.
- **Gate:** one of the five steps below. A gate is closed until a proof opens it.
- **Proof:** the read that opened a gate, with what it counted: "Proof: mttr's read on 2026-10-25, 6 of the 10 most linked pages link here, up from 1."
- **Slip:** a gate that was open and fails at a later read. It closes again, and the work goes back to it before any later gate.
- **Read-out:** the weekly check-in, written the same way every week ([the read-out](references/report.md)).
- **Time to rank:** the days from the campaign's start to the first read-out that finds the page at its aim or better. It measures how long the page took. It does not say what moved it.
- **mttr, mean time to rank:** the mean time to rank across a person's campaigns that reached their aim, always said with how many reached it of how many run: "mttr 41 days, 3 of 5 campaigns".

A campaign has one status at a time, always written as the word:

| Status | When |
|---|---|
| Setting up | The page, search, aim or starting place is not written down yet. |
| Climbing | Work is under way and a gate opened in the last three weeks. |
| Stalled | No gate opened, and the place did not reach the aim, for three weeks. Say so in the read-out and ask the person whether to go on. |
| Holding | The page has been at its aim or better for two read-outs in a row. Time to rank stopped at the first of them. |
| Ended | The person ended it, or it held for eight weeks and they moved on. |

## Before you start

1. Ask the person, once: the page (its path on the live site), the search it should rank for, in the words people type, the aim, and whether you may deploy or only open a pull request. Write all four at the top of the log ([tracking](references/tracking.md)).
2. One page and one search. If the person names several searches, ask which one matters most; the others wait for their own campaign. Check the search fits the page: where candidates come from, reading the intent from the live results, and whether another page of the site is the better one are in [choosing the search](references/choosing-the-search.md).
3. An aim the evidence supports. From place 40, top 3 is a long campaign; say so and offer top 10 first. Never raise or lower the aim later without the person, and never to make time to rank look better. Tell the person once that changes reach Google over days to weeks and no place or date is promised ([timelines and stopping](references/timelines-and-stopping.md)).
4. Connect to mttr over MCP at `https://mttr.si/mcp` with the person's key (`mttr_signup` gives one). Without mttr, every gate below still works from the site's own files and a browser, and the log is kept by hand in `campaign.md`.
5. Find the place it starts at. With mttr and a claimed site, call `mttr_queries({ site, page: "<the page's full address>" })` for the searches the page shows for and its average position for each. Without it, ask the person for Search Console's Performance report for that page and search, or write "place unknown" rather than guess. How to read it for one page and one search, and what its average means, is in [measuring with Search Console](references/search-console.md).
6. Write the starting place, the date, the window, the impressions and the source in the log. The date is the campaign's start, where time to rank counts from. A place from a person's own search in a browser is personalized; say so if that is all there is.

The status moves from Setting up to Climbing. Then work the gates in order. Work on a gate past one that is closed is wasted.

## 1. Clean up

Make the page and the paths to it work before anything else.

- **Look at:** with mttr, `mttr_page({ site, path })` for the page's findings, and `mttr_links({ site, show: "broken" })` for broken links on the site. Without mttr, load the page, follow every link on it, and check its status and its canonical in the HTML.
- **Decide:** fix anything on this page first, then anything that leads to it: links to it that redirect or break, copies of it at other addresses (with and without a trailing slash, with filters or tracking in the address), and a canonical that points elsewhere.
- **Change:** one address for the page, every internal link pointing straight at it, a canonical to itself, and a 200 for the page with its words in the HTML before any script.
- **Opens when:** mttr's next read fails no access rule on the page and finds no broken link or duplicate touching it. Without mttr: the page answers 200 at one address, its canonical is itself, and no link to it on the site redirects. Where the person has Search Console, the URL Inspection tool's Google-selected canonical is the page's own address too ([measuring with Search Console](references/search-console.md)).

## 2. One intent

A page ranks for what it is plainly about. Make it about one thing: the search.

- **Look at:** the searches the page already shows for (`mttr_queries({ site, page })`, or Search Console). Sort them by what the person wants: to buy, to compare, a use, a place, an answer to a question.
- **Decide:** the campaign's search sets the intent. Searches of the same intent stay; a search of another intent belongs to another page. If no page answers it, list it for the person as a page to write, and a campaign of its own, and leave this one alone.
- **Change:** a title that leads with the search and says what the page is, a first heading that does the same in words a person reads, and an opening that answers the intent in the first lines. Cut from the title what belongs to other pages. See [title links](https://developers.google.com/search/docs/appearance/title-link) for what Google shows, and [what the page must answer](references/the-page.md) for a worked before and after.
- **Opens when:** the title and first heading carry the search, and none of the searches the page earns is for a different kind of page. Without Search Console data, the title and heading alone, and say the rest is unchecked.

## 3. Substance

Give the page what the pages above it give a reader, and what only this site can.

- **Look at:** the three pages that rank above it for the search. With mttr, `mttr_competitors({ site })` and `mttr_gaps({ site })` show sites near it and the subjects they cover that it does not. Read the rivals' pages yourself: what questions do they answer, how deep, with what proof?
- **Decide:** write a short brief before changing anything ([what the page must answer](references/the-page.md) has its shape and a worked one): the questions a reader of this search has, which the page answers, which it misses, and what the site knows that the rivals do not (its own products, prices, places, people, results). Do not copy a rival's structure or words.
- **Change:** add what is missing in the site's own voice: answers under headings that are the reader's questions, the real details (sizes, prices, steps, places), why to choose this site, and proof a reader can check. Keep it as long as it needs to be and no longer. See [helpful, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
- **Opens when:** the page passes the content rules mttr checks on it (for any it fails, `mttr_examples({ site, path, rule })` shows passages that pass it, to write from), and covers the subjects the rivals cover, or has fewer than two left. Without mttr: the brief's questions each have an answer on the page, checked by the person.

## 4. Links inside

The site's own strongest pages should point here, in words that say what the page is.

- **Look at:** with mttr, `mttr_links({ site, show: "content", q: "<the page's path>" })` for the links to the page from inside other pages' text, and the site's most linked pages. Without mttr, the navigation, the home page, and the guides or categories most people land on.
- **Decide:** pick pages where a link reads naturally: a guide on the same subject, a parent category, a page that mentions the thing by name. Three good links from strong pages beat thirty from a footer.
- **Change:** a sentence on each that links to the page with words describing it, close to the search but written for a reader. Not the exact search on every link. See [link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), and [links inside](references/links-inside.md) for finding the pages, a worked link and how to check it.
- **Opens when:** at least three of the site's ten most linked pages link to the page from their text, or the page is among the site's twenty most linked.

## 5. Links from outside

Earn links from sites that would point a reader here anyway.

- **Look at:** who links to the rivals above it. With mttr, `mttr_backlinks({ site })` for the sites mttr has read that link to this one. Note that mttr counts only links from sites it has read; it is not a full index.
- **Decide:** list sites that link to the rivals' pages and would gain from linking here: clubs, guides, suppliers, local groups, writers who cover the subject. Next to each, what this page gives their readers that the rival page does not.
- **Change:** nothing on the site. Write the person a short list of who to ask and what to offer, and a draft note for each. Never buy links, swap them, or ask for exact search words in the link: those are [link spam](https://developers.google.com/search/docs/essentials/spam-policies), and a page caught at it falls.
- **Opens when:** the page has as many linking sites, among those mttr has read, as the middle rival above it. Until then the list of who to ask is the work.

## Prove, log, repeat

After each change ships:

1. With mttr, log it with `mttr_log_work({ site, step: "changed", did })`, then `mttr_rescan({ site, reason })` and, once the read is done, `mttr_changes({ site })` for what it moved. A read that opens the gate is logged with `step: "checked"` and its proof. A read that does not is logged with `step: "stuck"` and why, and the gate stays closed.
2. Without mttr, write the change in `campaign.md` with the date and the address, and what the person checked.
3. Never open a gate yourself. A read opens it, or the person does, and the log says which.
4. At each read, check the open gates too. One that fails again has slipped: close it, say so in the log, and go back to it.

The log's shape is in [tracking](references/tracking.md), with a worked log eight weeks in, and the read-out in [the read-out](references/report.md), with worked weeks: a slip, the aim reached, a stall, the end. Write the read-out each week the same way, even when nothing moved, and set the campaign's status in it. When a read or a figure does not behave, see [troubleshooting](references/troubleshooting.md).

## Reaching the aim

1. The first read-out that finds the page at its aim or better stops the clock: write the time to rank in days, from the start date, with the dates and the source.
2. The status stays Climbing until a second read-out in a row finds it there; then it is Holding. If the second does not, the clock does not restart: the time to rank stands, and the read-out says the place fell back.
3. While it holds, keep reading the site and keep the gates open. A slip while holding is worked on before anything new.
4. When the person ends it, or after eight weeks holding, write the campaign's last read-out and set it to Ended. Their mttr is the mean time to rank of the campaigns that reached their aim, said with how many reached it of how many were run.

## Stopping or changing target

Raise it with the person, never decide alone, when the read-out shows any of these: Stalled twice in a row; all five gates open for eight read-outs with the place no better than the start; the page still not shown for the search after gates one to three opened; another page of the site shown for the search more often; the results changed kind since the start. A new search, page or aim is a new campaign with its own start; this one ends and stays in the count. The signals, what each suggests and what to offer are in [timelines and stopping](references/timelines-and-stopping.md).

## Rules you keep

- One page, one search, one aim, five gates in order.
- Never promise a place or a date. Google decides both.
- Never claim a place moved because of a gate. Say what was done, what was proved, and the place Google gave, side by side. Time to rank measures; it never credits.
- Never change the aim without the person, and never leave a campaign that missed its aim out of their mttr's count.
- Never buy links, swap them, or ask for keyword-rich link text.
- Never fill a page with the search repeated, or with text a reader does not need.
- Ask before deploying unless the person said you may.

## A worked example, an illustration

This shows the method, not a real site's results. An outdoor shop's category page, `/hiking-boots`, for the search "waterproof hiking boots", with an aim of top 3, from place 14.

1. **Clean up:** two links to retired products return 404, and a filtered copy of the page has no canonical; both are fixed, and the next read opens the gate.
2. **One intent:** the title read "Hiking Boots for Men, Women & Kids | Best Waterproof Boots for Winter". Winter boots and kids' boots are other searches with other pages; the title becomes "Waterproof Hiking Boots | Shop Men's and Women's", and the winter page takes the rest.
3. **Substance:** the three pages above it each explain sizing, what waterproof means in practice, and care. The page gains a short guide to each, a paragraph on why buy here (fitting help, free returns), and the range named.
4. **Links inside:** the shop's guides to trails and to layering, its most linked pages, each gain a sentence linking to the page with the words "waterproof hiking boots".
5. **Links from outside:** two trail clubs and a gear blog link to rivals' sizing guides. The shop's new sizing guide is offered to them as the better page.

If the read-out of week 7 finds it at place 3, and week 8 does again, its time to rank is the days from the start to week 7's read-out, and the campaign is Holding.

## Sources

- [Spam policies for Google web search](https://developers.google.com/search/docs/essentials/spam-policies): why links are earned, never bought or swapped, at gate five.
- [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content): what substance means at gate three.
- [Influencing your title links in search results](https://developers.google.com/search/docs/appearance/title-link): how the title at gate two is shown.
- [Link best practices for Google](https://developers.google.com/search/docs/crawling-indexing/links-crawlable): link text at gate four.
- [How to specify a canonical URL with rel="canonical" and other methods](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls): one address for the page at gate one.
- [Performance report (Search results): Overview and basic setup](https://support.google.com/webmasters/answer/7576553): where the page's place, and so its time to rank, comes from without mttr; results differ by person, newest data is preliminary, and the chart and table count differently.
- [Performance report (Search results): Advanced filtering and comparison](https://support.google.com/webmasters/answer/17011165): filtering to one page and comparing two windows, and why filtered totals leave out anonymized queries.
- [What are impressions, position, and clicks?](https://support.google.com/webmasters/answer/7042828): position as the topmost place held, averaged, and recorded only when the page was shown.
- [URL Inspection tool](https://support.google.com/webmasters/answer/9012289): whether the page is on Google, and the declared canonical against the one Google selected, at gate one.
- [Ask Google to recrawl your URLs](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl): asking for a crawl after a change, and that it takes days to weeks.
- [SEO Starter Guide: The Basics](https://developers.google.com/search/docs/fundamentals/seo-starter-guide): that changes take hours to months to show, to wait a few weeks before judging, and that there is no preferred word count.
- [Debugging drops in Google Search traffic](https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops): that small moves in position happen at any time, and that no change is sure to have an effect.
- [Do you need an SEO?](https://developers.google.com/search/docs/fundamentals/do-i-need-seo): that no one can guarantee a first place, so the campaign never promises one.

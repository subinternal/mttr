# Choosing the search and reading its intent

A campaign is only as good as its search. Pick one the page can plausibly win, read what the people typing it want from the results Google already shows, and set an aim the evidence supports. Do this before the first gate; a wrong search wastes every gate after it.

## Where candidate searches come from

In order of how much they can be trusted:

1. **Search Console, for this page.** With mttr and a claimed site, `mttr_queries({ site, page: "<the page's full address>" })` lists the searches the page was shown for, with clicks, impressions and average place. Without mttr, the person's Performance report, filtered to the page ([measuring with Search Console](search-console.md)).
2. **Searches close to the top, across the site.** `mttr_queries({ site, show: "near" })` lists searches at places 4 to 20. A page already on page one or two for a search has shown Google it is relevant; those are the cheapest campaigns.
3. **The person's own words.** What customers say on the phone, in emails, in reviews. Useful when the site is new to Search Console, but unproven: say so in the log.
4. **Searches nothing answers.** `mttr_queries({ site, show: "unanswered" })` lists searches no passage on the site comes close to. These are pages to write, not pages to rank: each is a campaign for a page that does not exist yet, and this skill starts once it does.

Never pick a search because a tool says it has volume. Pick it because the page answers it and people who type it would be glad to land there.

## Is it the right page for the search?

Before committing, check that the page you were given is the one the site should rank:

- `mttr_queries({ site, show: "better" })` lists searches where another page on the site reads closer to the search than the one Google shows. If the campaign's search is on it, the person may be pushing the wrong page. Show them both and let them choose.
- `mttr_similar({ site, path })` lists the pages that read most like this one. Two pages that mean nearly the same thing can split one search between them. If one exists, the campaign either picks one page and makes the other link to it (and differ from it), or the person merges them. Write which in the log.
- In Search Console, filter to the query alone and look at the Pages tab. If Google shows several of the site's pages for it, note which and how often.

## Reading the intent from the live results

Google's results for a search are the best record of what people typing it want. Read them the way a person sees them.

**Getting the results.** Ask the person to search in a private window, signed out, on the device most of their customers use, and paste or screenshot the first page. Results depend on "the time, place, device, and recent history of the person searching" (Search Console Help), so one person's view is a sample; say so. Do not script searches against Google yourself.

**What to note, for the first ten results:**

| Note | What it tells you |
|---|---|
| The kind of page: shop category, single product, guide, comparison, local business, tool, forum thread, video | The kind of page people expect. If eight of ten are guides and this is a category page, the page is the wrong kind for the search. |
| Who ranks: big retailers, small specialists, directories, forums | How open the search is to a site like this one. |
| What sits above the ordinary results: a map with businesses, shopping results, questions people ask, videos, an AI answer | How many clicks are left for ordinary results, and whether a local or product listing matters more than the page. |
| What the top three each answer, in their first screen | What the page must answer early (gate three). |
| How fresh the top results are | Whether the search wants recent pages. |

**Classify the intent** in one of the words the skill uses at gate two: to buy, to compare, a use, a place, an answer to a question. Write it in the log with the evidence: "Intent: to buy. 7 of 10 results are shop category pages, 2 are comparison guides, a shopping row sits above them."

**Mixed results.** When the first ten split between two kinds of page (say five guides and five shops), the search has two intents. A page can serve the one it is built for; it should not try to be both. Note which half the page competes in: its realistic aim is a place among that half.

## When the search and the page do not fit

| What you see | What to do |
|---|---|
| The results are a different kind of page from this one | Tell the person. Either pick a search of this page's kind (often a longer one, such as "buy waterproof hiking boots" for a shop page), or write the other kind of page in its own campaign. Do not turn a category page into a guide to chase a search. |
| A map of local businesses fills the top, and the business has a place | The local listing may matter more than this page. Say so; it is outside this skill. The page can still win the ordinary results below. |
| The top ten are all very large sites, and this site is small | Offer a longer, more exact search first ("waterproof hiking boots for wide feet") with an aim of top 3, and the broad search later. |
| The search names a brand that is not the site's | Leave it. A page that ranks for a rival's name disappoints the people who click. |
| Google already shows a different page of this site for it | See "Is it the right page" above; settle that before gate one. |

## Setting an aim the evidence supports

These are the skill's own rules of thumb, not Google's: Google publishes no timeline for a place.

- **Already 4 to 10:** top 3 is a fair aim.
- **11 to 20:** top 10 first; top 3 as a second campaign once it holds.
- **21 to 50, or not shown at all:** top 10 is a long campaign. Say so, and offer a longer search where the page can reach top 3.
- **Never shown, page new:** write "place unknown" as the start, and set the aim knowing the clock starts from the day the page was first written down.

An aim is one number, set once with the person. If the evidence later says it was wrong, the campaign ends and a new one starts ([timelines and stopping](timelines-and-stopping.md)); the aim of a running campaign is never moved.

# Measuring with Search Console

The campaign's place comes from Google's own figures, never from a search the agent or the person runs and reads by eye. Search Console's Performance report is that record. This is how to read it for one page and one search, what its figures mean, and what to write in the log.

## With mttr

mttr has Search Console figures only for sites whose owner added mttr in Search Console, and gives them only for a site the person has claimed.

- `mttr_queries({ site, page: "<the page's full address>" })`: the searches the page was shown for, each with clicks, impressions and average place. Find the campaign's search in it.
- `mttr_queries({ site, show: "near" })`: searches at places 4 to 20 across the site, to see the campaign's search among the others close to the top.
- `mttr_traffic({ site })`: clicks by day and each page's clicks now against as many days before, as a baseline. The page losing clicks while its place holds can mean fewer people search, not that the page fell.

If `mttr_queries` returns nothing for the site, the owner has not added mttr in Search Console, or the site is not claimed. Use the person's report by hand as below, and say which source each figure came from.

## Without mttr: the Performance report, by hand

Ask the person to open Search Console, the property for the site, then Performance, Search results, and set:

1. **Search type:** Web.
2. **Date:** the last 7 days for a weekly read-out; the last 28 days once, at the start, beside the 7 day figure, for a steadier view.
3. **Page filter:** the page's full address ("URLs containing"). Check the Pages tab then shows only the campaign's page; if a longer address also matches (such as `/hiking-boots-kids`), use the Custom (regex) option to match the one address.
4. **Queries tab:** find the row whose query is the campaign's search, word for word, and read its **Position**, **Impressions** and **Clicks** columns. A row's position is the average for that row alone, so it is the search's figure, not the page's average over every search.

Have them paste the row's three figures and the dates, or a screenshot. Write each with its window and source in the log: "Place 9.4, 212 impressions, 6 clicks, 2026-10-19 to 2026-10-25, Search Console, this page, this query's row."

To see a change across weeks, the Date filter's Compare sets two windows side by side, and Google suggests weekly granularity when comparing, to even out the day of the week ([Performance report (Search results): Advanced filtering and comparison](https://support.google.com/webmasters/answer/17011165)). Filtering can change the report's totals, because anonymized queries are left out of filtered figures; read the one row, not the totals at the top.

Search Console's labels can change; if the person cannot find one, ask them to describe what they see rather than guessing at the screen.

## What the figures mean

From Google's own help ([What are impressions, position, and clicks?](https://support.google.com/webmasters/answer/7042828) and [Performance report (Search results): Overview and basic setup](https://support.google.com/webmasters/answer/7576553)):

- **Position** is the topmost place a link to the page held when it was shown, averaged. A page at 2 for one search and 3 for another averages 2.5, which is why the campaign reads the one search's row, never the page's figure over all its searches.
- **A place is only recorded when the page was shown.** A dash means it was not shown for that search in the window: write "not shown", never a number.
- **Results differ by person.** Google says results are "specific to the time, place, device, and recent history of the person searching". The average is across everyone who saw the page, which is why it is the campaign's measure and one person's search is not.
- **Newest data can be preliminary**, still being collected and changing over the next hours. End each window on a day that is complete.
- **The chart and the table can disagree.** The chart counts by site, the table's Pages tab by page; the totals can differ. Read the one row, as above.

## Reading a week's figure honestly

- **Few impressions, a jumpy average.** A place from 20 impressions can move several places on no change at all. Write the impressions beside every place, and do not call a move of one or two places on few impressions a change.
- **Use the same window, filters and source every week.** A 28 day figure one week and a 7 day the next are not comparable.
- **Look at the trend, not the week.** Google says small moves in position "can happen at any time" ([Debugging drops in Google Search traffic](https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops)). The read-out reports the week; the campaign's judgment rests on several.
- **The clock is still the clock.** The first read-out at the aim or better stops time to rank, even on few impressions. That is why Holding needs a second read-out in a row: one good week is not yet a place the page keeps.

## Checking the page Google has

The URL Inspection tool in Search Console says how Google holds the page ([URL Inspection tool](https://support.google.com/webmasters/answer/9012289)). Ask the person to inspect the page's address:

- **"URL is on Google"** means it is indexed; it does not promise the page shows for any search.
- **User-declared canonical against Google-selected canonical.** If Google chose a different address from the one the page declares, gate one is not done: Google is treating another address as the page. Fix the duplicates and links, then inspect again.
- **The indexed version is not a live test.** After a change ships, the live test shows what Google can fetch now; the indexed view changes only once Google crawls it again.
- **Request indexing** after a change worth Google's notice (a new title, a new section). It is a request: Google says crawling "can take anywhere from a few days to a few weeks" and requesting again does not make it faster ([Ask Google to recrawl your URLs](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)). Write the date of the request in the log.

## Troubleshooting the figures

| Symptom | Likely cause | What to do |
|---|---|---|
| The search is not in the page's list at all | The page was not shown for it in the window, or only very rarely | Write "not shown". Widen to 28 days once to see if it ever was. A page never shown for its campaign's search after several weeks of open gates is a sign the search or the page is wrong ([timelines and stopping](timelines-and-stopping.md)). |
| The place in Search Console differs from what the person sees | Their results are personalized by place, device and history | Search Console's average is the measure. Say so in the read-out. |
| Place improved, clicks did not | Something above the ordinary results takes the clicks, or few people search it this season | Note it. The campaign's aim is a place, but tell the person what the clicks say. |
| Another page of the site shows for the search | Two pages compete for it | Filter by the query alone ("Queries containing") and look at the Pages tab; see "Is it the right page" in [choosing the search](choosing-the-search.md). |
| `mttr_queries` and the report by hand disagree slightly | Different windows or filters, or newest data still preliminary | Use one source for the campaign and write which. |

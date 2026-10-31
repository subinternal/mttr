# What the page must answer

Gates two and three change the page itself: its title, its first heading, its opening, and what it covers. This is the depth behind them, with the brief to write first, a worked before and after, and what trips agents up.

## The brief, before any change

Write it in the log, short, before touching the page. It keeps the work honest: every change answers a line of it.

```markdown
### Brief: /hiking-boots for "waterproof hiking boots"

Intent: to buy (7 of 10 results are shop category pages; a shopping row sits above them).
The reader wants to know: which boots are truly waterproof, how they fit, what they cost, how to keep them waterproof, whether returns are easy.
The top three answer: sizing (all three), membrane against treated leather (two), care (two), price range (one).
This page answers now: price, a grid of products. Nothing else.
Only this site can say: it fits boots in store and by video call; free returns for 60 days; it has sold the range for 12 years; its own wear tests on two trails.
To add: a fit guide, what waterproof means here, care, why buy here. Not copied from any rival: written from the shop's own knowledge.
```

Read the rivals' pages to find the reader's questions, never to copy their order or words. Google's own test for helpful content asks whether a page gives "substantial value when compared to other pages in search results" ([Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)). A page that restates the top three adds nothing to them.

With mttr, `mttr_gaps({ site })` lists the subjects rivals write about that nothing on the site comes close to, with the rival pages. `mttr_compare({ site, with: "<rival>", view: "content" })` sets the two sites' content side by side by meaning: subjects both write about, and what only one does. Close in meaning says similar, never better.

## Title, first heading, opening: before and after

The title leads with the search and says what the page is. The first heading says the same in words a person reads. The opening answers the intent at once.

Before:

```html
<title>Hiking Boots for Men, Women &amp; Kids | Best Waterproof Boots for Winter | Trailhead Outfitters</title>
...
<h1>Shop</h1>
<p>Welcome to our store! We have been passionate about the outdoors since 2014.</p>
```

After:

```html
<title>Waterproof Hiking Boots | Men's and Women's | Trailhead Outfitters</title>
...
<h1>Waterproof hiking boots</h1>
<p>Every boot here keeps water out with a sealed membrane, not just a treated outer. 38 styles for men and women,
fitted free in store or by video call, with 60 days to return them worn on a trail.</p>
```

What changed and why:

- The title leads with the search, drops winter and kids (other searches, other pages), and is 15 to 65 characters before the shop's name, which the `title` rule checks. Google's own guidance: titles "descriptive and concise", no word repeated, the site's name at the start or end with a separator ([Influencing your title links in search results](https://developers.google.com/search/docs/appearance/title-link)).
- One first heading that matches the title (the `one-h1` rule). Google builds the title it shows from several sources, the main visible heading among them, so a heading that disagrees with the title weakens both.
- The opening answers what a buyer of this search wants first: are they truly waterproof, how many, how do I get the right fit. No welcome, no history.

## Substance: answers under the reader's questions

Add what the brief says is missing, each under a heading that is the reader's question:

```html
<h2>How do I find my size in a hiking boot?</h2>
<p>Measure your foot in the evening, standing, in the socks you hike in, and add a thumb's width at the toe.
Our boots run true to size except the Ridgeline, which runs half a size small. Book a fitting and we check it for you.</p>

<h2>What makes a boot waterproof, not just water resistant?</h2>
<p>...</p>

<table>
  <caption>Our boots by how they keep water out</caption>
  <tr><th>Style</th><th>Waterproofing</th><th>Weight, pair</th><th>Price</th></tr>
  ...
</table>
```

The rules mttr checks that bear on this, each in `mttr_rules()` with its fix: `question-headings` (at least one heading is a question), `answer-first` (the first question answered in 25 to 90 words under it, on guide pages), `liftable-blocks` and `has-table` (lists and tables a reader and an assistant can lift), `depth` (a floor of words for the kind of page), `plain-claims` (no sales claim with nothing behind it), `content-in-html` (the words in the HTML, not drawn by script). For any rule the page fails, `mttr_examples({ site, path, rule })` shows passages from pages near it in meaning that pass it: worked examples to write from, not text to copy.

Length is not the aim. Google says there is no preferred word count ([SEO Starter Guide: The Basics](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)), and its self-assessment asks whether you are "writing to a particular word count". `depth` is a floor for thin pages, not a target: stop when the brief's questions are answered.

## Edge cases that trip agents

| Trap | How to spot it | What to do |
|---|---|---|
| The search repeated into every heading and paragraph | Read the page aloud; the phrase appears more often than a person would say it | Say it in the title, the first heading and where it reads naturally. Repetition to manipulate a place is keyword stuffing, against [Google's spam policies](https://developers.google.com/search/docs/essentials/spam-policies). |
| A shop page turned into an essay | Products pushed below several screens of text | Keep the products near the top. Put the guide below the grid, or in short parts beside it. The intent is to buy. |
| An FAQ block written for search, not readers | Questions no customer asks, answers that repeat the title | Use the brief's questions. Any FAQ in structured data must be visible on the page (`faq-matches-page`). |
| Ratings in structured data with no reviews shown | Stars in the markup, none on the page | Remove them or show the reviews (`ratings-are-real`). |
| Changing the date to look fresh | A new date with no change in substance | Change the date only with a real change. Google's self-assessment names this as search-first. |
| mttr reads the page as a plain page | `mttr_page` shows few content rules for it | mttr guesses a page's kind from its address and markup, and a plain page gets fewer rules. Passing them proves less; the brief's questions, checked by the person, carry the gate. Say so in the proof. |
| The fix is on a template shared by many pages | The title or heading comes from a layout file | Change only this page, through its own data, unless the person agrees to change the template; then the campaign log says every page it touched. |

## Verifying gates two and three

- **Gate two, with mttr:** after the rescan, `mttr_page({ site, path })` shows the title and first heading, and no `title` or `one-h1` finding. Then, after a few weeks, the page's searches in `mttr_queries({ site, page })` should be mostly of the campaign's intent. A search of another intent that still earns impressions is a note for another page, not a failure of this one, unless it is among the page's top searches.
- **Gate two, without mttr:** fetch the live page and read the `<title>` and `<h1>` in the HTML the server sends, not in the browser after script runs: `curl -sL https://<site>/<path> | grep -iE '<title>|<h1'`.
- **Gate three:** the page passes the content rules mttr checks on it, and `mttr_gaps` lists fewer than two of the rivals' subjects whose nearest page here is this one. Without mttr, each line of the brief's "to add" is on the live page, and the person has read it and agrees.
- **A pass** is a read, written in the log as the proof. **A fail** is written as `stuck` with the rule or the question still open, and the gate stays closed.

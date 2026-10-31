# Links inside the site

Gate four. The site's own strongest pages should point to the campaign's page from their text, in words that say what it is. This is the method, a worked change, and how to check it.

## Find the pages that should link here

1. **The site's strongest pages.** With mttr, `mttr_structure({ site })` and `mttr_pages({ site })` show how the site hangs together and its pages; `mttr_links({ site, show: "all" })` lists every link from the latest read. The pages most linked from the rest of the site, and the pages most people land on (the person's Search Console Pages tab, sorted by clicks, or `mttr_traffic({ site, show: "all" })`), are where a link counts most.
2. **What already links here.** `mttr_links({ site, show: "content", q: "<the page's path>" })` lists links to the page from inside other pages' text. Navigation and footer links say a page exists; a link in text says what it is related to (the `linked-in-context` rule).
3. **Pages on the same subject.** `mttr_similar({ site, path })` gives the pages that read most like this one, each with the passages that come closest. Those passages are often exactly where a link belongs.
4. **Without mttr:** the home page, the navigation, the parent category, and the guides the person names as most visited. Search the repository for pages that mention the subject by name: `grep -ril "waterproof" content/ src/pages/`.

Pick three to five pages where a reader of that page would want this one. Three good links from strong pages in text beat thirty from a footer.

## Write the link: before and after

Before, on the guide `/guides/layering-for-wet-weather`:

```html
<p>Your feet matter as much as your jacket. We stock a wide range of footwear for every trail,
<a href="/hiking-boots?utm_source=guide">click here</a> to see it.</p>
```

After:

```html
<p>Your feet matter as much as your jacket. A boot with a sealed membrane keeps water out on a wet
trail; our <a href="/hiking-boots">waterproof hiking boots</a> are all fitted free in store.</p>
```

What changed and why:

- **The words of the link say what the page is.** Google's guidance: good link text is "descriptive, reasonably concise, and relevant to the page that it's on and to the page it links to", and "click here" or "read more" say nothing ([Link best practices for Google](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)).
- **It sits in a sentence.** The words around a link give it context; a link alone in a list of links loses it.
- **It points straight at the page's one address,** with no tracking in the address and no redirect (`direct-links`, and gate one's one address).
- **It is a real link,** an `<a>` with an `href`, which Google can follow. A button that changes the page with script is not.

Vary the words across pages. "waterproof hiking boots" on one, "boots that keep water out" on another, "our waterproof boots for men and women" on a third. The same exact search on every link reads as written for a machine, and Google warns against cramming keywords into link text.

## Edge cases

| Trap | How to spot it | What to do |
|---|---|---|
| Links added to the footer or a sitewide menu only | `mttr_links({ site, show: "content", q })` shows no new links after the rescan | Footer links are fine but do not open the gate. Add links in text. |
| A link through a redirect | The `href` is an old address, or has a trailing slash the page does not | Point it at the final address. `mttr_links({ site })` lists broken links; `direct-links` flags redirecting ones. |
| A link drawn by script after load | The link is in the browser but not in `curl -sL <page>` | Put it in the HTML the server sends. |
| Many pages linking with the same exact words | A search of the repository finds the same anchor text five times | Rewrite most of them in plain words for each page's reader. |
| The page is deep | More than three clicks from the home page (`within-three-clicks`) | A link from the home page or a top category is worth more than another from a deep page. |
| A competing page on the same subject | `mttr_similar` shows a page that reads nearly the same | Link from it to the campaign's page with words that say how they differ, and make sure the campaign's page does not link to it as the main answer for the search. |

## Verifying the gate

- **With mttr:** after the rescan, `mttr_links({ site, show: "content", q: "<the page's path>" })` lists the new links, from the pages you chose. The gate opens when at least three of the site's ten most linked pages link to the page from their text, or the page is among the twenty most linked. Write the count in the proof: "Proof: mttr's read on 2026-11-08, 4 of the 10 most linked pages link here in text, up from 1."
- **Without mttr:** for each linking page, `curl -sL https://<site>/<linking path> | grep -o 'href="/hiking-boots"'` finds the link in the HTML the server sends. The person confirms the pages chosen are among the most visited.
- **A fail:** a link that only appears after script runs, or that goes through a redirect, does not count. Log it as `stuck` and fix it.

# Outline, landmarks and accessibility

A page's outline is what a screen reader lists, what a crawler takes as the page's parts, and what an assistant lifts a passage from. The same markup serves all three. This file is for step 3 of the skill, and for the landmarks in step 2.

## How mttr reads the outline

Knowing what code counts saves guessing.

- `one-h1` counts every `h1` in the whole HTML the server sends, header and footer included, not only those in `<main>`. A logo wrapped in an `h1`, or a second `h1` in a mobile menu that is hidden by CSS, is a second `h1`.
- The page's own text is what is inside `<main>`, with `nav`, `form`, `script`, `style`, `noscript` and `template` taken out. With no `<main>`, it is the `<body>` less its top-level `header`, `footer` and `aside`. Word counts (`content-in-html`, `depth`) and lists (`liftable-blocks`) are read from there.
- `question-headings` looks at the `h2`, `h3` and `summary` elements inside the content for one that ends in a question mark.
- `answer-first` finds the first `h2` that is a question and counts the words of the first paragraph after it: 25 to 90 words passes. Code checks only place and length; whether it truly answers is the judge's rule, `answers-the-question`, or a person's read.

`mttr_rules()` gives each rule's current wording. If it says something different from this file, it is right.

## The outline, worked

Before: sizes chosen by look, a logo as the `h1`, the answer after a picture.

```html
<header><h1 class="logo">Hollow Creek Drainage</h1></header>
<main>
  <h1>French Drains</h1>
  <h4>Fast, reliable service</h4>
  <img src="/img/hero.jpg">
  <h3>How deep should a french drain be?</h3>
  <div class="cta">Call now!</div>
  <p>It depends on many factors.</p>
</main>
```

After: one `h1`, levels in order, the answer right under its question.

```html
<header><a class="logo" href="/">Hollow Creek Drainage</a></header>
<main id="content">
  <h1>French drain installation in St. Louis</h1>
  <p>We dig and lay french drains for homes and small businesses across St. Louis and St. Charles counties.</p>
  <figure><img src="/img/drain-trench.jpg" alt="A trench lined with fabric and gravel beside a house foundation" width="1200" height="800" fetchpriority="high"></figure>
  <h2>How deep should a french drain be?</h2>
  <p>Most french drains are dug 18 to 24 inches deep and 6 to 12 inches wide, deeper where they carry water away from a basement wall. The slope matters more than the depth: about one inch of fall for every eight feet of run, so water keeps moving to the outlet.</p>
  <h3>When a deeper drain is needed</h3>
  <p>...</p>
  <h2>How much does a french drain cost?</h2>
  <p>...</p>
</main>
```

- The heading's look comes from a class, never from picking a level. MDN says it plainly: do not use heading elements to resize text.
- An `h3` sits under an `h2`; a new `h2` may follow an `h3` or `h4`, since that closes a section. Going down skips no level.
- A sidebar or footer that repeats on every page keeps the same heading levels on every page, whatever the content is.
- Headings come from the page's data. A template that types "Why choose us" into every page gives every page the same outline and adds shared text that counts against `pages-are-distinct`.

## Landmarks

```html
<body>
  <a class="skip" href="#content">Skip to the content</a>
  <header>...<nav aria-label="Main">...</nav></header>
  <main id="content">...</main>
  <aside aria-labelledby="related">...</aside>
  <footer><nav aria-label="Site">...</nav></footer>
</body>
```

- One `<main>`, top-level, not inside another landmark.
- `header` and `footer` are the page's banner and footer only when their parent is `body`. Inside `<article>` or `<main>` they are just part of that content.
- Two `nav` elements each get their own label. The label does not repeat the role: "Main", not "Main navigation", since a screen reader already says "navigation".
- Every piece of the page sits inside some landmark, so nothing is skipped by someone moving landmark to landmark.
- The skip link is the first thing in `body` and points at `<main>`'s `id`. WCAG 2.2 success criterion 2.4.1 asks for a way past blocks repeated on every page.

## Language, names and focus

- `<html lang="en">`, or the page's real language, set per page on a site in several. WCAG 2.2 success criterion 3.1.1 asks that the page's language can be read by software.
- Every link and button has words a person can read out of context: "French drain prices", not "Read more". An icon-only control has an `aria-label`.
- A form field has a `<label>`, never a placeholder alone.
- A sticky header must not cover the element that has keyboard focus. WCAG 2.2 success criterion 2.4.11 asks that a focused control is not entirely hidden.
- Text and its background meet 4.5 to 1, large text 3 to 1, in every theme (success criterion 1.4.3). Measure with a contrast tool in each theme; do not judge it by eye.

## Accordions, tabs and hidden text

- An accordion built on `<details>` and `<summary>` keeps its text in the HTML, and mttr reads a `summary` that ends in a question mark as a question heading.
- Tabs or accordions that fetch their panel by script on click put nothing in the HTML for a crawler. Render every panel on the server and hide with CSS or `hidden`.
- Text hidden from everyone is not content. Do not mark up an FAQ that is in a closed panel the server never sends.

## Check it

| What | How | Pass | Fail |
|---|---|---|---|
| One `h1` and the order | `https://mttr.si/h1-checker?url=<page>` | One `h1`, no level skipped going down | Two `h1`, or an `h2` then an `h4` |
| What a crawler gets | `https://mttr.si/agent-view?url=<page>`, or `mttr_agent_view({ url })` | The main text, headings in order, the answer under the first question | A shell a script fills in, or the menu as the text |
| `h1` count in the raw HTML | `curl -s <page> \| grep -o '<h1' \| wc -l` | `1` | `0`, or `2` and more |
| Every template at once | `mttr_pages({ site, failing: "one-h1" })` | An empty list | Pages of one template, which points at that template |

The `curl` count reads the HTML the server sends, which is what mttr and most AI crawlers read. A browser's inspector shows the page after scripts ran, which can differ.

## Sources

- [Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/): W3C WAI's Page Structure Tutorial on heading ranks, skipping levels and fixed sections.
- [Landmark Regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/): one top-level main, labels for repeated landmarks, and labels that do not repeat the role.
- [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/): success criteria 1.3.1, 2.4.1, 2.4.6, 2.4.11 and 3.1.1, the structure, skip link, headings, focus and language this file asks for.
- [h1 to h6, the HTML section heading elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements): not resizing text with headings, not skipping levels, and one `h1` as the better practice.

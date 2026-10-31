# Component patterns

Each pattern is one component with one job, shown as the HTML it should send. Build it in the site's own framework and styles. The mttr rules after each one are what proves it. The business, the names and the figures in the examples are samples, there to show the shape: every real value comes from the site.

## The frame

Every page's shared layout. The values come from the page; none is shared between pages.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><What the page covers, then the site's name></title>
  <meta name="description" content="<What the page says, in a sentence or two>">
  <link rel="canonical" href="https://example.com<the page's own final path>">
  <meta property="og:title" content="<the title>">
  <meta property="og:description" content="<the description>">
  <meta property="og:image" content="https://example.com/og/<page>.png">
  <meta property="og:image:alt" content="<what the image shows>">
  <meta property="og:url" content="https://example.com<path>">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json"><the page's graph></script>
</head>
<body>
  <a class="skip" href="#content">Skip to the content</a>
  <header> <a href="/"><the site's name></a> <nav aria-label="Main"> ... </nav> </header>
  <main id="content"> <the page> </main>
  <footer> ... </footer>
</body>
</html>
```

- `noindex` goes in only on pages meant to stay out of search, set from the page's data, never left on from a staging build.
- The share image is 1200 by 630 pixels, about 1.91 to 1, so it is not cropped.
- The logo in the header is a link, never an `h1`: `one-h1` counts every `h1` in the HTML, header included. The landmarks and the skip link are explained in [outline-and-accessibility.md](outline-and-accessibility.md).
- Rules: `title`, `description`, `canonical`, `indexable`, `share-image`, `content-in-html`, `structured-data`.

## Breadcrumb

```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/guides">Guides</a></li>
    <li aria-current="page">How deep should a french drain be?</li>
  </ol>
</nav>
```

- The same trail as the page's `BreadcrumbList`, from the same data.
- Rules: `breadcrumb`.

## Question and answer

The heading is the question a reader asks. The paragraph right under it answers it in its first sentence.

```html
<h2>How deep should a french drain be?</h2>
<p>Most french drains are dug 18 to 24 inches deep and 6 to 12 inches wide, deeper where they carry water away from a basement wall. The slope matters more than the depth: about one inch of fall for every eight feet.</p>
```

- Nothing between the heading and its answer: no image, no call to action, no table first.
- The answer is the page's own fact, true and specific. A model reads whether it truly answers; code reads only its place and length.
- Rules: `question-headings`, `answer-first`, `answers-the-question`.

## Table

```html
<table>
  <caption>French drain or dry well</caption>
  <thead><tr><th scope="col">Option</th><th scope="col">Best for</th><th scope="col">Typical depth</th></tr></thead>
  <tbody><tr><th scope="row">French drain</th><td>Water across a yard</td><td>18 to 24 inches</td></tr></tbody>
</table>
```

- A real `<table>` with a caption and header cells, not a grid of `<div>`s.
- Rules: `has-table`, `liftable-blocks`.

## Image

```html
<figure>
  <img src="/img/drain-trench.jpg" alt="A trench lined with fabric and gravel beside a house foundation" width="1200" height="800" loading="lazy">
  <figcaption>A french drain before backfill, St. Charles, 2026.</figcaption>
</figure>
```

- Alt text says what the picture shows, not the keywords of the page. A picture only for decoration has `alt=""` and `role="presentation"`, which mttr reads as decoration.
- `width` and `height` always, so the page does not move as it loads. The first large image on the page is not lazy, and takes `fetchpriority="high"`.
- Which alt text for which image, `srcset`, and the order of speed work are in [images-and-speed.md](images-and-speed.md).
- Rules: `has-image`, `image-alt`.

## Byline and date

```html
<p class="byline">By <a href="/about#dana">Dana Ruiz</a>, licensed drainage contractor. Updated <time datetime="2026-10-16">October 16, 2026</time>.</p>
```

- The date shown is the `dateModified` in the Article data, and changes only when the content does.
- Rules: `dated`, `named-publisher`.

## Sources

```html
<section aria-labelledby="sources">
  <h2 id="sources">Sources</h2>
  <ul>
    <li><a href="<official or primary source>">Publisher: title of the page</a></li>
  </ul>
</section>
```

- Links a reader can see and follow, to the official or primary source of each fact. Sources only in structured data do not count.
- Rules: `sources-shown`, `claims-supported`.

## Contact block

```html
<section aria-labelledby="contact">
  <h2 id="contact">Get a quote</h2>
  <p><a href="tel:+13145550100">(314) 555-0100</a>, Monday to Friday, 7 to 5.</p>
  <a class="button" href="/contact">Request a quote</a>
</section>
```

- A `tel:` link where the business takes calls, and a form or a link to one on every page.
- Rules: `phone-link`, `next-step`.

## Footer

```html
<footer>
  <nav aria-label="Site">
    <a href="/services">Services</a> <a href="/guides">Guides</a> <a href="/about">About</a> <a href="/contact">Contact</a>
    <a href="/llms.txt" title="This site outlined for AI assistants">llms.txt</a>
  </nav>
  <p><Business name>, <locality>. <a href="tel:+13145550100">(314) 555-0100</a></p>
</footer>
```

- The footer links every hub, so each sits one click from every page.
- The `mttr-llms-txt` skill writes the file the footer links to.
- Rules: `within-three-clicks`, `llms-txt`, `phone-link`.

## Related links in the text

```html
<p>If the water comes from a downspout, a <a href="/services/dry-wells">dry well</a> may be the simpler fix.</p>
```

- A link in a sentence says what two pages have to do with each other. A menu link says only that a page exists.
- Every page that should rank has at least one link from the text of another page.
- Rules: `linked-in-context`, `no-orphans`, `direct-links`.

## Contrast and speed

- Text at least 4.5 to 1 against its background, and large text at least 3 to 1, in every theme. Measure it; do not judge it by eye. WCAG 2.2, success criterion 1.4.3: https://www.w3.org/TR/WCAG22/#contrast-minimum
- HTML compressed with gzip or Brotli, pages cached at the server or CDN, scripts deferred, fonts that do not hold the text back. Google's Core Web Vitals, https://web.dev/articles/vitals, are the shared yardstick. Check one page at `https://mttr.si/website-speed-test?url=<page>`.
- Rules: `compressed`, `quick-to-answer`.

## Sources

- [Influencing your title links in search results](https://developers.google.com/search/docs/appearance/title-link): what makes a good title in the frame.
- [Control your snippets in search results](https://developers.google.com/search/docs/appearance/snippet): the meta description and how Google uses it.
- [How to specify a canonical URL with rel="canonical" and other methods](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls): one address for each page.
- [Block Search indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing): keeping drafts and private pages out.
- [Link best practices for Google](https://developers.google.com/search/docs/crawling-indexing/links-crawlable): links a crawler can follow, and their words.
- [Google image SEO best practices](https://developers.google.com/search/docs/appearance/google-images): alt text, sizes and the image element.
- [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/#contrast-minimum): success criterion 1.4.3, the contrast every theme meets.
- [Web Vitals](https://web.dev/articles/vitals): the shared yardstick for how fast a page answers.
- [The Open Graph protocol](https://ogp.me/): the share tags in the frame.

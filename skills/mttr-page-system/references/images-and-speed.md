# Images, and the speed that matters for reading

Images carry meaning only as an element with words; speed matters most where it decides whether a crawler gets the page at all. This file is for the image and speed parts of step 6.

## How mttr reads images and speed

- `has-image` passes an article or service page with an `img`, `picture`, `video`, an `svg` inside a `figure`, or an `svg` with `role="img"` in its content. A picture set as a CSS background does not count, and the finding says how many it found.
- `image-alt` fails each `img` in the content with no alt text, or only spaces. An image marked `aria-hidden="true"` or `role="presentation"` is read as decoration and may have `alt=""`.
- `share-image` fails a page with no `og:image`.
- `compressed` reads the home page's `Content-Encoding`. A page under 2 KB, or a local address, is not judged.
- `quick-to-answer` fails a site where half the pages took over 800 ms to start answering. This is the server's time to first byte, not how long the page took to draw.

mttr does not measure Core Web Vitals. They are field figures from real visits; the speed test and Google's own tools report them.

## Alt text, decided

Work down the list for each image and stop at the first that fits.

| The image | Alt text |
|---|---|
| The only content of a link or button | Where it goes or what it does: `alt="Hollow Creek Drainage, home"` |
| Has words in it that appear nowhere else | Those words |
| A photo or drawing that adds meaning | What it shows, in a short sentence: `alt="A trench lined with fabric and gravel beside a house foundation"` |
| A chart or diagram | A short alt, and the figures in a table or text on the page |
| Repeats text right beside it | `alt=""` with `role="presentation"` |
| Decoration only | `alt=""` with `role="presentation"`, or a CSS background |

- Never `alt="image"`, the file name, or the page's keywords in a list. Google treats keyword stuffed alt text as spam.
- An image that is a link gives its alt as the link's words.
- Alt text comes from the image's own data in the CMS. A template that writes the page title into every image's alt gives the same words to every picture.

## The image element, worked

Before: a background picture and an image the page jumps around.

```html
<div class="hero" style="background-image:url(/img/hero.jpg)"></div>
<img src="/img/trench.jpg" loading="lazy">
```

After: the first large image loads early with its space held; the rest wait until they are near.

```html
<img src="/img/trench-1200.jpg"
     srcset="/img/trench-600.jpg 600w, /img/trench-1200.jpg 1200w, /img/trench-2000.jpg 2000w"
     sizes="(width <= 700px) 100vw, 700px"
     alt="A trench lined with fabric and gravel beside a house foundation"
     width="1200" height="800" fetchpriority="high">

<figure>
  <img src="/img/outlet-800.jpg" alt="A pop-up emitter at the end of a drain line in a lawn"
       width="800" height="600" loading="lazy" decoding="async">
  <figcaption>The outlet, where the water leaves the drain.</figcaption>
</figure>
```

- `width` and `height` on every `img`, as whole numbers of the file's own size, so the browser holds the space before it loads. CSS can still scale it.
- The largest image in the first screen is never lazy, and takes `fetchpriority="high"`. Give it to one image, two at most.
- `loading="lazy"` on images below the first screen. In a `<picture>`, the attribute goes on its `img`.
- `src` stays as the fallback beside `srcset`. Each `w` figure is that file's real width; `sizes` says how wide the image shows.
- The share image is a separate file, 1200 by 630, named in `og:image` with `og:image:alt`.

## Speed that decides what a crawler reads

Order of work, by what it gives a reader and a crawler:

1. Text in the HTML the server sends. Text added by script after load is the biggest loss: most AI crawlers do not run scripts at all.
2. Compression. Turn on gzip or Brotli for HTML at the server or CDN.
3. Time to first byte. Cache whole pages at the server or CDN where they are the same for everyone; a crawler that waits gives the site fewer visits.
4. The first image and font. Do not lazy load the main image; preload a hero image that only CSS names; use `font-display: swap` or `optional` so text shows before the font.
5. Script. Defer what the first screen does not need. Every script in `<head>` without `defer` or `async` holds the page back.

Core Web Vitals are the shared yardstick for people: Largest Contentful Paint within 2.5 seconds, Interaction to Next Paint 200 ms or less, and Cumulative Layout Shift 0.1 or less, each at the 75th percentile of real visits. They are worth meeting for people. mttr's rules check the server side of speed, not these.

## Check it

| What | How | Pass | Fail |
|---|---|---|---|
| Compressed | `curl -s -o /dev/null -H 'Accept-Encoding: br, gzip' -w '%header{content-encoding}\n' https://<page>` (curl 7.84 or later) | `br` or `gzip` | An empty line |
| Time to first byte | `curl -s -o /dev/null -w '%{time_starttransfer}\n' https://<page>`, run three times | Under 0.8 seconds most times | Over 0.8 most times |
| The whole page | `https://mttr.si/website-speed-test?url=<page>` | Its figures in the good range | The step it names as slowest |
| Images in content | `mttr_pages({ site, failing: "image-alt" })` and `failing: "has-image"` | Empty lists | The pages, which usually share a template or a CMS field left empty |
| Share image | `https://mttr.si/og-image-checker?url=<page>` | The image, its size and its alt | No image, or one cropped at 1.91 to 1 |

## Sources

- [Google image SEO best practices](https://developers.google.com/search/docs/appearance/google-images): alt text, the `img` element over CSS images, `srcset` with a `src` fallback, and file names.
- [Understand the JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics): rendering, why server rendering is still advised, and that not every bot runs script.
- [Optimize Largest Contentful Paint](https://web.dev/articles/optimize-lcp): never lazy load the main image, high fetch priority, the image findable in the HTML, and time to first byte.
- [Browser-level image lazy loading for the web](https://web.dev/articles/browser-level-image-lazy-loading): lazy only below the first screen, and `width` and `height` on every image.
- [An alt Decision Tree](https://www.w3.org/WAI/tutorials/images/decision-tree/): W3C WAI's order for choosing alt text, which the table above follows.
- [The Image Embed element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img): `alt=""`, `srcset` and `sizes`, `width` and `height`, `fetchpriority` and `decoding`.

# The player card tags, exactly

Every figure here is from X's own card docs, which X has taken down; the pages are cited from the Internet Archive below. X may have changed its clients since. What X serves today is the final word, so check each card in a real post (step 7).

## The tags a player card needs

On the share address, in `<head>`, written with `name=`:

| Tag | Needed | What it takes |
|---|---|---|
| `twitter:card` | yes | `player`, once on the page |
| `twitter:site` | yes | the account's `@username`; `twitter:site:id`, the numeric id, may stand in for it |
| `twitter:title` | yes | at most 70 characters |
| `twitter:description` | no | at most 200 characters |
| `twitter:player` | yes | the `https` address of the page X frames |
| `twitter:player:width` | yes | the frame's width in pixels, a whole number |
| `twitter:player:height` | yes | the frame's height in pixels, a whole number |
| `twitter:image` | yes | the picture shown where the frame is not |
| `twitter:image:alt` | no | what the picture shows, at most 420 characters |
| `twitter:player:stream` | leave out | a raw video or audio file, never a page |

X's markup lists Open Graph fallbacks for the title, the description, the image and its alt text (`og:title`, `og:description`, `og:image`, `og:image:alt`). There is no fallback for `twitter:card` or any `twitter:player` tag, and a page with Open Graph tags and no `twitter:card` may get a summary card. Write the player tags yourself.

## The picture

X shows `twitter:image` before the frame loads, and in place of the frame wherever a client cannot frame it. X's player card page says:

- Make it the same size as the frame you declare.
- Under 68,600 pixels in all (262 by 262, or 350 by 196 at 16:9), the player card does not render at all. A 640 by 480 picture is 307,200 pixels.
- Under 5 MB. JPG, PNG, WEBP or GIF; only the first frame of a GIF is used; SVG is not supported.
- Every address `https`.

X's troubleshooting guide adds a floor of 144 by 144 for any card image, and that X caches a card's image by its address: to replace the picture, give it a new address (a new file name, or `?v=2` after it), not new bytes at the old one.

## Choosing the frame size

X's archived docs say the web client scales the frame to the width it has, keeping the ratio of the width and height you declare. So the numbers set a shape, not a size: the page must lay out at whatever width the frame gets, which on a phone's timeline is narrow.

- 640 by 480 (4:3) suits a tool or a form with a little height.
- 640 by 360 (16:9) suits a single screen with no scrolling.
- Whatever the shape, the frame's real height is its real width times your ratio. If the content needs more, it needs an inner scroll (see [embed-mode.md](embed-mode.md)).

## One `twitter:card`, and where a second comes from

A page with two `twitter:card` tags is read unpredictably. A second one usually comes from:

- A site-wide layout or SEO plugin that writes `summary_large_image` on every page.
- A framework that builds X tags from the page's Open Graph settings. Next.js does this: when a page has `openGraph` and its `twitter` field has no card, it writes `twitter:card` as `summary_large_image` (or `summary` without an image).
- A prerender or edge layer that injects its own tags for social crawlers.

Read the rendered HTML, never the config: `curl -s -A "Twitterbot/1.0" <share-address> | grep -o 'name="twitter:card"' | wc -l` must print `1`.

## Before and after: plain HTML

Before, a page with a share image and nothing more:

```html
<meta property="og:title" content="Price a job">
<meta property="og:image" content="https://example.com/og/estimator.png">
<meta name="twitter:card" content="summary_large_image">
```

After, on the route that runs in the post:

```html
<meta property="og:title" content="Price a job">
<meta property="og:image" content="https://example.com/og/in-post.png">
<meta name="twitter:card" content="player">
<meta name="twitter:site" content="@youraccount">
<meta name="twitter:title" content="Price a job in three questions">
<meta name="twitter:description" content="Answer three questions and see the price, right in the post.">
<meta name="twitter:image" content="https://example.com/og/in-post.png">
<meta name="twitter:image:alt" content="The estimator's first question and its three answers.">
<meta name="twitter:player" content="https://example.com/in-post">
<meta name="twitter:player:width" content="640">
<meta name="twitter:player:height" content="480">
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="https://example.com/estimator">
```

The `summary_large_image` line is gone, not kept beside the new one.

## Before and after: Next.js App Router

Next.js has a `twitter.players` field, but its source writes `twitter:player:stream` for every player listed, and its type makes `streamUrl` required. A page is not a stream. Set the card with an empty `players` list and write the three player tags through `other`, which Next.js prints as `<meta name="..." content="...">`:

```tsx
// app/in-post/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Price a job in three questions',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://example.com/estimator' },
  twitter: {
    card: 'player',
    site: '@youraccount',
    title: 'Price a job in three questions',
    description: 'Answer three questions and see the price, right in the post.',
    images: [{ url: 'https://example.com/og/in-post.png', alt: "The estimator's first question." }],
    players: [], // a listed player would add twitter:player:stream
  },
  other: {
    'twitter:player': 'https://example.com/in-post',
    'twitter:player:width': '640',
    'twitter:player:height': '480',
  },
}
```

Setting `twitter` on the page replaces the layout's `twitter` (Next.js merges metadata one level deep), so the layout's `summary_large_image` does not also print. Then fetch the page as Twitterbot and count the cards.

Next.js may stream metadata into the end of `<body>` for most visitors. Its list of HTML-limited bots, which get the tags in `<head>`, includes Twitterbot. A plain `curl` with no user agent can show the tags in the body: that is not what X sees, which is one more reason to fetch as Twitterbot.

## Other stacks

Write the tags in the route's own `<head>` with whatever the stack uses for per-page meta (a layout slot, a head component, a template block), and remove any site-wide `twitter:card` from that route. Then read the rendered HTML as Twitterbot. Whatever the stack, the rendered tags are what count.

## Verify

```bash
curl -s -A "Twitterbot/1.0" https://example.com/in-post | grep -o '<meta[^>]*twitter:[^>]*>'
```

Pass: one `twitter:card` of `player`, a `twitter:site`, a `twitter:title`, an `https` `twitter:player` with whole-number width and height, an `https` `twitter:image`, and no `twitter:player:stream`. Then `mttr_x_card({ url })`, or `https://mttr.si/twitter-card-validator?url=<share-address>` with no key, checks the same tags, the picture's real size and the player route's framing headers.

## Sources

- [Cards markup](https://web.archive.org/web/20260201012312/https://developer.x.com/en/docs/x-for-websites/cards/overview/markup): every card tag, the title, description and alt lengths, the image formats and size, and the Open Graph fallback for each tag.
- [Player Card](https://web.archive.org/web/20260201012312/https://developer.x.com/en/docs/x-for-websites/cards/overview/player-card): the tags a player card requires, the 68,600 pixel floor, the picture the size of the frame, and the scaling to the client's width.
- [Troubleshooting Cards](https://web.archive.org/web/20260201012312/https://developer.x.com/en/docs/x-for-websites/cards/guides/troubleshooting-cards): the 144 by 144 floor and images cached by their address.
- [next.js/packages/next/src/lib/metadata/metadata-elements.tsx](https://github.com/vercel/next.js/blob/canary/packages/next/src/lib/metadata/metadata-elements.tsx): Next.js writes `twitter:player:stream` for each listed player.
- [next.js/packages/next/src/lib/metadata/metadata-resolution-primitives.ts](https://github.com/vercel/next.js/blob/canary/packages/next/src/lib/metadata/metadata-resolution-primitives.ts): Next.js fills the X tags from Open Graph when the page sets none.
- [next.js/packages/next/src/shared/lib/router/utils/html-bots.ts](https://github.com/vercel/next.js/blob/canary/packages/next/src/shared/lib/router/utils/html-bots.ts): the bots, Twitterbot among them, that get metadata in the head rather than streamed.

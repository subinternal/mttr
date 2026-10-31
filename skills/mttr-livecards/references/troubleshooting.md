# When the card is wrong

Start from what the post shows, find the cause with one command, and fix it at the layer that causes it. Facts about X's crawler and cache are from X's archived troubleshooting guide; X may have changed them since.

## What X's crawler is, and how to serve it

- X fetches a posted link as `Twitterbot`, with a version, such as `Twitterbot/1.0`.
- Its requests come from `199.16.156.0/22`, `199.59.148.0/22` and `192.133.76.0/22`, X's network AS13414. A request with that user agent from anywhere else is someone posing as it. To confirm one address, look it up both ways: the reverse name ends in `twitter.com` or `twttr.com`, and that name looks up to the same address.
- It needs TLS 1.1 or later, reads at most 2 MB of HTML and about 5 MB of image, and gives up on a server that answers slowly.
- It reads `robots.txt` as Google's specification says: it follows the one group that names it most specifically and ignores the rest. A `User-agent: Twitterbot` group replaces the `*` group for it entirely.

Bot protection that challenges unknown crawlers must let these ranges through to the share address and its image. Allow by address range or by AS, not by user agent alone, which anyone can send.

## Find the cause

Run these against the live addresses, every time with the user agent:

```bash
# 1. What the share address answers, and where it redirects
curl -s -o /dev/null -D - -A "Twitterbot/1.0" https://example.com/in-post | head -20
# 2. The card tags it is served
curl -s -A "Twitterbot/1.0" https://example.com/in-post | grep -o '<meta[^>]*twitter:[^>]*>'
# 3. The picture: status, type and size
curl -s -o /dev/null -D - -A "Twitterbot/1.0" https://example.com/og/in-post.png | grep -i '^http\|^content-type\|^content-length'
# 4. Whether robots.txt keeps Twitterbot out
curl -s https://example.com/robots.txt
```

`mttr_x_card({ url })` runs the same checks in one call, as mttr rather than as Twitterbot, and gives these curl lines back so the two answers can be set side by side.

## Symptoms

| What the post shows | Likely cause | How to tell | Fix |
|---|---|---|---|
| No card, a bare link | The crawler was refused or timed out | Command 1 gives a 403, 429, 503, a challenge page, or hangs | Let X's ranges through the bot protection and the firewall; serve the route fast |
| No card, a bare link | `robots.txt` keeps Twitterbot out | Command 4 has a `Disallow` that covers the route in the group Twitterbot follows | Add a `User-agent: Twitterbot` group with an empty `Disallow:`, or allow the route in the group it follows |
| A summary card, or another page's card | The edge or a prerender serves social crawlers from another path | Command 2 shows another page's tags, or `summary_large_image` | Let the route pass through to the real page for crawlers |
| A summary card | Two `twitter:card` tags, or none | Command 2 shows two cards, or none | Keep one, `player` ([card-tags.md](card-tags.md)) |
| The picture, never a frame | The client does not frame cards (X's apps, mobile web) | It is a frame on x.com in a desktop browser | Nothing to fix: the picture is the card there |
| The picture, never a frame, on x.com too | A required player tag is missing, the player address is not `https`, or the picture is under 68,600 pixels | Command 2 and command 3 | Add the tag, use `https`, make the picture the frame's size |
| No picture | The image is not public, too large, an SVG, or under 144 by 144 | Command 3 gives an error status, a large length or `image/svg+xml` | Serve a public JPG, PNG or WEBP under 5 MB, the frame's size |
| A blank or gray frame | The browser refused to frame the route | The browser console on x.com names `frame-ancestors` or `X-Frame-Options` | Fix the headers ([framing-headers.md](framing-headers.md)) |
| A blank frame, no console error about framing | The page fails in a frame: a script error, a sign-in redirect, or a blocked request | Open the test frame (step 7) and read its console | Fix the error; never redirect to sign-in on this route |
| A frame showing part of the whole site | The player address is a full page, not a page made for the frame | It looks the same as the site's normal page | Make a route of its own with the embed mode |
| A frame that will not scroll | The document is meant to scroll, and the frame does not let it | The test frame does not scroll either | Fit the content, or lock the document and scroll `main` ([embed-mode.md](embed-mode.md)) |
| Links open inside the frame | No listener, or a framework's router runs first | Click a link in the test frame | Add the capture listener |
| An old card after a fix | X's card cache | Command 2 shows the fix, the post does not | See below |

## The card cache

X keeps the card it built for an address. Its archived guide says the crawler reads an address's tags again roughly every seven days, and that pictures are cached by their own address.

- To see a fix sooner, post a new address. X's own workaround was a new address for the same page: a query such as `?v=2` on the share address makes one. Moving the route to a new path does the same.
- To replace a picture, change its address, not only its bytes.
- The page inside the frame is not cached as part of the card: a fix to the page shows the next time the frame loads.

## The card validator

X's archived docs point to a card validator at `cards-dev.twitter.com/validator`. Today that address asks for an X sign-in, and X's own player card page said it shows only a still picture, never a working player. Do not count on it. The checks that count are the curl lines above and a real post from a spare account, opened on x.com and in X's apps.

## Sources

- [Troubleshooting Cards](https://web.archive.org/web/20260201012312/https://developer.x.com/en/docs/x-for-websites/cards/guides/troubleshooting-cards): Twitterbot's user agent, its address ranges and AS, the two-way lookup, TLS, the size limits, `robots.txt`, a player address that must be a simple page, and the cache.
- [Player Card](https://web.archive.org/web/20260201012312/https://developer.x.com/en/docs/x-for-websites/cards/overview/player-card): the 68,600 pixel floor, how each client shows the card, and the validator's still picture.
- [How Google interprets the robots.txt specification](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt): one group followed, the most specific that matches, which Twitterbot follows too.

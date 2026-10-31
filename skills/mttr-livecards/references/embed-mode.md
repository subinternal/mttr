# The embed mode, in depth

A page in a post runs in places its normal layout was never built for. This file covers where it runs, how to switch the mode on, and each of the four changes in step 5, with what to check.

## Where the page really runs

X's archived player card docs describe three cases. X may have changed them since, so test each one (step 7):

| Client | What the person sees | Is the page framed? |
|---|---|---|
| x.com in a desktop browser | The page in a frame, once the post is expanded, or at once on the post's own page | Yes |
| X's iPhone and Android apps | The picture with a play icon, in the post's own view; a tap opens the player address in a browser inside the app | No: it is the top page |
| Other clients, and mobile web | The picture, linking to the address in the post | No: it is the share address, opened normally |

So the mode cannot hang on framing alone. Switch the embed mode on by the route, on the server, and add the framed-only changes when the page finds itself in a frame.

## Switching it on

On the server, render the route's root as `<html class="embed">`. Then, in a small script in `<head>` that runs before the page paints:

```js
if (window.self !== window.top) document.documentElement.classList.add('framed')
```

- `embed` hides overlays, opens links out and keeps the page light, whether framed or not.
- `framed` adds the scroll lock below, which only makes sense inside a frame.
- If the site's CSP forbids inline script, load this line as its own file, without `defer` or `async`, so it runs before the body.

## Scrolling

In a frame inside a post the document may not scroll at all. Two ways through:

1. Fit: the content fits the frame's real height at its real width. Best for one screen of a tool or a game.
2. Inner scroll: lock the document and scroll one element, which still takes the wheel and touch.

```css
html.framed, html.framed body { height: 100%; margin: 0; overflow: hidden; }
html.framed main { height: 100dvh; overflow-y: auto; overscroll-behavior: contain; }
```

- Inside a frame, `100dvh` is the frame's own height.
- `overscroll-behavior: contain` stops a scroll that reaches the end from being handed on.
- Code that reads `window.scrollY` or listens for `scroll` on `window` sees nothing in this mode. Move those listeners to `main`.
- A sticky header inside `main` stays put; one fixed to the viewport sits over the content and takes room the frame does not have.

Check: in the test frame (step 7), scroll with a wheel, a trackpad and a touch screen, and reach the last element.

## Links

Every link opens in a new tab. A link that navigates the frame leaves the person with the rest of the site squeezed into a box in a post.

```js
document.addEventListener('click', (event) => {
  if (!document.documentElement.classList.contains('embed')) return;
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest?.('a[href]');
  if (!link || link.getAttribute('href').startsWith('#')) return;
  event.preventDefault();
  window.open(link.href, '_blank', 'noopener');
}, true);
```

- The capture phase runs before a framework's own router, so client-side links open out too.
- It prevents the default and does not stop the event, so click tracking still runs.
- Forms that leave the page need `target="_blank"` as well. In-page forms that only change what the page shows can stay.

## Sign-in, cookies and state

X's player card policy says not to require people to sign in. It would not work well anyway:

- A cookie the route sets inside a frame on x.com is a third-party cookie there. Firefox and Safari keep such cookies apart per site or restrict them by default; Chrome does not block them by default. A session cookie from the main site will often not reach the frame.
- Sign-in providers usually refuse to be framed themselves.

Keep any state the page needs in the page: in memory, or in the address. Where the person must sign in to go further, the button is a link that opens the site in a new tab.

## Overlays

Hide, under `html.embed`, everything that floats: chat widgets, floating buttons, sign-up prompts, install banners, a sticky header taller than a line.

A cookie consent banner is a different case. If the route sets no cookies and loads no tracking, there is nothing to ask. If it does, do not hide a banner the site needs by law: ask the person how consent should work in the frame, or have the route set nothing that needs it.

## Video and audio on the page

The policy's rules for media apply to anything on the route that plays:

- Anything that plays by itself starts with the sound off.
- Anything longer than 10 seconds does not play by itself.
- Every player has play, pause and stop controls.

## Every address https

X's policy refuses a card whose page raises a mixed content warning at any point. Every script, style, image, font, frame and request on the route is `https`. Check: open the route in a browser with its console open, and look for mixed content warnings while you use it.

## Weight

The frame loads when someone opens the post, and the page is all they wait for. X's crawler also stops reading a page over 2 MB.

- Ship only what the route uses: no site-wide bundles, analytics beyond one, or fonts the frame does not show.
- `https://mttr.si/website-speed-test?url=<player-address>` gives the route's time and weight.

## A whole route, as an example

```html
<!doctype html>
<html lang="en" class="embed">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Price a job in three questions</title>
  <!-- the card tags from card-tags.md go here -->
  <script src="/in-post/framed.js"></script>
  <link rel="stylesheet" href="/in-post/in-post.css">
</head>
<body>
  <main>
    <h1>Price a job in three questions</h1>
    <!-- the one tool -->
    <p><a href="https://example.com/estimator">Open the full estimator</a></p>
  </main>
  <script src="/in-post/links-out.js" defer></script>
</body>
</html>
```

`framed.js` holds the framing line, `links-out.js` the link listener, and `in-post.css` the scroll lock and the rules that hide overlays.

## Sources

- [Player Card](https://web.archive.org/web/20260201012312/https://developer.x.com/en/docs/x-for-websites/cards/overview/player-card): how each client shows the card, and the policy: no sign-in, media rules, https for every asset, a page that fills the width it is given.
- [Troubleshooting Cards](https://web.archive.org/web/20260201012312/https://developer.x.com/en/docs/x-for-websites/cards/guides/troubleshooting-cards): the 2 MB limit on a page X's crawler reads, and a player address that must be a simple page, not a whole site.
- [Third-party cookies](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Third-party_cookies): what makes a cookie third-party, and how Firefox, Safari and Chrome treat them by default.

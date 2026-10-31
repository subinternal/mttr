# Framing headers, for X on one route

The player route must let X frame it, and every other route must not let anyone. This file says why the rule reads as it does, what breaks it, and how to set it on each stack. Whatever the stack, the response is the only proof: read the headers on the live answer.

## The rule, part by part

```
Content-Security-Policy: frame-ancestors 'self' https://x.com https://*.x.com https://twitter.com https://*.twitter.com
```

- `frame-ancestors` names who may put this page in a frame. It is not `frame-src`, which names what this page may frame.
- `https://*.x.com` matches every subdomain of `x.com` and not `x.com` itself, so the bare host is listed as well. The same goes for `twitter.com`.
- `'self'` lets the site's own test page frame the route (step 7).
- A browser checks every ancestor, not only the parent. If the frame is nested inside another frame on a host not listed, the load is refused.
- `frame-ancestors` does not fall back to `default-src`. A policy of `default-src 'none'` with no `frame-ancestors` lets anyone frame the page.

## What breaks it

| Cause | What happens | What to do |
|---|---|---|
| The rule is in a `<meta http-equiv>` tag | Ignored: `frame-ancestors` works only as a header | Send it as a response header |
| A site-wide policy also sends `frame-ancestors 'self'` | Two policies, each enforced; the frame must pass both, so X is refused | Make the route's response carry one `frame-ancestors`, the one above |
| The site-wide CSP and the route's CSP are joined into one header with a comma | Still two policies, as above | Remove the site-wide header on the route, then set the route's own |
| The route replaces the whole site-wide CSP | Its other directives (`script-src` and the rest) are gone on that route | Copy them into the route's header, changing only `frame-ancestors` |
| `X-Frame-Options: DENY` or `SAMEORIGIN` is still sent | In a browser that follows CSP Level 3, an enforced `frame-ancestors` overrides it; a client that reads only `X-Frame-Options` refuses | Send no `X-Frame-Options` on the route |
| `X-Frame-Options: ALLOW-FROM https://x.com` | Obsolete; modern browsers ignore the whole header | Remove it; `frame-ancestors` does this job |
| The rule is sent as `Content-Security-Policy-Report-Only` | Reports and refuses nothing, and does not override `X-Frame-Options` either, since CSP Level 3 counts only an enforced `frame-ancestors` | Send it as `Content-Security-Policy` |
| `X-Frame-Options` in a `<meta>` tag | No effect at all | Nothing to fix on the route, but do not rely on it elsewhere |

## Per stack

The rule for each stack is the same: the player route gets the rule above and no `X-Frame-Options`; nothing else changes. Find every layer that sets headers first (framework config, middleware, a security package, the web server, the CDN): a header set by a later layer wins or is added, and only the live response shows which.

### Next.js

`headers()` in `next.config.js`. When two entries match a path and set the same key, the last one wins, so put the route after the catch-all:

```js
// next.config.js
const site = "frame-ancestors 'self'"
const inPost = "frame-ancestors 'self' https://x.com https://*.x.com https://twitter.com https://*.twitter.com"

module.exports = {
  async headers() {
    return [
      { source: '/:path*', headers: [{ key: 'Content-Security-Policy', value: site }] },
      { source: '/in-post', headers: [{ key: 'Content-Security-Policy', value: inPost }] },
    ]
  },
}
```

- Keep `X-Frame-Options` out of the catch-all. Next.js's own docs say it is superseded by `frame-ancestors`, and a later entry can only replace a key, not remove it. If the site's catch-all sets it today, take it out: the catch-all's `frame-ancestors 'self'` does the same job.
- A site with a full CSP in the catch-all repeats every directive in the route's value.
- Middleware (named `proxy` in newer Next.js) can set headers too, and a CSP with a nonce is usually set there. Look for `Content-Security-Policy` and `X-Frame-Options` in it and give the route the same treatment.

### Express, with or without Helmet

Helmet sends `X-Frame-Options: SAMEORIGIN` and a CSP with `frame-ancestors 'self'` by default. Leave it on for the site and change both on the one route, after Helmet has run:

```js
app.use(helmet())

app.get('/in-post', (req, res, next) => {
  res.set('Content-Security-Policy', "frame-ancestors 'self' https://x.com https://*.x.com https://twitter.com https://*.twitter.com")
  res.removeHeader('X-Frame-Options')
  next()
})
```

`res.set` replaces a header already set, so Helmet's whole CSP is replaced on this route. If the site relies on Helmet's other directives, pass the same directives with `frameAncestors` changed instead (Helmet takes camel case keys inside `contentSecurityPolicy.directives`). `res.removeHeader` is Node's own method on the response.

### Nginx

```nginx
location = /in-post {
    proxy_hide_header X-Frame-Options;
    proxy_hide_header Content-Security-Policy;
    add_header Content-Security-Policy "frame-ancestors 'self' https://x.com https://*.x.com https://twitter.com https://*.twitter.com" always;
    proxy_pass http://app;
}
```

- `add_header` directives are inherited from the level above only when the current level has none. The moment this location has one, it loses every `add_header` from the `server` block, including `Strict-Transport-Security` and any other security header. Repeat those here, or, from Nginx 1.29.3, use `add_header_inherit merge;`.
- With `add_header_inherit merge`, a server-level `X-Frame-Options` comes back. Then do not merge, or keep that header out of the server block.
- `always` adds the header on every status, not only 200 and redirects.
- `proxy_hide_header` drops a header the app behind Nginx sends, so the app's own `X-Frame-Options` does not get through. Hiding the app's CSP drops all of its directives on this route: copy the ones the page needs into the `add_header` line.

### Cloudflare Pages

A `_headers` file in the output directory. A request inherits the headers of every rule it matches, and a header set twice is joined with a comma, which makes two policies. Detach the site-wide ones on the route with `!`, then set the route's own:

```
/*
  Content-Security-Policy: frame-ancestors 'self'
  X-Frame-Options: DENY

/in-post
  ! Content-Security-Policy
  ! X-Frame-Options
  Content-Security-Policy: frame-ancestors 'self' https://x.com https://*.x.com https://twitter.com https://*.twitter.com
```

- `_headers` is not applied to responses from Pages Functions, an SSR framework's server output, or `_worker.js`. Set the headers in that code instead.
- If the live response shows the route with no CSP at all, the detach also took the route's own line: move `frame-ancestors 'self'` out of `/*` into the paths that need it, and drop the `!` lines.
- A Worker in front of any origin sets or deletes headers on the response it returns; the same two changes apply there.

### Vercel

`vercel.json` takes the same `source` and `headers` shape as Next.js:

```json
{
  "headers": [
    { "source": "/in-post", "headers": [{ "key": "Content-Security-Policy", "value": "frame-ancestors 'self' https://x.com https://*.x.com https://twitter.com https://*.twitter.com" }] }
  ]
}
```

Vercel's docs do not say which entry wins when a catch-all also sets the key. Keep `X-Frame-Options` and `frame-ancestors` out of any catch-all that matches the route, and read the live headers. A Next.js app on Vercel can keep its headers in `next.config.js` instead.

### Netlify

`_headers` in the publish directory, or `[[headers]]` in `netlify.toml`:

```toml
[[headers]]
  for = "/in-post"
  [headers.values]
    Content-Security-Policy = "frame-ancestors 'self' https://x.com https://*.x.com https://twitter.com https://*.twitter.com"
```

- Netlify applies these only to files it serves itself. A route answered by a Function, an Edge Function, an SSR page or a proxy must send its headers from that code.
- Netlify's docs do not say how two matching rules combine. Keep `X-Frame-Options` and `frame-ancestors` out of a `/*` rule and set them per path, then read the live headers.

## Verify

```bash
curl -s -o /dev/null -D - -A "Twitterbot/1.0" https://example.com/in-post | grep -i '^content-security-policy\|^x-frame-options'
curl -s -o /dev/null -D - https://example.com/ | grep -i '^content-security-policy\|^x-frame-options'
```

Pass: the route prints one `content-security-policy` line whose `frame-ancestors` lists X's four hosts, and no `x-frame-options`. The home page still prints `frame-ancestors 'self'` or `'none'`, or `X-Frame-Options`. A fail is two `content-security-policy` lines on the route, a comma inside one with two `frame-ancestors`, or any `x-frame-options` on the route. `mttr_x_card` reads the route's headers too, and says for each of X's hosts whether it may frame the page.

## Sources

- [Static Configuration with vercel.json](https://vercel.com/docs/project-configuration/vercel-json): the `headers` property, its `source` and its key and value pairs.
- [Custom headers](https://docs.netlify.com/manage/routing/headers/): `_headers` and `netlify.toml`, and that they skip Functions, Edge Functions and proxied responses.
- [Headers](https://developers.cloudflare.com/pages/configuration/headers/): Cloudflare Pages `_headers`, rules that combine, the comma join, detaching with `!`, and Pages Functions left out.
- [headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers): `headers()` in `next.config.js`, the last match winning, and `X-Frame-Options` superseded by `frame-ancestors`.
- [Response](https://expressjs.com/en/5x/api/response/): `res.set`, which sets a header on the response.
- [Helmet.js](https://helmet.js.org/): Helmet's default `X-Frame-Options: SAMEORIGIN` and `frame-ancestors 'self'`, and how to change a directive.
- [HTTP](https://nodejs.org/api/http.html): `response.removeHeader`, which drops a header before it is sent.
- [Module ngx_http_headers_module](https://nginx.org/en/docs/http/ngx_http_headers_module.html): `add_header`, `always`, and inheritance only when a level sets none.
- [Module ngx_http_proxy_module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html): `proxy_hide_header`, which keeps a proxied header from the client.
- [Content-Security-Policy: frame-ancestors directive](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors): the sources it takes, every ancestor checked, no fallback to `default-src`, and no support in `<meta>`.
- [Content-Security-Policy (CSP) header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy): more than one policy can only restrict further.
- [X-Frame-Options header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options): `DENY`, `SAMEORIGIN`, the obsolete `ALLOW-FROM`, and no effect in `<meta>`.
- [Content Security Policy Level 3](https://www.w3.org/TR/CSP3/): a `*.` host matches subdomains, and an enforced `frame-ancestors` makes a browser ignore `X-Frame-Options`.

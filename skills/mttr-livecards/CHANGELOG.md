# Changelog

Versions follow semantic versioning: a major version changes what the skill asks of the person or the agent, a minor one adds or tightens steps, a patch corrects wording. The version is in `SKILL.md` under `metadata`, as the Agent Skills format keeps anything it does not define.

## 1.2.0 (2026-10-19)

- Named Livecards, after what it makes.
- Leads to the free X card tester to test a livecard's link, and to the livecard builder on mttr for one made with no code.

## 1.1.0 (2026-10-18)

- Four references, linked from the steps: the card tags in depth, framing headers per stack, the embed mode in depth, and troubleshooting.
- The card tags take X's own limits: title, description and alt lengths, the picture at the frame's size, under 5 MB, no SVG, and the 68,600 pixel floor below which a player card does not render. `twitter:image:alt` is added.
- Next.js: its `twitter.players` field always writes `twitter:player:stream`, so the player tags go through `other`, and a page with Open Graph and no card gets a second `twitter:card`.
- Framing: the rule works only as a header, two policies are both enforced, `*.x.com` leaves out `x.com`, and the config for Next.js, Express with Helmet, Nginx, Cloudflare Pages, Vercel and Netlify, with each one's trap.
- The embed mode turns on by the route, since X's apps open the page unframed in their own browser; sign-in, third-party cookies, consent banners, media and mixed content are covered.
- Step 6 checks the route with `mttr_x_card` or the free X card tester, and names X's crawler address ranges for bot protection.
- The card cache: about seven days per address, pictures cached by their own address, and the validator now behind a sign-in. The caveat names X's player card policy, which reserves the card for linear audio and video.

## 1.0.0 (2026-10-17)

- First release: seven steps from picking the route to testing it in a post, so a page of a site runs inside a post on X.
- The card tags, framing headers for X on one route only, a check of what X's crawler is really served, an embed mode for scrolling, links and overlays, and X's card cache.
- Checks the live route with mttr's free share preview and speed test, and a report that says X describes the card for video, audio and media.

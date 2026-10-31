# A worked example

A whole `/llms.txt` for a sample business, and the code that builds one from a site's own data. The business, its facts and its pages are samples; a real file takes every value from the site. Why each part sits where it does is in [format.md](format.md).

## The file

```
# Hollow Creek Drainage

> Hollow Creek Drainage installs french drains, dry wells and sump pumps for homes in St. Louis and St. Charles counties, Missouri. It is a family business with its own crews.

- Phone: (314) 555-0100
- Email: office@example.com
- Based in: St. Louis, Missouri
- Service area: St. Louis County and St. Charles County
- Hours: Monday to Friday, 7 am to 5 pm
- Quotes: free, on site, booked at https://example.com/contact

Notes for assistants:

- Prices are quoted per job after a visit. The guides give typical ranges, not prices.
- "Yard drain" and "french drain" mean the same service here.
- It does not do waterproofing inside basements.

## Services

- [French drain installation](https://example.com/services/french-drains): Trenches with fabric, gravel and pipe that carry water away from a yard or a foundation.
- [Dry wells](https://example.com/services/dry-wells): Underground pits that take water from downspouts and let it soak away.
- [Sump pumps](https://example.com/services/sump-pumps): New pumps and replacements, with battery backups.

## Guides

- [How deep should a french drain be?](https://example.com/guides/french-drain-depth): Depth, width and slope for a yard drain, and when to go deeper.
- [French drain or dry well](https://example.com/guides/french-drain-or-dry-well): Which one fits the water you have, compared.

## Areas served

- [St. Louis County](https://example.com/areas/st-louis-county): Towns served, with the work done in each. Also [Kirkwood](https://example.com/areas/kirkwood) and [Webster Groves](https://example.com/areas/webster-groves).
- [St. Charles County](https://example.com/areas/st-charles-county): Towns served, with the work done in each.

## Company

- [About](https://example.com/about): Who runs the business, its licenses and since when.
- [Contact](https://example.com/contact): Phone, email, hours and the quote form.
```

## Built on each request

The shape of a route that builds the file from the same data as the pages, in TypeScript. Name the parts after the site's own code.

```ts
// GET /llms.txt
export function llmsTxt(site: Site, pages: Page[]): string {
  const facts = site.facts; // the one config the pages read too
  const lines = [`# ${site.name}`, '', `> ${site.summary}`, ''];
  for (const [label, value] of facts) lines.push(`- ${label}: ${value}`);
  // Notes are details, not links, so they sit above the first ## section, as the proposal places them.
  if (site.notes.length) lines.push('', 'Notes for assistants:', '', ...site.notes.map((note) => `- ${note}`));
  for (const group of GROUPS) {
    const listed = pages.filter((page) => page.group === group.id && page.indexable && page.path !== '/');
    if (!listed.length) continue;
    lines.push('', `## ${group.title}`, '');
    for (const page of listed) {
      const link = `- [${titleOf(page, site.name)}](${site.origin}${page.path})`;
      lines.push(page.description ? `${link}: ${page.description}` : link);
    }
  }
  return lines.join('\n') + '\n';
}

// The page's own title, without the site's name on the end. Only the name is cut, so "Drains: a guide" keeps its subtitle.
const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const titleOf = (page: Page, name: string) => page.title.replace(new RegExp(`\\s*[|·:-]\\s*${escaped(name)}\\s*$`, 'i'), '');
```

- Send it with `Content-Type: text/plain; charset=utf-8` and status 200.
- `pages` is the same list the sitemap is made from, so a new page appears in both at once.
- A page with no description of its own gets its link and no note, never one written for this file.
- Every `##` section holds links only. An introduction line under a heading, which earlier versions of this example had, is not part of a file list; say it in the page's description instead.
- More tests, a sitemap index, and the live checks are in [verify.md](verify.md); the same function in Next.js, Astro, WordPress and a build script is in [stacks.md](stacks.md).

## The test that catches a new page

```ts
test('every page in the sitemap is in llms.txt', async () => {
  const sitemap = await get('/sitemap.xml');
  const file = await get('/llms.txt');
  const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  for (const address of listed) if (new URL(address).pathname !== '/') assert.ok(file.includes(`](${address})`), address);
});
```

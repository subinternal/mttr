# Proving it, keeping it true, and fixing it

The tests from step 5 as code, the checks to run on the live file in step 6, how the file stays in sync, and a table of what goes wrong. The tests are in TypeScript with `node:test`; write them in the site's own test framework and language.

## The tests

`get(path)` stands for whatever the suite already uses to fetch a page from the app without a network: a test client, a request to the dev server, or reading the built file from `dist/`. `site` is the site's facts.

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';

// A sitemap may be an index of other sitemaps. Follow it to the pages.
async function sitemapPages(path = '/sitemap.xml'): Promise<string[]> {
  const xml = await get(path);
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((match) => match[1]);
  if (!/<sitemapindex[\s>]/.test(xml)) return locs;
  const nested = await Promise.all(locs.map((loc) => sitemapPages(new URL(loc).pathname)));
  return nested.flat();
}

const linksIn = (file: string) => [...file.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((match) => match[1]);

test('1. the file starts with the name and a summary', async () => {
  const file = await get('/llms.txt');
  assert.match(file, new RegExp(`^# ${site.name}\\n\\n> \\S`));
});

test('2. every page in the sitemap is in llms.txt, and every page in llms.txt is in the sitemap', async () => {
  const file = await get('/llms.txt');
  const listed = (await sitemapPages()).filter((address) => new URL(address).pathname !== '/');
  for (const address of listed) assert.ok(file.includes(`](${address})`), `missing from llms.txt: ${address}`);
  const inSitemap = new Set(listed);
  const own = linksIn(file).filter((address) => new URL(address).hostname === site.host && !address.endsWith('/llms.txt'));
  for (const address of own) assert.ok(inSitemap.has(address), `in llms.txt, not in the sitemap: ${address}`);
});

test('3. plain text, absolute links on the site, and sections that hold only links', async () => {
  const file = await get('/llms.txt');
  assert.doesNotMatch(file, /<[a-z][^>]*>/i, 'no HTML');
  assert.doesNotMatch(file, /[\u2013\u2014]| - /, 'no dashes as punctuation');
  for (const address of linksIn(file)) {
    assert.match(address, /^https:\/\//, address);
    assert.equal(new URL(address).hostname, site.host, address);
    assert.doesNotMatch(address, /[?&]utm_/, address);
  }
  const sections = file.split(/^## /m).slice(1);
  for (const section of sections) {
    const [, ...lines] = section.split('\n');
    for (const line of lines.filter((one) => one.trim())) assert.match(line, /^- \[[^\]]+\]\(https:\/\/[^)]+\)(: .+)?$/, line);
  }
  assert.equal((file.match(/^# /gm) ?? []).length, 1, 'one H1');
});

test('4. the footer links to llms.txt', async () => {
  assert.match(await get('/'), /<footer[\s\S]*href="\/llms\.txt"[\s\S]*<\/footer>/);
});
```

- Test 2 checks the link's whole address, `](https://...)`, not just a substring, so `/services/drains` does not pass for `/services/drains-and-gutters`.
- Test 2 matches addresses as the sitemap writes them. If the sitemap ends paths with `/` and the file does not, or the other way round, make both agree; do not loosen the test.
- On a large site with section files, test 2 reads the root file plus every `.../llms.txt` it links to, and checks the union.
- Test 3's section check allows a line of introduction only if you relax it. This skill keeps sections to links, so it does not.
- Test 5, for a static file, runs the build command's `--check` mode: `node scripts/llms.mjs --check` exits non-zero when `public/llms.txt` differs from a fresh build. Run it as a step of the test script or in continuous integration after the build.
- Test 6, for an unbranded site: `assert.doesNotMatch(file, new RegExp(OPERATOR.name, 'i'))` and the same for the operator's phone, written in each form the site might print it.

## The live checks

Run these after the site ships, against the real domain. Each says what a pass looks like.

```
curl -sI https://example.com/llms.txt
```

Pass: `HTTP/2 200`, `content-type: text/plain; charset=utf-8`, no `location:` header. A `301` or `302` means a redirect (to `/llms.txt/`, to `www`, or to a login); a `content-type: text/html` means the address is answered by a page, not the file.

```
curl -s https://example.com/llms.txt | head -5
```

Pass: the first line is `# ` and the name, then a blank line, then `> ` and the summary. A `<!doctype html>` means a fallback page.

```
curl -s -A "<a crawler's user agent>" -o /dev/null -w "%{http_code} %{content_type}\n" https://example.com/llms.txt
```

Use the user agent string the crawler's operator publishes. Pass: the same `200 text/plain` as without it. A `403`, or a challenge page, means a firewall or bot protection treats crawlers differently; the file is there for people and closed to the readers it is for. This tests only rules keyed on the user agent; protection that checks a crawler's network addresses cannot be tested from your machine, and mttr's read, from outside your network under its own crawler name, is a second check.

```
curl -s https://example.com/llms.txt | grep -o '](https://[^)]*)' | tr -d '()]' | sort -u | while read -r url; do printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' "$url")" "$url"; done | grep -v '^200'
```

Pass: no output. Each line it prints is a link in the file that does not answer 200.

Then the mttr checks from step 6, and the reading test: give a fresh agent only the file and ask what a customer would. The proposal itself suggests this test: ask an agent questions about the content with only the llms.txt to start from.

Lighthouse, in Chrome's DevTools, has an llms.txt audit under agentic browsing. It flags a server error when fetching the file and marks a missing one as not applicable; a pass there says only that the file did not error.

## Keeping it in sync

- Built from data on each request or at each build: nothing to do, as long as the page list is the sitemap's list. The page test proves it.
- Built by a command into a committed file: the command runs in the build, and `--check` runs in the tests, so a page added without rebuilding the file fails before it ships.
- Made by a plugin or platform: the tests in step 5 still run, against the live or staging address, in a scheduled check; a plugin's settings can change under you.
- Facts change in one place. If the phone number in the file and the footer are two values, one will be wrong; make the file read the footer's value.
- After a redesign, a move to a new domain, or a new section of the site, read the file again by eye. Tests prove it is complete, not that its summary still describes the business.
- To have mttr watch it, a rescan after each release finds the `llms-txt` finding again if the file goes missing.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| mttr still reports `llms-txt` after the deploy | The address answers with an HTML page: a single-page app's catch-all route, a CMS's 404 template sent with 200, or a theme page | Serve the file before the catch-all, and check `content-type` with `curl -sI` |
| `curl -I` shows a `301` to `/llms.txt/` | A framework or CMS adds trailing slashes to every address | Exempt the file from the rule; in WordPress, stop the canonical redirect for that query var |
| The live file is older than the repository's | A CDN or page cache kept the old one | Purge `/llms.txt` after each deploy, or give it a short cache life |
| A 404 cached at the edge after the file was added | The CDN cached the miss before the file existed | Purge the address once |
| The file lists drafts, tag pages or `noindex` pages | It reads all content rather than the sitemap's list | Filter by the same rule the sitemap uses, then fix the sitemap if it lists them too |
| A new page is missing | The file is a committed copy and nobody rebuilt it | Run the build command; add `--check` to the tests so it cannot happen twice |
| Titles end in "Hollow Creek Drainage" or show `&amp;` | The site's name was not stripped, or HTML entities were not decoded | Strip the name as step 2 says; decode entities when reading built HTML |
| Two different files appear at different times | A plugin and your route both answer, or a real file hides the route | Keep one source; delete the other |
| Crawlers get `403` while a browser gets the file | Bot protection or a firewall rule on the host | Allow the file's address for known crawlers in that tool's settings, as the person agrees |
| The file is blocked for every crawler | `robots.txt` disallows `/llms.txt`, or a broad `Disallow: /*.txt$` | Remove the rule for this address |
| Another site's name or phone appears | A network's shared default fell through | Give the site its own value, or drop the line; test 6 catches it |
| The file shows in Google results | Google may crawl and index any file | Leave it, or send `X-Robots-Tag: noindex` on the file if the person prefers it out of results |

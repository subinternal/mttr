# Building it in the site's own stack

How to build and serve `/llms.txt` from the data the pages already use, stack by stack. Read the section for the site's stack in step 4 and skip the rest. Each sample names its parts after a typical project; name them after the site's own code.

The rule in every stack is the same: one function turns the site's facts and its list of pages into the file's text, and that list is the one the sitemap is built from. A shape of that function, `llmsTxt(site, pages)`, is in [example.md](example.md). The samples below call it.

## Next.js (App Router)

A route handler in a folder named for the file. The Next.js docs use the same pattern for `app/rss.xml/route.ts`.

```ts
// app/llms.txt/route.ts
import { allPages, site } from '@/lib/site'; // the same list app/sitemap.ts maps over
import { llmsTxt } from '@/lib/llms';

// Built once at each deploy. Drop it, or use `export const revalidate = 3600`, if pages come from a CMS and change between deploys.
export const dynamic = 'force-static';

export async function GET() {
  const pages = await allPages();
  return new Response(llmsTxt(site, pages), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
```

- Route handlers are not cached by default since Next.js 15. Without `force-static` or `revalidate` the file is built on every request, which is correct but costs a call to the data each time.
- If `app/sitemap.ts` builds its list inline, move that list into a function both files import. A sitemap and an llms.txt that each query the CMS their own way drift apart.
- With the Pages Router, the simplest way is a script that writes `public/llms.txt` at build, as under "A static site generator" below.
- The Next.js docs list built-in support for `sitemap.xml` and `robots.txt`, not for llms.txt, so a route handler is the way.

## Astro

A static file endpoint: a file in `src/pages` named with the extension it makes. On a static site Astro calls it at build time and writes the file; with a server adapter it answers each request.

```ts
// src/pages/llms.txt.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../site.config';
import { llmsTxt } from '../lib/llms';

export const GET: APIRoute = async (context) => {
  const services = await getCollection('services', ({ data }) => !data.draft);
  const guides = await getCollection('guides', ({ data }) => !data.draft);
  const pages = [
    ...services.map((entry) => ({ group: 'services', path: `/services/${entry.id}`, title: entry.data.title, description: entry.data.description, indexable: true })),
    ...guides.map((entry) => ({ group: 'guides', path: `/guides/${entry.id}`, title: entry.data.title, description: entry.data.description, indexable: true })),
  ];
  return new Response(llmsTxt({ ...site, origin: String(context.site ?? site.origin).replace(/\/$/, '') }, pages), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
```

- Use the same filter for drafts as the pages and the sitemap do. A draft that reaches the file and not the site is a link to a 404.
- Astro serves an endpoint whose name has an extension only without a trailing slash, whatever `trailingSlash` says, so `/llms.txt` is the only address. Good.
- On a static build the `Content-Type` header in the code is not sent; the host serves the built `llms.txt` by its extension. Check the live header in step 6.
- Pages that are `.astro` files rather than collection entries are not in any collection. List them from one array in the code that both the sitemap and this endpoint read, or fall back to the build command below for them.

## A static site generator, or hand-written pages

When the pages are templates and nothing holds them as data, build the file after the site is built, from the built site itself: the sitemap gives the pages, each built page gives its title and description.

```js
// scripts/llms.mjs: node scripts/llms.mjs [--check]
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { llmsTxt } from './llms-lib.mjs';

const site = JSON.parse(await readFile('site.facts.json', 'utf8')); // the hand-written facts, in one file

const OUT = 'dist'; // the folder the build writes
const sitemap = await readFile(join(OUT, 'sitemap.xml'), 'utf8');
const addresses = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());

const pages = [];
for (const address of addresses) {
  const path = new URL(address).pathname;
  if (path === '/') continue;
  const html = await readFile(join(OUT, path.endsWith('/') ? `${path}index.html` : path), 'utf8').catch(() => readFile(join(OUT, path, 'index.html'), 'utf8'));
  const title = /<title>([^<]*)<\/title>/i.exec(html)?.[1]?.trim() ?? path;
  const description = /<meta\s+name="description"\s+content="([^"]*)"/i.exec(html)?.[1]?.trim() ?? '';
  const indexable = !/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
  pages.push({ path, title, description, indexable, group: site.groups.find((one) => path.startsWith(one.prefix))?.id ?? 'company' });
}

const text = llmsTxt(site, pages);
const target = join(OUT, 'llms.txt');
if (process.argv.includes('--check')) {
  const onDisk = await readFile('public/llms.txt', 'utf8').catch(() => '');
  if (onDisk !== text) {
    console.error('public/llms.txt is out of date: run node scripts/llms.mjs');
    process.exit(1);
  }
} else {
  await writeFile('public/llms.txt', text);
  await writeFile(target, text);
}
```

- The regular expressions read the site's own markup. If its `<meta>` tags put `content` before `name`, or use single quotes, adjust them or parse with the HTML library the project already has. Check by printing the list once and reading it.
- Unescape HTML entities in titles and descriptions (`&amp;` to `&`), or the file shows them raw.
- Run it as the last step of the build (`"build": "astro build && node scripts/llms.mjs"`, or the generator's own command), and `--check` in the test suite, so a template change that forgets the file fails.
- If the sitemap is a sitemap index, follow it first, as [verify.md](verify.md) shows.

## WordPress

First look for a plugin that already makes one: the proposal lists Yoast SEO and AIOSEO among those that generate an llms.txt. If the site uses one of them, turn its llms.txt on, then run the tests in step 5 against its file. Keep it only if it passes them; a generated file that lists tag archives or leaves out the business's facts is fixed by building your own and turning the plugin's off.

To build your own, a small plugin answers the address and builds the file from the same posts and pages WordPress shows:

```php
<?php
/**
 * Plugin Name: Site llms.txt
 * Description: Serves /llms.txt from the site's published pages.
 */

function site_llms_rule() {
	add_rewrite_rule( '^llms\.txt$', 'index.php?site_llms_txt=1', 'top' );
}
add_action( 'init', 'site_llms_rule' );

add_filter( 'query_vars', function ( $vars ) {
	$vars[] = 'site_llms_txt';
	return $vars;
} );

add_action( 'template_redirect', function () {
	if ( ! get_query_var( 'site_llms_txt' ) ) {
		return;
	}
	status_header( 200 );
	header( 'Content-Type: text/plain; charset=utf-8' );
	echo site_llms_text(); // builds the file from get_bloginfo() and get_posts(), as below
	exit;
} );

register_activation_hook( __FILE__, function () {
	site_llms_rule();
	flush_rewrite_rules();
} );
register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
```

- `site_llms_text()` takes the name from `get_bloginfo( 'name' )`, the facts from wherever the theme keeps them (its options, a contact page's fields), and the pages from `get_posts()` with `post_status` set to `publish`, the same post types the sitemap lists. Each page's title is `get_the_title()`; its description is the one the SEO plugin keeps for that page, or the excerpt. Skip any post the SEO plugin marks `noindex`, by reading that plugin's own field.
- Rewrite rules are cached; flush them once, on activation, and never on every request, since flushing is expensive. After installing, or after changing the rule, visit Settings, Permalinks and save once.
- A real file named `llms.txt` in the web root is usually served by the web server before WordPress runs, so it hides the plugin's route. Delete any such file, and check which one answers with `curl` in step 6.
- WordPress's own sitemap, since 5.5, is an index at `/wp-sitemap.xml`; an SEO plugin may replace it with its own. The page test must follow whichever the site serves.
- Page caches and CDNs in front of WordPress keep the file like any page. Purge `/llms.txt` after a change, or exclude it.

## A plain server, a CDN, or a hosted builder

- A site served as plain files: put the built `llms.txt` at the root. Check the header the server sends for it; set `text/plain; charset=utf-8` in the server's own config if it sends anything else or leaves out the charset and the file has any character outside plain ASCII.
- A hosted site builder with no way to add a file at the root cannot serve one. Say so to the person rather than putting the outline on a page called `/llms-txt`, which nothing looks for.
- A CDN or an edge function can serve it too, but it is then one more place the file is built. Build it in the app and let the edge cache it.

## A network of sites from one app

One route, one function, and the domain chooses the site.

```ts
// GET /llms.txt
export function handleLlms(request: Request): Response {
  const host = new URL(request.url).hostname.replace(/^www\./, '');
  const site = SITES.get(host); // the same table the pages use to choose a site
  if (!site) return new Response('Not found\n', { status: 404 });
  return new Response(llmsTxt(site, pagesOf(site)), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
```

- Every fact comes from that site's own record. A shared default (the operator's phone, a parent brand's email) leaks into every site that does not set its own; give each site its own value or leave the line out.
- An unknown host answers 404, never another site's file.
- Reading the host makes the route dynamic in a framework that would otherwise build it once (Next.js treats a request's headers as request-time data). That is right here; cache per host if the cost matters.
- Test each host: the page test from step 5 runs once per site, against that site's sitemap, and test 6 checks that no site's file names the operator or another site.

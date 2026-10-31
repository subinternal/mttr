# Changelog

Versions follow semantic versioning: a major version changes what the skill asks of the person or the agent, a minor one adds or tightens steps, a patch corrects wording. The version is in `SKILL.md` under `metadata`, as the Agent Skills format keeps anything it does not define.

## 1.1.2 (2026-10-23)

- The worked route writes "Notes for assistants" only when the site has notes, so a file is never left with an empty heading.

## 1.1.1 (2026-10-19)

- The description no longer has a colon mid-sentence, which YAML read as a new key, so installers that parse the frontmatter skipped the skill.

## 1.1.0 (2026-10-18)

- The file's shape follows v2 of the proposal: facts and notes for assistants sit above the first `##` section, every `##` section holds only links, an `## Optional` section may come last, and a page with no description gets its link and no note.
- Before you start checks for an existing file and what makes it, so a plugin and a new route never both answer.
- Step 2 says what to leave out, follows a sitemap index, and splits a large site into one file per section.
- Step 4 adds keeping or replacing a plugin's file; step 5's tests also catch a retired page, links that are not absolute `https` on the site, and sections that hold anything but links.
- Step 6 adds the `curl` check, and reading the file with a fresh agent as the proposal suggests.
- New references: `format.md` (the proposal's exact parts, mistakes that break them, a broken file and its fix, what to leave out, large sites, Markdown twins, llms-full.txt), `stacks.md` (Next.js, Astro, a static site generator, WordPress, a plain server, a network of sites) and `verify.md` (the tests as code, live checks with what a pass looks like, keeping it in sync, troubleshooting).
- The worked example uses the new shape, cuts only the site's name from a title, and its page test matches whole links.
- Sources add the proposal's v2 details, Google on sitemap indexes, `X-Robots-Tag` and canonical headers, the Next.js, Astro and WordPress docs used, one platform's llms-full.txt, Lighthouse's audit and MDN on the `Link` header.

## 1.0.1 (2026-10-16)

- Says that Google Search does not need the file and that it neither helps nor hurts a site there, as Google wrote in June 2026.
- A Sources list ends the file, each by its page's own title, with what the skill takes from it.

## 1.0.0 (2026-10-16)

- First release: six steps from gathering the site's facts to checking the live file with mttr.
- The file's shape, its rules for content, two ways to serve it, six tests to add, and a report template that says its effect is unproven.
- A worked example: a whole file for a sample business, a route that builds it from the site's data, and the test that catches a new page.

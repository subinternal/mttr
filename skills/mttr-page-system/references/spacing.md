# Spacing and rhythm

Step 7 in depth: find the scale a site already uses, write it down as tokens, move every value onto it a component at a time, and measure the page before and after. The rules themselves are in [spacing-traits.md](spacing-traits.md), one to a section.

Spacing is the one part of a page's look this skill changes, because it is structure a reader feels: what belongs together, where a section ends, where to look next. Color, type faces and the brand stay as they are.

## Find the site's own scale

A site almost always has a scale already, written down or not. Fix the site to its own rhythm; bring in a new one only when there is none.

1. Look for one written down: CSS custom properties such as `--space-*` or `--s-*`, Tailwind's `theme.spacing` or `theme.extend.spacing`, a design tokens file, or a theme's settings. Say what you found.
2. Count what the stylesheets actually use. Every padding, margin, gap, `inset` and `row-gap` value, in pixels, with how often:

```bash
grep -rhoE '(padding|margin|gap|row-gap|column-gap|inset)[a-z-]*:\s*[^;]+' --include='*.css' --include='*.scss' src styles 2>/dev/null \
  | grep -oE '[0-9.]+(px|rem)' | sort | uniq -c | sort -rn | head -30
```

Read a rem as 16px unless the root font size is set otherwise.
3. The scale is the values used most, once two that are too close to tell apart are folded into the one used more (trait `steps-you-can-see`). Six to ten values is usual. A value used once or twice is a mistake to move, not a step to keep.
4. When nothing is written down and no clear set of values leads, take 4, 8, 12, 16, 24, 32, 48, 64 and 96 pixels.
5. Name the roles as well as the steps: the gap between sections, a card's padding, the gap under a heading, and the gaps a list may use. A role is one value, with one smaller value for phones.

Show the person the scale and the roles before changing anything. They may know why a value is the way it is.

## Write it down as tokens

Put the scale in one place, in the site's own way:

```css
:root {
  --s-4: 4px; --s-8: 8px; --s-12: 12px; --s-16: 16px; --s-24: 24px;
  --s-32: 32px; --s-48: 48px; --s-64: 64px; --s-96: 96px;
  --section: 72px;   /* between sections */
  --card-pad: 24px;  /* inside every card */
  --head-gap: 16px;  /* under a heading */
}
@media (max-width: 640px) {
  :root { --section: 48px; --card-pad: 16px; }
}
```

On Tailwind, replace `theme.spacing` with the scale rather than extending it, so a value off it cannot be written. On a theme with settings, put the roles in the settings and read them in the CSS.

## Move the values onto it

- Work a shared component at a time, the frame first, so one change fixes every page that uses it.
- Move each value to the nearest step. Where two steps are equally near, take the smaller inside a group and the larger between groups.
- Space between siblings goes on the parent as `gap`, never as a margin on each child. A child's own margin is how one item ends up out of step with its list.
- Space between sections is set once, on the container that holds them, never as each section's own top and bottom margin.
- Never change what a component shows to make it fit: only the space around and inside it.

## Measure the page

`scripts/measure.mjs` in this skill measures a page against the twelve measured traits, at 1440 and 375 wide, in the Chrome already on the machine. It needs Node 22 or later and nothing installed. The paths below are where Claude Code keeps the skill; use the folder your client keeps it in:

```bash
node .claude/skills/mttr-page-system/scripts/measure.mjs https://example.com/
node .claude/skills/mttr-page-system/scripts/measure.mjs https://example.com/ --scale 4,8,12,16,24,32,48,64,96 --json
```

Without `--scale` it works out the page's own scale from the values it uses most, which is the scale to keep. It prints each trait as pass or fail with up to eight places it failed, and exits 1 when one fails, so it can run before a change is merged. Set `CHROME` to the browser's path if it is somewhere unusual. It reads what is inside `main`, and says so when a page has none.

Where Node or Chrome cannot run, paste this in the browser's console on the page, at 1440 wide and again at 375. It counts every spacing value the page computes inside `main`, and lists the space between each pair of sections, counting the padding each keeps as well as the gap between them, since many sites space sections with padding:

```js
(() => {
  const props = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginBottom', 'rowGap', 'columnGap'];
  const used = {};
  for (const el of document.querySelectorAll('main *')) {
    const style = getComputedStyle(el);
    for (const prop of props) {
      const px = parseFloat(style[prop]);
      if (px > 2) used[Math.round(px)] = (used[Math.round(px)] || 0) + 1;
    }
  }
  const sections = [...document.querySelectorAll('main > *')];
  // The space between two sections is the gap between them and the padding each keeps on that side.
  const pad = (el, side) => parseFloat(getComputedStyle(el)[side]);
  const gaps = sections.slice(1).map((el, i) => Math.round(el.getBoundingClientRect().top - sections[i].getBoundingClientRect().bottom + pad(sections[i], 'paddingBottom') + pad(el, 'paddingTop')));
  console.table(Object.entries(used).sort((a, b) => a[0] - b[0]));
  console.log('gaps between sections', gaps, 'scroll width', document.documentElement.scrollWidth, 'of', innerWidth);
})();
```

Either way, keep the numbers from before the change: the report sets them against the numbers after. A value in the table that is not on the scale fails `one-scale`; more than one value in the section gaps fails `section-rhythm`; a scroll width over the window's fails `phone-gutter`.

## Read the judged traits

Take a full page screenshot at 1440 and at 375 of a page of each template. For each judged trait, say pass, fail or unsure, and where on the page. A model's or a reader's opinion is an opinion: unsure goes to the person with the screenshot, and is never counted as a pass.

## Report back

```
Scale: <values>, found in <where> | taken as the default, because <why>.
Roles: section <n> (<n> on phones), card <n> (<n>), heading gap <n>, list gaps <values>.

| Trait | Before | After |
|---|---|---|
| one-scale | <n> values off the scale | <n> |
| section-rhythm | gaps <values> | <value> |
| <judged trait> | fail: <where> | pass |

Left as it was, and why: <trait: reason>.
```

#!/usr/bin/env node
// Measures a page against the spacing traits in references/spacing-traits.md, at 1440 and 375 wide, in the Chrome
// already on the machine. Nothing to install: Node 22 or later and Chrome or Chromium.
//
//   node measure.mjs <url> [--scale 4,8,12,16,24,32,48,64,96] [--json]
//
// Without --scale it works out the page's own scale from the values it uses most. It exits 1 when a measured trait
// fails, so it can run before a change is merged. The four judged traits are left to a reader with the screenshots.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Runs inside the page: the facts each measured trait is judged on. Nothing in it reaches outside the page. */
export function collect() {
  const root = document.querySelector('main') || document.body;
  // Shown, and inside the window across: a drawer parked off to the side, or a control drawn a pixel wide for screen
  // readers, is not on the page a reader sees.
  const shown = (el) => {
    const box = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return box.width > 2 && box.height > 2 && box.right > 0 && box.left < innerWidth && style.visibility !== 'hidden' && style.display !== 'none';
  };
  const px = (value) => parseFloat(value) || 0;
  const where = (el) => {
    const name = el.tagName.toLowerCase() + (el.classList[0] ? `.${el.classList[0]}` : '');
    const words = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    return words ? `${name} "${words}"` : name;
  };
  const all = [...root.querySelectorAll('*')].filter(shown);

  const values = {};
  for (const el of all) {
    const style = getComputedStyle(el);
    for (const prop of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginBottom', 'rowGap', 'columnGap']) {
      const value = Math.round(px(style[prop]));
      if (value > 2) (values[value] ||= []).push(where(el));
    }
  }

  // The sections are the blocks the page is stacked from: past any wrapper that holds them all.
  let stack = root;
  for (;;) {
    const tall = stack.getBoundingClientRect().height;
    const holder = [...stack.children].filter(shown).find((kid) => kid.getBoundingClientRect().height >= tall * 0.8);
    if (!holder) break;
    stack = holder;
  }
  // A layer laid over the page, such as a moving background or a menu drawer, is not one of its sections.
  const sections = [...stack.children].filter(shown).filter((el) => !/^(absolute|fixed)$/.test(getComputedStyle(el).position));
  const between = sections.slice(1).map((el, i) => {
    const before = sections[i];
    return Math.round(el.getBoundingClientRect().top - before.getBoundingClientRect().bottom + px(getComputedStyle(before).paddingBottom) + px(getComputedStyle(el).paddingTop));
  });

  // Each section's inner column: the first block inside it narrower than the window, or the section itself.
  const edges = sections.map((section) => {
    let inner = section;
    for (let depth = 0; depth < 3 && inner.getBoundingClientRect().width >= innerWidth - 1; depth++) {
      const next = [...inner.children].find((child) => shown(child) && !/^(P|H[1-6]|IMG|PICTURE|VIDEO|SVG)$/.test(child.tagName));
      if (!next) break;
      inner = next;
    }
    const box = inner.getBoundingClientRect();
    return { where: where(section), left: Math.round(box.left), right: Math.round(box.right) };
  });

  const headings = all.filter((el) => /^H[1-6]$/.test(el.tagName)).map((el) => {
    const box = el.getBoundingClientRect();
    const before = (one) => {
      let prev = one.previousElementSibling;
      while (prev && !shown(prev)) prev = prev.previousElementSibling;
      return prev;
    };
    let prev = before(el);
    // A short line set smaller over the heading, a label or a date, belongs with it: the gap above is above that.
    const size = px(getComputedStyle(el).fontSize);
    if (prev && (prev.textContent || '').trim().length <= 60 && px(getComputedStyle(prev).fontSize) < size) prev = before(prev);
    let next = el.nextElementSibling;
    while (next && !shown(next)) next = next.nextElementSibling;
    return {
      where: where(el),
      level: Number(el.tagName[1]),
      above: prev ? Math.round(box.top - prev.getBoundingClientRect().bottom) : null,
      below: next ? Math.round(next.getBoundingClientRect().top - box.bottom) : null,
    };
  });

  // Lists of like things: three or more shown children of one tag and first class, laid out in rows.
  const lists = [];
  for (const el of [root, ...all]) {
    const kids = [...el.children].filter(shown);
    if (kids.length < 3) continue;
    const kind = (k) => k.tagName + (k.classList[0] || '');
    if (!kids.every((k) => kind(k) === kind(kids[0]))) continue;
    const boxes = kids.map((k) => k.getBoundingClientRect());
    const rows = [];
    for (const box of boxes) {
      const row = rows.find((one) => Math.abs(one.top - box.top) < 2);
      if (row) row.boxes.push(box);
      else rows.push({ top: box.top, boxes: [box] });
    }
    rows.sort((a, b) => a.top - b.top);
    const across = rows.flatMap((row) => row.boxes.sort((a, b) => a.left - b.left).slice(1).map((box, i) => Math.round(box.left - row.boxes[i].right)));
    const down = rows.slice(1).map((row, i) => Math.round(Math.min(...row.boxes.map((b) => b.top)) - Math.max(...rows[i].boxes.map((b) => b.bottom))));
    lists.push({ where: where(el), across, down });
  }

  const cards = all.filter((el) => {
    if (/^(A|BUTTON|INPUT|SELECT|TEXTAREA|IMG|TABLE|TR|TD|TH)$/.test(el.tagName)) return false;
    const box = el.getBoundingClientRect();
    if (box.width < 160 || box.height < 80 || el.children.length < 2) return false;
    const style = getComputedStyle(el);
    const lined = ['Top', 'Right', 'Bottom', 'Left'].filter((side) => px(style[`border${side}Width`]) > 0 && style[`border${side}Style`] !== 'none').length >= 3;
    return lined || style.boxShadow !== 'none';
  }).map((el) => ({ where: where(el), pad: Math.round(px(getComputedStyle(el).paddingLeft)) }))
    // A card padded 0 keeps its padding on a block inside it, such as a picture above padded words.
    .filter((card) => card.pad > 0);

  const paragraphs = all.filter((el) => el.tagName === 'P' && (el.textContent || '').trim().length >= 200).map((el) => {
    const style = getComputedStyle(el);
    const line = style.lineHeight === 'normal' ? px(style.fontSize) * 1.2 : px(style.lineHeight);
    const lines = Math.max(1, Math.round(el.getBoundingClientRect().height / line));
    return { where: where(el), perLine: Math.round((el.textContent || '').trim().length / lines) };
  });

  // Short things that must stay on one line: count the lines their words take, from the words alone, so an icon set
  // beside them is not a second line.
  const linesOf = (el) => {
    const style = getComputedStyle(el);
    const line = style.lineHeight === 'normal' ? px(style.fontSize) * 1.2 : px(style.lineHeight);
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const tops = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) if (rect.width > 0) tops.push(rect.top);
    }
    return distinctTops(tops, line / 2);
  };
  const distinctTops = (tops, within) => tops.sort((a, b) => a - b).reduce((n, top, i) => (i && top - tops[i - 1] > within ? n + 1 : n), tops.length ? 1 : 0);
  const scope = document.body;
  const short = [...scope.querySelectorAll('a, button, label, summary, [role="tab"], nav li, footer li')].filter(shown).filter((el) => {
    const text = (el.textContent || '').trim().replace(/\s+/g, ' ');
    return text.length > 0 && text.length <= 40 && text.split(' ').length <= 5 && !el.closest('p');
  });
  const wraps = short.filter((el) => linesOf(el) > 1).map(where);

  // Targets: links and controls, leaving out links inside a sentence, which WCAG 2.2 sets aside.
  const targets = [...scope.querySelectorAll('a[href], button, input:not([type="hidden"]), select, textarea, [role="button"], summary')].filter(shown).filter((el) => !el.closest('p'));
  const centers = targets.map((el) => {
    const box = el.getBoundingClientRect();
    return { el, box, x: box.left + box.width / 2, y: box.top + box.height / 2 };
  });
  const small = centers.filter((one) => one.box.width < 24 || one.box.height < 24).filter((one) => centers.some((other) => other !== one && Math.hypot(other.x - one.x, other.y - one.y) < 24)).map((one) => where(one.el));

  // The page's side gutter: the nearest any text comes to either edge of the window.
  let left = Infinity;
  let right = Infinity;
  for (const el of all) {
    if (![...el.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim())) continue;
    const box = el.getBoundingClientRect();
    if (box.right <= 0 || box.left >= innerWidth) continue;
    left = Math.min(left, box.left);
    right = Math.min(right, innerWidth - box.right);
  }

  return { width: innerWidth, hasMain: Boolean(document.querySelector('main')), scrollWidth: document.documentElement.scrollWidth, values, between, edges, headings, lists, cards, paragraphs, wraps, small, gutter: { left: Math.round(left), right: Math.round(right) } };
}

/** Two values a reader can tell apart: 4px apart below 16, and a quarter larger from 16 up. */
export const apart = (a, b) => (Math.min(a, b) < 16 ? Math.abs(a - b) >= 4 : Math.max(a, b) / Math.min(a, b) >= 1.25);

/** The values a page uses often: at least three times, and at least one use in fifty. */
export function frequent(values) {
  const counts = Object.entries(values).map(([value, uses]) => [Number(value), uses.length]);
  const total = counts.reduce((sum, [, n]) => sum + n, 0);
  return counts.filter(([, n]) => n >= Math.max(3, total * 0.02)).sort((a, b) => b[1] - a[1] || a[0] - b[0]);
}

/**
 * The scale a page already keeps: its frequent values, the most used first, each kept only when it can be told apart
 * from every value kept before it. So of two values too close to tell apart, the one used more is the step.
 */
export function inferScale(values) {
  const scale = [];
  for (const [value] of frequent(values)) if (scale.every((step) => apart(step, value))) scale.push(value);
  return scale.sort((a, b) => a - b);
}

const distinct = (xs, within = 2) => xs.slice().sort((a, b) => a - b).reduce((out, x) => (out.length && x - out[out.length - 1] <= within ? out : [...out, x]), []);

/** Judges the facts from both widths against the twelve measured traits. Pure, so it can be tested without a browser. */
export function judge(wide, narrow, given) {
  const both = {};
  for (const facts of [wide, narrow]) for (const [value, uses] of Object.entries(facts.values)) (both[value] ||= []).push(...uses);
  const scale = given && given.length ? given : inferScale(both);
  const on = (value) => value <= 2 || scale.includes(value);
  const result = (id, fails, says) => ({ id, pass: fails.length === 0, says, where: fails.slice(0, 8) });
  const used = Object.keys(both).map(Number).sort((a, b) => a - b);
  // Values the page leans on that sit too close together: the mistakes that read as a careless line, not one stray value.
  const often = frequent(both).map(([value]) => value).sort((a, b) => a - b);
  const close = often.flatMap((value, i) => (i && !apart(often[i - 1], value) ? [`${often[i - 1]} and ${value}`] : []));
  const rhythm = (facts) => distinct(facts.between.filter((gap) => gap > 0));
  const pads = (facts) => distinct(facts.cards.map((card) => card.pad));
  const pairs = distinct(wide.edges.map((edge) => edge.left)).length;
  const levels = [1, 2, 3, 4, 5, 6].map((level) => ({ level, gaps: distinct(wide.headings.filter((h) => h.level === level && h.below !== null).map((h) => h.below)) })).filter((one) => one.gaps.length > 1);
  const uneven = [...wide.lists, ...narrow.lists].filter((list) => distinct(list.across).length > 1 || distinct(list.down).length > 1);
  return {
    scale,
    traits: [
      result('one-scale', used.filter((value) => !on(value)).map((value) => `${value}px, ${both[value].length} uses, such as ${both[value][0]}`), `${used.filter((value) => !on(value)).length} of ${used.length} values off the scale ${scale.join(', ')}`),
      result('steps-you-can-see', close, close.length ? `values too close to tell apart: ${close.join('; ')}` : 'every value in use can be told from its neighbors'),
      result('one-container', pairs > 1 ? wide.edges.map((edge) => `${edge.where}: ${edge.left} to ${edge.right}`) : [], `${pairs} left edge${pairs === 1 ? '' : 's'} across ${wide.edges.length} sections at ${wide.width} wide`),
      result('section-rhythm', [wide, narrow].filter((facts) => rhythm(facts).length > 1).map((facts) => `${facts.width} wide: ${facts.between.join(', ')}`), `space between sections ${rhythm(wide).join(', ') || 'none'} at ${wide.width}, ${rhythm(narrow).join(', ') || 'none'} at ${narrow.width}`),
      result('near-belongs-together', wide.headings.filter((h) => h.above !== null && h.below !== null && h.below > h.above).map((h) => `${h.where}: ${h.above} above, ${h.below} below`), 'each heading closer to what it heads than to what is above it'),
      result('heading-gap', levels.map((one) => `h${one.level}: ${one.gaps.join(', ')} below`), 'one gap under every heading of a level'),
      result('one-gap-per-list', uneven.map((list) => `${list.where}: ${[...distinct(list.across), ...distinct(list.down)].join(', ')}`), `${uneven.length} lists with more than one gap`),
      result('card-padding', [wide, narrow].filter((facts) => pads(facts).length > 1).map((facts) => `${facts.width} wide: ${pads(facts).join(', ')}`), `card padding ${pads(wide).join(', ') || 'no cards'} at ${wide.width}, ${pads(narrow).join(', ') || 'no cards'} at ${narrow.width}`),
      result('reading-width', wide.paragraphs.filter((p) => p.perLine > 90).map((p) => `${p.where}: ${p.perLine} a line`), 'running text at 90 characters a line or fewer'),
      result('nothing-short-wraps', [...wide.wraps.map((w) => `${wide.width}: ${w}`), ...narrow.wraps.map((w) => `${narrow.width}: ${w}`)], 'buttons, labels and links on one line'),
      result('phone-gutter', [...(narrow.scrollWidth > narrow.width ? [`the page is ${narrow.scrollWidth} wide in a window of ${narrow.width}`] : []), ...(Math.min(narrow.gutter.left, narrow.gutter.right) < 16 ? [`text ${narrow.gutter.left} from the left and ${narrow.gutter.right} from the right`] : [])], `at ${narrow.width} wide, a gutter of ${Math.min(narrow.gutter.left, narrow.gutter.right)} and a page ${narrow.scrollWidth} wide`),
      result('room-to-tap', narrow.small, `${narrow.small.length} targets under 24 by 24 with another within 24 at ${narrow.width} wide`),
    ],
  };
}

// The Chrome on this machine, or the one named by CHROME.
function chrome() {
  const home = process.env.HOME || '';
  const found = [
    process.env.CHROME,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    path.join(home, 'AppData', 'Local', 'Google', 'Chrome', 'Application', 'chrome.exe'),
  ].find((one) => one && existsSync(one));
  if (!found) throw new Error('No Chrome or Chromium found. Set CHROME to its path.');
  return found;
}

// Opens the page in headless Chrome at each width and runs collect() in it, over the DevTools protocol.
async function measure(url, widths) {
  const profile = mkdtempSync(path.join(tmpdir(), 'measure-'));
  const browser = spawn(chrome(), ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  const closed = new Promise((resolve) => browser.once('exit', resolve));
  try {
    const portFile = path.join(profile, 'DevToolsActivePort');
    for (let i = 0; i < 100 && !existsSync(portFile); i++) await new Promise((r) => setTimeout(r, 100));
    const port = readFileSync(portFile, 'utf8').split('\n')[0];
    const page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((one) => one.type === 'page');
    const socket = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => ((socket.onopen = resolve), (socket.onerror = reject)));
    let id = 0;
    const waiting = new Map();
    let loaded = false;
    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.id && waiting.has(data.id)) waiting.get(data.id)(data), waiting.delete(data.id);
      else if (data.method === 'Page.loadEventFired') loaded = true;
    };
    const send = (method, params = {}) => new Promise((resolve) => {
      waiting.set(++id, resolve);
      socket.send(JSON.stringify({ id, method, params }));
    });
    await send('Page.enable');
    const out = [];
    for (const width of widths) {
      loaded = false;
      await send('Emulation.setDeviceMetricsOverride', { width, height: width < 600 ? 812 : 900, deviceScaleFactor: 1, mobile: width < 600 });
      await send('Page.navigate', { url });
      for (let i = 0; i < 300 && !loaded; i++) await new Promise((r) => setTimeout(r, 100));
      await new Promise((r) => setTimeout(r, 1000));
      const ran = await send('Runtime.evaluate', { expression: `(${collect.toString()})()`, returnByValue: true });
      if (ran.result?.exceptionDetails) throw new Error(ran.result.exceptionDetails.exception?.description || 'the measure failed in the page');
      out.push(ran.result.result.value);
    }
    socket.close();
    return out;
  } finally {
    browser.kill();
    await closed;
    rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
}

async function main() {
  const args = process.argv.slice(2);
  const url = args.find((one) => /^https?:\/\//.test(one));
  if (!url) {
    process.stderr.write('Give a page address: node measure.mjs https://example.com/ [--scale 4,8,12,16,24,32,48,64,96] [--json]\n');
    process.exit(2);
  }
  const scaleAt = args.indexOf('--scale');
  const given = scaleAt >= 0 ? (args[scaleAt + 1] || '').split(',').map(Number).filter((n) => n > 0) : null;
  const [wide, narrow] = await measure(url, [1440, 375]);
  const judged = judge(wide, narrow, given);
  if (args.includes('--json')) process.stdout.write(`${JSON.stringify({ url, ...judged }, null, 2)}\n`);
  else {
    if (!wide.hasMain) process.stdout.write('The page has no <main>: the measure read the whole body, header and footer included. Step 2 of the skill adds one.\n');
    process.stdout.write(`${url}\nScale: ${judged.scale.join(', ')}${given ? '' : ' (the page\'s own, from the values it uses most)'}\n\n`);
    for (const trait of judged.traits) {
      process.stdout.write(`${trait.pass ? 'pass' : 'FAIL'}  ${trait.id}: ${trait.says}\n`);
      for (const one of trait.where) process.stdout.write(`        ${one}\n`);
    }
    const failed = judged.traits.filter((trait) => !trait.pass).length;
    process.stdout.write(`\n${judged.traits.length - failed} of ${judged.traits.length} measured traits pass. The four judged traits are read from screenshots.\n`);
  }
  process.exit(judged.traits.some((trait) => !trait.pass) ? 1 : 0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();

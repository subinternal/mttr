# Spacing traits

One rule a section. Each has an id that never changes, says whether code measures it or a reader judges it, and gives a bad and a good example. Step 7 of the skill works through them in this order; [spacing.md](spacing.md) says how to find the site's scale and how to measure.

A measured trait passes or fails on numbers. A judged trait is read from screenshots of the page at 1440 and 375 pixels wide: pass, fail, or unsure. Unsure goes to the person with the screenshot; it is never counted as a pass.

"The scale" below is the site's own spacing scale, found in step 7. A site with none takes 4, 8, 12, 16, 24, 32, 48, 64 and 96 pixels.

## one-scale

Measured. Every padding, margin and gap comes from the scale. 0, 1px and 2px are the only other values, for hairlines and nudges.

- Bad: a card padded 22px beside one padded 24px, and a list 10px apart beside one 12px apart.
- Good: both cards 24px, both lists 12px, each written as the scale's token.
- Measure: every distinct padding, margin and gap the page computes, counted. Any value off the scale fails, with where it is used.

## steps-you-can-see

Measured. Two values on the scale are never so close that a reader cannot tell them apart. Below 16px a step is at least 4px; from 16px up, each step is at least a quarter larger than the one before.

- Bad: 12, 14 and 16 all in use, so three gaps look like one gap drawn carelessly.
- Good: 12 and 16, and nothing between.
- Measure: the values the page uses often (three times or more, and one use in fifty), sorted. Two neighbors closer than the step fail, and the one used less is the one to move.

## one-container

Measured. A page sets its width once, on its main column, and every block inside shares that column's left and right edges. Only running text is held narrower, to its reading width.

- Bad: a hero 1280px wide over a grid 1200px wide over a form 1140px wide, so each block starts at a different left edge.
- Good: one column 1200px wide; the form sits inside it at the column's left edge.
- Measure: the left and right edges of each top level block inside `main` at 1440 wide. More than one pair, other than text held to its reading width, fails.

## section-rhythm

Measured. The sections of a page are one distance apart, top to bottom, and nothing else adds space between them. Phones take one smaller value.

- Bad: 96px between the first two sections, 64px between the next, 120px before the footer, because each section brought its own margin.
- Good: 72px between every section at 1440 wide and 48px at 375, set once on the container.
- Measure: the space from the end of each section's content to the start of the next one's, at both widths: the gap between them and the padding each keeps on that side. More than one value at a width fails.

## near-belongs-together

Measured. The space inside a group is smaller than the space around it, so what belongs together reads together.

- Bad: a label 16px above its field and 16px below the field before it, so it could belong to either.
- Good: the label 8px above its field, and 24px between one field and the next label.
- Measure: for each heading, label and caption, the gap to what it names against the gap to what comes before it. The first must be smaller.

## heading-gap

Measured. A heading sits closer to what it heads than to what is above it, and the gap below a heading is the same for every heading of one level.

- Bad: an h2 with 12px below it in one section and 32px in the next.
- Good: every h2 with 16px below it and a section's whole rhythm above it.
- Measure: the gap below each heading, grouped by level. More than one value in a level fails, as does a gap below larger than the gap above.

## one-gap-per-list

Measured. The items of one list, one grid or one stack are one distance apart.

- Bad: a list of features whose items are 12px apart, except one with a bottom margin of 20px of its own.
- Good: the list sets `gap: 12px` and no item sets a margin.
- Measure: the gaps between siblings of each list, grid and flex container. More than one value in one container fails.

## card-padding

Measured. Every card on the site has the same inside padding, and a phone takes one smaller value.

- Bad: pricing cards padded 32px beside feature cards padded 20px.
- Good: every card padded 24px, and 16px at 375 wide.
- Measure: the padding of each element that draws a card (a border or a shadow, and a background). More than one value at a width fails.

## reading-width

Measured. Running text is held to a width a reader can follow: about 45 to 80 characters a line.

- Bad: a paragraph across a 1200px column, 150 characters a line.
- Good: the paragraph at a `max-width` of about 65 characters, inside the same column.
- Measure: characters per line of each paragraph of body text at 1440 wide. Over 90 fails.

## nothing-short-wraps

Measured. A button, a label, a chip, a tab, a menu item or a footer link stays on one line. A heading runs on one line where it fits.

- Bad: a button reading "Get a" over "quote" at 375 wide.
- Good: the button's words kept together, and the row it sits in wraps whole buttons, never their words.
- Measure: the height of each such element against its line height, at 1440 and at 375. Taller than one line fails.

## phone-gutter

Measured. At 375 wide the page keeps a side gutter of at least 16px and never scrolls sideways.

- Bad: a table 420px wide that pushes the whole page sideways.
- Good: the table scrolls inside its own box, and the page's edges hold.
- Measure: the page's scroll width against its width at 375, and the left edge of the main column. A page wider than the screen, or a gutter under 16px, fails.

## room-to-tap

Measured. A control a person taps is at least 24 by 24 pixels, or has that much room around it with nothing else to tap inside it.

- Bad: footer links 14px tall and 4px apart.
- Good: the same links with 12px between rows.
- Measure: each link and button's box and its distance to the next one. Under 24 by 24, with less room than that around it, fails. This is WCAG 2.2's target size at its minimum.

## space-not-borders

Judged. Two halves of one thing are set apart with space, not with a rule drawn inside a border.

- Bad: a card split down the middle by a hairline, inside the card's own hairline.
- Good: the two halves 24px apart inside one card.
- Read: any border drawn inside another bordered box, other than the lines of a table.

## no-empty-columns

Judged. A layout with a side column has content in both columns on every screen. A side that can run out stacks under the other instead.

- Bad: a long article beside a short list of links, with the side column empty for most of the page.
- Good: the links set above or below the article.
- Read: the screenshots at 1440 for a column that is blank for more than a screen's height.

## one-header-shape

Judged. Every section header on the site has the same shape: a title, at most one line under it, and its one action on the right.

- Bad: one section with a small label over its title, the next with a rule under its title, a third with two buttons.
- Good: every section with the title, a line, and one link on the right.
- Read: each section header's parts in order, against the site's first.

## density-fits-the-job

Judged. Space follows what the reader is doing: tight where they compare rows, roomy where they read.

- Bad: a pricing comparison with 48px between rows, so the eye loses its row.
- Good: the comparison at 12px a row, the paragraph under it at full reading rhythm.
- Read: each table and comparison for rows a reader cannot follow across, and each run of text for crowding.

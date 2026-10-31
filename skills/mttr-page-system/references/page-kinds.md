# Templates for each kind of page

One template for each kind of page, as the outline its HTML should have. The words in angle brackets come from the page's own data. Keep the site's own classes, components and look; these show only what is underneath.

Each kind lists the mttr rules that check it. `mttr_rules()` or `https://mttr.si/rulebook` gives each rule's current wording.

## How mttr files a page

mttr decides a page's kind from its address and its structured data, in this order, and checks it against that kind's rules:

1. The address `/` is the home page.
2. An `Article`, `BlogPosting`, `NewsArticle` or `TechArticle` in its data, or an address under `/guide/`, `/guides/`, `/blog/`, `/article/`, `/articles/`, `/news/`, `/resources/` or `/learn/`, is an article.
3. A `Service` or `Product` in its data, or an address under `/service/`, `/services/`, `/service-area/`, `/location/`, `/locations/`, `/product/` or `/products/`, is a service page.
4. Anything else is a plain page, which skips the rules for content (`question-headings`, `depth`, `has-image`, `breadcrumb` and others).

So a service at `/excavation` or `/springfield/excavation`, with no `Service` in its data, is read as a plain page and checked against too few rules. Writing the right type in its data is the fix that moves no address. Check how a template's pages were filed with `mttr_pages({ site, kind: "page" })`: a service or a guide in that list is filed wrong.

The minimum words mttr asks for (`depth`) differ by kind: 150 for the home page, 350 for a service page, 500 for an article. They count the text inside `<main>`, less menus and forms.

## Home

What the business is, what it does and where, in the first screen, then a way into each part of the site.

```html
<main>
  <h1><What the business does, and where></h1>
  <p><Two or three sentences: who it is for, what it does, the area it serves.></p>
  <a href="/contact"><Get a quote></a> <a href="tel:+13145550100"><(314) 555-0100></a>

  <h2><Services></h2>
  <ul>
    <li><a href="/services/<slug>"><Service name></a>: <one line from the service's own page></li>
  </ul>

  <h2><Why people choose us></h2>
  <p><Facts that can be checked: years trading, licenses with their numbers, areas served.></p>

  <h2><Guides></h2>
  <ul><li><a href="/guides/<slug>"><Guide title></a></li></ul>
</main>
```

- Structured data: `Organization`, or `LocalBusiness` or a subtype for a business with a place or an area served, and `WebSite`.
- Links out: every hub, and the pages that matter most.
- Rules: `one-h1`, `title`, `description`, `canonical`, `structured-data`, `schema-fits`, `content-in-html`, `depth`, `next-step`, `phone-link`, `share-image`.

## Service or location served

One offer per page: what it is, who it is for, what it costs or how a price is reached, the area, and the next step.

```html
<main>
  <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/services">Services</a> / <span><Service></span></nav>
  <h1><Service, in the words a buyer uses></h1>
  <p><What it is and who it is for, in two or three sentences.></p>

  <h2><How much does <service> cost?></h2>
  <p><The answer first: a range, or how the price is reached. Then the detail.></p>
  <table><caption><What changes the price></caption> ... </table>

  <h2><What is included?></h2>
  <ul><li><Item></li></ul>

  <h2><Areas we serve></h2>
  <p><Towns, each linked to its own page where one exists.></p>

  <figure><img src="<photo of the work>" alt="<what the photo shows>" width="1200" height="800" loading="lazy"><figcaption><Where and when></figcaption></figure>

  <a href="/contact?service=<slug>"><Request a quote></a>
</main>
```

- Structured data: `Service` with `provider` pointing at the business's `@id`, `areaServed`, and `BreadcrumbList`.
- Links in: from the services hub, and from the text of related guides.
- A page for each town that only swaps the town's name reads as a doorway page. Give each town page what is true of that town, or keep one page with the towns listed.
- Rules: `one-h1`, `question-headings`, `liftable-blocks`, `has-image`, `image-alt`, `schema-fits`, `breadcrumb`, `linked-in-context`, `depth`, `pages-are-distinct`, `plain-claims`, `next-step`.

### A service template, before and after

Before, as many themes ship it: the picture is a background, the headings are sales lines, the price is behind a button, and every service page shares the same three blocks.

```html
<main>
  <section class="hero" style="background-image:url(/img/hero.jpg)">
    <h2>Drainage done right. Best in St. Louis!</h2>
    <button onclick="openQuote()">Get a free quote</button>
  </section>
  <h1>{{ service.name }}</h1>
  <div class="text">{{ service.body }}</div>
  {% include 'why-choose-us' %}   <!-- 300 words, the same on every service page -->
  {% include 'testimonials' %}
</main>
```

What mttr reports on each page made from it: `has-image` (a CSS background), `question-headings`, `liftable-blocks`, `plain-claims` ("Best in St. Louis"), `breadcrumb` and `schema-fits` where the data is missing, and across the set `pages-are-distinct`, since the shared blocks are most of each page's text. The quote button is not a link at all; `next-step` passes only because the menu links to `/contact`.

After: the same look, with the structure under it.

```html
<main id="content">
  <nav aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/services">Services</a></li><li aria-current="page">{{ service.name }}</li></ol></nav>
  <h1>{{ service.name }} in {{ site.area }}</h1>
  <p>{{ service.summary }}</p>
  <img class="hero" src="{{ service.photo.url }}" alt="{{ service.photo.alt }}" width="1600" height="900" fetchpriority="high">
  <a class="button" href="/contact?service={{ service.slug }}">Get a free quote</a>

  <h2>How much does {{ service.name | downcase }} cost?</h2>
  <p>{{ service.price_answer }}</p>
  <table><caption>What changes the price</caption>{{ service.price_rows }}</table>

  <h2>What is included?</h2>
  <ul>{% for item in service.included %}<li>{{ item }}</li>{% endfor %}</ul>

  {{ service.body }}
  <p class="proof">{{ site.years_trading }} years in business. License {{ site.license_number }}.</p>
</main>
<script type="application/ld+json">{{ service_graph }}</script>
```

- Each field is the service's own: the summary, the price answer, the list of what is included. Where a field is empty, the template leaves its block out rather than showing a default.
- The shared "why choose us" block became one line of facts that can be checked. Testimonials, if kept, sit on the page where the reviews are real, and no rating goes in the data unless they are.
- The quote button is a link to a real address, so it counts as a next step and works without script.

## Product

One product per page, with its price, stock and variants stated where a shopper sees them.

```html
<main>
  <nav aria-label="Breadcrumb"> ... </nav>
  <h1><Product name></h1>
  <img src="<product photo>" alt="<product, color, angle>" width="1200" height="1200">
  <p><Price, as the shop shows it></p> <p><In stock | Sold out></p>
  <form action="/cart/add" method="post"> ... </form>
  <h2><Details></h2>
  <dl><dt>Material</dt><dd><...></dd></dl>
</main>
```

- Structured data: `Product` or `ProductGroup` with an `Offer` for each variant, and `BreadcrumbList`. The `mttr-shop-ready` skill fixes it field by field and checks it with `mttr_product_check`.
- The buy form is in the HTML the server sends.
- Rules: `structured-data`, `schema-fits`, `ratings-are-real`, `image-alt`, `breadcrumb`.

## Article

A guide that answers one question well: the answer first, then the reasons, the figures and the sources.

```html
<main>
  <nav aria-label="Breadcrumb"> ... </nav>
  <article>
    <h1><The guide's subject></h1>
    <p>By <a href="/about#<author>"><Author></a>. Updated <time datetime="2026-10-16">October 16, 2026</time>.</p>

    <h2><The question a reader asks?></h2>
    <p><The answer in its first sentence, then the one or two facts that hold it up.></p>

    <h2><What changes the answer?></h2>
    <table><caption><Options compared></caption> ... </table>

    <h2>Sources</h2>
    <ul><li><a href="<official or primary source>"><Publisher: title></a></li></ul>
  </article>
  <aside><h2>Related</h2><ul><li><a href="/services/<slug>"><The service this guide is about></a></li></ul></aside>
</main>
```

- Structured data: `Article` or `BlogPosting` with `headline`, `datePublished`, `dateModified`, `author` and `publisher`, and `BreadcrumbList`.
- Links out: in the text, to the service or product the guide is about.
- Rules: `answer-first`, `answers-the-question`, `question-headings`, `has-table`, `liftable-blocks`, `dated`, `named-publisher`, `sources-shown`, `claims-supported`, `depth`, `breadcrumb`, `has-image`.

## Hub

The list of every page of one kind, so each is a click from home and a click from its neighbors.

```html
<main>
  <h1><Services></h1>
  <p><One or two sentences on what the pages below cover.></p>
  <ul>
    <li><h2><a href="/services/<slug>"><Service></a></h2><p><The service page's own description.></p></li>
  </ul>
</main>
```

- Structured data: `CollectionPage` and `BreadcrumbList`.
- Every page of the kind is listed. A new page appears here when it is made, from the same data.
- Rules: `within-three-clicks`, `no-orphans`, `one-h1`, `description`.

## Plain page: about, contact, pricing, policies

- About: who runs the business, since when, licenses and memberships with their numbers, and where it works. Link each author's name on articles here.
- Contact: the phone as a `tel:` link, the email, the address as text, the hours, and a form. The same facts as the home page's structured data.
- Pricing: the prices or how a price is reached, in a table.
- Author: one page, or one anchor on the about page, for each person who writes. Their name, what qualifies them to write on the subject, and the guides they wrote. Each article's `author.url` points here. Never a person who does not exist or a credential they do not hold.
- Rules: `one-h1`, `title`, `description`, `phone-link`, `next-step`, `plain-claims`.

## Every kind

- One `h1`, in `<main>`, from the page's own data.
- Title and meta description written for this page, not shared.
- Canonical link to its own final address.
- Share tags with an image.
- In the sitemap, within three clicks of home, and linked from the text of a related page.

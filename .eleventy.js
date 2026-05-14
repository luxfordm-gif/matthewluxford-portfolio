module.exports = function (eleventyConfig) {
  // copy static assets straight through
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/sitemap.xml": "sitemap.xml" });
  eleventyConfig.addPassthroughCopy({ "src/tone-of-voice.md": "tone-of-voice.md" });

  // keep original filenames — output /jlr.html not /jlr/index.html
  // so existing internal links (cv.html, jlr.html, etc.) keep working
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      if (data.permalink) return data.permalink;
      if (data.page && data.page.filePathStem) {
        return `${data.page.filePathStem}.html`;
      }
    },
  });

  // ----------------------------------------------------------------------
  // Case-study section shortcodes
  // Used inside any case-study .njk that extends layouts/case.njk —
  // turns repeated wrapper markup into named tags so the source reads as
  // content rather than scaffolding.
  // ----------------------------------------------------------------------

  // Top hero image — full-bleed picture at the top of the case body.
  // Optionally accepts a mobile-specific srcset.
  eleventyConfig.addShortcode("case_hero_image", function (src, alt, mobileSrc) {
    const source = mobileSrc
      ? `\n    <source media="(max-width: 760px)" srcset="${mobileSrc}" />`
      : "";
    return `<figure class="case__bleed case__bleed--top">
  <picture>${source}
    <img src="${src}" alt="${alt}" loading="eager" />
  </picture>
</figure>`;
  });

  // Body section — 1fr 2fr grid: h2 on the left, copy on the right.
  eleventyConfig.addPairedShortcode("case_body", function (content, title) {
    return `<section class="case__body">
  <h2>${title}</h2>
  <div class="case__body__copy">${content}</div>
</section>`;
  });

  // Coloured-card hero — title + lede on the left, freeform stats panel
  // on the right. Pass an optional marginTop override (Reps does this).
  eleventyConfig.addPairedShortcode("case_hero", function (content, title, lede, marginTop) {
    const style = marginTop ? ` style="margin-top:${marginTop}"` : "";
    return `<section class="case__hero"${style}>
  <div class="case__hero-grid">
    <div>
      <h2>${title}</h2>
      <p>${lede}</p>
    </div>
    <div class="case__hero-stats">${content}</div>
  </div>
</section>`;
  });

  // Single stat card inside a case_hero stats panel.
  eleventyConfig.addShortcode("hero_stat", function (num, lab) {
    return `<div class="hero-stat">
        <div class="hero-stat__num">${num}</div>
        <div class="hero-stat__lab">${lab}</div>
      </div>`;
  });

  // Editorial featured image with optional caption.
  eleventyConfig.addShortcode("case_feature", function (src, alt, caption) {
    const cap = caption
      ? `\n  <figcaption class="case__caption">— ${caption}</figcaption>`
      : "";
    return `<figure class="case__feature">
  <img src="${src}" alt="${alt}" />${cap}
</figure>`;
  });

  // Full-bleed featured image (no max-width, no border-radius).
  eleventyConfig.addShortcode("case_feature_full", function (src, alt) {
    return `<figure class="case__feature case__feature--full">
  <img src="${src}" alt="${alt}" />
</figure>`;
  });

  // Two-up split image row.
  eleventyConfig.addShortcode("case_split", function (src1, alt1, src2, alt2) {
    return `<div class="case__split">
  <img src="${src1}" alt="${alt1}" />
  <img src="${src2}" alt="${alt2}" />
</div>`;
  });

  // Two-up gallery (rounded, near the foot of a page).
  eleventyConfig.addShortcode("case_gallery", function (src1, alt1, src2, alt2) {
    return `<div class="case__gallery">
  <img src="${src1}" alt="${alt1}" loading="lazy" />
  <img src="${src2}" alt="${alt2}" loading="lazy" />
</div>`;
  });

  // Pull quote — italic Fraunces with optional attribution.
  eleventyConfig.addPairedShortcode("case_quote", function (content, attribution) {
    const cite = attribution ? `\n  <cite>${attribution}</cite>` : "";
    return `<blockquote class="case__quote">
  <p>${content}</p>${cite}
</blockquote>`;
  });

  // Outcomes — three big numbers. Wrap with {% outcomes %} … {% endoutcomes %}
  // and use {% outcome num, lab %} inside.
  eleventyConfig.addPairedShortcode("outcomes", function (content) {
    return `<section class="outcomes">${content}</section>`;
  });
  eleventyConfig.addShortcode("outcome", function (num, lab, modifier) {
    const cls = modifier ? `outcome outcome--${modifier}` : "outcome";
    return `<div class="${cls}">
    <span class="outcome__num">${num}</span>
    <span class="outcome__lab">${lab}</span>
  </div>`;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk",
  };
};

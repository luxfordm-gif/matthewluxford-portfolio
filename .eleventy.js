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
    <img src="${src}" alt="${alt}" loading="eager" fetchpriority="high" />
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
    return `<section class="case__hero" data-nav-dark${style}>
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

  // Reel — a horizontal, snap-scrolling strip with a caption under each
  // slide (Reps). Wrap with {% reel "label" %} … {% endreel %} and use
  // reel_phone (an iPhone frame around a screen) or reel_card (a plain
  // rounded image) inside. Pass "cards" as the second arg for the card variant.
  eleventyConfig.addPairedShortcode("reel", function (content, label, variant) {
    // "cards": images at natural aspect and a fixed height; "shots": the same
    // with a hairline border and paper background, for website screenshots.
    const cls = variant === "shots" ? "reel reel--cards reel--shots" : variant === "cards" ? "reel reel--cards" : "reel reel--phones";
    return `<section class="${cls}" aria-label="${label || "Gallery"}">
  <div class="reel__track" tabindex="0">${content}</div>
</section>`;
  });

  // A phone in a reel (a Pixel 10 Pro XL). The frame, status bar, camera and
  // gesture bar are CSS, so the image is just the screen content: a 1080×2404
  // Pixel screenshot with its own bars cropped off (1:1.965). Pass the
  // screen's top colour as bg and, if different, its bottom colour as
  // bottomBg so the status and gesture bars match.
  const phoneStatusGlyphs = `<svg viewBox="0 0 60 12" fill="currentColor" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx=".7"/><rect x="4.5" y="6" width="3" height="6" rx=".7"/><rect x="9" y="3.5" width="3" height="8.5" rx=".7"/><rect x="13.5" y="1" width="3" height="11" rx=".7"/><path d="M24 4.6a9 9 0 0 1 12 0l-1.5 1.7a6.8 6.8 0 0 0-9 0z"/><path d="M26.7 7.4a5.2 5.2 0 0 1 6.6 0L30 11z"/><rect x="42" y="1.5" width="15" height="9" rx="2.5" fill="none" stroke="currentColor" stroke-opacity=".45"/><rect x="43.5" y="3" width="12" height="6" rx="1.5"/><rect x="58.2" y="4.3" width="1.3" height="3.4" rx=".6" opacity=".45"/></svg>`;
  // Status bar and gesture bar colours: the screen's top colour behind the
  // status bar, its bottom colour behind the gesture bar, white text on dark.
  const isDark = (hex) => {
    const m = /^#([0-9a-f]{6})$/i.exec((hex || "").trim());
    if (!m) return false;
    const n = parseInt(m[1], 16);
    return (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255 < 0.45;
  };
  const phoneStyle = (bg, bottomBg) => {
    const parts = [];
    if (bg) { parts.push(`--sbg:${bg}`); if (isDark(bg)) parts.push("--sfg:#fff"); }
    const nbg = bottomBg || bg;
    if (nbg) { parts.push(`--nbg:${nbg}`); if (isDark(nbg)) parts.push("--nfg:#fff"); }
    return parts.length ? ` style="${parts.join(";")}"` : "";
  };
  eleventyConfig.addShortcode("reel_phone", function (src, alt, caption, bg, bottomBg) {
    const style = phoneStyle(bg, bottomBg);
    const cap = caption ? `\n  <figcaption class="reel__cap">${caption}</figcaption>` : "";
    return `<figure class="reel__item">
  <div class="phone"${style}>
    <div class="phone__screen">
      <div class="phone__status" aria-hidden="true"><span>9:41</span><i class="phone__cam"></i>${phoneStatusGlyphs}</div>
      <img src="${src}" alt="${alt}" loading="lazy" draggable="false" />
      <i class="phone__nav" aria-hidden="true"></i>
    </div>
  </div>${cap}
</figure>`;
  });

  // A phone in a reel playing a short clip (a screen recording with the
  // device's own bars cropped off). Muted, looping; JS plays it only while
  // it's on screen so the file never downloads for a reel nobody reaches.
  eleventyConfig.addShortcode("reel_video", function (src, poster, alt, caption, bg, bottomBg) {
    const style = phoneStyle(bg, bottomBg);
    const cap = caption ? `\n  <figcaption class="reel__cap">${caption}</figcaption>` : "";
    return `<figure class="reel__item">
  <div class="phone"${style}>
    <div class="phone__screen">
      <div class="phone__status" aria-hidden="true"><span>9:41</span><i class="phone__cam"></i>${phoneStatusGlyphs}</div>
      <video class="phone__video" data-src="${src}" poster="${poster}" muted loop playsinline preload="none" aria-label="${alt}"></video>
      <i class="phone__nav" aria-hidden="true"></i>
    </div>
  </div>${cap}
</figure>`;
  });

  // A plain rounded image in a reel — natural aspect at a fixed height.
  eleventyConfig.addShortcode("reel_card", function (src, alt, caption) {
    const cap = caption ? `\n  <figcaption class="reel__cap">${caption}</figcaption>` : "";
    return `<figure class="reel__item">
  <div class="reel__card"><img src="${src}" alt="${alt}" loading="lazy" draggable="false" /></div>${cap}
</figure>`;
  });

  // Ruled rows — a definition list with hairlines between rows, for facts,
  // steps or numbers without boxes (Reps). Variants: "steps" numbers the
  // rows 01, 02…; "big" sets the term as a large figure.
  eleventyConfig.addPairedShortcode("ruled", function (content, variant) {
    const cls = variant ? `ruled ruled--${variant}` : "ruled";
    return `<dl class="${cls}">${content}</dl>`;
  });
  eleventyConfig.addShortcode("ruled_row", function (term, text) {
    return `<div class="ruled__row"><dt>${term}</dt><dd>${text}</dd></div>`;
  });

  // Pill under a card in the homepage Featured work carousel — one short,
  // concrete fact about the work. Keep labels to two or three words.
  eleventyConfig.addShortcode("proj_tag", function (label) {
    return `<span class="proj__tag">${label}</span>`;
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

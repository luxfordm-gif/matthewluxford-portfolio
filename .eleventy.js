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

// Lost Pixel — free/OSS visual regression for Storybook.
// Screenshots the built storybook-static and diffs against committed-free local
// baselines (.lostpixel/, gitignored). No account, no snapshot cap.
//
// Usage:
//   npm run visual:build      # build storybook-static
//   npm run visual:update     # set/refresh baselines
//   npm run visual            # screenshot + diff against baselines
//
// Scoped to the workspace kit for a fast first pass; widen `filterShot`
// (or remove it) to cover Core / Experience / all stories.
module.exports = {
  storybookShots: {
    storybookUrl: "./storybook-static",
  },
  // OSS/local mode — no Lost Pixel platform API.
  generateOnly: true,
  failOnDifference: true,
};

import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3000/dashboard", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(2000);
const m = await p.evaluate(() => {
  const link = document.querySelector('a[class*="nav-link__"]');
  const icon = document.querySelector('span[class*="nav-icon__"]');
  const svg = document.querySelector('[class*="lucid-icon"]');
  const label = document.querySelector('[class*="nav-label"]');
  const cs = (el) => el ? getComputedStyle(el) : null;
  const r = (el) => el ? el.getBoundingClientRect() : null;
  return {
    linkH: r(link)?.height, linkPad: cs(link)?.padding, linkFont: cs(link)?.fontSize,
    iconBox: r(icon) && {w:r(icon).width,h:r(icon).height}, iconCS: cs(icon)?.fontSize,
    svg: r(svg) && {w:r(svg).width,h:r(svg).height},
    labelFont: cs(label)?.fontSize, labelLH: cs(label)?.lineHeight,
  };
});
console.log(JSON.stringify(m, null, 2));
await b.close();

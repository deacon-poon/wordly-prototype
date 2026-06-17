import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3000/dashboard";
const out = process.argv[3] ?? "/tmp/shot.png";
const w = Number(process.argv[4] ?? 1440);
const h = Number(process.argv[5] ?? 900);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: h } });
const selector = process.argv[6]; // optional: screenshot just this element
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2500);
if (selector) {
  await page.locator(selector).first().screenshot({ path: out });
} else {
  await page.screenshot({ path: out, fullPage: false });
}
await browser.close();
console.log("shot:", out);

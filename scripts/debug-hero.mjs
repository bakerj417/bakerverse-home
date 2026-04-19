import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto('https://josephkbaker.com/', { waitUntil: 'networkidle' });

const data = await page.evaluate(() => {
  const hero = document.querySelector('.hero');
  const hc = document.querySelector('.hero-content');
  const hn = document.querySelector('.hero-name');
  const hr = document.querySelector('.hero-role');
  const hp = document.querySelector('.hero-pitch');
  const info = (el) => el ? {
    tag: el.tagName,
    classes: el.className,
    rectW: el.getBoundingClientRect().width,
    rectX: el.getBoundingClientRect().x,
    scrollW: el.scrollWidth,
    offW: el.offsetWidth,
    fontSize: getComputedStyle(el).fontSize,
    width: getComputedStyle(el).width,
    maxWidth: getComputedStyle(el).maxWidth,
    display: getComputedStyle(el).display,
    wordBreak: getComputedStyle(el).wordBreak,
    overflowWrap: getComputedStyle(el).overflowWrap,
  } : null;
  return {
    viewport: { w: window.innerWidth, h: window.innerHeight },
    hero: info(hero),
    heroContent: info(hc),
    heroName: info(hn),
    heroRole: info(hr),
    heroPitch: info(hp),
  };
});
console.log(JSON.stringify(data, null, 2));
await browser.close();

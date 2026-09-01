/**
 * One-off routing retest for root-based Strato deploy (no /M.Gosejohann/).
 * Run: node scripts/retest-routing.mjs
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = 'http://127.0.0.1:4173';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const results = [];
const brokenLinks = [];

function record(id, pass, detail = '') {
  results.push({ id, pass, detail });
  const mark = pass ? 'PASS' : 'FAIL';
  console.log(`[${mark}] ${id}${detail ? ' — ' + detail : ''}`);
}

async function statusOf(url) {
  try {
    const res = await fetch(url, { redirect: 'manual' });
    return res.status;
  } catch (e) {
    return `ERR:${e.message}`;
  }
}

async function collectBrokenAnchors(page, pageUrl) {
  const hrefs = await page.$$eval('a[href]', (as) =>
    as.map((a) => a.getAttribute('href')).filter(Boolean)
  );
  for (const href of hrefs) {
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) continue;
    if (href.startsWith('http') && !href.startsWith(BASE)) continue;
    let absolute;
    try {
      absolute = new URL(href, pageUrl).href;
    } catch {
      brokenLinks.push({ page: pageUrl, href, reason: 'invalid URL' });
      continue;
    }
    const st = await statusOf(absolute);
    if (st !== 200) {
      brokenLinks.push({ page: pageUrl, href, absolute, status: st });
    }
  }
}

function checkDistNoBasePath() {
  const htmlFiles = fs.readdirSync(DIST).filter((f) => f.endsWith('.html'));
  const hits = [];
  for (const f of htmlFiles) {
    const text = fs.readFileSync(path.join(DIST, f), 'utf8');
    if (text.includes('/M.Gosejohann/')) {
      hits.push(f);
    }
  }
  record(
    '10. dist HTML has no /M.Gosejohann/',
    hits.length === 0,
    hits.length ? `found in: ${hits.join(', ')}` : 'confirmed absent'
  );
}

async function main() {
  console.log(`Retesting against ${BASE}/\n`);

  // --- Check 1: open / and /index.html ---
  for (const pathPart of ['/', '/index.html']) {
    const st = await statusOf(BASE + pathPart);
    record(`1. GET ${pathPart}`, st === 200, `status=${st}`);
  }

  // --- Check 8: assets ---
  const assets = [
    '/styles.css',
    '/script.js',
    '/contact-gate.js',
    '/images/lklw.png',
    '/fonts/inter-latin-400-normal.woff2',
    '/fonts/inter-latin-700-normal.woff2',
  ];
  for (const a of assets) {
    const st = await statusOf(BASE + a);
    record(`8. asset ${a}`, st === 200, `status=${st}`);
  }
  // also list all woff2 via HTTP from CSS refs if possible
  const css = await (await fetch(BASE + '/styles.css')).text();
  const fontUrls = [...css.matchAll(/url\((['"]?)(\.?\/?fonts\/[^)'"]+\.woff2)\1\)/g)].map((m) => m[2]);
  const uniqueFonts = [...new Set(fontUrls.map((u) => new URL(u, BASE + '/styles.css').pathname))];
  let fontsOk = true;
  for (const fp of uniqueFonts) {
    const st = await statusOf(BASE + fp);
    if (st !== 200) {
      fontsOk = false;
      record(`8. font ${fp}`, false, `status=${st}`);
    }
  }
  if (uniqueFonts.length && fontsOk) {
    record(`8. all CSS-referenced fonts (${uniqueFonts.length})`, true, 'all 200');
  }

  checkDistNoBasePath();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // --- Check 1 browser ---
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const titleHome = await page.title();
  record('1b. browser open /', titleHome.includes('Gosejohann'), `title="${titleHome}"`);

  await collectBrokenAnchors(page, BASE + '/');

  // --- Check 2: footer Impressum ---
  await page.locator('footer a[href*="impressum"]').first().click();
  await page.waitForURL(/\/impressum\.html$/);
  const impressumUrl = page.url();
  const impressumStatus = await statusOf(impressumUrl);
  record(
    '2. footer Impressum → impressum.html',
    impressumUrl === `${BASE}/impressum.html` && impressumStatus === 200,
    `url=${impressumUrl} status=${impressumStatus}`
  );

  await collectBrokenAnchors(page, impressumUrl);

  // --- Check 3: Datenschutz (crosslink + footer) ---
  // crosslink in legal content
  await page.locator('.legal-nav-links a[href*="datenschutz"], a[href="./datenschutz.html"]').first().click();
  await page.waitForURL(/\/datenschutz\.html$/);
  const dsUrl1 = page.url();
  const dsSt1 = await statusOf(dsUrl1);
  record(
    '3a. Datenschutz crosslink',
    dsUrl1 === `${BASE}/datenschutz.html` && dsSt1 === 200,
    `url=${dsUrl1} status=${dsSt1}`
  );

  await collectBrokenAnchors(page, dsUrl1);

  // go back to impressum via footer then Datenschutz footer from impressum
  await page.locator('footer a[href*="impressum"]').first().click();
  await page.waitForURL(/\/impressum\.html$/);
  await page.locator('footer a[href*="datenschutz"]').first().click();
  await page.waitForURL(/\/datenschutz\.html$/);
  record('3b. footer Datenschutz', page.url() === `${BASE}/datenschutz.html`, `url=${page.url()}`);

  // from home footer Datenschutz
  await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.locator('footer a[href*="datenschutz"]').first().click();
  await page.waitForURL(/\/datenschutz\.html$/);
  record('3c. home footer Datenschutz', page.url() === `${BASE}/datenschutz.html`, `url=${page.url()}`);

  // --- Check 4: Logo / Zur Startseite ---
  await page.goto(BASE + '/impressum.html', { waitUntil: 'domcontentloaded' });
  await page.locator('a.logo[aria-label="Zur Startseite"]').click();
  await page.waitForURL(/\/index\.html$/);
  record('4a. logo → index.html', page.url() === `${BASE}/index.html`, `url=${page.url()}`);

  await page.goto(BASE + '/datenschutz.html', { waitUntil: 'domcontentloaded' });
  await page.locator('a.nav-cta:has-text("Zur Startseite")').click();
  await page.waitForURL(/\/index\.html$/);
  record('4b. Zur Startseite CTA → index.html', page.url() === `${BASE}/index.html`, `url=${page.url()}`);

  // --- Check 5: history back/forward ---
  await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.locator('footer a[href*="impressum"]').first().click();
  await page.waitForURL(/\/impressum\.html$/);
  await page.locator('footer a[href*="datenschutz"]').first().click();
  await page.waitForURL(/\/datenschutz\.html$/);

  await page.goBack();
  await page.waitForURL(/\/impressum\.html$/);
  const back1 = page.url() === `${BASE}/impressum.html`;
  await page.goBack();
  await page.waitForURL(/\/(index\.html)?$/);
  const back2 = /\/(index\.html)?$/.test(new URL(page.url()).pathname) || page.url() === `${BASE}/index.html` || page.url() === `${BASE}/`;
  await page.goForward();
  await page.waitForURL(/\/impressum\.html$/);
  const fwd1 = page.url() === `${BASE}/impressum.html`;
  await page.goForward();
  await page.waitForURL(/\/datenschutz\.html$/);
  const fwd2 = page.url() === `${BASE}/datenschutz.html`;
  record(
    '5. history Start ↔ Impressum ↔ Datenschutz',
    back1 && back2 && fwd1 && fwd2,
    `back1=${back1} back2=${back2}(${page.url()}→after) fwd1=${fwd1} fwd2=${fwd2}`
  );
  // re-read after forwards ended on datenschutz
  // detail above may be confusing; recompute final
  if (!(back1 && back2 && fwd1 && fwd2)) {
    // already recorded fail
  }

  // --- Check 6: nav hash scroll ---
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  async function scrollCheck(hash, sectionId) {
    const before = await page.evaluate(() => window.scrollY);
    await page.locator(`nav a.nav-link[href="${hash}"]`).first().click();
    await page.waitForTimeout(700);
    const after = await page.evaluate(() => window.scrollY);
    const near = await page.evaluate(({ sectionId }) => {
      const el = document.getElementById(sectionId);
      if (!el) return { ok: false, reason: 'missing section' };
      const nav = document.getElementById('navbar');
      const navH = nav ? nav.getBoundingClientRect().height : 0;
      const top = el.getBoundingClientRect().top;
      // section top should be near navbar bottom (within ~120px)
      return { ok: Math.abs(top - navH) < 120 || (top >= 0 && top < navH + 120), top, navH, scrollY: window.scrollY };
    }, { sectionId });
    const moved = after !== before || after > 50;
    record(
      `6. nav ${hash} scroll`,
      moved && near.ok,
      `scrollY ${before}→${after}, sectionTop=${near.top?.toFixed?.(1) ?? near.top}, navH=${near.navH}`
    );
  }

  await scrollCheck('#services', 'services');
  await scrollCheck('#contact', 'contact');
  await scrollCheck('#about', 'about');

  // --- Check 7: direct hash #contact ---
  await page.goto(BASE + '/index.html#contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const hashLand = await page.evaluate(() => {
    const el = document.getElementById('contact');
    const nav = document.getElementById('navbar');
    const navH = nav ? nav.getBoundingClientRect().height : 0;
    const top = el.getBoundingClientRect().top;
    return { top, navH, scrollY: window.scrollY, ok: Math.abs(top - navH) < 140 || (top >= -20 && top < navH + 140) };
  });
  record(
    '7. direct #contact lands near contact (nav offset)',
    hashLand.ok && hashLand.scrollY > 100,
    `top=${hashLand.top.toFixed(1)} navH=${hashLand.navH} scrollY=${hashLand.scrollY}`
  );

  // --- Check 9: impressum shows owner contact openly ---
  await page.goto(BASE + '/impressum.html', { waitUntil: 'networkidle' });
  const hasEmail = await page.locator('a[href^="mailto:info@fahrzeugbau-m-gosejohann.com"]').count();
  const hasGate = await page.locator('[data-contact-gate]').count();
  record(
    '9. impressum shows owner contact openly',
    hasEmail > 0 && hasGate === 0,
    `mailto=${hasEmail} gates=${hasGate}`
  );

  // Extra: ensure no runtime navigation to /M.Gosejohann/
  const htmlSniff = await page.content();
  record(
    '10b. live impressum HTML no /M.Gosejohann/',
    !htmlSniff.includes('/M.Gosejohann/'),
    htmlSniff.includes('/M.Gosejohann/') ? 'FOUND in live HTML' : 'absent'
  );

  await browser.close();

  console.log('\n=== Broken internal links ===');
  if (!brokenLinks.length) {
    console.log('(none)');
  } else {
    for (const b of brokenLinks) {
      console.log(JSON.stringify(b));
    }
  }

  const failed = results.filter((r) => !r.pass);
  console.log(`\n=== Summary: ${results.length - failed.length}/${results.length} passed ===`);
  if (failed.length) {
    console.log('Failed:');
    for (const f of failed) console.log(`  - ${f.id}: ${f.detail}`);
    process.exitCode = 1;
  }

  // machine-readable dump for parent
  fs.writeFileSync(
    path.join(ROOT, 'scripts', 'retest-routing-results.json'),
    JSON.stringify({ results, brokenLinks, failed: failed.map((f) => f.id) }, null, 2)
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

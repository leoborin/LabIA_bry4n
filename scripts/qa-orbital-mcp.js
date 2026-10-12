async (page) => {
  // Playwright MCP; real local build, no network mocks.
  const origin = 'http://127.0.0.1:8080';
  const results = [];
  const check = (condition, name) => {
    if (!condition) throw new Error(name);
    results.push({ name, passed: true });
  };
  let context;
  try {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${origin}/labs`);
    await page.getByRole('button', { name: 'Explorar Development', exact: true }).click();
    await page.waitForTimeout(850);
    check(await page.locator('.orbital-timeline').getAttribute('data-motion') === 'paused' && await page.locator('.animate-pulse').first().evaluate(e => getComputedStyle(e).animationPlayState === 'running'), 'Seleção para órbita e preserva pulsos do exemplo');
    await page.getByRole('button', { name: 'Pausar animação', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.orbital-timeline')?.getAttribute('data-effects') === 'paused');
    check(await page.locator('.animate-pulse').first().evaluate(e => getComputedStyle(e).animationPlayState === 'paused'), 'Pausa interrompe também as animações CSS');
    await page.getByRole('button', { name: 'Retomar animação', exact: true }).click();
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('.orbital-timeline')?.getAttribute('data-effects') === 'paused');
    check(await page.locator('.animate-pulse').first().evaluate(e => getComputedStyle(e).animationPlayState === 'paused'), 'Cena fora da viewport interrompe efeitos');

    const browser = page.context().browser();
    context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'no-preference' });
    const mobile = await context.newPage();
    await mobile.goto(`${origin}/labs`);
    await mobile.locator('.orbital-timeline').scrollIntoViewIfNeeded();
    const box = await mobile.getByRole('button', { name: 'Explorar Development', exact: true }).boundingBox();
    await mobile.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await mobile.getByRole('region', { name: 'Detalhes de Development', exact: true }).waitFor();
    check(await mobile.locator('.orbital-card').isVisible(), 'Toque abre nó com movimento normal');
    await mobile.waitForTimeout(850);
    await mobile.locator('.orbital-card').getByRole('button', { name: 'Design', exact: true }).tap();
    await mobile.getByRole('region', { name: 'Detalhes de Design', exact: true }).waitFor();
    check(await mobile.locator('.orbital-card').textContent().then(text => text.includes('90%')), 'Toque navega entre nós conectados');
    await mobile.waitForTimeout(850);
    check(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Contexto com toque não tem overflow');
    await mobile.screenshot({ path: 'docs/design/previews/orbital-touch-mobile.png' });
    return { results, total: results.length, browser: browser.version(), touch: true, networkMocks: false };
  } finally {
    await context?.close();
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  }
}

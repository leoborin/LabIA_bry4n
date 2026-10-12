async (page) => {
  // Executar pelo Playwright MCP: browser_run_code_unsafe({ filename: 'scripts/qa-web-mcp.js' }).
  // Usar o servidor local compilado na porta 8080. Mocks são exclusivos do navegador de QA.
  const origin = 'http://127.0.0.1:8080';
  const results = [];
  const check = (value, name) => { if (!value) throw new Error(name); results.push({ name, passed: true }); };
  const errors = [];
  const onError = error => errors.push(error.message);
  page.on('pageerror', onError);
  try {
  await page.unrouteAll({ behavior: 'wait' });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${origin}/labs`);
  await page.locator('.lab-row').first().waitFor({ timeout: 5000 });
  await page.waitForTimeout(300);
  check(await page.locator('.lab-row').count() === 7, 'Sete slugs retornados pela API real');
  await page.getByRole('button', { name: 'Dados', exact: true }).click();
  check(await page.locator('.lab-row').count() === 1, 'Filtro por categoria');
  await page.getByRole('textbox', { name: 'Filtrar por nome, assunto ou tecnologia' }).fill('nenhum-termo-xyz');
  check(await page.getByText('Nenhuma pergunta por aqui.').isVisible(), 'Vazio de busca e recuperação');
  await page.getByRole('button', { name: 'Limpar filtros', exact: true }).click();
  await page.locator('.lab-row').nth(4).focus();
  await page.getByRole('heading', { name: 'Como fazer um agente responder com evidência e saber quando se abster?' }).waitFor({ timeout: 2000 });
  check(await page.locator('.lab-row.inspected').textContent().then(text => text.includes('rag-agents')), 'Preview sincronizado com foco por teclado');
  await page.keyboard.press('Enter');
  await page.getByRole('heading', { name: 'Respostas com fundamento.', exact: true }).waitFor({ timeout: 2000 });
  await page.waitForTimeout(250);
  check(await page.evaluate(() => document.activeElement?.tagName === 'H1'), 'Foco no título após navegação');
  await page.getByRole('button', { name: 'Buscar páginas e laboratórios', exact: true }).click();
  await page.keyboard.press('Shift+Tab');
  check(await page.getByRole('dialog').evaluate(dialog => dialog.contains(document.activeElement)), 'Foco permanece no diálogo');
  await page.keyboard.press('Escape');
  check(await page.evaluate(() => document.activeElement?.getAttribute('aria-label') === 'Buscar páginas e laboratórios'), 'Escape restaura foco ao disparador');
  await page.keyboard.press('Control+k');
  await page.getByRole('textbox', { name: 'Buscar páginas e laboratórios', exact: true }).fill('Operação');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.getByText('A API respondeu.', { exact: true }).waitFor({ timeout: 2000 });
  check(await page.locator('.health-facts').textContent().then(text => text.includes('labia-api')), 'Ctrl+K, setas, Enter e health real');

  await page.route('**/v1/labs', route => route.fulfill({ status: 503, contentType: 'application/json', body: '{}' }));
  await page.goto(`${origin}/labs`);
  await page.getByRole('alert').waitFor({ timeout: 3000 });
  check(await page.getByRole('button', { name: 'Consultar novamente' }).isVisible(), 'Erro 503 com retry acessível');
  await page.unroute('**/v1/labs');
  await page.getByRole('button', { name: 'Consultar novamente' }).click();
  await page.locator('.lab-row').first().waitFor({ timeout: 3000 });
  check(await page.locator('.lab-row').count() === 7, 'Retry recupera catálogo real');

  await page.route('**/v1/labs', route => route.fulfill({ status: 403, contentType: 'application/json', body: '{}' }));
  await page.goto(`${origin}/labs`);
  await page.getByText('Acesso não autorizado.').waitFor({ timeout: 3000 });
  check(await page.locator('.lab-row').count() === 0, 'Permissão negada não expõe conteúdo');
  await page.unroute('**/v1/labs');

  await page.route('**/v1/labs', async route => { await new Promise(resolve => setTimeout(resolve, 1200)); await route.continue().catch(() => {}); });
  await page.goto(`${origin}/labs`);
  check(await page.getByRole('status', { name: 'Carregando catálogo' }).isVisible(), 'Loading estável antes da resposta');
  await page.locator('.lab-row').first().waitFor({ timeout: 4000 });
  await page.unroute('**/v1/labs');

  await page.route('**/v1/labs', async route => { await new Promise(resolve => setTimeout(resolve, 8500)); await route.continue().catch(() => {}); });
  await page.goto(`${origin}/labs`);
  await page.getByText('A API levou mais de 8 segundos para responder.', { exact: false }).waitFor({ timeout: 10000 });
  check(await page.getByRole('alert').isVisible(), 'Timeout de 8 segundos informa recuperação');
  await page.unrouteAll({ behavior: 'wait' });

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${origin}/labs`);
  await page.locator('.lab-row').first().waitFor({ timeout: 3000 });
  await page.getByRole('button', { name: 'Abrir as camadas', exact: true }).click();
  check(await page.getByRole('button', { name: 'Reunir as camadas', exact: true }).getAttribute('aria-pressed') === 'true', 'Camadas respondem ao clique com movimento reduzido');
  check(await page.locator('.deck-stage').evaluate(element => ['none', ''].includes(getComputedStyle(element).transform)), 'Parallax removido em reduced-motion');
  await page.getByRole('slider', { name: 'Abertura das camadas' }).focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  check(await page.getByRole('slider', { name: 'Abertura das camadas' }).inputValue() === '1', 'Camadas ajustáveis por teclado');
  await page.keyboard.press('Home');
  const deckBounds = await page.locator('.deck-stage').boundingBox();
  await page.mouse.move(deckBounds.x + deckBounds.width * .45, deckBounds.y + deckBounds.height * .5);
  await page.mouse.down();
  await page.mouse.move(deckBounds.x + deckBounds.width * .85, deckBounds.y + deckBounds.height * .5, { steps: 10 });
  await page.mouse.up();
  check(Number(await page.getByRole('slider', { name: 'Abertura das camadas' }).inputValue()) > 50, 'Arrastar abre as camadas');
  await page.locator('.method-step').nth(1).click();
  check(await page.locator('#method-1').getAttribute('aria-hidden') === 'false', 'Expansão funciona sem movimento');

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${origin}/labs`);
    await page.locator('.lab-row').first().waitFor({ timeout: 3000 });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Sem overflow em ${width}px`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}/labs`);
  await page.getByRole('button', { name: 'Abrir navegação' }).click();
  await page.getByRole('link', { name: 'Arquitetura', exact: true }).click();
  await page.getByRole('button', { name: 'Workers Python · Cloud Run Jobs' }).click();
  check(await page.locator('#node-description').textContent().then(text => text.includes('Nenhum worker')), 'Mobile: menu e seleção de arquitetura');
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Arquitetura mobile sem overflow');
  await page.screenshot({ path: 'docs/design/previews/architecture-mobile.png', fullPage: true });
  await page.goto(`${origin}/runs/exemplo`);
  check(await page.getByText('O fluxo de runs ainda não está disponível.', { exact: false }).isVisible(), 'Runs não implementados com estado honesto');
  await page.goto(`${origin}/caminho-inexistente`);
  check(await page.getByRole('heading', { name: 'Uma outra direção.' }).isVisible(), '404 da SPA');

  for (const viewport of [{ width: 1440, height: 1000, name: 'catalog-desktop' }, { width: 390, height: 844, name: 'catalog-mobile' }]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${origin}/labs`);
    await page.locator('.lab-row').first().waitFor({ timeout: 3000 });
    await page.screenshot({ path: `docs/design/previews/${viewport.name}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.keyboard.press('Control+k');
  await page.getByRole('dialog').waitFor();
  await page.screenshot({ path: 'docs/design/previews/command-palette.png' });
  await page.keyboard.press('Escape');
  check(errors.length === 0, 'Sem exceções JavaScript');
  return { results, total: results.length, errors, mockScope: 'Somente requests da página de QA; removidos ao terminar.' };
  } finally {
    await page.unrouteAll({ behavior: 'wait' });
    page.off('pageerror', onError);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  }
}

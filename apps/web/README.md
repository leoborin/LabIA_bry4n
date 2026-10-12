# Console web

**Estado:** primeira casca implementada e verificada localmente. React/TypeScript/Vite com catálogo real da API Go, planos de laboratórios, arquitetura e consulta de saúde. Autenticação, runs e resultados permanecem pendentes.

## Padrão de novas páginas

Ler [AGENTS.md](AGENTS.md) e o [guia visual](../../docs/design/README.md) antes de evoluir a interface. O guia salva referências, capturas, tokens, composição, motion e critérios de interação. A decisão de stack e hospedagem está no [ADR 0002](../../docs/adr/0002-primeira-casca-frontend-e-container-unico.md).

- `src/pages/`: catálogo, plano de laboratório, arquitetura, operação e estados de indisponibilidade/404.
- `src/components/`: primitives, busca nativa, SVGs e camadas do hero.
- `src/api/`: cliente validado, timeout/abort, estado de consulta e dados compartilhados.
- `src/styles.css`: tokens, layout e componentes; `src/evidence-deck.css`: composição 3D da abertura.
- `public/`: favicon autoral; fonte Manrope local entra pelo build.

## Executar e verificar

Na raiz do repositório:

```powershell
npm --prefix apps/web ci --no-audit --no-fund
npm --prefix apps/web run build
npm --prefix apps/web run format:check
go -C services/api-go run ./cmd/api
```

Abrir `http://127.0.0.1:8080/labs`. Versões efetivamente verificadas e resultados em [evidências](../../docs/evidence/2026-10-11-primeira-casca-web.md). O build verifica TypeScript e pré-comprime JS/CSS/HTML para o Go servir com gzip. `npm run dev` inicia o Vite em 5173 e usa proxy para a API em 8080.

Para QA via Playwright MCP, usar `scripts/qa-web-mcp.js`, conforme o [runbook](../../docs/runbooks/primeira-casca-cloud-run.md). As referências foram consultadas pelo 21st.dev MCP e pelo navegador; o último acesso MCP ao CardStack exigiu autenticação, e sua prévia pública foi inspecionada sem copiar código ou fotos.

## Escopo verificado

- [x] Catálogo público, filtros, busca e vazio com recuperação: `/labs`.
- [x] Detalhe do plano, slugs preservados e estado planejado: `/labs/:slug`.
- [x] Arquitetura e consulta real do processo HTTP: `/architecture`, `/operations`.
- [x] Camadas 3D, botão, arraste, range, foco por teclado e alternativa de movimento reduzido.
- [x] Loading, erro, timeout, permissão negada, retry, 404 e layouts de 320/390/768/1440 px.
- [x] Dependências fixadas, lockfile real e build de produção executado.
- [ ] Login OIDC, sessão e autorização.
- [ ] Criação/acompanhamento de run e resultado com backend persistente.
- [ ] Telemetria, métricas de experimentos e comparação de resultados.
- [ ] Publicação e smoke test da URL Cloud Run.

`/runs/:id` e `/runs/:id/results` explicam a indisponibilidade. Não há execução simulada, métricas fictícias ou armazenamento de dados de usuário nesta versão.

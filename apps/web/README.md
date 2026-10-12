# Console web

**Estado:** primeira casca implementada e verificada localmente. React/TypeScript/Vite com catálogo real da API Go, planos de laboratórios, arquitetura e consulta de saúde. Autenticação, runs e resultados permanecem pendentes.

Identidade: **LabAI bry4n**, com bry4n em laranja e abertura explicando o objetivo do laboratório. Nome do pacote: `@labai-bry4n/web`; marca compartilhada em `Brand`/`BrandName`. [ADR 0004](../../docs/adr/0004-identidade-labai-bry4n-e-proposito.md) e [evidência de identidade](../../docs/evidence/2026-10-12-identidade-labai-bry4n.md).

## Padrão de novas páginas

Ler [AGENTS.md](AGENTS.md) e o [guia visual](../../docs/design/README.md) antes de evoluir a interface. O guia salva referências, capturas, tokens, composição, motion e critérios de interação. A decisão de stack e hospedagem está no [ADR 0002](../../docs/adr/0002-primeira-casca-frontend-e-container-unico.md).

- `src/pages/`: catálogo, plano de laboratório, arquitetura, operação e estados de indisponibilidade/404.
- `src/components/`: primitives, busca nativa, SVGs e `portfolio-orbit.tsx`, adaptador dos sete projetos; `src/components/ui/`: timeline orbital e dependências shadcn fornecidas pelo usuário.
- `src/api/`: cliente validado, timeout/abort, estado de consulta e dados compartilhados.
- `src/styles.css`: tokens, layout e componentes; `src/globals.css`: Tailwind, integração de tokens shadcn e ajustes da timeline.
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

Para QA via Playwright MCP, usar `scripts/qa-web-mcp.js`, conforme o [runbook](../../docs/runbooks/primeira-casca-cloud-run.md). `scripts/qa-orbital-mcp.js` verifica pulsos, pausa e interação em contexto com toque. A integração da timeline fornecida, suas dependências e os ajustes verificados estão na [evidência de 12/10](../../docs/evidence/2026-10-12-timeline-orbital.md).

## Componentes shadcn e Tailwind

O projeto já usa TypeScript. Tailwind 4.3.3 e seu plugin Vite foram instalados e fixados no lockfile. `components.json` configura `@/components/ui`, que resolve para **`apps/web/src/components/ui/`**, e `@/lib/utils`, que resolve para `src/lib/utils.ts`. Este caminho mantém os imports do componente recebido e a descoberta pelo shadcn sem duplicar a aplicação em um `/components` na raiz do monorepo. `src/components/ui.tsx` continua contendo os primitives anteriores; arquivo e diretório podem coexistir.

`badge.tsx`, `button.tsx` e `card.tsx` contêm as dependências copiadas do pedido. `cn` usa `clsx` e `tailwind-merge`. O alias `@` está configurado no TypeScript e no Vite; não é necessário criar outro projeto ou executar `shadcn init` sobre esta configuração. Novos componentes devem seguir a [instalação oficial para Vite](https://ui.shadcn.com/docs/installation/vite), usando os aliases existentes e revisando o código antes de substituir arquivos.

O Tailwind importa theme e utilities, sem Preflight, porque a aplicação já tem reset próprio. Essa [forma documentada de integração](https://tailwindcss.com/docs/preflight#disabling-preflight) preserva as telas existentes. As classes de pulse, ping, escala, opacidade e gradientes já são geradas pelo Tailwind; não duplicar as definições globais do exemplo, que podem conflitar com seus transforms.

`RadialOrbitalTimeline` recebe `timelineData: TimelineItem[]` e `className` opcional; não exige provider adicional, imagens ou estado global. Ícone, conteúdo, status e IDs relacionados continuam disponíveis; data e energia são opcionais. Label curto, slug, tags, texto de status e rota permitem usar a mesma interação como portfólio.

A abertura usa `PortfolioOrbit`, com sete temas: Eventos, Dados, Crédito, Documentos, Agentes, Jev e Confiabilidade. Nomes, resumos e tags vêm do mesmo catálogo Go usado pela lista. Os cards mostram o estado planejado do contrato e linkam para `/labs/:slug`; as relações são editoriais, sem representar dependências em execução. Não há datas ou percentuais inventados. `demo.tsx` preserva o exemplo original isolado, sem entrar no bundle da abertura.

Loading e indisponibilidade têm apresentação própria; permissão negada remove os nós. Em refresh com dados anteriores, a legenda identifica o último catálogo disponível. A [evidência do portfólio](../../docs/evidence/2026-10-12-portfolio-orbital.md) registra a validação atual.

## Escopo verificado

- [x] Catálogo público, filtros, busca e vazio com recuperação: `/labs`.
- [x] Detalhe do plano, slugs preservados e estado planejado: `/labs/:slug`.
- [x] Arquitetura e consulta real do processo HTTP: `/architecture`, `/operations`.
- [x] Timeline orbital fornecida: rotação, cards, relações, pausa, teclado e movimento reduzido.
- [x] Loading, erro, timeout, permissão negada, retry, 404 e layouts de 320/390/768/1440 px.
- [x] Dependências fixadas, lockfile real e build de produção executado.
- [ ] Login OIDC, sessão e autorização.
- [ ] Criação/acompanhamento de run e resultado com backend persistente.
- [ ] Telemetria, métricas de experimentos e comparação de resultados.
- [ ] Publicação e smoke test da URL Cloud Run.

`/runs/:id` e `/runs/:id/results` explicam a indisponibilidade. A órbita apresenta propostas do portfólio; o estado Planejado não implica implementação concluída. Não há métricas de experimentos ou armazenamento de dados de usuário nesta versão.

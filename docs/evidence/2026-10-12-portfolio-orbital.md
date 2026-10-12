# Portfólio orbital — temas reais do LabIA

## Pedido e decisão

O responsável aprovou a interação orbital e pediu usar os temas do projeto como portfólio. A abertura agora apresenta Eventos, Dados, Crédito, Documentos, Agentes, Jev e Confiabilidade. O [ADR 0003](../adr/0003-timeline-orbital-e-tailwind.md) e o [guia visual](../design/README.md) registram o padrão atualizado.

`PortfolioOrbit` adapta os dados do catálogo Go para a interação já aprovada. Nomes completos, slugs, resumos e tags vêm da API. Labels curtos e relações editoriais ficam no adaptador. Cards mostram Planejado, categoria, resumo, temas/ferramentas, projetos relacionados e link para `/labs/:slug`. Datas e energia da demo não aparecem. A demo original permanece isolada.

A abertura recebeu texto de portfólio e ação Explorar projetos. A cena e as animações foram preservadas. Loading/indisponibilidade não mostram nós fictícios; permissão negada remove os nós e dados anteriores são identificados em refresh. Conteúdo e controles foram ajustados para caberem no mobile.

## Ambiente e revisão

- Data: `2026-10-12`, fuso `America/Sao_Paulo`.
- Commit base: `4478b2c934c3aa239362def8b8565e6924bd5fb1`.
- Revisão de implementação: a registrar após criar o commit.
- Windows/PowerShell; Node `22.21.0`, npm `10.9.4`, React `19.3.0`, TypeScript `7.0.2`, Vite `8.3.4`, Tailwind `4.3.3`.
- Chromium `154.0.8037.58` via Playwright MCP; build servido pelo Go em `http://127.0.0.1:8080/labs`.
- Dependências, lockfile, API e contratos não foram alterados nesta entrega; versões instaladas conforme a [evidência anterior](2026-10-12-timeline-orbital.md).

## Verificação executada

```powershell
npm --prefix apps/web run build
npm --prefix apps/web run format:check
```

Build TypeScript/Vite e formatação passaram com código zero. JavaScript `472,64 kB` / gzip `151,21 kB`; CSS `49,93 kB` / gzip `10,34 kB`. A meta de JS comprimido abaixo de 180 KiB continua atendida. O aviso de chunk bruto acima de 350 kB permanece; não é falha do build.

```text
browser_run_code_unsafe({filename: "scripts/qa-web-mcp.js"})
browser_run_code_unsafe({filename: "scripts/qa-orbital-mcp.js"})
```

**61 verificações gerais passaram, zero exceções JavaScript.** Incluem sete temas da API, ausência de métricas fictícias, teclado, troca de projetos relacionados, Escape/foco, link para a página real, movimento reduzido, pausa/retomada, loading, 403, 503/retry, timeout, navegação, catálogo/busca, arquitetura, 404 e runs indisponíveis.

Os **sete cards foram conferidos em 320/390/768/1440 px**: 28 combinações com card inteiro e sem cobrir os controles da cena, além de ausência de overflow da página. Fonte local foi carregada antes das medições. As descrições reais exigiram padding mais compacto e deslocamento da seleção em cenas estreitas.

**Seis verificações adicionais passaram:** órbita para ao selecionar enquanto pulsos continuam; pausa interrompe CSS; efeitos param fora da viewport; contexto mobile com `hasTouch: true`, `isMobile: true` e movimento normal abre Agentes e navega para Documentos por toque sem overflow. O script aguarda catálogo/fonte/entrada antes de medir coordenadas de toque, evitando capturar o layout provisório.

Capturas próprias atualizadas no guia visual. Mocks de erros existem apenas no navegador de QA e são removidos ao terminar; o teste por toque usa API real sem mocks.

Revisão documental: oito arquivos Markdown em UTF-8, 42 links locais válidos e fences consistentes. `git diff --check` passou. Arquivos preparados para Git foram revisados; prints locais permaneceram fora do stage.

## Limitações

Os sete projetos continuam planejados; não houve execução, treinamento ou persistência. Relações são editoriais e não comprovam integração entre laboratórios. Métricas de experimentos e custo cloud: `null`. Lighthouse, FPS e auditoria WCAG completa não foram executados.

Deploy e build de container: `not_run`; destino e orçamento de Cloud Run permanecem pendentes. Nenhuma infraestrutura paga foi criada. Prints de VM e ferramentas locais permanecem fora do commit.

# Integração do Radial Orbital Timeline fornecido

## Problema, decisão e escopo

O responsável solicitou integrar o componente completo que forneceu, após rejeitar as reinterpretações da abertura. Código de base: [Radial Orbital Timeline — jatin-yadav05 / 21st.dev](https://21st.dev/@jatin-yadav05/components/radial-orbital-timeline), demo e primitives badge/button/card recebidos no pedido. Decisão no [ADR 0003](../adr/0003-timeline-orbital-e-tailwind.md).

Integrados cena preta, núcleo com gradiente/pulsos, órbita em rotação, cinco nós originais, seleção com card, status, energia e relações. A demo é identificada como dados de exemplo. O catálogo real com sete slugs, navegação, API e demais páginas foram preservados. As camadas anteriores e a alternativa de mapa/shader foram removidas da abertura.

## Ambiente e revisão

- Data: `2026-10-12`, fuso `America/Sao_Paulo`.
- Ambiente: Windows/PowerShell, Node `22.21.0`, npm `10.9.4`, build Vite servido pelo processo Go em `http://127.0.0.1:8080`.
- Commit base: `674ef52da5bd58520b564554d2daad958d2a02eb`.
- A revisão de implementação será registrada após criar o commit; não foi publicado em Cloud Run.
- QA: Chromium `154.0.8037.58` via Playwright MCP, usando API real e mocks temporários apenas para estados de falha.

| Dependência | Versão verificada |
|---|---|
| React / React DOM | 19.3.0 |
| TypeScript | 7.0.2 |
| Vite | 8.3.4 |
| Tailwind / @tailwindcss/vite | 4.3.3 |
| class-variance-authority | 0.7.1 |
| @radix-ui/react-slot | 1.5.0 |
| clsx | 2.1.1 |
| tailwind-merge | 3.7.0 |
| @types/node | 22.20.5 |
| Lucide React | 1.55.0 |
| Motion | 14.1.0 |

## Comandos e resultados

Na raiz do repositório:

```powershell
npm --prefix apps/web ci --no-audit --no-fund
npm --prefix apps/web run build
npm --prefix apps/web run format:check
```

Instalação pelo lockfile passou: 60 pacotes instalados. Build TypeScript/Vite e formatação passaram com código zero. Licenças de 21 dependências de runtime foram incluídas, além dos avisos estáticos de Go, shadcn e timeline. A página de origem identifica a timeline como MIT; os avisos e atribuição ficam em `apps/web/public/licenses/` e no código.

Playwright MCP:

```text
browser_run_code_unsafe({filename: "scripts/qa-web-mcp.js"})
```

**36 verificações passaram, zero exceções JavaScript.** Cobertura: rotação normal, pausa/retomada, cinco nós da demo, Enter/Space, card com status/energia originais, Connected Nodes, Escape com retorno de foco, movimento reduzido sem rotação/pulsos, catálogo/filtro/vazio, preview por foco, navegação, busca/diálogo/Tab/Ctrl+K/setas/Enter, health real, loading, 503/retry, 403, timeout de 8 s, método expansível, navegação mobile, arquitetura, runs indisponíveis e 404.

Layouts de **320, 390, 768 e 1440 px** passaram sem overflow. O card expandido foi medido dentro dos limites da cena em cada largura. Capturas atuais em [docs/design/previews](../design/README.md). Os mocks não alteram o servidor e são removidos no `finally` do script. Erros HTTP dos cenários 403/503 são esperados; não são exceções de código.

Verificação adicional via `browser_run_code_unsafe({filename: "scripts/qa-orbital-mcp.js"})`: **seis verificações passaram**. A seleção para a órbita e mantém os pulsos originais; o controle pausa também as animações CSS; efeitos param fora da viewport. Em um contexto Chromium com `hasTouch: true`, `isMobile: true` e movimento normal, toque abriu Development e navegou para Design sem overflow. A captura mobile por toque foi salva no guia visual. Nenhum mock foi usado nessa verificação.

## Ajustes necessários encontrados na integração

- Ref sem retornar atribuição, timer com tipo de navegador e atualizadores puros compatíveis com React 19/StrictMode.
- Nós com botão semântico e foco visível; seleção de nó conectado transfere foco ao novo nó, evitando perdê-lo quando o botão anterior sai do DOM.
- Pausa explícita; timer e efeitos param com movimento reduzido. Timer também depende de visibilidade/foco/ponteiro e desmonta com cleanup.
- Raio, largura do card e deslocamento vertical ajustados ao espaço disponível, evitando cortar o detalhe no mobile.
- Tailwind importa theme/utilities sem Preflight, preservando o reset existente. Ajustes locais de bordas/margem evitam diferenças de estilos nativos no componente recebido.
- A pausa de CSS ganhou precedência sobre o shorthand `animation` das utilities Tailwind, para interromper pulsos de verdade; o cenário foi conferido por estilo computado no navegador.
- `components.json`, aliases `@` e `cn` tornam o caminho `apps/web/src/components/ui/` compatível com os imports do pedido. Nenhuma imagem ou provider adicional foi necessário.

## Performance e limitações

Build final: JavaScript `471,08 kB`, gzip `150,66 kB`; CSS `48,67 kB`, gzip `10,10 kB`; fonte local `24,83 kB`. JS comprimido permanece abaixo da meta de 180 KiB. O Vite avisa que o chunk bruto excede o limiar de 350 kB; build passou. Não foram medidos Lighthouse, FPS, consumo GPU ou latência cloud.

A órbita é HTML/CSS/JS com perspectiva e opacidade; não é modelagem geométrica 3D. A cena mantém os cinco itens e percentuais fornecidos para demonstrar interação. Laboratórios executados: nenhum; métricas reais: `null`. Não foi simulada execução de negócio nem adicionada persistência.

Deploy, build de container e custo cloud: `not_run`, `not_run` e `null`. Não houve provisionamento pago. Publicação continua pendente de projeto e orçamento autorizados, conforme o [AGENTS.md](../../AGENTS.md) e o [runbook](../runbooks/primeira-casca-cloud-run.md). Validação em outros engines e auditoria WCAG completa não foram executadas.

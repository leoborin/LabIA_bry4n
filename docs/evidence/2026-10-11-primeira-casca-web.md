# Primeira casca do LabIA — implementação e verificação

## Problema, decisão e escopo

O responsável pediu uma casca inicial publicada em Cloud Run, com frontend limpo, interações refinadas, referências Apple/Linear/Vercel, uso de 21st.dev e Playwright MCP e preservação do padrão para novas páginas. Em 12/10, pediu mais impacto na abertura, com uma animação HTML/CSS/JS que evitasse a aparência comum de interfaces de IA.

Preservamos React/TypeScript/Vite e implementamos uma API Go somente de leitura, em um container preparado para Cloud Run. O [ADR 0001](../adr/0001-cloud-run-para-demo-sob-demanda.md) salva a escolha da plataforma; o [ADR 0002](../adr/0002-primeira-casca-frontend-e-container-unico.md) delimita o incremento sem banco/workers. O [guia visual](../design/README.md) registra referências, capturas próprias, tokens e motion; `apps/web/AGENTS.md` orienta novas páginas.

Disponível localmente: catálogo dos sete slugs com filtro/busca, plano do laboratório, arquitetura, consulta real de saúde, paleta por teclado, estados de indisponibilidade e hero de camadas. Nenhum experimento, run, treinamento ou integração de IA foi executado. Não foi implementada persistência de negócio.

## Ambiente, data e revisão

- Trabalho iniciado em `2026-10-11`; última validação da casca em `2026-10-12`, fuso `America/Sao_Paulo`.
- Commit base: `f079ecaec4968153861a3935c65d6105b23311cf`.
- Sistema: Windows/PowerShell; testes de navegador no Chromium `154.0.8037.58` via Playwright MCP.
- SDK Go portátil mantido em `.tools`, fora do Git; arquivo oficial verificado por SHA-256 `1314008898bd40df77af4b014f777f08873dbdfbcd3d92308728ee03304fe04f`.
- Revisão de implementação: [`ac3e08544e05aea6329042b9dd3299ab30c9eb5d`](https://github.com/leoborin/LabIA_bry4n/commit/ac3e08544e05aea6329042b9dd3299ab30c9eb5d), criada após revisão de 64 arquivos de código, configuração, documentação e capturas. Este registro posterior acrescenta o hash real da revisão verificada. Push será conferido separadamente; deploy segue pendente.

| Ferramenta/dependência | Versão efetivamente usada |
|---|---|
| Node / npm | `22.21.0` / `10.9.4` |
| Go | `1.27.2` |
| React / React DOM | `19.3.0` |
| React Router | `7.18.4` |
| TypeScript / Vite | `7.0.2` / `8.3.4` |
| Plugin React Vite | `6.1.2` |
| Motion / Lucide React | `14.1.0` / `1.55.0` |
| Manrope Variable / Prettier | `5.3.0` / `3.9.10` |

`package-lock.json` foi gerado por instalação real e usado por `npm ci`. Go usa a biblioteca padrão; não há lockfile vazio. Os digests das bases Node e Go no Dockerfile foram consultados no Docker Hub; essa consulta não comprova build do container.

## Referências e origem do visual

Apple, Linear e Vercel foram abertos na web e em Playwright. Capturas de benchmark ficaram localmente em `.tools/visual-benchmark/`. Project Index, de ssychui, foi encontrado e recuperado pelo 21st.dev MCP na etapa inicial; sua relação entre lista e preview orientou o catálogo autoral.

Para o novo hero, o 21st.dev MCP retornou `Authentication required`. Não foi obtido código pelo MCP nessa tentativa. A [prévia pública do CardStack de Ruixen](https://21st.dev/@ruixen.ui/components/card-stack) foi consultada na web e inspecionada com Playwright, inclusive a composição em camadas. A implementação própria usa folhas tipográficas do método LabIA, HTML/CSS 3D e Motion/JS existentes; não incorpora fotos, template, dependência Next.js ou autoplay contínuo.

As [capturas finais](../design/README.md) são do LabIA e podem ser reutilizadas como referência no Git. O componente responde por botão, arraste, range, teclado e toque; o primeiro gesto interrompe a entrada. Movimento reduzido mantém a seleção e remove parallax/transições de posição.

## Comandos e resultados

Comandos abaixo foram executados, usando o SDK portátil para Go nesta máquina. `go` no PATH é a forma equivalente do runbook.

```text
npm --prefix apps/web ci --no-audit --no-fund
npm --prefix apps/web run build
npm --prefix apps/web run format:check
go -C services/api-go test ./...
go -C services/api-go vet ./...
go -C services/api-go run ./cmd/api
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go -C services/api-go build -buildvcs=false -trimpath -ldflags="-s -w" -o <diretorio-local-ignorado>/labia-linux-amd64 ./cmd/api
gcloud help meta list-files-for-upload
gcloud meta list-files-for-upload . --quiet
```

A notação de variáveis da compilação acima resume o ambiente do processo; no Windows foram definidas separadamente em PowerShell. A compilação Linux não foi apresentada como execução de container. `-buildvcs=false` evita stamp Git em um build cuja origem não inclui `.git`; a revisão é registrada na evidência/publicação.

| Verificação | Resultado observado |
|---|---|
| Instalação pelo lockfile | `npm ci` concluiu, instalando 36 pacotes. |
| TypeScript/Vite/gzip | Build de produção concluído com código 0. |
| Formatação | Prettier conferiu todos os arquivos de frontend selecionados. |
| API Go | `go test ./...` e `go vet ./...` passaram. |
| Contrato HTTP | Sete slugs únicos, `planned`, disponibilidade falsa rejeitada; rotas/caches/headers/gzip e recusa de qualidade zero verificados. |
| Linux/amd64 | Binário estático compilado com código 0, incluindo o encerramento gracioso implementado. |
| Integração local | Go serviu build, deep links, catálogo e health na porta 8080; navegador consultou API real. |
| Playwright MCP | `browser_run_code_unsafe({filename: "scripts/qa-web-mcp.js"})`: 27 verificações passaram, zero exceções JavaScript. |
| Toque | Contexto mobile Chromium com `hasTouch: true`: toque abriu camadas, sem overflow. |
| Movimento normal | Inspecionados entrada, mudança de abertura e parallax por ponteiro; spring retornou à posição de repouso. |
| Fonte e rede | Fonte Manrope local carregou; respostas negociaram gzip e `Vary: Accept-Encoding`; CSP presente. |
| Upload cloud | Allowlist de `.gcloudignore` conferida: apenas fonte web/API e arquivos de container, sem ferramentas, estudos, prints, credenciais, build ou `node_modules`. |
| Distribuição de dependências | Build incluiu os avisos de licença de 16 dependências de runtime e o aviso do Go em `/licenses/`. |

Conferência documental: 20 arquivos Markdown alterados/novos, 72 links locais válidos, UTF-8 e fences consistentes. `git diff --check` passou; busca de padrões de chaves privadas/tokens no escopo não encontrou correspondências. Código, configuração, documentos e capturas foram revisados antes do stage; a imagem de VM em `prints/` permanece como material local, fora desta publicação do frontend.

As 27 verificações cobrem catálogo/filtro/vazio, preview por foco, navegação/foco de rota, diálogo/Tab/Escape/Ctrl+K/setas/Enter, API real, loading, 503/retry, 403, timeout de 8 s, camadas por botão/teclado/arraste, movimento reduzido, expansão do método, layouts de 320/390/768/1440 px, menu mobile, arquitetura, runs indisponíveis e 404. Mocks são locais ao navegador de QA e removidos no `finally`; não alteraram o servidor nem criaram resultados de experimentos.

## Reparos feitos após renderizar

- A rota inicialmente focava o título anterior durante a transição; o foco passou a pertencer ao componente da nova rota.
- A animação de saída da prévia podia atrasar a troca de conteúdo; o conteúdo agora muda imediatamente com entrada curta.
- A busca ganhou contenção explícita de Tab/Shift+Tab, além do diálogo nativo, e restauração por Escape.
- A seleção por teclado ganhou prioridade sobre hover causado por scroll.
- O mapa em rede da primeira proposta foi substituído pelo hero tipográfico em camadas, conforme o novo pedido.
- Corrigidos normalização de paths no Windows e decode de URL de arquivo no script de gzip.
- A primeira allowlist de upload incluía diretórios além do escopo; foi corrigida e conferida novamente antes de qualquer envio.
- O processo Go agora aguarda a drenagem após `ListenAndServe` encerrar; SIGTERM em Cloud Run ainda não foi exercitado.

## Revisão do resultado renderizado

- **Alvo/evidência:** catálogo desktop/mobile, camadas fechadas/abertas, arquitetura e busca; capturas no guia visual e inspeção em navegador.
- **Leitura inicial:** laboratório independente, pergunta/evidência e ação de explorar; camadas apresentam o método, sem aparentar uma run.
- **Objeto/prova:** catálogo com sete planos versionados e detalhe por slug; página de operação lê health real.
- **Composição/tipografia:** abertura assimétrica, espaço negativo, Manrope local, índice em linhas e metadados discretos.
- **Estado/utilidade:** planos identificados, caminhos utilizáveis, recuperação visível e futuros recursos indisponíveis explicados.
- **Material/motion:** folhas tipográficas e SVGs autorais; posições mantêm relações mesmo em estado estático; gestos interrompem a entrada.
- **Responsividade:** navegação e inspeção se reorganizam no mobile; larguras verificadas sem overflow.
- **Resíduo de biblioteca:** sem template visual instalado, fotos emprestadas ou dashboard padrão.
- **Capturas:** adequadas para apresentar a casca no portfólio; não são prova de produto completo ou deploy.
- **Limite restante:** auditoria WCAG completa, avaliação em outros engines/dispositivos e performance de runtime cloud não executadas.

## Performance e limites

Build final: JavaScript `434,87 kB` / gzip `138,47 kB`; CSS `29,61 kB` / gzip `6,80 kB`; fonte WOFF2 `24,83 kB`. O JavaScript comprimido fica abaixo da meta de 180 KiB do guia. O Vite emite aviso porque o chunk bruto passa o limiar configurado de 350 kB; não é falha de build. Não foram atribuídas pontuação Lighthouse, 60 fps ou métricas de experimento.

Deploy e build de container: `not_run`. Docker não está instalado nesta estação; o Dockerfile foi preparado para build remoto após definir destino e orçamento. Projeto e teto mensal foram perguntados, ainda sem resposta. A sugestão de R$20 adicionais não equivale a autorização e o limite de instâncias não trava a fatura.

Não houve provisionamento pago para validar a casca. Custo medido do LabIA, latência cloud, cold start e métricas de laboratórios: `null`. Autenticação, tenant, runs, PostgreSQL, jobs, backup, restauração e rollback cloud permanecem pendentes. A fatura histórica segue não conciliada, conforme a evidência do comparativo.

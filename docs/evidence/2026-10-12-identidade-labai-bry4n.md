# LabAI bry4n — identidade e propósito da abertura

## Pedido e resultado

O responsável solicitou renomear o projeto inteiro para LabAI bry4n, destacar bry4n em laranja e explicar melhor o objetivo na primeira tela. Nome visível, títulos de página, descrição HTML, busca, operação, órbita, documentação ativa e identificadores internos foram atualizados. Decisão no [ADR 0004](../adr/0004-identidade-labai-bry4n-e-proposito.md).

A abertura agora explica: um laboratório para aprender engenharia de software, dados e IA construindo projetos, documentando decisões e testes, e transformar isso em um portfólio verificável. O estado dos sete projetos continua Planejado. `BrandName` mantém a escrita e a assinatura laranja consistentes em fundos claros e escuros.

## Ambiente e revisão

- Data: `2026-10-12`, fuso `America/Sao_Paulo`.
- Commit base: `15b89abf28ea6cea6b8d9b47537f10a5622adb5d`.
- Revisão de implementação: a registrar após criar o commit.
- Windows/PowerShell, Node `22.21.0`, npm `10.9.4`, Go `1.27.2`, React `19.3.0`, TypeScript `7.0.2`, Vite `8.3.4`, Tailwind `4.3.3`.
- Chromium `154.0.8037.58` via Playwright MCP; frontend de produção e API local na porta 8080.

## Comandos e resultados

```powershell
npm --prefix apps/web ci --no-audit --no-fund
npm --prefix apps/web run build
npm --prefix apps/web run format:check
go -C services/api-go test ./...
go -C services/api-go vet ./...
```

Comandos passaram com código zero. Instalação pelo lockfile trouxe 60 pacotes. Os comandos Go usaram o SDK portátil já verificado em `.tools/go-sdk/go/bin/go.exe`. Compilação adicional com `GOOS=linux`, `GOARCH=amd64`, `CGO_ENABLED=0`, `-buildvcs=false`, `-trimpath` e `-ldflags="-s -w"` produziu `.tools/labai-bry4n-linux-amd64`, 6.815.904 bytes. Binário local ignorado pelo Git; container não foi construído.

Playwright MCP executou `scripts/qa-web-mcp.js`: **61 verificações passaram, zero exceções JavaScript**, incluindo catálogo real, novo identificador de health, keyboard/foco, erros/retry, timeout, rotas e todos os sete cards em 320/390/768/1440 px. `scripts/qa-orbital-mcp.js`: **seis verificações passaram**, incluindo pausa, visibilidade e toque em contexto mobile com movimento normal.

Inspeção adicional nas quatro larguras confirmou o nome LabAI bry4n, título da página, propósito visível, assinatura laranja computada como `rgb(186, 79, 13)` no header e ausência de overflow. Capturas de catálogo, busca, arquitetura e órbita foram atualizadas no [guia visual](../design/README.md).

Nas rotas de catálogo, arquitetura e operação, o título e a marca usam o novo nome; o health consultado ao vivo retornou `service: labai-bry4n-api`. Revisão de 15 arquivos Markdown: UTF-8, fences consistentes e 79 links locais válidos. `git diff --check` passou.

A mudança de altura da abertura expôs um conflito entre seleção manual do método e seleção por entrada no scroll. A seleção manual agora tem prioridade; movimento reduzido não troca a etapa automaticamente. O fluxo correspondente voltou a passar no QA.

Build final: JavaScript `473,21 kB` / gzip `151,37 kB`; CSS `50,29 kB` / gzip `10,42 kB`. JS comprimido segue abaixo de 180 KiB. O Vite mantém o aviso de chunk bruto acima de 350 kB; build passou. Não foram medidos FPS ou Lighthouse.

## Compatibilidade e limites

Pacote, namespace Go, serviço de saúde, Compose, binário, configuração de exemplo e perfil de Cloud Run usam o novo identificador. O campo `service` de health mudou com OpenAPI e QA atualizados; consumidores externos que comparem o nome antigo precisariam se adaptar. A casca ainda não foi publicada em cloud; os sete slugs e o contrato de catálogo v1 foram preservados.

Evidências históricas, URLs reais do repositório e endereços locais de arquivos não foram reescritos. Nenhum dataset, segredo, peso ou material privado foi incluído. O projeto segue com runs, persistência e laboratórios completos pendentes. Deploy, build de container e custo cloud: `not_run`, `not_run` e `null`.

# Primeira casca: desenvolvimento e publicação

Estado: comandos locais verificados; build de container, deploy e rollback cloud preparados, ainda `not_run`. Ver [ADR 0002](../adr/0002-primeira-casca-frontend-e-container-unico.md) e [evidências](../evidence/2026-10-11-primeira-casca-web.md).

## Executar localmente

Requisitos verificados: Node `22.21.0`, npm `10.9.4` e Go `1.27.2`. Go deve estar no PATH; nesta estação foi usado SDK portátil fora do Git. Na raiz:

```powershell
npm --prefix apps/web ci --no-audit --no-fund
npm --prefix apps/web run build
go -C services/api-go test ./...
go -C services/api-go run ./cmd/api
```

Abrir `http://127.0.0.1:8080/labs`. A API usa `WEB_DIST=../../apps/web/dist` relativo a `services/api-go`, `PORT=8080` e aceita as duas variáveis como configuração. Não precisa de `.env`, credenciais, banco ou API de IA.

Para edição com HMR, manter a API rodando e iniciar `npm --prefix apps/web run dev` em outro terminal. O Vite encaminha `/v1` e `/healthz` à API local. HMR não foi usado como prova da publicação; o navegador de QA consultou o build servido pelo Go.

Playwright MCP: executar `browser_run_code_unsafe` com `filename: "scripts/qa-web-mcp.js"`. O script usa porta 8080 e registra verificações; seus mocks de loading/erro/permissão/timeout existem somente no navegador e são removidos no encerramento. Capturas atualizam `docs/design/previews/`.

## Publicar a casca

Antes de executar: projeto com billing, teto mensal, região, janela de até 15 minutos para publicação/verificação e identidade de runtime de privilégio mínimo. A pergunta sobre projeto/teto permanece pendente. O perfil preparado tem 1 CPU, 256 MiB, mínimo zero, máximo uma instância por revisão, concorrência 40 e cobrança por requisição. Máximo de instâncias não é teto financeiro.

Cloud Run, Cloud Build e Artifact Registry devem estar habilitados no destino. Confirmar as permissões de quem publica e de quem faz o build; não aplicar roles amplas por tentativa e erro. A identidade de runtime desta casca não precisa de acesso a banco, storage de usuários ou APIs de IA. Não reaproveitar credenciais de outros aplicativos.

Sintaxe abaixo conferida com os comandos `gcloud help` específicos do SDK instalado. Os identificadores são placeholders a substituir após a definição do destino. **Preparação não comprova execução.**

```text
gcloud meta list-files-for-upload . --quiet
gcloud run deploy labai-bry4n --source=. --project=PROJECT_ID --region=us-central1 --service-account=RUNTIME_SERVICE_ACCOUNT --cpu=1 --memory=256Mi --min=0 --min-instances=0 --max-instances=1 --concurrency=40 --timeout=30s --cpu-throttling --no-cpu-boost --allow-unauthenticated --port=8080 --labels=app=labai-bry4n,phase=shell,commit=COMMIT_SHA --quiet
gcloud run services describe labai-bry4n --project=PROJECT_ID --region=us-central1 --format=json(status.url,status.latestReadyRevisionName,status.conditions,status.traffic) --quiet
```

O Dockerfile é construído remotamente pelo Cloud Build, usando versões/digests explícitos das bases. A allowlist de `.gcloudignore` foi conferida e enviou somente frontend, API e arquivos de container. `.dockerignore` restringe o contexto interno; `.tools`, estudos, prints, credenciais, `node_modules`, builds locais e Git ficam fora do upload.

Depois do deploy, verificar URL pública, revisão pronta, `GET /healthz`, sete slugs em `GET /v1/labs`, refresh de `/labs/rag-agents`, assets, headers/gzip, teclado e mobile. Registrar projeto, região, commit e imagem/revisão em evidência de publicação, sem credenciais. Consultar os valores efetivamente cobrados antes de afirmar o aumento da fatura.

## Retornar à revisão anterior

Após haver uma revisão anterior verificada, registrar seu nome e encaminhar 100% do tráfego a ela. Operação cloud ainda não exercitada:

```text
gcloud run services update-traffic labai-bry4n --project=PROJECT_ID --region=us-central1 --to-revisions=PREVIOUS_REVISION=100 --quiet
```

Repetir os smoke tests. Frontend e API revertem juntos. Esta casca não tem migração ou dados persistidos; futuras mudanças com banco exigirão procedimento próprio.

## Encerramento e revisão de custo

Mínimo zero permite reduzir instâncias quando não há requisições; a URL continua pública e novos acessos podem ativar o serviço. Não é um desligamento financeiro. A [documentação de mínimo de instâncias](https://docs.cloud.google.com/run/docs/configuring/min-instances) e os [preços](https://cloud.google.com/run/pricing) descrevem esse comportamento e cobrança.

Ao encerrar a janela de verificação, conferir mínimo zero nas revisões com tráfego, interromper processos locais deste teste e revisar builds em andamento. Imagens, staging de builds, logs e tráfego podem gerar cobrança mesmo sem banco ou GPU. Definir retenção e revisar custo na primeira semana após publicar. Remoção do serviço e limpeza de imagens/buckets precisam de escopo confirmado; não tocar nos aplicativos existentes.

Fontes de publicação: [deploy por código fonte e Dockerfile](https://docs.cloud.google.com/run/docs/deploying-source-code), [contrato do container](https://docs.cloud.google.com/run/docs/container-contract).

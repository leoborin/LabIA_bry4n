# API Go

**Estado:** API mínima da casca, integrada ao build do console e verificada localmente. Biblioteca padrão, Go 1.27.2; sem dependências externas e sem `go.sum` vazio. A API modular completa e os experimentos continuam pendentes.

## Disponível

- `GET /healthz`: saúde do processo, serviço e versão `0.1.0-shell`; não comprova banco ou workers.
- `GET /v1/labs`: sete planos públicos embarcados no binário. Slugs estáveis, `status: planned`, `available: false`.
- Frontend compilado: estáticos e deep links da SPA; assets com hash/cache e gzip; APIs desconhecidas e assets ausentes não recebem HTML de sucesso.

Contrato mínimo em [OpenAPI](../../contracts/openapi.yaml). Headers/CSP limitam a casca à mesma origem. O processo escuta em `0.0.0.0:$PORT`; `WEB_DIST` define o diretório do build. O container usa `/web`; localmente o padrão é `../../apps/web/dist` a partir desta área.

## Executar e verificar

Na raiz, com Go no PATH e frontend construído:

```powershell
go -C services/api-go test ./...
go -C services/api-go vet ./...
go -C services/api-go run ./cmd/api
```

Os testes conferem sete slugs únicos, ausência de disponibilidade falsa, fronteiras de rotas, cache, headers, gzip/qualidade zero e frontend ainda não construído. Ver [evidências](../../docs/evidence/2026-10-11-primeira-casca-web.md) e [runbook](../../docs/runbooks/primeira-casca-cloud-run.md). Encerramento gracioso está implementado com até 8 segundos; SIGTERM no runtime Cloud Run permanece pendente de verificação.

## Próximas fatias

- [ ] `POST /v1/labs/{slug}/runs`: aceitar trabalho persistido com HTTP 202.
- [ ] `GET /v1/runs/{id}`: estado, tentativas, erros e versões.
- [ ] `GET /v1/runs/{id}/results`: resultado tipado de execução concluída.
- [ ] OIDC e autorização por tenant/objeto no servidor.
- [ ] PostgreSQL, migrações, transações e storage.
- [ ] Outbox, idempotência, concorrência, deadlines e recuperação de falhas.
- [ ] Integração com workers e testes de invariantes/race detector apropriados.

Recurso de runs inexistente retorna 404 JSON. Não há aceite HTTP 202 sem persistência, fila em memória ou trabalho durável depois da resposta nesta casca.

# API Go

**Estado: pendente.** API modular compartilhada pelos sete laboratórios.

## Contratos previstos

- [ ] `GET /v1/labs`: catálogo, disponibilidade e schemas.
- [ ] `POST /v1/labs/{slug}/runs`: aceitar trabalho persistido com HTTP 202.
- [ ] `GET /v1/runs/{id}`: estado, tentativas, erros e versões.
- [ ] `GET /v1/runs/{id}/results`: resultado tipado de execução concluída.

## Componentes previstos

- [ ] Inicializar módulo Go e adicionar `go.mod`/`go.sum` verificados.
- [ ] Implementar catálogo e handlers em `internal/labs/`.
- [ ] Implementar runs e invariantes em `internal/runs/`.
- [ ] Implementar autenticação OIDC e autorização por tenant em `internal/auth/`.
- [ ] Implementar storage, transações e migrações PostgreSQL.
- [ ] Implementar outbox, idempotência, deadlines e recuperação de falhas.
- [ ] Registrar testes relevantes, incluindo concorrência e race detector.

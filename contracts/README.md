# Contratos

**Estado: mínimo implementado.** [openapi.yaml](openapi.yaml) descreve o catálogo público e `/healthz` da casca `0.1.0-shell`; o catálogo preserva os sete slugs e marca todos como planejados. Testes Go conferem slugs, estados e fronteira HTTP. Runs, eventos e resultados continuam pendentes.

- [ ] Implementar `openapi.yaml` com catálogo, criação, estado e resultado de runs.
- [ ] Definir `events/run-requested.v1.schema.json`.
- [ ] Definir um schema de resultado por laboratório em `results/`.
- [ ] Adicionar fixtures sintéticas pequenas em `fixtures/`.
- [ ] Verificar compatibilidade, autorização, idempotência e erros com testes de contrato.

Os diretórios reservados não representam contratos já implementados.

Identidade atual: LabAI bry4n. O campo `service` de `/healthz` passa a `labai-bry4n-api`, com OpenAPI e consumidor de QA atualizados juntos; catálogo v1 e slugs permanecem estáveis. Justificativa da alteração no [ADR 0004](../docs/adr/0004-identidade-labai-bry4n-e-proposito.md).

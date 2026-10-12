# Contratos

**Estado: mínimo implementado.** [openapi.yaml](openapi.yaml) descreve o catálogo público e `/healthz` da casca `0.1.0-shell`; o catálogo preserva os sete slugs e marca todos como planejados. Testes Go conferem slugs, estados e fronteira HTTP. Runs, eventos e resultados continuam pendentes.

- [ ] Implementar `openapi.yaml` com catálogo, criação, estado e resultado de runs.
- [ ] Definir `events/run-requested.v1.schema.json`.
- [ ] Definir um schema de resultado por laboratório em `results/`.
- [ ] Adicionar fixtures sintéticas pequenas em `fixtures/`.
- [ ] Verificar compatibilidade, autorização, idempotência e erros com testes de contrato.

Os diretórios reservados não representam contratos já implementados.

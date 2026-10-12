# Evidência documental: decisão por Cloud Run

## Problema e decisão

Após revisar o [comparativo de deploy e custos](../architecture/comparativo-deploy-gcp.md), o responsável escolheu Cloud Run e solicitou salvar a decisão. O [ADR 0001](../adr/0001-cloud-run-para-demo-sob-demanda.md) registra a escolha com status aceito e implementação pendente.

A decisão mantém Firebase Hosting para a SPA, Cloud Run Service para a API Go, Cloud Run Jobs para workers Python finitos e PostgreSQL externo, com Cloud SQL como referência do perfil sob demanda. Estimativas continuam separadas de valores efetivamente cobrados.

## Ambiente e base

- Data local: `2026-10-11`, fuso `America/Sao_Paulo`.
- Commit base: `f079ecaec4968153861a3935c65d6105b23311cf`.
- Na entrega original, não havia solicitação de commit/push. O responsável posteriormente solicitou salvar o trabalho no Git durante a implementação da primeira casca.
- Windows, PowerShell `5.1.26100.9444`, Git `2.52.0.windows.1` e ripgrep `15.2.0`, verificados na etapa do comparativo.
- Guias do projeto, arquitetura, documentação e evidências lidos; decisões e fontes técnicas reutilizadas da análise anterior nesta sessão.
- Skill do ambiente `cloud-run-basics` consultada para distinguir Services, Jobs e worker pools; nenhuma configuração cloud foi executada nesta entrega.

## Verificação documental

| Verificação | Resultado |
|---|---|
| ADR, índice e referências entre documentos | Conferidos; sete documentos e 28 links locais válidos na etapa original. |
| UTF-8, links locais, fences, espaços finais e checklists | Conferidos na etapa documental; não concluíram recursos do produto. |
| Diff e preservação das alterações preexistentes | `git diff --check` passou; alterações anteriores preservadas. |

Comandos de leitura: `Get-Content -Encoding UTF8`, `Get-ChildItem docs/adr` e `git status --short`. Git foi usado com a exceção de propriedade limitada ao comando: `git -c safe.directory='C:/Users/leona/OneDrive/Ambiente de Trabalho/LabIA'`.

## Limitações e pendências

- O ADR formaliza uma decisão arquitetural; não comprova implementação ou infraestrutura publicada.
- A faixa de R$20–40 adicionais por mês é uma estimativa sob as premissas do comparativo, não um orçamento de execução autorizado ou uma medição de fatura.
- Região, dimensionamento, backup, restauração, prazo e encerramento precisam ser definidos antes do deploy.
- Build, testes de aplicação, demo, benchmark e deploy: `not_run`; métricas de execução e custo observado: `null`.
- Checklists de implementação permanecem desmarcados.
- Documentação de instalação de skills, seus registros e a pasta `prints/` foram preservados.

A implementação local posterior é registrada no [ADR 0002](../adr/0002-primeira-casca-frontend-e-container-unico.md) e na [evidência da casca](2026-10-11-primeira-casca-web.md). Ela atualiza o destino inicial do frontend para o mesmo serviço Cloud Run; não conclui a demo com runs/banco/workers.

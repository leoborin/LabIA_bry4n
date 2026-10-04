# Guia de trabalho para agentes — LabIA

## Contexto e estado

LabIA é um portfólio independente de engenharia de software, sistemas e IA. A arquitetura planejada combina console React/TypeScript/Vite, API Go modular, workers Python e PostgreSQL.

Este repositório começa como um esqueleto. Todos os itens de implementação do README estão pendentes. Não tratar diretórios, documentação, configurações de exemplo ou fixtures como evidência de funcionalidade concluída.

Antes de alterar o projeto, ler `README.md`, `docs/architecture/README.md` e o guia da área afetada. O documento local `999module_study/LabIA.md` pode aprofundar o plano quando estiver disponível; ele é ignorado pelo Git e não é uma dependência para trabalhar em um clone.

## Organização

- `apps/web/`: interface, cliente HTTP, autenticação e testes do console.
- `services/api-go/`: catálogo, runs, autorização, storage e outbox.
- `services/workers-python/`: execução e módulos de dados e IA.
- `labs/`: problemas, roteiros, decisões e evidências; evitar duplicar aplicações aqui.
- `contracts/`: OpenAPI, eventos, resultados e fixtures pequenas.
- `configs/`: parâmetros versionados, sem credenciais.
- `data/manifests/`, `models/cards/` e `registry/`: metadados e registros de artefatos.
- `db/`, `pipelines/`, `training/`, `infra/` e `observability/`: responsabilidades específicas de cada camada.
- `docs/`: C4, ADRs, RFCs, runbooks, evidências e portfólio.

Preservar os slugs `backend-events`, `data-platform`, `credit-risk`, `documents-finetuning`, `rag-agents`, `jev-classification` e `reliability-platform`.

## Critérios de implementação

- Entregar mudanças pequenas com problema, decisão, verificação e limitações claros.
- Começar com módulos compartilhados; criar serviços adicionais quando houver necessidade demonstrada.
- Preservar contratos versionados e justificar mudanças incompatíveis.
- Nos fluxos de runs, verificar persistência, idempotência, concorrência, timeout e recuperação.
- Derivar tenant da identidade autorizada e verificar acesso ao objeto no servidor.
- No frontend, cobrir loading, vazio, validação, processamento, erro, permissão e sucesso; verificar teclado e foco.
- Manter Jev como comparação opcional de classificação, separado do fine-tuning de documentos.
- Manter dados de crédito e documentos sintéticos em experimentos independentes.
- Fixar dependências e registrar as versões efetivamente verificadas. Não criar lockfiles vazios ou versões apresentadas como testadas sem execução.

## Dados, modelos e infraestrutura

Nunca versionar segredos, tokens, `.env`, credenciais, datasets privados/brutos, pesos, checkpoints, caches ou state Terraform. Manter manifests, hashes, cards, configurações, migrações e fixtures sintéticas pequenas no Git.

Preservar no `.gitignore` as exclusões de `.github-cleanup/`, `.tools/` e `999module_study/`. Não copiar seu conteúdo para outra pasta rastreada como forma de contornar essas exclusões.

Cloud, GPU, downloads grandes e serviços pagos exigem escopo e orçamento autorizados. Documentar prazo de execução, recursos temporários e desligamento. Não provisionar infraestrutura só para validar este esqueleto.

## Verificação e evidências

Executar as verificações relevantes para a mudança implementada. Para alterações apenas documentais, conferir links, consistência, checklist e conteúdo do commit; não inventar testes de aplicação.

Não apresentar um comando de build, teste, demo ou deploy como funcional antes de executá-lo com sucesso. A configuração atual não inicia uma aplicação.

Cada entrega deve permitir **explicar, decidir e verificar**. Registrar comando, ambiente, commit, data e resultado em `docs/evidence/`. Experimentos não executados usam `not_run` e métricas `null`; não preencher métricas demonstrativas como resultados reais.

Manter checklists desmarcados até comprovar seus critérios. A criação desta estrutura não conclui os laboratórios nem os recursos do produto.

## Git e comunicação

Respeitar alterações existentes do usuário. Inspecionar o diff e os arquivos preparados para commit; evitar incluir pastas ignoradas ou arquivos não relacionados.

Fazer commit e push quando fizerem parte da solicitação autorizada. Não reescrever histórico remoto nem usar force push sem uma necessidade e autorização explícitas.

Documentar em português, com nomes técnicos estáveis no código. Ao relatar uma entrega, informar o que mudou, o que foi verificado e o que permanece pendente.

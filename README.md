# LabIA

Portfólio de engenharia de software, sistemas distribuídos, dados e inteligência artificial, construído por meio de experimentos reproduzíveis.

O projeto será um laboratório independente com console web, API e workers. Cada entrega deverá demonstrar três competências: **explicar** o mecanismo, **decidir** entre alternativas e **verificar** o resultado com evidências. A proposta é desenvolver capacidade técnica para discutir decisões de arquitetura, confiabilidade, qualidade de dados, IA aplicada e custo.

**Estado atual:** esqueleto inicial do repositório. A estrutura e os guias estão preparados; toda a implementação do produto permanece **pendente**. Ainda não há aplicação executável, dependências instaladas, modelos treinados, métricas medidas ou infraestrutura publicada.

## Ideia e arquitetura planejada

- **Console:** React, TypeScript e Vite, com catálogo, laboratório, execução, resultados, arquitetura e operação.
- **API:** Go modular, com catálogo dos laboratórios, execução assíncrona, autorização e contratos HTTP.
- **Workers:** Python para processamento de dados, inferência, avaliação e experimentos de IA.
- **Persistência:** PostgreSQL, com pgvector quando necessário, e artefatos armazenados fora do Git.
- **Evolução:** ambiente local com Compose; depois, demonstração econômica em Cloud Run; GKE e GPU somente em janelas temporárias justificadas.

Começar com poucos processos e módulos bem definidos. A separação em serviços adicionais deverá ser sustentada por uma decisão documentada e uma necessidade observada.

O LabIA é independente do Evolua: o acompanhamento do aprendizado pode apontar para suas evidências, mas não substitui a execução dos experimentos. O plano de referência organiza a evolução em **56 semanas**, de 05/10/2026 a 31/10/2027.

Veja o [guia de arquitetura planejada](docs/architecture/README.md).

## Laboratórios previstos

| Laboratório | Ideia | Estado |
|---|---|---|
| [backend-events](labs/backend-events/README.md) | Execuções assíncronas, concorrência, idempotência e recuperação de falhas. | Pendente |
| [data-platform](labs/data-platform/README.md) | Ingestão, contratos, qualidade, versionamento e linhagem de dados. | Pendente |
| [credit-risk](labs/credit-risk/README.md) | Benchmark histórico de classificação tabular, calibração e avaliação. | Pendente |
| [documents-finetuning](labs/documents-finetuning/README.md) | Extração estruturada de documentos sintéticos, com comparação entre base e adapter QLoRA. | Pendente |
| [rag-agents](labs/rag-agents/README.md) | Recuperação de evidências, citações, abstensão e ferramentas autorizadas. | Pendente |
| [jev-classification](labs/jev-classification/README.md) | Classificação de tickets com baseline local e comparação externa opcional. | Pendente |
| [reliability-platform](labs/reliability-platform/README.md) | Observabilidade, capacidade, SLOs, incidentes, rollback e restauração. | Pendente |

## Estrutura do repositório

```text
apps/web/                 Console React / TypeScript / Vite
services/api-go/          API modular e processamento confiável
services/workers-python/ Workers e módulos de IA
foundations/             Fundamentos, experimentos e DSA
labs/                    Roteiros e evidências dos sete laboratórios
contracts/               Contratos HTTP, eventos, resultados e fixtures
configs/                 Configurações de dados, treino e avaliação
data/manifests/          Metadados e hashes de datasets
models/cards/            Documentação dos modelos
registry/                Manifestos, promoção e rollback
db/migrations/           Evolução do banco de dados
pipelines/               Ingestão, transformação e qualidade
training/                Preparação, treino, avaliação e comparação
scripts/                 Automação local, demo e operação
infra/                   Terraform, perfis de ambiente e Kubernetes
observability/           Telemetria, painéis e alertas
tests/                   Contratos, ponta a ponta e falhas
benchmarks/              Cenários e relatórios de desempenho
docs/                    Arquitetura, ADRs, RFCs, runbooks e portfólio
docs/evidence/weeks/      Evidências de w01 a w56
```

Diretórios ainda vazios usam `.gitkeep`. Os manifests de dependências, contratos, migrações e configurações executáveis serão adicionados durante a implementação, com versões verificadas.

## Checklist resumido — tudo pendente

- [ ] Preparar ambiente local, fixar versões e implementar os serviços do Compose.
- [ ] Construir o console web com as seis telas e estados acessíveis.
- [ ] Implementar API, autenticação OIDC e isolamento por tenant.
- [ ] Implementar workers, estados de execução, deadlines e recuperação de erros.
- [ ] Versionar contratos HTTP, eventos, resultados e fixtures sintéticas.
- [ ] Implementar o laboratório `backend-events`.
- [ ] Implementar o laboratório `data-platform`.
- [ ] Implementar o laboratório `credit-risk`.
- [ ] Implementar o laboratório `documents-finetuning`.
- [ ] Implementar o laboratório `rag-agents`.
- [ ] Implementar o laboratório `jev-classification`.
- [ ] Implementar o laboratório `reliability-platform`.
- [ ] Preparar pipelines, manifests de dados, data cards e model cards.
- [ ] Implementar treino, avaliação, comparação, promoção e rollback de modelos.
- [ ] Preparar infraestrutura local, demo cloud e perfis temporários de plataforma.
- [ ] Implementar telemetria, SLOs, benchmarks, backups e runbooks de restauração.
- [ ] Configurar CI e verificações de segurança, contratos, integração e falhas.
- [ ] Registrar fundamentos, ADRs, RFCs e evidências das 56 semanas.
- [ ] Publicar demos e portfólio técnico em português e inglês com resultados verificáveis.

## Como começar

Leia este README e [AGENTS.md](AGENTS.md). Escolha uma fatia pequena do checklist, implemente-a e registre sua verificação em [docs/evidence](docs/evidence/README.md).

`.env.example` apresenta apenas variáveis planejadas e valores de exemplo. `compose.yaml` ainda não define serviços. O `Makefile` oferece somente ajuda. O quickstart executável será documentado quando a primeira integração real estiver pronta.

A estrutura foi baseada no guia local `999module_study/LabIA.md`. As pastas `.github-cleanup/`, `.tools/` e `999module_study/` permanecem fora do versionamento. Segredos, datasets, pesos, checkpoints e state de infraestrutura também ficam fora do Git.

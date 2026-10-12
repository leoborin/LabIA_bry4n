# LabAI bry4n

LabAI bry4n é um laboratório para aprender engenharia de software, dados e inteligência artificial construindo projetos práticos. O objetivo é transformar esse aprendizado em um portfólio técnico: mostrar o problema, explicar as decisões, publicar o código e registrar testes e resultados verificáveis.

O projeto será um laboratório independente com console web, API e workers. Cada entrega deverá demonstrar três competências: **explicar** o mecanismo, **decidir** entre alternativas e **verificar** o resultado com evidências. A proposta é desenvolver capacidade técnica para discutir decisões de arquitetura, confiabilidade, qualidade de dados, IA aplicada e custo.

A identidade e os identificadores internos estão registrados no [ADR 0004](docs/adr/0004-identidade-labai-bry4n-e-proposito.md).

**Estado atual:** primeira casca navegável verificada localmente: console React/TypeScript/Vite, catálogo público e health em Go. Os sete laboratórios, autenticação, runs, workers e persistência permanecem **pendentes**. Nenhum modelo foi treinado ou experimento medido. O deploy aguarda definição de projeto e orçamento.

## Ideia e arquitetura planejada

- **Console:** React, TypeScript e Vite, com catálogo, laboratório, execução, resultados, arquitetura e operação.
- **API:** Go modular, com catálogo dos laboratórios, execução assíncrona, autorização e contratos HTTP.
- **Workers:** Python para processamento de dados, inferência, avaliação e experimentos de IA.
- **Persistência:** PostgreSQL, com pgvector quando necessário, e artefatos armazenados fora do Git.
- **Evolução:** ambiente local com Compose; depois, demonstração econômica em Cloud Run; GKE e GPU somente em janelas temporárias justificadas.

Começar com poucos processos e módulos bem definidos. A separação em serviços adicionais deverá ser sustentada por uma decisão documentada e uma necessidade observada.

O LabAI bry4n é independente do Evolua: o acompanhamento do aprendizado pode apontar para suas evidências, mas não substitui a execução dos experimentos. O plano de referência organiza a evolução em **56 semanas**, de 05/10/2026 a 31/10/2027.

Veja o [guia de arquitetura planejada](docs/architecture/README.md).

A hospedagem foi escolhida no [ADR 0001 — Cloud Run](docs/adr/0001-cloud-run-para-demo-sob-demanda.md). O [ADR 0002](docs/adr/0002-primeira-casca-frontend-e-container-unico.md) define a primeira casca com console e API mínima no mesmo container. As alternativas e estimativas estão no [comparativo de deploy e custos GCP](docs/architecture/comparativo-deploy-gcp.md).

O [guia visual](docs/design/README.md) salva referências Apple, Linear, Vercel e 21st.dev, capturas próprias e regras de futuras páginas. O [runbook](docs/runbooks/primeira-casca-cloud-run.md) explica desenvolvimento e publicação; as [evidências](docs/evidence/2026-10-11-primeira-casca-web.md) registram o que foi executado.

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

Diretórios ainda vazios usam `.gitkeep`. Frontend, módulo Go e contrato mínimo já têm manifests verificados; migrações e contratos de runs serão acrescentados por etapas.

## Checklist resumido — implementação completa pendente

A casca inclui catálogo, detalhe de plano, arquitetura e consulta de saúde. Os itens abaixo representam o produto completo; a navegação inicial não conclui os fluxos de execução.

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

Para executar a casca:

```powershell
npm --prefix apps/web ci --no-audit --no-fund
npm --prefix apps/web run build
go -C services/api-go run ./cmd/api
```

Requisitos verificados: Node 22.21.0, npm 10.9.4 e Go 1.27.2 no PATH. Abrir `http://127.0.0.1:8080/labs`. Ver demais comandos e limites no runbook. `.env.example` contém variáveis futuras; `compose.yaml` ainda não define serviços e o `Makefile` oferece somente ajuda.

A estrutura foi baseada no guia local `999module_study/LabIA.md`. As pastas `.github-cleanup/`, `.tools/` e `999module_study/` permanecem fora do versionamento. Segredos, datasets, pesos, checkpoints e state de infraestrutura também ficam fora do Git.

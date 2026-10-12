# Evidência documental: comparativo de deploy e custos GCP

## Problema e escopo

Comparar alternativas de hospedagem para o LabIA, explicar frontend e backend e estimar o impacto sobre o gasto mensal informado pelo usuário. O usuário pediu que a comparação fosse salva em Markdown e que o ADR fosse criado **depois da escolha**.

Entrega: [comparativo de deploy](../architecture/comparativo-deploy-gcp.md). A recomendação é preliminar; não há decisão formal nem orçamento de provisionamento autorizado nesta entrega.

## Ambiente e base

- Data local: `2026-10-11`, fuso `America/Sao_Paulo`.
- Verificação documental concluída em `2026-10-11T23:00:41-03:00`.
- Commit base do LabIA: `f079ecaec4968153861a3935c65d6105b23311cf`.
- Alterações desta revisão: working tree, sem novo commit ou push solicitado.
- Windows; PowerShell `5.1.26100.9444`; Git `2.52.0.windows.1`; ripgrep `15.2.0`.
- Google Cloud SDK `504.0.1`, `bq` `2.1.11`, confirmados com `gcloud version`.
- Fontes primárias Google Cloud, Firebase, Vite e kernel Linux consultadas nesta data; links próximos das afirmações no comparativo.
- A tabela SQL foi lida pelo navegador na região padrão Iowa; a tabela de VMs foi conferida selecionando Oregon. Conversão de orçamento assumida: `5,50 BRL/USD`, não cotação verificada nem SKU real em BRL.

## Informações fornecidas e verificação de inventário

O usuário informou cerca de R$100/mês, dois Cloud Run, VM e Firebase, com preferência por uso sob demanda. A CLI confirmou uma e2-small em `us-west1-a`; o contexto fornecido descreve disco balanced de 16 GiB e Debian 12.

Referência visual local fornecida pelo usuário: `prints/vm.png`, não incorporada nesta entrega e não necessária para ler o documento. SHA-256: `96353d02d313fdc7171db93726eb5f25c18570c80bcd460450bba84cc67c0825`. O painel mostra CPU 0,5%, RAM 90,6% e disco 74,4%; isso não substitui histórico nem discrimina cache, swap ou memória por container.

O inventário de faturamento encontrou quatro projetos vinculados à conta consultada. Consultas de Compute/Cloud Run no projeto inicialmente ativo retornaram `SERVICE_DISABLED`; a consulta de APIs habilitadas permitiu direcionar as leituras a projetos apropriados. Nenhuma API foi habilitada.

Foram confirmados uma VM, seu disco/IP, um Cloud Run, uma aplicação App Engine com 25 versões, três repositórios com 10,37 GiB de imagens, cinco buckets e dois datasets BigQuery. A distribuição de tráfego do App Engine aponta para uma versão; a consulta pontual de instâncias retornou vazia. O segundo Cloud Run informado não foi localizado nas consultas; a investigação não atribui custo zero a ele. Nos datasets acessíveis não foi identificada tabela de exportação de faturamento.

Valores efetivamente cobrados: **não conciliados**. O relatório web requer login e o navegador de auditoria perdeu a sessão após sua abertura. A tentativa de abrir o relatório no navegador padrão por `Start-Process` foi rejeitada pela política automática da ferramenta, com motivo `blocked by policy`. O usuário recebeu o link direto. O gasto informado, os preços de catálogo e as estimativas não foram apresentados como uma fatura medida.

## Verificações documentais

| Verificação | Resultado |
|---|---|
| Leitura dos guias de projeto, arquitetura, documentação, evidências, API, workers e web | Concluída. |
| Consulta a fontes oficiais sobre modelos, limites e preços | Concluída; fontes registradas no comparativo. |
| Cálculos de estimativas com premissas explícitas | Executados; não são métricas de workloads. |
| Links locais, UTF-8, espaços finais e checklists | Quatro arquivos verificados; 16 links locais válidos, 35 URLs externas catalogadas, UTF-8 válido, nenhuma falha. Links externos relevantes foram consultados como fontes, sem apresentar isso como teste HTTP de todos os endpoints. |
| Revisão de diff e arquivos de escopo | Concluída; `git diff --check` passou nos arquivos desta revisão; nenhum arquivo preparado para commit. |

Comandos locais usados: `Get-Content -Encoding UTF8`, `rg --files`, `Get-FileHash -Algorithm SHA256`, `git status --short` e `git log -1`. Git exigiu exceção por propriedade do diretório; foi usado `git -c safe.directory='C:/Users/leona/OneDrive/Ambiente de Trabalho/LabIA'` por comando, sem modificar configuração global.

Uma verificação Python pontual via `python -` conferiu existência dos destinos Markdown locais, leitura estrita UTF-8, fences balanceados, espaços finais, ausência de checklists concluídos e de identificadores privados conhecidos. Foram revisados o conteúdo dos dois documentos novos, o diff de `README.md` e `docs/architecture/README.md` e a saída vazia de `git diff --cached --stat`.

A consulta cloud usou `gcloud`/`bq` autenticados apenas para leitura de metadados. A skill global `gcloud` orientou a validação dos comandos posteriores à sua leitura por `gcloud help` no comando específico, escopo explícito de projeto e redução de saída. A consulta de integrações seguiu `plugin-management`; o conector BigQuery do catálogo está indisponível por administração. Essas skills são recursos do ambiente, não dependências do repositório.

Comandos cloud executados, com identificadores de projetos/conta omitidos abaixo para não versionar dados financeiros identificáveis:

```text
gcloud billing projects describe <projeto> --format=json
gcloud billing accounts list --project=<projeto> --limit=10 --format=json(name,open) --quiet
gcloud billing projects list --billing-account=<conta> --project=<projeto> --limit=50 --format=json(projectId,billingEnabled) --quiet
gcloud services list --project=<projeto> --enabled --limit=200 --format=value(config.name) --quiet
gcloud compute instances list --project=<projeto> --limit=20 --format=json(name,zone,machineType,status) --quiet
gcloud compute disks list --project=<projeto> --limit=30 --format=json(name,zone,sizeGb,type,status,users) --quiet
gcloud compute addresses list --project=<projeto> --limit=30 --format=json(name,region,status,addressType,networkTier,users) --quiet
gcloud run services list --project=<projeto> --limit=30 --format=<projecao de nome, localizacao e limites sem env> --quiet
gcloud app versions list --project=<projeto> --limit=30 --format=json(service,id,version.env,version.servingStatus,version.instanceClass) --quiet
gcloud app services describe default --project=<projeto> --format=json(id,split) --quiet
gcloud app instances list --project=<projeto> --service=default --limit=30 --format=json(id,version,instanceClass,vmStatus,uptime) --quiet
gcloud storage buckets list --project=<projeto> --limit=50 --format=json(name,location,storage_class) --quiet
gcloud artifacts repositories list --project=<projeto> --location=all --limit=50 --format=json(name,format,sizeBytes) --quiet
bq --project_id=<projeto> --format=json ls --max_results=100
bq --project_id=<projeto> --format=json ls --max_results=100 <projeto>:<dataset>
gcloud version --format=json --quiet
```

Essas linhas registram a consulta com campos privados substituídos; não são um quickstart executável. Não foram executadas queries BigQuery sobre dados nem criadas exportações de cobrança.

Não registrar comandos com tokens, chaves, dados financeiros identificáveis, IPs ou contas pessoais no Git. Alterações preexistentes na documentação de instalação de skills e na pasta `prints/` foram preservadas.

## Limitações e pendências

- Autorização para consultar custos não equivale a autorização para aumentar recursos ou despesa.
- O período de 730 h é uma convenção de cálculo; uptime histórico e total da fatura não foram medidos.
- A região final, franquias remanescentes, SKUs em BRL e impostos permanecem a confirmar.
- A faixa de planejamento pode ser excedida por recursos auxiliares, armazenamento, rede, retries ou maior uso.
- Build, teste de aplicação, demo, benchmark e deploy: `not_run`.
- Métricas de execução do LabIA, custo cloud efetivamente medido e latência: `null`.
- Checklists de produto permanecem desmarcados. Não houve provisionamento, resize, mudança de IAM, commit ou push.

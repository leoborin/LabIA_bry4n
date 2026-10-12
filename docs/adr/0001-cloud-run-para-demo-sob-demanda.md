# ADR 0001 — Cloud Run para a demonstração sob demanda do LabAI bry4n

- **Status:** aceito.
- **Data:** 11/10/2026.
- **Decisão:** escolhida pelo responsável pelo projeto após a comparação das alternativas.
- **Escopo:** arquitetura do primeiro ambiente de demonstração no Google Cloud.
- **Implementação:** pendente; este registro não comprova deploy ou aplicação em execução.

**Complemento:** o [ADR 0002](0002-primeira-casca-frontend-e-container-unico.md) define a primeira casca verificada localmente, com console e API mínima no mesmo serviço Cloud Run. Ele substitui o destino Firebase do console somente nesse incremento; workers, runs, autenticação e persistência desta demo continuam pendentes.

## Contexto

O LabAI bry4n combina console React/TypeScript/Vite, API Go modular, workers Python e PostgreSQL. O repositório ainda é um esqueleto; a primeira integração deve funcionar localmente antes de ser publicada.

O ambiente cloud será usado sob demanda, em janelas de demonstração. O responsável informou gasto atual próximo de R$100/mês e infraestrutura já usada por outros projetos. A VM existente tem 2 GiB de RAM, e o painel fornecido mostrou pouca margem aparente de memória e disco; sua capacidade para novos workloads não foi comprovada.

Queremos publicar uma demonstração pequena com operação simples, preservar containers e módulos compartilhados e limitar recursos ociosos. Não há requisito demonstrado de cluster Kubernetes, processos privilegiados ou consumidores permanentes.

O [comparativo de deploy e custos](../architecture/comparativo-deploy-gcp.md) documenta as opções, preços de referência e limitações da estimativa. O responsável escolheu Cloud Run para esse perfil.

## Decisão

Adotar **Cloud Run como plataforma de execução da API e dos workers da primeira demo**, com a seguinte divisão:

| Componente | Destino e comportamento definidos |
|---|---|
| Console React + Vite | Firebase Hosting, publicando o build estático da SPA; avaliar reaproveitamento do projeto Firebase existente. |
| API Go modular | Cloud Run Service, com cobrança por requisição e mínimo de instâncias zero; definir limite máximo, concorrência e recursos antes do deploy. |
| Workers Python CPU | Cloud Run Jobs com tarefas finitas, concorrência e tentativas limitadas; encerrar após concluir ou atingir o limite de execução. |
| Persistência | PostgreSQL externo aos containers; Cloud SQL for PostgreSQL como referência do perfil de demo, iniciado antes da janela e parado ao encerrá-la. |
| Artefatos | Cloud Storage, com acesso controlado e retenção; manifests, hashes e cards continuam no Git. |
| Imagens | Artifact Registry, com versões identificadas e política de retenção que preserve o rollback necessário. |

Manter poucos processos e módulos compartilhados. Os sete laboratórios continuam usando a API e os módulos de worker comuns; esta decisão não cria um serviço por laboratório.

Cloud SQL, conectividade, região, dimensionamento e prazo de cada janela devem ser concretizados com orçamento antes de provisionar. Preferir IP privado com Direct VPC egress quando viável, incluindo a rede na estimativa e evitando IPv4 público ocioso. O banco não inicia automaticamente quando alguém abre o site.

Worker pools, GPU e GKE ficam para necessidades ou experimentos posteriores documentados. Treinamento permanece separado da inferência e da primeira demo CPU.

## Motivos

- A API HTTP e as tarefas Python finitas correspondem aos modelos Service e Job do Cloud Run.
- Instâncias da API podem chegar a zero, enquanto jobs executam apenas o trabalho solicitado. Isso atende ao uso esporádico previsto.
- O projeto pode usar imagens Go/Python e concentrar o esforço nos contratos, persistência e recuperação, com menos operação de hosts e clusters.
- A demo evita disputar recursos com as aplicações da VM atual ou exigir seu upgrade permanente apenas para hospedar o LabAI bry4n.
- O frontend estático pode ser distribuído pelo Firebase Hosting sem um processo de servidor para gerar suas páginas.

Esses motivos sustentam a escolha para o contexto atual; não comprovam que seja a opção de menor custo em qualquer carga. As características da plataforma estão descritas na [visão geral do Cloud Run](https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run) e no [Firebase Hosting](https://firebase.google.com/docs/hosting).

## Alternativas consideradas

| Alternativa | Motivo para não adotá-la na primeira demo |
|---|---|
| Ampliar a VM existente e hospedar a stack nela | Aumenta o gasto durante todo o mês e compartilha capacidade e falhas com aplicações atuais. O upgrade pode ser útil para essas aplicações, mas não é requisito demonstrado do LabAI bry4n. |
| VM exclusiva ligada somente nas demos | Alternativa viável e com estimativa próxima; exige administrar sistema, deploy, TLS, backup e procedimento de início/encerramento. Cloud Run foi escolhido pela menor carga operacional. |
| App Engine Standard | Pode atender aplicações web pequenas; adaptar esta stack não trouxe vantagem demonstrada sobre os modelos Service e Job. |
| App Engine Flexible | Capacidade permanente e ausência de escala a zero não combinam com a janela sob demanda prevista. |
| GKE Autopilot ou Standard | O produto ainda não demonstrou necessidade de Kubernetes; acrescentaria configuração e operação de workloads, rede e recursos do cluster. |
| Cloud Run functions / Cloud Functions | Úteis para handlers de eventos isolados; não há necessidade de fragmentar a API modular e os workers em funções. |
| Cloud Run para servir a SPA ou Firebase App Hosting | A SPA prevista gera arquivos estáticos. Reavaliar uma hospedagem com runtime de frontend se surgir renderização no servidor. |

A comparação detalhada, inclusive as diferenças entre modos e os exemplos de custo, permanece no [documento de apoio](../architecture/comparativo-deploy-gcp.md).

## Fluxo de execução e persistência

1. Iniciar a janela de demo, preparar o banco e verificar readiness antes de aceitar runs.
2. A API valida identidade, tenant e acesso ao objeto no servidor. Grava run e intenção de execução em uma transação e retorna `202` após o commit.
3. Solicitar execução de um job depois da persistência. A intenção durável permanece no PostgreSQL; Cloud Run Jobs não substitui uma fila de negócio.
4. Workers usam leases, tentativas limitadas e atualização condicionada ao estado da run para lidar com concorrência e invocações duplicadas. Persistem resultados e referências dos artefatos.
5. Implementar recuperação das pendências caso a solicitação do job falhe depois do commit. Uma varredura finita pode usar os módulos e a imagem existentes; agendas só devem atuar durante a janela de demo.
6. O console consulta estado e resultados persistidos. Encerrar a janela bloqueando novas runs, concluindo ou cancelando tarefas conforme deadline e parando o banco após as verificações operacionais.

Não depender de uma thread continuar após responder HTTP para executar trabalho durável. Definir pool SQL e limites agregados de instâncias, tasks e conexões; o autoscaling da aplicação não amplia automaticamente a capacidade do banco.

Se usarmos rewrites `/v1/**` do Firebase Hosting para a API, essas regras precedem o fallback da SPA. O proxy tem timeout de 60 segundos, portanto processamento demorado permanece assíncrono. A hospedagem não substitui autenticação e autorização da API. [Integração Hosting/Cloud Run](https://firebase.google.com/docs/hosting/cloud-run).

## Consequências

Aceitamos cold starts e uma etapa operacional para iniciar PostgreSQL antes das demos. Fora da janela, o frontend deve explicar a indisponibilidade das operações; esse estado ainda precisa ser implementado.

Estado e arquivos importantes devem permanecer fora da instância. Os workers precisam tolerar interrupção, timeout e repetição; a plataforma não garante os invariantes de negócio. Rollback de revisão não substitui migrações compatíveis ou restauração do banco.

Persistência, idempotência, concorrência, timeout, recuperação, isolamento por tenant e estados acessíveis do console precisam ser verificados com execuções reais. Mantemos a primeira integração local como etapa anterior ao deploy.

## Custo e operação sob demanda

A estimativa aceita como **referência de planejamento** é um acréscimo de **R$20–40/mês**, levando o gasto informado de R$100 para aproximadamente **R$120–140/mês**. Ela usa uma demo CPU pequena, cerca de 20 horas de janela por mês, armazenamento limitado, ausência de GPU/HA/APIs pagas de IA e hipótese de conversão de R$5,50/US$.

Essa faixa não é um teto de cobrança nem uma fatura conciliada. O exemplo SQL usa preços de `us-central1`; região final, SKUs em reais, impostos, franquias, retries, builds, registry, rede e retenção podem alterar o valor. Os cálculos estão no [comparativo](../architecture/comparativo-deploy-gcp.md).

Persistência e retenção podem continuar cobrando fora da janela. Definir prazo, desligamento verificável, recursos temporários e orçamento antes do provisionamento. A escolha da arquitetura não autoriza, por si só, aumento de recursos ou despesa.

## Verificação e pendências

Esta entrega registra a decisão e verifica documentação e links. A [evidência do ADR](../evidence/2026-10-11-adr-cloud-run.md) registra ambiente, commit base, comandos e resultado.

- [ ] Implementar e verificar a integração local de ponta a ponta.
- [ ] Definir região, projeto de destino, recursos e orçamento autorizado.
- [ ] Implementar contratos, persistência, idempotência e recuperação das runs.
- [ ] Implementar autenticação OIDC e autorização por tenant e objeto.
- [ ] Preparar builds, imagens, configuração de deploy e rollback.
- [ ] Definir e testar backup, restauração e início/encerramento da janela.
- [ ] Medir latência, cold start e custo real da primeira demo.

Na entrega original deste ADR, build, testes, demo e deploy eram `not_run`. A casca local foi posteriormente verificada conforme o ADR 0002; isso não conclui os fluxos acima. Métricas de experimentos e custo observado continuam `null`.

## Quando reavaliar

Criar outro ADR se surgirem necessidade de operação permanente, consumidores contínuos, SSR, restrições de runtime, treinamento distribuído ou limites observados incompatíveis com esta solução. GKE e GPU podem ser comparados em janelas temporárias com objetivos e orçamento próprios. Uma mudança futura deve indicar se complementa ou substitui este ADR.

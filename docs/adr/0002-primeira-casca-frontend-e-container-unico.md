# ADR 0002 — Frontend inicial e container único no Cloud Run

- **Status:** aceito.
- **Data:** 11/10/2026.
- **Atualização:** 12/10/2026; interação orbital e Tailwind registrados no [ADR 0003](0003-timeline-orbital-e-tailwind.md).
- **Escopo:** primeira casca navegável; complementa o [ADR 0001](0001-cloud-run-para-demo-sob-demanda.md).
- **Implementação:** integração local verificada; publicação cloud pendente de projeto e orçamento autorizados.

## Contexto

O responsável pediu publicar uma casca para começar a evolução do LabIA, com frontend limpo, interações refinadas e referências portáteis para futuras páginas. A stack planejada já era React/TypeScript/Vite e Go; não existe requisito de SSR. Os experimentos, autenticação, runs, workers e banco ainda não estão implementados.

O ADR 0001 descreve a demo futura com SPA no Firebase Hosting, API no Cloud Run, Jobs e PostgreSQL externo. Para este primeiro incremento, distribuir uma SPA e uma API somente de leitura em dois produtos acrescentaria configuração e duas publicações sem benefício comprovado.

## Decisão

Preservar **React + TypeScript + Vite**, com dependências fixadas e lockfile real. Servir o build estático e a API mínima Go em **um container e um Cloud Run Service**. Nesta etapa, esta escolha substitui apenas o destino Firebase Hosting do console no ADR 0001. Separar a distribuição estática continua uma alternativa futura; não exige SSR.

O container contém apenas o binário Go estático, HTML, CSS, JavaScript, fonte local e SVGs autorais. O processo usa `0.0.0.0:$PORT`, usuário sem privilégios e encerramento gracioso. Build em estágios separados, bases identificadas por versão e digest, assets com hash/cache e gzip pré-calculado. Banco, bucket de artefatos de experimentos, workers, IdP e GPU entram quando uma próxima fatia precisar deles.

Entregar catálogo com sete slugs preservados, detalhe de plano, arquitetura, operação, busca por teclado e estados honestos para rotas de runs/resultados. `GET /v1/labs` retorna metadados públicos com `planned` e `available: false`; `GET /healthz` consulta o processo real. Nenhuma run é criada, nenhum dado de usuário é salvo e nenhum diagrama representa uma execução real.

### Identidade e interação

Adotar a direção documentada no [guia visual](../design/README.md): branco quente, grafite, cinzas e um azul de destaque; Manrope local, índice editorial e visualizações SVG próprias. Apple, Linear e Vercel orientam composição e acabamento; o Project Index do 21st.dev orienta a relação lista/preview. A consulta ocorreu via web, 21st.dev MCP e Playwright MCP.

Motion for React cuida de entrada, continuidade de seleção, profundidade do mapa e expansão; CSS cuida de feedback local. Scroll nativo, poucos momentos de movimento, controles sempre acessíveis e alternativa estática em `prefers-reduced-motion`. Diálogo nativo para busca com foco contido, Escape, setas e Enter. As regras de novas páginas ficam em `apps/web/AGENTS.md`.

O [ADR 0003](0003-timeline-orbital-e-tailwind.md) substitui a proposta de camadas tipográficas na abertura pelo componente Radial Orbital Timeline fornecido pelo responsável, acrescentando Tailwind e primitives shadcn. O restante da casca e a decisão de container único permanecem os mesmos. A abertura apresenta os sete temas do portfólio com dados do catálogo; a demo original ficou isolada.

## Perfil de publicação preparado

| Item | Perfil proposto |
|---|---|
| Serviço | `labia`, criado separadamente das aplicações existentes |
| Região | `us-central1`, proposta inicial para esta casca; confirmar junto ao projeto de destino |
| Recursos | 1 vCPU, 256 MiB, concorrência 40, timeout HTTP de 30 s |
| Escala | Mínimo zero; máximo uma instância por revisão |
| Cobrança | Por requisição, CPU com throttling; sem CPU boost |
| Acesso | Público somente para console, catálogo e health; não expõe contas, segredos ou dados pessoais |
| Build | Dockerfile via Cloud Build; upload limitado por allowlist conferida antes da publicação |
| Persistência | Nenhuma neste incremento; o Git salva código, documentação e referências |
| Revisão operacional | Primeira janela de publicação e smoke test de até 15 minutos; console poderá continuar sob demanda com mínimo zero |

O projeto e o teto financeiro ainda precisam de resposta do responsável. A sugestão de R$20/mês adicionais foi enviada, **não aprovada**. O limite de instâncias não é um teto de faturamento; builds, imagens, logs e tráfego continuam relevantes. A franquia é compartilhada na conta, inclusive com os Cloud Run existentes. [Preços oficiais](https://cloud.google.com/run/pricing).

A faixa de R$20–40 do ADR 0001 incluía um perfil futuro com PostgreSQL e artefatos; não atribuir essa faixa automaticamente à casca sem banco. Custo medido do LabIA: `null`. Não foi criada infraestrutura paga para validar o código.

## Alternativas

| Alternativa | Avaliação |
|---|---|
| Firebase Hosting + API Cloud Run agora | Boa distribuição estática e evolução possível; acrescentaria configuração de Hosting/proxy e uma segunda publicação nesta primeira fatia. |
| Next.js com SSR | Sem necessidade atual de renderização no servidor; alteraria a stack e o runtime sem resolver um requisito demonstrado. |
| Hospedar na VM atual | Compartilha capacidade com serviços existentes e requer operação do host; a casca não justifica resize. |
| GKE, App Engine ou funções separadas | Não há requisito de cluster, runtime de App Engine ou fragmentação da API para este incremento. |
| Mock de runs e métricas | Rejeitado: fixtures e diagramas não devem aparentar implementação ou resultados reais. |

## Consequências

Frontend e API são publicados e revertidos juntos. Um cold start pode afetar os arquivos estáticos; cache do navegador reduz novas transferências. A hospedagem poderá ser separada quando distribuição, disponibilidade independente ou SEO exigirem outra decisão.

O catálogo está embarcado no binário; alterações exigem novo build. Trata-se de metadados versionados, não de persistência de negócio. Antes de expor operações de escrita, implementar autenticação e autorização no servidor, persistência, idempotência e recuperação conforme o ADR 0001.

## Verificação

Build TypeScript/Vite, testes/vet Go, compilação Linux/amd64 e 27 verificações Playwright MCP passaram. Toque em contexto mobile, fonte local, gzip, headers e movimento normal foram conferidos adicionalmente. O [registro de evidências](../evidence/2026-10-11-primeira-casca-web.md) identifica versões, comandos, reparos e limitações.

- [x] Casca local integrada e verificada, sem simular experimentos.
- [x] Padrão visual, referências, capturas e instruções de novas páginas registrados.
- [x] Dockerfile e seleção de arquivos de upload preparados; código Linux compilado.
- [ ] Confirmar projeto e teto financeiro.
- [ ] Executar build do container no ambiente de publicação.
- [ ] Publicar e verificar URL/revisão do Cloud Run.
- [ ] Medir custo real e validar rollback cloud.

Deploy, build de container e rollback cloud: `not_run`. Laboratórios executados: nenhum; métricas de experimentos: `null`.

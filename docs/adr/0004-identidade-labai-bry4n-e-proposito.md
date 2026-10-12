# ADR 0004 — Identidade LabAI bry4n e propósito explícito

- **Status:** aceito pelos pedidos explícitos do responsável.
- **Data:** 12/10/2026.
- **Escopo:** nome do produto, assinatura visual, propósito da abertura e identificadores internos.

## Contexto

O responsável pediu renomear o projeto para **LabAI bry4n**, destacar **bry4n em laranja** e explicar melhor o objetivo no início. A abertura anterior apresentava o portfólio, mas o slogan e a descrição não deixavam suficientemente claro o que o laboratório pretende construir.

## Decisão

Adotar LabAI bry4n como nome oficial. Reutilizar `Brand` e `BrandName` em header, footer, estados e órbita. A assinatura bry4n fica em laranja: `#ba4f0d` em superfícies claras e `#f08a40` em escuras. Os controles e a interação orbital mantêm a direção aprovada; o laranja destaca a identidade.

A abertura usa **Aprender. Na prática.** e explica que o laboratório aprende engenharia de software, dados e IA construindo projetos que registram problema, solução, decisões e testes. O objetivo declarado é transformar o aprendizado em um portfólio técnico com código e resultados que possam ser conferidos. Os sete projetos continuam explicitamente planejados.

Padronizar identificadores locais e configuração preparada com `labai-bry4n`: pacote `@labai-bry4n/web`, módulo `labai-bry4n.local/api`, serviço de saúde `labai-bry4n-api`, projeto Compose, binário do container, exemplos de configuração e nome proposto do Cloud Run. Exemplos de banco usam `labai_bry4n`, adequados ao identificador SQL.

Atualizar juntos implementação, OpenAPI e QA para o novo valor de `service` em `/healthz`. Essa alteração pode afetar consumidores que comparem o nome antigo literalmente; é autorizada pela renomeação e ocorre na casca local, antes de um deploy do produto. O contrato de catálogo v1, as rotas, os sete slugs, status e indisponibilidade dos laboratórios permanecem estáveis.

Documentação ativa adota o novo nome. Evidências anteriores conservam nomes, comandos e revisões registrados na época. URLs GitHub existentes, diretório do checkout e arquivo local `999module_study/LabIA.md` continuam com seus endereços reais, para preservar links e acesso aos materiais.

## Verificação e consequências

Build, instalação pelo lockfile, testes/vet Go, compilação Linux e Playwright MCP foram executados conforme a [evidência](../evidence/2026-10-12-identidade-labai-bry4n.md). Capturas atualizadas no [guia visual](../design/README.md).

A mudança de nome não conclui os laboratórios nem ativa serviços cloud. Deploy, build de container e custo medido permanecem `not_run`, `not_run` e `null`. O objetivo agora pode ser entendido pela leitura da abertura, sem depender da animação.

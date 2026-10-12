# ADR 0003 — Integrar a timeline orbital fornecida com Tailwind

- **Status:** aceito pelo pedido explícito do responsável.
- **Data:** 12/10/2026.
- **Atualização:** 12/10/2026, aplicando os sete temas reais como portfólio, conforme novo pedido do responsável.
- **Escopo:** interação da abertura e estrutura de componentes; complementa o [ADR 0002](0002-primeira-casca-frontend-e-container-unico.md).

## Contexto

A abertura em camadas foi rejeitada pelo responsável, que pediu voltar à composição anterior e usar os exemplos do 21st.dev. Após uma reinterpretação visual, ele forneceu o código completo de Radial Orbital Timeline, sua demo e os primitives badge/button/card, solicitando copiá-los para o projeto.

O console já usa React 19, TypeScript e Vite, mas não tinha Tailwind nem os aliases esperados. O código recebido inclui tipos de timer Node em contexto de navegador, setters não utilizados, ref com retorno de atribuição e ações em divs que precisam de compatibilidade e teclado.

## Decisão

Integrar o [Radial Orbital Timeline de jatin-yadav05](https://21st.dev/@jatin-yadav05/components/radial-orbital-timeline) usando o código fornecido como base. Preservar cena preta, núcleo em gradiente com anéis, rotação, profundidade por opacidade, card expansível e navegação entre nós conectados. Este componente usa HTML, CSS e JavaScript com perspectiva; não é um modelo geométrico WebGL.

Manter a composição de texto à esquerda e interação à direita, a navegação, o catálogo real e as demais páginas. Remover a abertura tipográfica e a alternativa de mapa/esfera. O shader-orb indicado pelo responsável permanece uma referência, sem implementação paralela na casca.

Adicionar Tailwind 4.3.3 com plugin Vite, estrutura `src/components/ui/`, `components.json`, alias `@` e `cn`. Copiar badge, button e card; instalar CVA, Radix Slot, clsx e tailwind-merge com versões fixadas. Não trocar Vite por Next.js nem reinicializar o projeto pelo CLI. Reutilizar os tokens existentes e omitir Preflight para preservar o reset do console.

Aplicar os ajustes necessários: tipos/ref compatíveis com React 19 e navegador, atualizadores puros no StrictMode, botões semânticos, Enter/Space, Escape com retorno de foco, controle de pausa e movimento reduzido. Adaptar raio e largura/posição do card ao espaço disponível. Interromper o timer quando a cena não está visível, a aba está oculta, há foco/ponteiro na interação ou um item está expandido.

Após aprovar a interação, o responsável solicitou os temas do projeto em formato de portfólio. A abertura passa a usar `PortfolioOrbit`: sete nós para os sete slugs, com nomes, resumos e tags da API Go. Labels e relações editoriais são definidos por slug no adaptador. Cards em português mostram Planejado e a rota real do projeto. Relações não representam dependências em execução; Jev permanece separado do fine-tuning de documentos.

Data e energia tornam-se campos opcionais no componente reutilizável; o portfólio os omite. Label curto, slug, tags e rota são campos adicionais compatíveis com a demo anterior. A demo conserva os cinco itens originais em arquivo isolado, sem aparecer na abertura. Não atribuir percentuais ou conclusão fictícios ao produto.

## Alternativas

| Alternativa | Avaliação |
|---|---|
| Recriar uma visualização inspirada | Rejeitada: não atende ao pedido de integrar o componente específico. |
| Colar sem ajustes | Não compila sob todas as regras atuais de TypeScript/React e deixa teclado, pausa e mobile incompletos. |
| Converter todas as classes para CSS nativo | Mudaria o código recebido sem necessidade; Tailwind foi solicitado explicitamente. |
| Instalar Next.js ou engine 3D | Não é necessário para executar este componente; altera o runtime sem requisito. |

## Consequências e verificação

Há novas dependências e um aumento de bundle registrado na [evidência](../evidence/2026-10-12-timeline-orbital.md). A identidade neutra do console continua a referência de novas páginas; gradientes/pulsos pertencem a esta interação específica. Licença MIT declarada na página de origem, attribution em código e aviso distribuído em `public/licenses/`.

Build e Playwright MCP verificam a integração, interação, foco e layouts. A [evidência do portfólio](../evidence/2026-10-12-portfolio-orbital.md) registra 61 verificações gerais e seis de movimento/toque, incluindo os sete cards em quatro larguras. Capturas e regras estão no [guia visual](../design/README.md). A casca não implementa runs ou persistência. Deploy e custo medido permanecem `not_run` e `null`; projeto e orçamento de publicação ainda não foram autorizados.

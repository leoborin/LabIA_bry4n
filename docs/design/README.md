# Direção visual do console LabIA

Estado: primeira casca implementada e validada localmente com Playwright MCP; deploy pendente. Decisão técnica no [ADR 0002](../adr/0002-primeira-casca-frontend-e-container-unico.md).

Este guia é a referência para novas páginas. Preservar a identidade do LabIA e o comportamento compartilhado dos componentes de `apps/web/src/`. As referências orientam qualidade; não copiar suas marcas, textos, assets ou composições.

## Referência portátil do resultado

Capturas do LabIA verificadas em navegador, sem dados privados. Foram capturadas com movimento reduzido para documentar o estado final completo; as animações também foram exercitadas com movimento normal.

- [Catálogo desktop](previews/catalog-desktop.png).
- [Catálogo mobile](previews/catalog-mobile.png).
- [Arquitetura mobile](previews/architecture-mobile.png).
- [Paleta de busca](previews/command-palette.png).
- [Camadas abertas na visão inicial](previews/hero-layers-open.png).
- [Camadas no mobile com toque](previews/hero-layers-mobile.png).

Ao criar outra tela, reutilizar `PageHeading`, `Reveal`, `StatusPill`, `ErrorState`, `Brand`, as regras de layout e os tokens de `styles.css`. A página pode ter uma composição própria dentro desse sistema. Conferir o fluxo e o estado real dos dados, não somente a semelhança da captura.

## Referências e análise

Apple, Linear e Vercel foram consultados na web e inspecionados com Playwright MCP em 11/10/2026. As capturas de benchmark ficam localmente em `.tools/visual-benchmark/`, fora do Git. A documentação e os links abaixo são a referência portátil.

| Referência | O que absorvemos | Aplicação no LabIA |
|---|---|---|
| [Apple](https://www.apple.com/) | Objeto principal legível, hierarquia ampla, espaço negativo e revelação contida. | Uma abertura com tipografia expressiva e uma visualização autoral; controles sempre disponíveis. |
| [Linear](https://linear.app/) | Continuidade entre informação e detalhe, densidade organizada e precisão das ações. | Navegação por teclado, paleta de busca e expansão de laboratório com foco preservado. |
| [Vercel](https://vercel.com/) | Contraste neutro e distinção clara entre assunto, interface e informação técnica. | Metadados discretos, linhas finas e estados operacionais separados de conteúdo de apresentação. |
| [Project Index — ssychui / 21st.dev](https://21st.dev/@ssychui/components/project-index) | Índice editorial, preview associado ao item e equivalência entre hover e foco. | Lista de laboratórios com conteúdo e visualização próprios. Referência consultada pelo 21st.dev MCP; não instalar seu template ou imagens fictícias. |
| [CardStack — Ruixen / 21st.dev](https://21st.dev/@ruixen.ui/components/card-stack) | Camadas em perspectiva, abertura e manipulação com gesto. | Hero tipográfico autoral com Pergunta, Decisão e Evidência, entrada coordenada e controle contínuo da abertura. Prévia pública inspecionada com Playwright em 12/10; o MCP passou a exigir autenticação. Não copiar suas fotos, adotar Next.js ou adicionar autoplay contínuo. |

Proporção criativa solicitada: Apple 40%, Linear 40%, Vercel 20%, como orientação flexível. A personalidade vem de um laboratório editorial: perguntas concretas, traços de sistema e caminho da ideia à evidência.

## Brief de produto e composição

- Usuário: pessoa explorando o portfólio e responsável acompanhando sua evolução.
- Tarefa: conhecer laboratórios, inspecionar seus planos, entender a arquitetura e consultar a disponibilidade real da API.
- Superfície: aplicação web de exploração; o objeto primário é o laboratório.
- Stack: React, TypeScript e Vite, conforme o projeto; CSS nativo para tokens e estilos; Motion for React para continuidade; Lucide para ícones.
- Primeiro viewport: navegação compacta, título à esquerda, uma visualização autoral à direita e acesso direto ao índice. Sem fileiras de cards decorativos ou números fictícios.
- Tipografia: Manrope Variable local para display e UI; mono nativa apenas em código, identificadores e pequenos labels. Títulos amplos com tracking contido e corpo legível.
- Material: fundo branco levemente quente, grafite, cinza e azul como único destaque de marca. Linhas delicadas e profundidade discreta.
- Prova: dados do catálogo retornados pela API e status de saúde consultado de verdade. Planos e diagramas são identificados como previstos; nenhum run ou resultado inventado.
- Mobile: composição empilhada, navegação compacta e conteúdo de detalhe sem depender de hover. Não miniaturizar o desktop.
- Evidência de aceitação: build, fluxo de exploração, teclado, erro/retry, vazio por busca, mobile e movimento reduzido via Playwright MCP.

## Sistema visual

Tokens centralizados no CSS. Evitar valores e cores soltos em novas telas.

| Papel | Direção |
|---|---|
| Fundo | `#fafaf9`; superfícies brancas e cinza suave |
| Texto principal | `#19191b` |
| Texto secundário | Cinza com contraste verificável; nunca baixa opacidade para conteúdo essencial |
| Marca | Azul `#2459ed`; uso pontual em seleção, conexões e foco |
| Spacing | Base de 4 px, com ritmos de 8, 12, 16, 24, 32, 48, 64 e 96 px |
| Raio | Pequeno em controles, moderado em superfícies de inspeção; pills somente quando têm função |
| Tipo | Display responsivo; corpo 14–18 px e controles legíveis; marcas decorativas de diagramas menores têm equivalente textual acessível |
| Ícones | Traço consistente, com label quando o significado não for evidente |

## Motion e máquina de estados

Tese: a animação revela relações e mantém orientação. O índice e o laboratório selecionado são o objeto que evolui; movimento não representa execução de experimento.

| Momento | Trigger e mudança | Owner e timing | Alternativa acessível |
|---|---|---|---|
| Abertura | Carregamento: entrada de título e objeto em sequência breve. | Motion; entrada do conteúdo até 900 ms, reunião inicial das camadas em aproximadamente 1,5 s; transform/opacity. | Composição estática imediata. |
| Camadas do hero | Entrada única abre/reúne três folhas; clique, arraste horizontal ou range ajustam a abertura. O primeiro gesto cancela a sequência inicial. | HTML/CSS 3D + Motion/JS; spring interruptível; nenhum loop contínuo. | Botão e range por teclado; abertura imediata; parallax removido. |
| Descoberta no scroll | Entrada em uma seção: caminho de pergunta, decisão e evidência. | Motion + SVG; scroll nativo sem bloqueio ou hijacking. | Conteúdo empilhado e legível sem animação. |
| Inspeção | Hover, foco ou seleção mostra o preview do laboratório. | Spring interruptível, aproximadamente 250–450 ms. | Tap e teclado; detalhe com texto sempre disponível. |
| Navegação e expansão | Mudança de rota ou conteúdo mantém a relação com o item escolhido. | Motion para estado React; CSS para feedback local. | Corte imediato e foco no título. |
| Busca | Abrir diálogo, digitar, selecionar e fechar com feedback. | Motion de entrada curta, 180–240 ms. | Diálogo nativo, Escape, foco restaurado e setas/Enter. |
| Consulta da API | Loading, sucesso, erro, timeout e retry refletem a resposta real. | Animação discreta; sem mover controles ou inventar tempo/latência. | Texto de status e live region. |

Estados: loading estável, pronto, selecionado, vazio de busca, erro, permissão negada, indisponibilidade, dados anteriores identificados como desatualizados e movimento reduzido. Não esconder estados de erro em transições.

## Regras de interação e acessibilidade

- Navegação, seleção e busca funcionam por clique, toque e teclado.
- Tab/Shift+Tab mantêm ordem e foco visível; Enter/Space ativam ações; Escape fecha o diálogo e devolve foco ao disparador.
- Rotas movem foco para o título da nova página sem animar a posição desse foco.
- Hover é aprimoramento; nunca o único acesso à informação.
- `prefers-reduced-motion` remove deslocamento, parallax e springs sem retirar conteúdo.
- Status e erros têm texto, sem depender de cor; campos possuem labels; ícones decorativos ficam ocultos da árvore acessível.
- Nenhuma animação ambiente contínua, cursor alterado, rolagem artificial ou autoplay pesado.
- Runs e autenticação ainda não implementados têm estados honestos com próximos passos; não expor controles que fingem executar trabalho.

## Orçamento de performance e revisão

- Usar apenas Motion para a continuidade React e CSS para feedback; evitar empilhar GSAP, canvas, WebGL e bibliotecas de componentes.
- Fontes locais e assets SVG autorais; evitar imagens/vídeos de benchmark no bundle.
- Meta inicial: JavaScript comprimido abaixo de 180 KiB, layout sem overflow e conteúdo primário disponível sem aguardar animações.
- Medir bundle e interações no build real; não afirmar pontuação Lighthouse, conformidade WCAG completa ou 60 fps sem evidência.
- Ao criar outra página, revisar desktop, mobile, teclado, movimento reduzido, console e estados de recuperação. Corrigir clareza e operação antes de acrescentar efeitos.

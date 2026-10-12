# Padrão de frontend — LabIA

Antes de criar ou alterar uma tela, ler [o guia visual](../../docs/design/README.md) e o README desta área. O guia registra as referências Apple, Linear, Vercel e 21st.dev, a identidade própria do LabIA, os tokens e o contrato de motion.

Preservar React/TypeScript/Vite e os componentes compartilhados. Manter CSS e tokens centralizados; adicionar bibliotecas apenas para uma responsabilidade demonstrada.

Novas páginas precisam de hierarquia clara, estado real dos dados, foco e teclado, mobile e `prefers-reduced-motion`. Hover não pode ser o único caminho. Não adicionar gráficos, métricas, runs ou resultados fictícios.

Usar Playwright MCP para conferir interação e layout renderizado quando disponível. Registrar limitações e evidências; inspiração visual não comprova funcionalidade dos laboratórios.

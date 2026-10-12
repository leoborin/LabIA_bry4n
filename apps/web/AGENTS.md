# Padrão de frontend — LabIA

Antes de criar ou alterar uma tela, ler [o guia visual](../../docs/design/README.md) e o README desta área. O guia registra as referências Apple, Linear, Vercel e 21st.dev, a identidade própria do LabIA, os tokens e o contrato de motion.

Preservar React/TypeScript/Vite e os componentes compartilhados. Manter CSS e tokens centralizados; adicionar bibliotecas apenas para uma responsabilidade demonstrada.

Tailwind e os componentes em `src/components/ui/` foram autorizados para integrar o Radial Orbital Timeline fornecido pelo usuário; decisão no [ADR 0003](../../docs/adr/0003-timeline-orbital-e-tailwind.md). Reutilizar aliases e `cn`, manter o reset existente e não substituir a direção visual global pela aparência da demo. A demo deve continuar identificada; status e energia de exemplo não são resultados do produto.

Novas páginas precisam de hierarquia clara, estado real dos dados, foco e teclado, mobile e `prefers-reduced-motion`. Hover não pode ser o único caminho. Não adicionar gráficos, métricas, runs ou resultados fictícios.

Usar Playwright MCP para conferir interação e layout renderizado quando disponível. Registrar limitações e evidências; inspiração visual não comprova funcionalidade dos laboratórios.

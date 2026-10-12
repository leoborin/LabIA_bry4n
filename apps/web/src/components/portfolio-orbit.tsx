import {
  Network,
  Database,
  ChartNoAxesCombined,
  FileText,
  Braces,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import type { Lab } from '@/api/client';
import { Brand } from '@/components/visual';
import RadialOrbitalTimeline, { type TimelineItem } from '@/components/ui/radial-orbital-timeline';

// Editorial relationships between portfolio themes, not runtime dependencies.
const themes = {
  'backend-events': {
    id: 1,
    label: 'Eventos',
    icon: Network,
    related: ['data-platform', 'reliability-platform'],
  },
  'data-platform': {
    id: 2,
    label: 'Dados',
    icon: Database,
    related: ['backend-events', 'credit-risk'],
  },
  'credit-risk': {
    id: 3,
    label: 'Crédito',
    icon: ChartNoAxesCombined,
    related: ['data-platform', 'jev-classification'],
  },
  'documents-finetuning': { id: 4, label: 'Documentos', icon: FileText, related: ['rag-agents'] },
  'rag-agents': {
    id: 5,
    label: 'Agentes',
    icon: Braces,
    related: ['data-platform', 'documents-finetuning'],
  },
  'jev-classification': { id: 6, label: 'Jev', icon: Layers, related: ['credit-risk'] },
  'reliability-platform': {
    id: 7,
    label: 'Confiabilidade',
    icon: ShieldCheck,
    related: ['backend-events', 'data-platform'],
  },
} satisfies Record<string, { id: number; label: string; icon: typeof Network; related: string[] }>;

export function PortfolioOrbit({
  labs,
  status,
  denied = false,
}: {
  labs: Lab[];
  status: 'loading' | 'success' | 'error';
  denied?: boolean;
}) {
  const items: TimelineItem[] = Object.entries(themes).flatMap(([slug, theme]) => {
    const lab = labs.find((project) => project.slug === slug);
    if (!lab) return [];
    return [
      {
        id: theme.id,
        label: theme.label,
        title: lab.name,
        subtitle: lab.slug,
        content: lab.summary,
        category: lab.category,
        icon: theme.icon,
        status: 'pending',
        statusLabel: 'Planejado',
        tags: lab.tags,
        href: `/labs/${lab.slug}`,
        relatedIds: Object.entries(themes)
          .filter(
            ([relatedSlug]) =>
              theme.related.includes(relatedSlug) &&
              labs.some((project) => project.slug === relatedSlug),
          )
          .map(([, relatedTheme]) => relatedTheme.id),
      },
    ];
  });

  return (
    <figure className="orbital-portfolio">
      {items.length > 0 && !denied ? (
        <RadialOrbitalTimeline
          timelineData={items}
          className="h-[560px]"
          heading="PORTFÓLIO / LABIA"
          ariaLabel="Projetos do portfólio LabIA"
          relatedLabel="Projetos relacionados"
        />
      ) : (
        <div
          className="orbital-timeline portfolio-placeholder"
          role="status"
          aria-label={status === 'loading' ? 'Carregando projetos' : 'Projetos indisponíveis'}
        >
          <span className="portfolio-placeholder-heading">PORTFÓLIO / LABIA</span>
          <Brand />
          <p>
            {status === 'loading'
              ? 'Preparando os projetos.'
              : 'Os projetos estão indisponíveis no momento.'}
          </p>
          {status !== 'loading' && <span>Consulte o catálogo abaixo para tentar novamente.</span>}
        </div>
      )}
      <figcaption>
        {status !== 'success' && items.length > 0 && !denied
          ? 'Último catálogo disponível · projetos planejados.'
          : 'Sete temas. Um portfólio em construção.'}
      </figcaption>
    </figure>
  );
}

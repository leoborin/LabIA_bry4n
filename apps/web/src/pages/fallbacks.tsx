import { Link } from 'react-router-dom';
import { Workflow } from 'lucide-react';
import { Arrow, PageHeading } from '../components/ui';

export function UnavailablePage({ results = false }: { results?: boolean }) {
  return (
    <div className="shell inner-page unavailable-page">
      <PageHeading
        eyebrow="EXPERIMENTOS / EM DESENVOLVIMENTO"
        title={results ? 'A evidência vem depois.' : 'O próximo passo é executar.'}
      >
        {results
          ? 'Resultados aparecerão após a implementação e execução verificável dos experimentos.'
          : 'O fluxo de runs ainda não está disponível. Esta primeira casca permite explorar os planos e a arquitetura.'}
      </PageHeading>
      <div className="empty-emblem">
        <Workflow size={42} strokeWidth={1} />
      </div>
      <Link to="/labs" className="button">
        Explorar os laboratórios
        <Arrow />
      </Link>
    </div>
  );
}
export function NotFound() {
  return (
    <div className="shell inner-page unavailable-page">
      <PageHeading eyebrow="404 / CAMINHO NÃO ENCONTRADO" title="Uma outra direção.">
        Esta página não existe. O catálogo é um bom ponto de partida.
      </PageHeading>
      <Link to="/labs" className="button">
        Voltar ao catálogo
        <Arrow />
      </Link>
    </div>
  );
}

import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useData } from '../api/context';
import { LabGlyph } from '../components/visual';
import {
  Arrow,
  CatalogSkeleton,
  ErrorState,
  PageHeading,
  Reveal,
  StatusPill,
} from '../components/ui';
import { NotFound } from './fallbacks';

export function LabPage() {
  const { slug } = useParams();
  const { catalog, reloadCatalog } = useData();
  const lab = catalog.data?.labs.find((item) => item.slug === slug);
  if (catalog.status === 'loading' && !catalog.data)
    return (
      <div className="shell inner-page">
        <PageHeading eyebrow="LABORATÓRIO" title="Uma pergunta por vez.">
          Carregando o plano deste laboratório.
        </PageHeading>
        <CatalogSkeleton />
      </div>
    );
  if (catalog.status === 'error' && !lab)
    return (
      <div className="shell inner-page">
        <PageHeading eyebrow="LABORATÓRIO" title="Vamos reconectar.">
          O plano será exibido quando a API estiver disponível.
        </PageHeading>
        <ErrorState error={catalog.error} retry={reloadCatalog} />
      </div>
    );
  if (!lab) return <NotFound />;
  const labs = catalog.data!.labs,
    index = labs.indexOf(lab),
    next = labs[(index + 1) % labs.length];
  return (
    <div className="shell inner-page lab-detail">
      <Link to="/labs" className="back-link">
        <ArrowLeft size={15} aria-hidden="true" />
        Todos os laboratórios
      </Link>
      <div className="detail-heading">
        <PageHeading
          eyebrow={`LAB ${String(index + 1).padStart(2, '0')} / ${lab.category.toUpperCase()}`}
          title={lab.name}
        >
          {lab.summary}
        </PageHeading>
        <LabGlyph index={index} large />
      </div>
      <div className="detail-meta">
        <span className="mono">{lab.slug}</span>
        <StatusPill label="Implementação pendente" />
        {lab.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <div className="detail-grid">
        <Reveal>
          <p className="eyebrow">A PERGUNTA</p>
          <h2 className="research-question">{lab.question}</h2>
          <p className="body-copy">
            Este é o ponto de partida. Os resultados serão registrados quando houver uma execução
            reproduzível para sustentar a resposta.
          </p>
        </Reveal>
        <Reveal className="deliverables">
          <p className="eyebrow">O QUE PRETENDEMOS VERIFICAR</p>
          {lab.deliverables.map((item, i) => (
            <div key={item}>
              <span className="mono">0{i + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </Reveal>
      </div>
      <div className="detail-execution">
        <div>
          <span className="eyebrow">PRÓXIMA ETAPA</span>
          <h3>Preparar o primeiro experimento.</h3>
          <p>
            Execuções, configuração de parâmetros e resultados ainda não estão disponíveis. O
            catálogo já permite acompanhar o plano.
          </p>
        </div>
        <Link to="/architecture" className="button button-secondary">
          Ver a arquitetura
          <Arrow />
        </Link>
      </div>
      <Link to={`/labs/${next.slug}`} className="next-lab">
        <span>
          <small className="eyebrow">CONTINUE EXPLORANDO</small>
          <strong>{next.name}</strong>
        </span>
        <ArrowRight size={25} strokeWidth={1.3} aria-hidden="true" />
      </Link>
    </div>
  );
}

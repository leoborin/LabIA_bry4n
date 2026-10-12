import { useState } from 'react';
import { PortfolioOrbit } from '@/components/portfolio-orbit';
import { LayoutGroup, m, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowDown, Braces, FileCheck2, GitBranch, Search, X } from 'lucide-react';
import { useData } from '../api/context';
import { FlowIllustration, spring } from '../components/visual';
import { Arrow, CatalogSkeleton, ErrorState, Reveal, StatusPill } from '../components/ui';

export function CatalogPage() {
  const { catalog, reloadCatalog } = useData();
  const [active, setActive] = useState(0);
  const [filter, setFilter] = useState('Todos');
  const [query, setQuery] = useState('');
  const labs = catalog.data?.labs ?? [];
  const shown = labs.filter(
    (lab) =>
      (filter === 'Todos' || lab.category === filter) &&
      `${lab.name} ${lab.slug} ${lab.summary} ${lab.tags.join(' ')}`
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .includes(
          query
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase(),
        ),
  );
  return (
    <>
      <section className="hero shell">
        <div className="hero-copy">
          <Reveal>
            <p className="eyebrow">
              <span className="eyebrow-line" />
              PORTFÓLIO DE ENGENHARIA E IA
            </p>
            <h1 tabIndex={-1}>
              Da pergunta.
              <br />
              <span>À evidência.</span>
            </h1>
            <p className="hero-description">
              Projetos em engenharia de software, sistemas e inteligência artificial. Arquitetura,
              decisões e evidências em cada etapa.
            </p>
            <div className="hero-actions">
              <a href="#experimentos" className="button">
                Explorar projetos
                <Arrow />
              </a>
              <Link to="/architecture" className="text-link">
                Conhecer o projeto
                <Arrow size={15} />
              </Link>
            </div>
          </Reveal>
          <div className="hero-baseline">
            <span className="mono">01 / EXPLORAR</span>
            <a href="#experimentos" aria-label="Ir ao catálogo">
              <ArrowDown size={16} aria-hidden="true" />
            </a>
            <span>Ideias em desenvolvimento.</span>
          </div>
        </div>
        <Reveal className="hero-object" delay={0.12}>
          <PortfolioOrbit
            labs={labs}
            status={catalog.status}
            denied={catalog.status === 'error' && catalog.error.kind === 'permission'}
          />
        </Reveal>
      </section>
      <section
        id="experimentos"
        className="catalog-section shell"
        aria-labelledby="catalog-heading"
      >
        <Reveal>
          <div className="section-heading">
            <div>
              <p className="eyebrow">DIFERENTES CAMINHOS. O MESMO RIGOR.</p>
              <h2 id="catalog-heading">O que vamos explorar.</h2>
            </div>
            <span className="section-number mono">
              {String(labs.length || 7).padStart(2, '0')} LABORATÓRIOS
            </span>
          </div>
        </Reveal>
        <div className="catalog-tools">
          <div className="filter-group" aria-label="Filtrar laboratórios">
            <LayoutGroup id="filters">
              {['Todos', 'Sistemas', 'Dados', 'IA'].map((item) => (
                <button
                  key={item}
                  className={filter === item ? 'selected' : ''}
                  aria-pressed={filter === item}
                  onClick={() => setFilter(item)}
                >
                  {filter === item && (
                    <m.span
                      layoutId="filter-selected"
                      className="filter-background"
                      transition={spring}
                    />
                  )}
                  <span>{item}</span>
                </button>
              ))}
            </LayoutGroup>
          </div>
          <label className="inline-search">
            <Search size={15} aria-hidden="true" />
            <span className="sr-only">Filtrar por nome, assunto ou tecnologia</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Encontre uma pergunta"
            />
            {query && (
              <button
                className="icon-button"
                onClick={() => setQuery('')}
                aria-label="Limpar filtro"
              >
                <X size={14} />
              </button>
            )}
          </label>
        </div>
        {catalog.status === 'error' && <ErrorState error={catalog.error} retry={reloadCatalog} />}
        {catalog.status === 'loading' && !catalog.data && <CatalogSkeleton />}
        {catalog.data && catalog.status !== 'success' && (
          <p className="stale-note" role="status">
            Exibindo o último catálogo recebido. A consulta atual ainda não foi concluída.
          </p>
        )}
        {catalog.data && (
          <div className="catalog-layout">
            <div className="lab-list" aria-label="Laboratórios planejados">
              {shown.length === 0 ? (
                <div className="filtered-empty" role="status">
                  <Search size={24} />
                  <h3>Nenhuma pergunta por aqui.</h3>
                  <p>Tente outro termo ou explore todos os laboratórios.</p>
                  <button
                    className="text-link"
                    onClick={() => {
                      setQuery('');
                      setFilter('Todos');
                    }}
                  >
                    Limpar filtros
                    <Arrow />
                  </button>
                </div>
              ) : (
                shown.map((lab) => {
                  const index = labs.indexOf(lab);
                  return (
                    <Link
                      key={lab.slug}
                      to={`/labs/${lab.slug}`}
                      className={`lab-row ${active === index ? 'inspected' : ''}`}
                      onPointerEnter={(e) => {
                        if (
                          e.pointerType === 'mouse' &&
                          !document.querySelector('.lab-row:focus-visible')
                        )
                          setActive(index);
                      }}
                      onFocus={() => setActive(index)}
                    >
                      <span className="lab-number mono">{String(index + 1).padStart(2, '0')}</span>
                      <span className="lab-row-content">
                        <strong>{lab.name}</strong>
                        <span>{lab.slug}</span>
                      </span>
                      <span className="lab-category">{lab.category}</span>
                      <span className="row-arrow">
                        <ArrowUpRightIcon />
                      </span>
                    </Link>
                  );
                })
              )}
            </div>
            <aside className="lab-preview" aria-label="Prévia do laboratório selecionado">
              <m.div
                key={labs[active]?.slug}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.18 }}
              >
                <FlowIllustration category={labs[active]?.category ?? 'Sistemas'} index={active} />
                <div className="preview-content">
                  <StatusPill label="Planejado" />
                  <h3>{labs[active]?.question}</h3>
                  <p>{labs[active]?.summary}</p>
                  <Link to={`/labs/${labs[active]?.slug}`} className="text-link">
                    Conhecer este laboratório
                    <Arrow size={15} />
                  </Link>
                </div>
              </m.div>
            </aside>
          </div>
        )}
        <p className="catalog-disclaimer">
          <span className="mini-dot" />
          Os laboratórios estão planejados. Execuções e resultados serão publicados após sua
          implementação e verificação.
        </p>
      </section>
      <MethodSection />
    </>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M5 15 15 5M5 5h10v10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MethodSection() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const steps = [
    {
      verb: 'Explicar.',
      question: 'Comece pela pergunta.',
      description: 'Entender o mecanismo, as restrições e o problema que merece ser resolvido.',
      Icon: Braces,
    },
    {
      verb: 'Decidir.',
      question: 'Escolha com contexto.',
      description: 'Comparar alternativas, assumir trade-offs e registrar os motivos em um ADR.',
      Icon: GitBranch,
    },
    {
      verb: 'Verificar.',
      question: 'Termine com evidência.',
      description:
        'Executar, observar e registrar o resultado real. Inclusive quando ele não é o esperado.',
      Icon: FileCheck2,
    },
  ];
  return (
    <section className="method-section" aria-labelledby="method-heading">
      <div className="shell method-layout">
        <Reveal className="method-intro">
          <p className="eyebrow">NOSSO JEITO DE CONSTRUIR</p>
          <h2 id="method-heading">
            Mais do que
            <br />
            fazer funcionar.
          </h2>
          <p>
            Cada experimento conta uma história completa.
            <br />
            Da primeira pergunta ao que podemos provar.
          </p>
          <Link to="/architecture" className="text-link">
            Entender a arquitetura
            <Arrow />
          </Link>
        </Reveal>
        <div className="method-steps">
          {steps.map((step, i) => (
            <m.button
              key={step.verb}
              className={`method-step ${active === i ? 'active' : ''}`}
              onClick={() => setActive(i)}
              aria-expanded={active === i}
              aria-controls={`method-${i}`}
              onViewportEnter={() => setActive(i)}
              viewport={{ amount: 0.8, once: true }}
            >
              <span className="method-index mono">0{i + 1}</span>
              <span className="method-body">
                <span className="method-verb">{step.verb}</span>
                <span className="method-question">{step.question}</span>
                <m.span
                  id={`method-${i}`}
                  className="method-description"
                  aria-hidden={active !== i}
                  initial={false}
                  animate={{
                    height: active === i ? 'auto' : 0,
                    opacity: active === i ? 1 : 0,
                    paddingTop: active === i ? 12 : 0,
                  }}
                  transition={reduced ? { duration: 0 } : spring}
                >
                  {step.description}
                </m.span>
              </span>
              <step.Icon size={21} strokeWidth={1.3} aria-hidden="true" />
            </m.button>
          ))}
        </div>
      </div>
    </section>
  );
}

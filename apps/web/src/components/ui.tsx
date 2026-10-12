import type { ReactNode } from 'react';
import { m, useReducedMotion } from 'motion/react';
import { ArrowRight, RefreshCw, CircleAlert, LockKeyhole } from 'lucide-react';
import type { ApiError } from '../api/client';

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </m.div>
  );
}

export function Arrow({ size = 17 }: { size?: number }) {
  return <ArrowRight size={size} aria-hidden="true" />;
}

export function ErrorState({ error, retry }: { error: ApiError; retry: () => void }) {
  const permission = error.kind === 'permission';
  return (
    <div className="error-state" role="alert">
      {permission ? (
        <LockKeyhole size={24} aria-hidden="true" />
      ) : (
        <CircleAlert size={24} aria-hidden="true" />
      )}
      <div>
        <h3>{permission ? 'Acesso não autorizado.' : 'A conexão precisa de mais um instante.'}</h3>
        <p>{error.message}</p>
      </div>
      <button className="button button-secondary" onClick={retry}>
        <RefreshCw size={16} aria-hidden="true" />
        Consultar novamente
      </button>
    </div>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="catalog-skeleton" aria-label="Carregando catálogo" role="status">
      {[1, 2, 3, 4].map((item) => (
        <div key={item}>
          <span />
          <span />
          <span />
        </div>
      ))}
      <span className="sr-only">Carregando os laboratórios da API.</span>
    </div>
  );
}

export function StatusPill({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <span className={`status-pill ${active ? 'active' : ''}`}>
      <span aria-hidden="true" />
      {label}
    </span>
  );
}

export function PageHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <Reveal className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1 tabIndex={-1}>{title}</h1>
      <p>{children}</p>
    </Reveal>
  );
}

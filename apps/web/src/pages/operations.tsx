import { useState } from 'react';
import { Activity, Check, Cloud, Database, RefreshCw, ShieldCheck, Workflow } from 'lucide-react';
import { useData } from '../api/context';
import { Arrow, ErrorState, PageHeading, StatusPill } from '../components/ui';

export function OperationsPage() {
  const { health, reloadHealth } = useData();
  const pending = health.status === 'loading';
  const [copied, setCopied] = useState(false);
  const endpoint = `${window.location.origin}/healthz`;
  return (
    <div className="shell inner-page">
      <PageHeading
        eyebrow="OPERAÇÃO / ESTADO OBSERVADO"
        title={
          <>
            Clareza sobre
            <br />
            <span>o que está de pé.</span>
          </>
        }
      >
        A consulta abaixo lê a API de verdade. Capacidade, telemetria de runs e métricas dos
        laboratórios entram nas próximas etapas.
      </PageHeading>
      <section className="health-panel" aria-labelledby="health-heading">
        <div className="health-panel-top">
          <div>
            <p className="eyebrow">CONSULTA DE DISPONIBILIDADE</p>
            <h2 id="health-heading">API do LabAI bry4n</h2>
          </div>
          <button className="button button-secondary" disabled={pending} onClick={reloadHealth}>
            <RefreshCw size={15} aria-hidden="true" />
            {pending ? 'Consultando…' : 'Consultar agora'}
          </button>
        </div>
        <div className="health-status" role="status" aria-live="polite">
          <span className={`health-symbol ${health.status === 'success' ? 'success' : ''}`}>
            <Activity size={28} strokeWidth={1.3} aria-hidden="true" />
          </span>
          <div>
            <strong>
              {health.status === 'success'
                ? 'A API respondeu.'
                : pending
                  ? 'Estabelecendo conexão.'
                  : 'A API está indisponível.'}
            </strong>
            <p>
              {health.status === 'success'
                ? 'O endpoint de saúde retornou status ok.'
                : pending
                  ? 'Aguarde a consulta ao endpoint de saúde.'
                  : 'Consulte novamente ou confira a configuração da implantação.'}
            </p>
          </div>
          <StatusPill
            label={
              health.status === 'success' ? 'Conectada' : pending ? 'Consultando' : 'Indisponível'
            }
            active={health.status === 'success'}
          />
        </div>
        {health.status === 'error' && <ErrorState error={health.error} retry={reloadHealth} />}
        <dl className="health-facts">
          <div>
            <dt>Serviço</dt>
            <dd>{health.data?.service ?? 'Aguardando resposta'}</dd>
          </div>
          <div>
            <dt>Versão</dt>
            <dd className="mono">{health.data?.version ?? '—'}</dd>
          </div>
          <div>
            <dt>Última consulta concluída</dt>
            <dd>{health.checkedAt?.toLocaleTimeString('pt-BR') ?? '—'}</dd>
          </div>
        </dl>
        {health.data && health.status !== 'success' && (
          <p className="stale-note">
            Os dados de serviço e versão acima pertencem à última resposta concluída.
          </p>
        )}
        <div className="endpoint-row">
          <code>GET /healthz</code>
          <button
            className="text-link"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(endpoint);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              } catch {
                setCopied(false);
                window.prompt('Copie o endereço do endpoint:', endpoint);
              }
            }}
          >
            {copied ? 'Endereço copiado' : 'Copiar endereço'}
            {copied ? <Check size={15} /> : <Arrow size={15} />}
          </button>
          <span className="sr-only" role="status">
            {copied ? 'Endereço do endpoint copiado.' : ''}
          </span>
        </div>
      </section>
      <section className="operation-roadmap">
        <p className="eyebrow">DISPONIBILIDADE POR ETAPA</p>
        <div className="operation-row">
          <Cloud size={21} strokeWidth={1.3} />
          <div>
            <strong>Console e catálogo</strong>
            <p>Interface inicial e metadados públicos dos sete laboratórios.</p>
          </div>
          <StatusPill label="Primeira casca" />
        </div>
        {[
          {
            Icon: ShieldCheck,
            title: 'Autenticação e permissões',
            text: 'OIDC e isolamento por tenant ainda precisam ser implementados.',
          },
          {
            Icon: Workflow,
            title: 'Execuções e workers',
            text: 'Runs, filas, persistência e recuperação permanecem pendentes.',
          },
          {
            Icon: Database,
            title: 'Resultados e métricas',
            text: 'Nenhum experimento foi executado ou medido nesta entrega.',
          },
        ].map((item) => (
          <div className="operation-row" key={item.title}>
            <item.Icon size={21} strokeWidth={1.3} aria-hidden="true" />
            <div>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
            <StatusPill label="Planejado" />
          </div>
        ))}
      </section>
    </div>
  );
}

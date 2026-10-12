import { useState } from 'react';
import {
  Braces,
  Check,
  ChevronRight,
  Database,
  ExternalLink,
  Layers,
  Workflow,
} from 'lucide-react';
import { PageHeading, Reveal, StatusPill } from '../components/ui';

const architectureNodes = [
  {
    id: 'console',
    name: 'Console',
    tag: 'React · TypeScript · Vite',
    Icon: Layers,
    description:
      'A interface para conhecer os laboratórios e, nas próximas etapas, iniciar e acompanhar experimentos.',
    state: 'Casca inicial',
  },
  {
    id: 'api',
    name: 'API',
    tag: 'Go · Cloud Run',
    Icon: Braces,
    description:
      'Serve o console, o catálogo público e a consulta de saúde. Autenticação, runs e persistência serão implementados nas próximas fatias.',
    state: 'API mínima',
  },
  {
    id: 'workers',
    name: 'Workers',
    tag: 'Python · Cloud Run Jobs',
    Icon: Workflow,
    description:
      'Executarão tarefas finitas de dados, inferência e avaliação. Nenhum worker ou treinamento está disponível nesta casca.',
    state: 'Planejado',
  },
  {
    id: 'storage',
    name: 'Persistência',
    tag: 'PostgreSQL · Cloud Storage',
    Icon: Database,
    description:
      'Guardará runs, resultados e referências dos artefatos fora das instâncias. Banco e storage ainda não foram provisionados para o LabAI bry4n.',
    state: 'Planejado',
  },
];

export function ArchitecturePage() {
  const [selected, setSelected] = useState(1);
  const node = architectureNodes[selected];
  return (
    <div className="shell inner-page">
      <PageHeading
        eyebrow="ARQUITETURA / VISÃO DO SISTEMA"
        title={
          <>
            Poucas peças.
            <br />
            <span>Fronteiras claras.</span>
          </>
        }
      >
        Um console. Uma API modular. Workers com responsabilidades definidas. A estrutura evolui
        quando há uma razão para separar.
      </PageHeading>
      <Reveal className="architecture-panel">
        <div className="architecture-toolbar">
          <span className="mono">MAPA DO SISTEMA</span>
          <span>Selecione uma camada para conhecer seu papel.</span>
        </div>
        <div className="architecture-map">
          {architectureNodes.map((item, i) => (
            <div className="architecture-node-wrap" key={item.id}>
              <button
                className={`architecture-node ${selected === i ? 'selected' : ''}`}
                onClick={() => setSelected(i)}
                aria-pressed={selected === i}
                aria-controls="node-description"
              >
                <item.Icon size={27} strokeWidth={1.25} aria-hidden="true" />
                <strong>{item.name}</strong>
                <span>{item.tag}</span>
              </button>
              {i < architectureNodes.length - 1 && (
                <span className="architecture-connector" aria-hidden="true">
                  <ChevronRight size={15} />
                </span>
              )}
            </div>
          ))}
        </div>
        <div id="node-description" className="node-description" aria-live="polite">
          <span className="mono">0{selected + 1}</span>
          <div>
            <h2>{node.name}</h2>
            <p>{node.description}</p>
          </div>
          <StatusPill label={node.state} />
        </div>
        <p className="map-disclaimer">
          Mapa de responsabilidades. As conexões previstas não representam tarefas em execução.
        </p>
      </Reveal>
      <div className="architecture-decisions">
        <Reveal>
          <p className="eyebrow">DECISÃO 0001 / ACEITA</p>
          <h2>
            Cloud Run.
            <br />
            Sob demanda.
          </h2>
          <p>
            Containers gerenciados para a API e tarefas finitas para os workers. Nesta primeira
            casca, console e API compartilham um serviço; os demais componentes entram por etapas.
          </p>
          <a
            href="https://github.com/leoborin/LabIA_bry4n/blob/main/docs/adr/0001-cloud-run-para-demo-sob-demanda.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Ler a decisão completa
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </Reveal>
        <Reveal className="principles">
          <p className="eyebrow">PRINCÍPIOS DE EVOLUÇÃO</p>
          {[
            'Persistir antes de aceitar uma execução.',
            'Autorizar tenant e objeto no servidor.',
            'Recuperar trabalho interrompido.',
            'Publicar somente resultados verificáveis.',
          ].map((item) => (
            <p key={item}>
              <Check size={16} strokeWidth={1.5} aria-hidden="true" />
              {item}
            </p>
          ))}
        </Reveal>
      </div>
    </div>
  );
}

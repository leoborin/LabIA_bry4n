import { Braces, Database, Network, ShieldCheck, Sparkles, FileText, Layers } from 'lucide-react';

export const labIcons = [Network, Database, Sparkles, FileText, Braces, Layers, ShieldCheck];
export const spring = { type: 'spring' as const, stiffness: 300, damping: 32, mass: 0.8 };

export function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand ${small ? 'brand-small' : ''}`}>
      <svg aria-hidden="true" viewBox="0 0 40 40" fill="none">
        <path
          d="M10 9v23h21M18 9v15h13"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="31" cy="11" r="3" fill="currentColor" />
      </svg>
      <span>
        Lab<span className="brand-ia">IA</span>
      </span>
    </span>
  );
}

export function LabGlyph({ index, large = false }: { index: number; large?: boolean }) {
  const Icon = labIcons[index % labIcons.length];
  return (
    <span className={`lab-glyph ${large ? 'large' : ''}`}>
      <Icon aria-hidden="true" strokeWidth={1.4} />
    </span>
  );
}

export function FlowIllustration({ category, index = 0 }: { category: string; index?: number }) {
  const labels =
    category === 'Dados'
      ? ['Origem', 'Contrato', 'Linhagem']
      : category === 'IA'
        ? ['Pergunta', 'Modelo', 'Evidência']
        : ['Evento', 'Processo', 'Resultado'];
  return (
    <div className="flow-illustration" aria-label={`Fluxo conceitual: ${labels.join(', ')}`}>
      <span className="flow-label mono">LAB / {String(index + 1).padStart(2, '0')}</span>
      <svg viewBox="0 0 360 170" aria-hidden="true">
        <path d="M66 80H294M180 80V135" fill="none" stroke="#d1d4db" strokeWidth="1" />
        <circle cx="180" cy="80" r="41" fill="#fff" stroke="#dfe1e6" />
        <circle cx="180" cy="80" r="28" fill="#2459ed" />
        <path
          d="M168 68v24h23M176 68v16h15"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect x="40" y="58" width="46" height="46" rx="13" fill="#fff" stroke="#dfe1e6" />
        <rect x="272" y="58" width="46" height="46" rx="13" fill="#fff" stroke="#dfe1e6" />
        <path
          d="m57 75 7 6-7 6m12-10h8m210 3 5 5 9-10"
          fill="none"
          stroke="#737b8e"
          strokeWidth="1.5"
        />
        <circle cx="180" cy="137" r="3" fill="#2459ed" />
      </svg>
      <div className="flow-nouns">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <span className="flow-note mono">FLUXO CONCEITUAL · IMPLEMENTAÇÃO PENDENTE</span>
    </div>
  );
}

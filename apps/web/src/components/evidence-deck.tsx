import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, Layers2, MoveHorizontal } from 'lucide-react';

// Referência de movimento: CardStack / Ruixen, inspecionado no 21st.dev.
// Composição e implementação próprias: três folhas tipográficas, sem autoplay contínuo.
const sheets = [
  {
    word: 'Pergunta.',
    label: '01 / EXPLICAR',
    note: 'Tudo começa com uma boa pergunta.',
    code: 'Q / CONTEXTO',
  },
  {
    word: 'Decisão.',
    label: '02 / DECIDIR',
    note: 'O caminho tem um porquê.',
    code: 'D / ESCOLHA',
  },
  {
    word: 'Evidência.',
    label: '03 / VERIFICAR',
    note: 'O que podemos provar.',
    code: 'E / RESULTADO',
  },
];

export function EvidenceDeck() {
  const reduced = useReducedMotion();
  const [spread, setSpread] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ id: number; x: number; start: number; moved: boolean } | null>(null);
  const bounds = useRef<DOMRect | null>(null);
  const intro = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userValue = useRef(0);
  const target = useMotionValue(reduced ? 0 : 1);
  const expansion = useSpring(target, { stiffness: 95, damping: 22, mass: 1 });
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 100, damping: 24 });
  const rotateY = useSpring(y, { stiffness: 100, damping: 24 });
  const value = reduced ? target : expansion;

  const setValue = (next: number) => {
    if (intro.current) clearTimeout(intro.current);
    const clamped = Math.round(Math.max(0, Math.min(100, next)));
    setSpread(clamped);
    userValue.current = clamped;
    target.set(clamped / 100);
  };

  useEffect(() => {
    if (reduced) {
      target.set(userValue.current / 100);
      return;
    }
    // Uma abertura breve ao entrar; o primeiro gesto cancela a sequência imediatamente.
    intro.current = setTimeout(() => target.set(userValue.current / 100), 650);
    return () => {
      if (intro.current) clearTimeout(intro.current);
    };
  }, [reduced, target]);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (pointer.current?.id === event.pointerId) {
      const distance = event.clientX - pointer.current.x;
      if (Math.abs(distance) > 5) pointer.current.moved = true;
      setValue(pointer.current.start + (distance / (bounds.current?.width ?? 450)) * 170);
      return;
    }
    if (reduced || event.pointerType !== 'mouse' || !bounds.current) return;
    const b = bounds.current;
    x.set(-((event.clientY - b.top) / b.height - 0.5) * 10);
    y.set(((event.clientX - b.left) / b.width - 0.5) * 13);
  };

  return (
    <div className="evidence-deck" aria-label="As camadas de um experimento">
      <div className="deck-overline mono">
        <span className="mini-dot connected" />
        UM EXPERIMENTO. TRÊS CAMADAS.<span>LAB / 01</span>
      </div>
      <div className="deck-viewport">
        <m.div
          ref={stage}
          className="deck-stage"
          style={reduced ? undefined : { rotateX, rotateY }}
          onPointerEnter={(event) => {
            bounds.current = event.currentTarget.getBoundingClientRect();
          }}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            bounds.current = event.currentTarget.getBoundingClientRect();
            pointer.current = {
              id: event.pointerId,
              x: event.clientX,
              start: spread,
              moved: false,
            };
            if (intro.current) clearTimeout(intro.current);
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={move}
          onPointerUp={(event) => {
            if (pointer.current?.id !== event.pointerId) return;
            if (!pointer.current.moved) setValue(spread > 50 ? 0 : 100);
            pointer.current = null;
            if (event.currentTarget.hasPointerCapture(event.pointerId))
              event.currentTarget.releasePointerCapture(event.pointerId);
            x.set(0);
            y.set(0);
          }}
          onPointerCancel={() => {
            pointer.current = null;
            x.set(0);
            y.set(0);
          }}
          onPointerLeave={() => {
            if (!pointer.current) {
              x.set(0);
              y.set(0);
            }
          }}
        >
          {sheets.map((sheet, index) => (
            <DeckSheet
              key={sheet.word}
              sheet={sheet}
              index={index}
              expansion={value}
              reduced={Boolean(reduced)}
            />
          ))}
        </m.div>
        <div className="deck-ground" aria-hidden="true" />
      </div>
      <div className="deck-controls">
        <button
          className="deck-toggle"
          onClick={() => setValue(spread > 50 ? 0 : 100)}
          aria-pressed={spread > 50}
          aria-controls="deck-layers"
        >
          <Layers2 size={15} strokeWidth={1.4} aria-hidden="true" />
          {spread > 50 ? 'Reunir as camadas' : 'Abrir as camadas'}
          <ArrowUpRight size={14} aria-hidden="true" />
        </button>
        <label className="deck-slider">
          <span className="sr-only">Abertura das camadas</span>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={spread}
            onChange={(event) => setValue(Number(event.target.value))}
            aria-valuetext={`${spread}% de abertura`}
          />
        </label>
      </div>
      <p className="deck-hint">
        <MoveHorizontal size={12} aria-hidden="true" />
        Arraste para revelar. Cada camada tem um propósito.
      </p>
      <div id="deck-layers" className="sr-only">
        Pergunta: explicar o contexto. Decisão: escolher com critérios. Evidência: verificar o
        resultado. Esta composição apresenta o método do LabIA, não uma execução.
      </div>
    </div>
  );
}

function DeckSheet({
  sheet,
  index,
  expansion,
  reduced,
}: {
  sheet: (typeof sheets)[number];
  index: number;
  expansion: ReturnType<typeof useMotionValue<number>>;
  reduced: boolean;
}) {
  const translateX = useTransform(expansion, [0, 1], [index * 10, (index - 1) * 28]);
  const translateY = useTransform(expansion, [0, 1], [index * 17, (index - 1) * 124]);
  const rotateZ = useTransform(expansion, [0, 1], [-10 + index * 8, -8 + index * 8]);
  const rotateY = useTransform(expansion, [0, 1], [-16, -6]);
  return (
    <m.div
      className={`deck-sheet deck-sheet-${index}`}
      style={{
        x: translateX,
        y: translateY,
        rotateZ,
        rotateY,
        translateZ: (2 - index) * 8,
        zIndex: 3 - index,
      }}
      initial={reduced ? false : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: reduced ? 0 : 0.6,
        delay: reduced ? 0 : index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      aria-hidden="true"
    >
      <div className="sheet-header mono">
        <span>{sheet.label}</span>
        <span className="sheet-cross">+</span>
      </div>
      <span className="sheet-index" aria-hidden="true">
        0{index + 1}
      </span>
      <div className="sheet-word">{sheet.word}</div>
      <div className="sheet-footer">
        <span>{sheet.note}</span>
        <span className="mono">{sheet.code}</span>
      </div>
    </m.div>
  );
}

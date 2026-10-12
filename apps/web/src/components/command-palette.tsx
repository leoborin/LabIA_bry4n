import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { m, useReducedMotion } from 'motion/react';
import { ArrowRight, Search, X, CornerDownLeft, Layers, Workflow, Activity } from 'lucide-react';
import type { Lab } from '../api/client';

export function CommandPalette({
  open,
  close,
  labs,
}: {
  open: boolean;
  close: () => void;
  labs: Lab[];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const commands = [
    {
      name: 'Todos os laboratórios',
      description: 'Explorar perguntas e planos',
      path: '/labs',
      Icon: Layers,
    },
    {
      name: 'Arquitetura',
      description: 'Como o LabIA se organiza',
      path: '/architecture',
      Icon: Workflow,
    },
    {
      name: 'Operação',
      description: 'Consultar a API e o estado do projeto',
      path: '/operations',
      Icon: Activity,
    },
    ...labs.map((lab) => ({
      name: lab.name,
      description: lab.slug,
      path: `/labs/${lab.slug}`,
      Icon: Layers,
    })),
  ];
  const normal = (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  const results = commands.filter((item) =>
    normal(`${item.name} ${item.description}`).includes(normal(query)),
  );

  useEffect(() => {
    if (open) {
      previousFocus.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setQuery('');
      dialog.current?.showModal();
      input.current?.focus();
    } else {
      dialog.current?.close();
      previousFocus.current?.focus();
    }
  }, [open]);

  return (
    <dialog
      ref={dialog}
      className="command-dialog"
      aria-labelledby="command-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      onKeyDown={(e) => {
        if (e.key !== 'Tab') return;
        const elements = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>('input, button:not(:disabled), a[href]'),
        );
        const first = elements[0],
          last = elements.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }}
    >
      <m.div
        className="command-content"
        key={open ? 'open' : 'closed'}
        initial={reduced ? false : { opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 id="command-title" className="sr-only">
          Navegar pelo LabIA
        </h2>
        <div className="command-input">
          <Search size={20} aria-hidden="true" />
          <input
            ref={input}
            aria-label="Buscar páginas e laboratórios"
            placeholder="Aonde vamos?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                dialog.current?.querySelector<HTMLButtonElement>('.command-result')?.focus();
              }
            }}
          />
          <button aria-label="Fechar busca" className="icon-button" onClick={close}>
            <X size={18} />
          </button>
        </div>
        <p className="command-label mono">EXPLORAR</p>
        <div className="command-results" aria-live="polite">
          {results.length === 0 ? (
            <div className="command-empty">
              <p>Nenhum caminho encontrado.</p>
              <span>Tente o nome de um laboratório ou de uma página.</span>
            </div>
          ) : (
            results.map((item, i) => (
              <button
                className="command-result"
                key={item.path}
                onClick={() => {
                  close();
                  navigate(item.path);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const buttons = Array.from(
                      dialog.current?.querySelectorAll<HTMLButtonElement>('.command-result') ?? [],
                    );
                    buttons[
                      (i + (e.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length
                    ]?.focus();
                  }
                }}
              >
                <item.Icon size={18} aria-hidden="true" />
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.description}</small>
                </span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            ))
          )}
        </div>
        <div className="command-footer">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navegar
          </span>
          <span>
            <CornerDownLeft size={12} /> abrir
          </span>
          <span>
            <kbd>esc</kbd> fechar
          </span>
        </div>
      </m.div>
    </dialog>
  );
}

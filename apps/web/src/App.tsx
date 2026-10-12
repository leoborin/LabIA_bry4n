import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { LayoutGroup, m, useReducedMotion } from 'motion/react';
import { Link, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';
import { AppDataProvider, useData } from './api/context';
import { Brand, spring } from './components/visual';
import { CommandPalette } from './components/command-palette';
import { Arrow } from './components/ui';
import { CatalogPage } from './pages/catalog';
import { LabPage } from './pages/laboratory';
import { ArchitecturePage } from './pages/architecture';
import { OperationsPage } from './pages/operations';
import { NotFound, UnavailablePage } from './pages/fallbacks';

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="fatal-state">
        <Brand />
        <h1>Vamos tentar de novo.</h1>
        <p>O console não conseguiu concluir esta página.</p>
        <button className="button" onClick={() => window.location.reload()}>
          Reabrir o console
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}

export function App() {
  return (
    <Boundary>
      <AppDataProvider>
        <Shell />
      </AppDataProvider>
    </Boundary>
  );
}

function Shell() {
  const { catalog, health } = useData();
  const [search, setSearch] = useState(false);
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const links = [
    ['/labs', 'Laboratórios'],
    ['/architecture', 'Arquitetura'],
    ['/operations', 'Operação'],
  ];
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearch((value) => !value);
      }
      if (e.key === 'Escape') setMenu(false);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);
  useEffect(() => {
    setMenu(false);
    document.title = location.pathname.startsWith('/architecture')
      ? 'Arquitetura — LabIA'
      : location.pathname.startsWith('/operations')
        ? 'Operação — LabIA'
        : 'LabIA — Da pergunta à evidência';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);
  return (
    <>
      <a className="skip-link" href="#main">
        Ir para o conteúdo
      </a>
      <header className="header">
        <div className="header-inner">
          <Link to="/labs" className="brand-link" aria-label="LabIA — início">
            <Brand />
          </Link>
          <nav className="desktop-nav" aria-label="Navegação principal">
            <LayoutGroup id="navigation">
              {links.map(([path, label]) => (
                <NavLink key={path} to={path}>
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <m.span className="nav-marker" layoutId="nav-marker" transition={spring} />
                      )}
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </LayoutGroup>
          </nav>
          <div className="header-actions">
            <button
              className="search-trigger"
              onClick={() => setSearch(true)}
              aria-label="Buscar páginas e laboratórios"
            >
              <Search size={16} aria-hidden="true" />
              <span>Buscar</span>
              <kbd>⌘ K</kbd>
            </button>
            <span className="header-separator" />
            <span className="phase-label mono">
              EM CONSTRUÇÃO
              <span className="mini-dot" />
            </span>
            <button
              className="icon-button mobile-menu-toggle"
              aria-label={menu ? 'Fechar navegação' : 'Abrir navegação'}
              aria-expanded={menu}
              aria-controls="mobile-nav"
              onClick={() => setMenu((value) => !value)}
            >
              {menu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {menu && (
          <nav id="mobile-nav" className="mobile-nav" aria-label="Navegação mobile">
            {links.map(([path, label]) => (
              <NavLink key={path} to={path}>
                {label}
                <Arrow />
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main id="main">
        <RouteView key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Navigate to="/labs" replace />} />
            <Route path="/labs" element={<CatalogPage />} />
            <Route path="/labs/:slug" element={<LabPage />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/operations" element={<OperationsPage />} />
            <Route path="/runs/:id" element={<UnavailablePage />} />
            <Route path="/runs/:id/results" element={<UnavailablePage results />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RouteView>
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <Link to="/labs" aria-label="Voltar ao início">
            <Brand small />
          </Link>
          <span className="footer-note">Construir. Entender. Verificar.</span>
          <Link to="/operations" className="footer-status">
            <span className={`mini-dot ${health.status === 'success' ? 'connected' : ''}`} />
            {health.status === 'success'
              ? 'API respondeu'
              : health.status === 'loading'
                ? 'Consultando API'
                : 'API indisponível'}
            <Arrow size={12} />
          </Link>
        </div>
      </footer>
      <CommandPalette
        open={search}
        close={() => setSearch(false)}
        labs={catalog.data?.labs ?? []}
      />
    </>
  );
}

function RouteView({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const timer = setTimeout(
      () => ref.current?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true }),
      reduced ? 0 : 200,
    );
    return () => clearTimeout(timer);
  }, [reduced]);
  return (
    <m.div
      ref={ref}
      className="route-view"
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.16 }}
    >
      {children}
    </m.div>
  );
}

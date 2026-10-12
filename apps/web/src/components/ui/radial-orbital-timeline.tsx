'use client';

// Source supplied by the user: Jatin Yadav / 21st.dev Radial Orbital Timeline.
// Integration fixes: React 19 refs, browser timer types, keyboard, reduced motion and sizing.
import { useState, useEffect, useRef, useId, type ElementType } from 'react';
import { ArrowRight, Link, Zap, Pause, Play, X } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: ElementType;
  relatedIds: number[];
  status: 'completed' | 'in-progress' | 'pending';
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  className?: string;
}

export default function RadialOrbitalTimeline({
  timelineData,
  className,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [radius, setRadius] = useState(200);
  const [cardWidth, setCardWidth] = useState(256);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [pointerInside, setPointerInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const instanceId = useId();
  const rotating =
    autoRotate &&
    !paused &&
    !reducedMotion &&
    !pointerInside &&
    !focusInside &&
    visible &&
    pageVisible;

  const closeItems = () => {
    setExpandedItems({});
    setActiveNodeId(null);
    setPulseEffect({});
    setAutoRotate(true);
  };

  const getRelatedItems = (itemId: number): number[] =>
    timelineData.find((item) => item.id === itemId)?.relatedIds ?? [];

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    if (nodeIndex < 0 || timelineData.length === 0) return;
    setRotationAngle(270 - (nodeIndex / timelineData.length) * 360);
  };

  const toggleItem = (id: number) => {
    if (expandedItems[id]) {
      closeItems();
      return;
    }
    // Keep updater functions pure under React StrictMode.
    setExpandedItems({ [id]: true });
    setActiveNodeId(id);
    setAutoRotate(false);
    setPulseEffect(Object.fromEntries(getRelatedItems(id).map((relatedId) => [relatedId, true])));
    centerViewOnNode(id);
    nodeRefs.current[id]?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!rotating) return;
    const rotationTimer: ReturnType<typeof setInterval> = setInterval(() => {
      setRotationAngle((previous) => Number(((previous + 0.3) % 360).toFixed(3)));
    }, 50);
    return () => clearInterval(rotationTimer);
  }, [rotating]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resize = new ResizeObserver(([entry]) => {
      setRadius(Math.max(60, Math.min(200, (entry.contentRect.width - 116) / 2)));
      setCardWidth(Math.min(256, entry.contentRect.width - 24));
    });
    const intersection = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    const onVisibility = () => setPageVisible(!document.hidden);
    onVisibility();
    resize.observe(container);
    intersection.observe(container);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      resize.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, angle, zIndex, opacity };
  };

  const isRelatedToActive = (itemId: number): boolean =>
    activeNodeId !== null && getRelatedItems(activeNodeId).includes(itemId);

  const getStatusStyles = (status: TimelineItem['status']): string => {
    switch (status) {
      case 'completed':
        return 'text-white bg-black border-white';
      case 'in-progress':
        return 'text-black bg-white border-black';
      case 'pending':
        return 'text-white bg-black/40 border-white/50';
    }
  };

  return (
    <div
      className={cn(
        'orbital-timeline relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden',
        className,
      )}
      ref={containerRef}
      role="region"
      aria-label="Timeline orbital demonstrativa"
      data-rotation={rotationAngle}
      data-motion={rotating ? 'running' : 'paused'}
      data-effects={paused || reducedMotion || !visible || !pageVisible ? 'paused' : 'running'}
      onClick={(event) => {
        if (event.target === containerRef.current || event.target === orbitRef.current)
          closeItems();
      }}
      onPointerEnter={() => setPointerInside(true)}
      onPointerLeave={() => setPointerInside(false)}
      onFocusCapture={() => setFocusInside(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusInside(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && activeNodeId !== null) {
          event.stopPropagation();
          nodeRefs.current[activeNodeId]?.focus();
          closeItems();
        }
      }}
    >
      <span className="absolute left-6 top-6 text-[9px] tracking-[0.16em] text-white/60">
        INTERAÇÃO DEMONSTRATIVA
      </span>
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: '1000px',
            transform:
              activeNodeId !== null ? `translateY(-${Math.max(0, 140 - radius)}px)` : undefined,
          }}
        >
          <div
            className="pointer-events-none absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 animate-pulse flex items-center justify-center z-10"
            aria-hidden="true"
          >
            <div className="orbital-ring absolute w-20 h-20 rounded-full border border-white/20 animate-ping opacity-70" />
            <div
              className="orbital-ring absolute w-24 h-24 rounded-full border border-white/10 animate-ping opacity-50"
              style={{ animationDelay: '0.5s' }}
            />
            <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md" />
          </div>
          <div
            className="orbital-ring pointer-events-none absolute rounded-full border border-white/10"
            style={{ width: radius * 2, height: radius * 2 }}
            aria-hidden="true"
          />

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;
            const cardId = `${instanceId}-card-${item.id}`;
            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };
            return (
              <div
                key={item.id}
                className="absolute transition-all duration-700"
                style={nodeStyle}
                data-orbital-item={item.id}
              >
                <div
                  className={`pointer-events-none absolute rounded-full -inset-1 ${isPulsing ? 'animate-pulse duration-1000' : ''}`}
                  aria-hidden="true"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${item.energy * 0.25}px`,
                    top: `-${item.energy * 0.25}px`,
                  }}
                />
                <button
                  ref={(element) => {
                    nodeRefs.current[item.id] = element;
                  }}
                  type="button"
                  aria-label={`Explorar ${item.title}`}
                  aria-expanded={Boolean(isExpanded)}
                  aria-controls={isExpanded ? cardId : undefined}
                  className={`orbital-node w-10 h-10 rounded-full flex items-center justify-center
                    ${isExpanded ? 'bg-white text-black' : isRelated ? 'bg-white/50 text-black' : 'bg-black text-white'} border-2
                    ${isExpanded ? 'border-white shadow-lg shadow-white/30' : isRelated ? 'border-white animate-pulse' : 'border-white/40'}
                    transition-all duration-300 transform ${isExpanded ? 'scale-150' : ''}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleItem(item.id);
                  }}
                >
                  <Icon size={16} aria-hidden="true" />
                </button>
                <div
                  className={`pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300 ${isExpanded ? 'text-white scale-125' : 'text-white/70'}`}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <Card
                    id={cardId}
                    style={{ width: cardWidth }}
                    className="orbital-card absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-black/90 text-white backdrop-blur-lg border-white/30 shadow-xl shadow-white/10 overflow-visible"
                    role="region"
                    aria-label={`Detalhes de ${item.title}`}
                  >
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-white/50"
                      aria-hidden="true"
                    />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center gap-2">
                        <Badge className={`px-2 text-xs ${getStatusStyles(item.status)}`}>
                          {item.status === 'completed'
                            ? 'COMPLETE'
                            : item.status === 'in-progress'
                              ? 'IN PROGRESS'
                              : 'PENDING'}
                        </Badge>
                        <span className="text-xs font-mono text-white/50">{item.date}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm mt-2">{item.title}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 bg-transparent hover:bg-white/10 hover:text-white"
                          aria-label="Fechar detalhe"
                          onClick={() => {
                            closeItems();
                            nodeRefs.current[item.id]?.focus();
                          }}
                        >
                          <X size={12} aria-hidden="true" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="text-xs text-white/80">
                      <p>{item.content}</p>
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="flex items-center">
                            <Zap size={10} className="mr-1" aria-hidden="true" />
                            Energy Level
                          </span>
                          <span className="font-mono">{item.energy}%</span>
                        </div>
                        <div
                          className="w-full h-1 bg-white/10 rounded-full overflow-hidden"
                          aria-hidden="true"
                        >
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            style={{ width: `${item.energy}%` }}
                          />
                        </div>
                      </div>
                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <div className="flex items-center mb-2">
                            <Link size={10} className="text-white/70 mr-1" aria-hidden="true" />
                            <h4 className="text-xs uppercase tracking-wider font-medium text-white/70">
                              Connected Nodes
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find(
                                (related) => related.id === relatedId,
                              );
                              if (!relatedItem) return null;
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-6 px-2 py-0 text-xs rounded-none border-white/20 bg-transparent hover:bg-white/10 text-white/80 hover:text-white transition-all"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem.title}
                                  <ArrowRight
                                    size={8}
                                    className="ml-1 text-white/60"
                                    aria-hidden="true"
                                  />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="orbital-controls absolute bottom-5 right-5 z-[250] flex items-center gap-2 text-[10px] text-white/60">
        <span>
          {reducedMotion
            ? 'Movimento reduzido'
            : paused
              ? 'Animação pausada'
              : 'Clique para explorar'}
        </span>
        {!reducedMotion && (
          <button
            type="button"
            aria-label={paused ? 'Retomar animação' : 'Pausar animação'}
            aria-pressed={paused}
            onClick={() => setPaused((previous) => !previous)}
          >
            {paused ? (
              <Play size={14} aria-hidden="true" />
            ) : (
              <Pause size={14} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

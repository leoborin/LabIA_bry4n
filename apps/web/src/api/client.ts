export type Lab = {
  slug: string;
  name: string;
  category: 'Sistemas' | 'Dados' | 'IA';
  summary: string;
  question: string;
  tags: string[];
  deliverables: string[];
  status: 'planned';
  available: false;
};

export type Catalog = { version: 'v1'; phase: 'shell'; labs: Lab[] };
export type Health = { status: 'ok'; service: string; version: string; phase: 'shell' };

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly kind: 'network' | 'permission' | 'invalid',
  ) {
    super(message);
  }
}

const expectedSlugs = [
  'backend-events',
  'data-platform',
  'credit-risk',
  'documents-finetuning',
  'rag-agents',
  'jev-classification',
  'reliability-platform',
];

async function request(path: string, signal: AbortSignal): Promise<unknown> {
  try {
    const response = await fetch(path, {
      signal,
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (response.status === 401 || response.status === 403) {
      throw new ApiError(
        'O acesso à API não foi autorizado. O catálogo permanece indisponível nesta sessão.',
        'permission',
      );
    }
    if (!response.ok)
      throw new ApiError(
        'A API está indisponível. Tente consultar novamente em instantes.',
        'network',
      );
    return await response.json();
  } catch (error) {
    if (signal.aborted) throw error;
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      'Não foi possível conectar à API. Confira sua conexão e tente novamente.',
      'network',
    );
  }
}

export async function getCatalog(signal: AbortSignal): Promise<Catalog> {
  const data = (await request('/v1/labs', signal)) as Partial<Catalog>;
  const valid =
    data.version === 'v1' &&
    data.phase === 'shell' &&
    Array.isArray(data.labs) &&
    data.labs.length === expectedSlugs.length &&
    expectedSlugs.every((slug) => data.labs!.some((lab) => lab.slug === slug)) &&
    data.labs.every(
      (lab) =>
        typeof lab.name === 'string' &&
        typeof lab.summary === 'string' &&
        typeof lab.question === 'string' &&
        ['Sistemas', 'Dados', 'IA'].includes(lab.category) &&
        lab.status === 'planned' &&
        lab.available === false &&
        Array.isArray(lab.tags) &&
        lab.tags.every((tag) => typeof tag === 'string') &&
        Array.isArray(lab.deliverables) &&
        lab.deliverables.every((item) => typeof item === 'string'),
    );
  if (!valid)
    throw new ApiError(
      'O catálogo recebido não corresponde ao contrato desta versão. Consulte novamente.',
      'invalid',
    );
  return data as Catalog;
}

export async function getHealth(signal: AbortSignal): Promise<Health> {
  const data = (await request('/healthz', signal)) as Partial<Health>;
  if (
    data.status !== 'ok' ||
    data.phase !== 'shell' ||
    typeof data.service !== 'string' ||
    typeof data.version !== 'string'
  ) {
    throw new ApiError(
      'A resposta de saúde da API não corresponde ao contrato esperado.',
      'invalid',
    );
  }
  return data as Health;
}

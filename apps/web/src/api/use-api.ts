import { useEffect, useState, useCallback } from 'react';
import { ApiError } from './client';

export type ApiState<T> =
  | { status: 'loading'; data?: T; checkedAt?: Date }
  | { status: 'success'; data: T; checkedAt: Date }
  | { status: 'error'; error: ApiError; data?: T; checkedAt?: Date };

export function useApi<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<ApiState<T>>({ status: 'loading' });
  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let expired = false;
    setState((previous) => ({
      status: 'loading',
      data: previous.data,
      checkedAt: previous.checkedAt,
    }));
    const timer = setTimeout(() => {
      expired = true;
      controller.abort();
    }, 8000);
    load(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted)
          setState({ status: 'success', data, checkedAt: new Date() });
      })
      .catch((error) => {
        if (controller.signal.aborted && !expired) return;
        const apiError = expired
          ? new ApiError(
              'A API levou mais de 8 segundos para responder. Tente consultar novamente.',
              'network',
            )
          : error instanceof ApiError
            ? error
            : new ApiError('Não foi possível concluir a consulta.', 'network');
        setState((previous) => ({
          status: 'error',
          error: apiError,
          data: previous.data,
          checkedAt: previous.checkedAt,
        }));
      })
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [attempt, load]);

  return { state, reload };
}

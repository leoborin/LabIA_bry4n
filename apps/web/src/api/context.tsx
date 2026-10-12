import { createContext, useContext, type ReactNode } from 'react';
import { getCatalog, getHealth, type Catalog, type Health } from './client';
import { useApi, type ApiState } from './use-api';

type AppData = {
  catalog: ApiState<Catalog>;
  reloadCatalog: () => void;
  health: ApiState<Health>;
  reloadHealth: () => void;
};
const DataContext = createContext<AppData | null>(null);

export function useData() {
  const data = useContext(DataContext);
  if (!data) throw new Error('AppDataProvider is required');
  return data;
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { state: catalog, reload: reloadCatalog } = useApi(getCatalog);
  const { state: health, reload: reloadHealth } = useApi(getHealth);
  return (
    <DataContext.Provider value={{ catalog, reloadCatalog, health, reloadHealth }}>
      {children}
    </DataContext.Provider>
  );
}

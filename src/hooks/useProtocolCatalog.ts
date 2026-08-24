import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listProtocolCatalog,
  setProtocolCatalogEntryActive,
  upsertProtocolCatalogEntry,
} from '../lib/protocolCatalog';

const catalogKey = ['protocol-catalog'] as const;

export const useProtocolCatalog = () => useQuery({
  queryKey: catalogKey,
  queryFn: listProtocolCatalog,
  staleTime: 30_000,
});

function useRefreshProtocolCatalog() {
  const client = useQueryClient();
  return () => {
    void client.invalidateQueries({ queryKey: catalogKey });
  };
}

export function useUpsertProtocolCatalogEntry() {
  const refresh = useRefreshProtocolCatalog();
  return useMutation({ mutationFn: upsertProtocolCatalogEntry, onSuccess: refresh });
}

export function useSetProtocolCatalogEntryActive() {
  const refresh = useRefreshProtocolCatalog();
  return useMutation({ mutationFn: setProtocolCatalogEntryActive, onSuccess: refresh });
}

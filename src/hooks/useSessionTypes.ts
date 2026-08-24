import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listSessionTypes, setSessionTypeActive, upsertSessionType } from '../lib/sessionTypes';

const sessionTypesKey = ['sport-session-types'] as const;

export const useSessionTypes = () => useQuery({
  queryKey: sessionTypesKey,
  queryFn: listSessionTypes,
  staleTime: 30_000,
});

function useRefreshSessionTypes() {
  const client = useQueryClient();
  return () => {
    void client.invalidateQueries({ queryKey: sessionTypesKey });
  };
}

export function useUpsertSessionType() {
  const refresh = useRefreshSessionTypes();
  return useMutation({ mutationFn: upsertSessionType, onSuccess: refresh });
}

export function useSetSessionTypeActive() {
  const refresh = useRefreshSessionTypes();
  return useMutation({ mutationFn: setSessionTypeActive, onSuccess: refresh });
}

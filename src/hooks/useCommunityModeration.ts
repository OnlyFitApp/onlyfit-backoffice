import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listCommunitiesForModeration,
  moderateCommunity,
  type CommunityLifecycle,
} from "../lib/communityModeration";

export function useCommunitiesForModeration(
  status: CommunityLifecycle | null,
  query: string,
  limit: number,
  offset: number,
) {
  return useQuery({
    queryKey: ["community-moderation", status, query, limit, offset],
    queryFn: () =>
      listCommunitiesForModeration({ status, query, limit, offset }),
    staleTime: 20_000,
  });
}

export function useModerateCommunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: moderateCommunity,
    onSuccess: () =>
      void queryClient.invalidateQueries({
        queryKey: ["community-moderation"],
      }),
  });
}

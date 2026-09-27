import { coreApi } from '../api/core';
import type { StaffCommunity } from '../api/core.gen';

export type CommunityLifecycle =
  StaffCommunity["status"];
export type CommunityModerationAction =
  "suspend" | "restore" | "read_only" | "archive";

export type ModeratedCommunity = StaffCommunity;

export async function listCommunitiesForModeration(input: {
  status: CommunityLifecycle | null;
  query: string;
  limit: number;
  offset: number;
}) {
  return coreApi.staff.communities({
    status: input.status ?? undefined,
    query: input.query || undefined,
    limit: input.limit,
    offset: input.offset,
  });
}

export async function moderateCommunity(input: {
  communityId: string;
  action: CommunityModerationAction;
  reason?: string;
}) {
  return coreApi.staff.communityAct({
    communityId: input.communityId,
    action: input.action,
    reason: input.reason || null,
  });
}

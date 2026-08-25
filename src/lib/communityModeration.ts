import { supabase } from "./supabase";

export type CommunityLifecycle =
  "draft" | "published" | "read_only" | "suspended" | "archived";
export type CommunityModerationAction =
  "suspend" | "restore" | "read_only" | "archive";

export type ModeratedCommunity = {
  id: string;
  name: string;
  image_url: string | null;
  organization_id: string | null;
  organization_name: string | null;
  lifecycle_status: CommunityLifecycle;
  discovery_visibility: "listed" | "unlisted" | "hidden";
  join_policy: "open" | "approval" | "invite_only";
  posting_policy: "members" | "team" | "approval";
  member_count: number;
  pending_posts: number;
  created_at: string;
};

export type CommunityModerationPage = {
  items: ModeratedCommunity[];
  total: number;
};

export async function listCommunitiesForModeration(input: {
  status: CommunityLifecycle | null;
  query: string;
  limit: number;
  offset: number;
}) {
  const { data, error } = await supabase.rpc("control_list_communities_v2", {
    p_status: input.status,
    p_query: input.query || null,
    p_limit: input.limit,
    p_offset: input.offset,
  });
  if (error) throw error;
  return data as CommunityModerationPage;
}

export async function moderateCommunity(input: {
  communityId: string;
  action: CommunityModerationAction;
  reason?: string;
}) {
  const { error } = await supabase.rpc("control_moderate_community_v2", {
    p_community_id: input.communityId,
    p_action: input.action,
    p_reason: input.reason || null,
  });
  if (error) throw error;
}

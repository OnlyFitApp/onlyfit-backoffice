import { supabase } from './supabase';

export type FeedDistributionSettings = {
  slots_followed: number;
  slots_discovery: number;
  updated_at: string;
};

export type FeedDistributionInput = {
  slotsFollowed: number;
  slotsDiscovery: number;
  expectedUpdatedAt: string;
};

function parseSettings(value: unknown): FeedDistributionSettings {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Configuração do feed indisponível.');
  }
  const row = value as Record<string, unknown>;
  const slotsFollowed = Number(row.slots_followed);
  const slotsDiscovery = Number(row.slots_discovery);
  if (!Number.isInteger(slotsFollowed) || slotsFollowed < 1
    || !Number.isInteger(slotsDiscovery) || slotsDiscovery < 1
    || typeof row.updated_at !== 'string') {
    throw new Error('A configuração de distribuição do feed é inválida.');
  }
  return {
    slots_followed: slotsFollowed,
    slots_discovery: slotsDiscovery,
    updated_at: row.updated_at,
  };
}

export async function getFeedDistributionSettings(): Promise<FeedDistributionSettings> {
  const { data, error } = await supabase.rpc('control_get_feed_algorithm_settings');
  if (error) throw error;
  return parseSettings(data);
}

export async function updateFeedDistributionSettings(input: FeedDistributionInput): Promise<FeedDistributionSettings> {
  const { data, error } = await supabase.rpc('control_update_feed_distribution_v1', {
    p_slots_followed: input.slotsFollowed,
    p_slots_discovery: input.slotsDiscovery,
    p_expected_updated_at: input.expectedUpdatedAt,
  });
  if (error) throw error;
  return parseSettings(data);
}

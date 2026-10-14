import { coreApi } from '../api/core';
import type { SocialPublicationPolicy, StaffFeedSettings } from '../api/core.gen';

export type FeedDistributionSettings = {
  recommendationInterval: number;
  recommendationWindowDays: number;
  version: number;
  selectionMode: StaffFeedSettings['selection_mode'];
  publicationPolicy: SocialPublicationPolicy;
};

export type FeedDistributionInput = {
  recommendationInterval: number;
  recommendationWindowDays: number;
  expectedVersion: number;
  ambassadorVideoSeconds: number;
};

export function parseFeedTuning(interval: string, days: string, minutes: string) {
  const values = [interval, days, minutes].map(Number);
  const seconds = values[2] * 60;
  if (!Number.isInteger(values[0]) || !Number.isInteger(values[1]) || !Number.isInteger(seconds)
    || values[0] < 1 || values[0] > 100
    || values[1] < 1 || values[1] > 30
    || values[2] < 1 || values[2] > 5) return null;
  return { recommendationInterval: values[0], recommendationWindowDays: values[1], ambassadorVideoSeconds: seconds };
}

function fromCore(settings: StaffFeedSettings): FeedDistributionSettings {
  return {
    recommendationInterval: settings.recommendation_interval ?? 5,
    recommendationWindowDays: settings.recommendation_window_days ?? 7,
    version: settings.version,
    selectionMode: settings.selection_mode,
    publicationPolicy: settings.publication_policy,
  };
}

export async function getFeedDistributionSettings(): Promise<FeedDistributionSettings> {
  return fromCore(await coreApi.staff.feedSettings());
}

export async function updateFeedDistributionSettings(input: FeedDistributionInput): Promise<FeedDistributionSettings> {
  // Preserve the published RPC signature. In chronological_discovery these two
  // existing parameters mean recommendation interval and engagement window;
  // Core preserves the old group ratios for already-issued legacy cursors.
  return fromCore(await coreApi.staff.feedSettingsSave({
    followedSlots: input.recommendationInterval,
    discoverySlots: input.recommendationWindowDays,
    expectedVersion: input.expectedVersion,
    selectionMode: 'chronological_discovery',
    ambassadorVideoSeconds: input.ambassadorVideoSeconds,
  }));
}

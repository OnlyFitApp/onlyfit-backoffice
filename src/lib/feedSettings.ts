import { coreApi } from '../api/core';

export type FeedDistributionSettings = {
  followed: number;
  discovery: number;
  version: number;
  selectionMode: 'global_groups' | 'followed_discovery';
  prioritizeFollowed: boolean;
};

export type FeedDistributionInput = {
  slotsFollowed: number;
  slotsDiscovery: number;
  expectedVersion: number;
  selectionMode: 'global_groups' | 'followed_discovery';
  prioritizeFollowed: boolean;
};

export async function getFeedDistributionSettings(): Promise<FeedDistributionSettings> {
  const settings = await coreApi.staff.feedSettings();
  return {
    followed: settings.followed_slots,
    discovery: settings.discovery_slots,
    version: settings.version,
    selectionMode: settings.selection_mode,
    prioritizeFollowed: settings.prioritize_followed,
  };
}

export async function updateFeedDistributionSettings(input: FeedDistributionInput): Promise<FeedDistributionSettings> {
  const settings = await coreApi.staff.feedSettingsSave({
    followedSlots: input.slotsFollowed,
    discoverySlots: input.slotsDiscovery,
    expectedVersion: input.expectedVersion,
    selectionMode: input.selectionMode,
    prioritizeFollowed: input.prioritizeFollowed,
  });
  return {
    followed: settings.followed_slots,
    discovery: settings.discovery_slots,
    version: settings.version,
    selectionMode: settings.selection_mode,
    prioritizeFollowed: settings.prioritize_followed,
  };
}

import { coreApi } from '../api/core';

export type FeedDistributionSettings = {
  followed: number;
  discovery: number;
  version: number;
};

export type FeedDistributionInput = {
  slotsFollowed: number;
  slotsDiscovery: number;
  expectedVersion: number;
};

export async function getFeedDistributionSettings(): Promise<FeedDistributionSettings> {
  const settings = await coreApi.staff.feedSettings();
  return {
    followed: settings.followed_slots,
    discovery: settings.discovery_slots,
    version: settings.version,
  };
}

export async function updateFeedDistributionSettings(input: FeedDistributionInput): Promise<FeedDistributionSettings> {
  const settings = await coreApi.staff.feedSettingsSave({
    followedSlots: input.slotsFollowed,
    discoverySlots: input.slotsDiscovery,
    expectedVersion: input.expectedVersion,
  });
  return {
    followed: settings.followed_slots,
    discovery: settings.discovery_slots,
    version: settings.version,
  };
}

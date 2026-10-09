import { coreApi } from '../api/core';
import type { SocialPublicationPolicy } from '../api/core.gen';

export type FeedDistributionSettings = {
  followed: number;
  discovery: number;
  prioritySlots: number;
  otherSlots: number;
  version: number;
  selectionMode: 'global_groups' | 'followed_discovery';
  prioritizeFollowed: boolean;
  publicationPolicy: SocialPublicationPolicy;
};

export type FeedDistributionInput = {
  slotsFollowed: number;
  slotsDiscovery: number;
  prioritySlots: number;
  otherSlots: number;
  expectedVersion: number;
  selectionMode: 'global_groups' | 'followed_discovery';
  prioritizeFollowed: boolean;
  ambassadorVideoSeconds?: number;
};

export async function getFeedDistributionSettings(): Promise<FeedDistributionSettings> {
  const settings = await coreApi.staff.feedSettings();
  return {
    followed: settings.followed_slots,
    discovery: settings.discovery_slots,
    prioritySlots: settings.priority_slots,
    otherSlots: settings.other_slots,
    version: settings.version,
    selectionMode: settings.selection_mode,
    prioritizeFollowed: settings.prioritize_followed,
    publicationPolicy: settings.publication_policy,
  };
}

export async function updateFeedDistributionSettings(input: FeedDistributionInput): Promise<FeedDistributionSettings> {
  const settings = await coreApi.staff.feedSettingsSave({
    followedSlots: input.slotsFollowed,
    discoverySlots: input.slotsDiscovery,
    expectedVersion: input.expectedVersion,
    selectionMode: input.selectionMode,
    prioritizeFollowed: input.prioritizeFollowed,
    ambassadorVideoSeconds: input.ambassadorVideoSeconds,
    prioritySlots: input.prioritySlots,
    otherSlots: input.otherSlots,
  });
  return {
    followed: settings.followed_slots,
    discovery: settings.discovery_slots,
    prioritySlots: settings.priority_slots,
    otherSlots: settings.other_slots,
    version: settings.version,
    selectionMode: settings.selection_mode,
    prioritizeFollowed: settings.prioritize_followed,
    publicationPolicy: settings.publication_policy,
  };
}

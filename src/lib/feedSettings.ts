import { coreApi } from '../api/core';
import type { SocialPublicationPolicy } from '../api/core.gen';

export type FeedDistributionSettings = {
  followed: number;
  discovery: number;
  ambassadorSlots: number;
  professionalSlots: number;
  commonSlots: number;
  version: number;
  selectionMode: 'global_groups' | 'followed_discovery';
  prioritizeFollowed: boolean;
  publicationPolicy: SocialPublicationPolicy;
};

export type FeedDistributionInput = {
  slotsFollowed: number;
  slotsDiscovery: number;
  ambassadorSlots: number;
  professionalSlots: number;
  commonSlots: number;
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
    ambassadorSlots: settings.ambassador_slots,
    professionalSlots: settings.professional_slots,
    commonSlots: settings.common_slots,
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
    ambassadorSlots: input.ambassadorSlots,
    professionalSlots: input.professionalSlots,
    commonSlots: input.commonSlots,
  });
  return {
    followed: settings.followed_slots,
    discovery: settings.discovery_slots,
    ambassadorSlots: settings.ambassador_slots,
    professionalSlots: settings.professional_slots,
    commonSlots: settings.common_slots,
    version: settings.version,
    selectionMode: settings.selection_mode,
    prioritizeFollowed: settings.prioritize_followed,
    publicationPolicy: settings.publication_policy,
  };
}

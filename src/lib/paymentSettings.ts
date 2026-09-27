import { coreApi } from '../api/core';
import type { StaffPaymentSettings, StaffPaymentSettingsInput } from '../api/core.gen';

export type PlatformPaymentSettings = StaffPaymentSettings;

export function getPlatformPaymentSettings(): Promise<PlatformPaymentSettings> {
  return coreApi.staff.paymentSettings();
}

export async function updatePlatformPaymentSettings(input: {
  payoutProcessingHours: number;
  payoutMinimumAmount: number;
  cardSettlementDays: number;
  settlementWeekdays: number[];
  iosIapCommissionPercent: number;
  iosIapProcessingPercent: number;
  iosIapFixedFee: number;
  iosIapRoundingIncrement: number;
  iosIapPricingEnabled: boolean;
}): Promise<PlatformPaymentSettings> {
  const current = await getPlatformPaymentSettings();
  const settings: StaffPaymentSettingsInput = {
    payout_processing_hours: input.payoutProcessingHours,
    payout_minimum_amount: input.payoutMinimumAmount,
    card_settlement_days: input.cardSettlementDays,
    settlement_weekdays: input.settlementWeekdays,
    ios_iap_commission_percent: input.iosIapCommissionPercent,
    ios_iap_processing_percent: input.iosIapProcessingPercent,
    ios_iap_fixed_fee: input.iosIapFixedFee,
    ios_iap_rounding_increment: input.iosIapRoundingIncrement,
    ios_iap_pricing_enabled: input.iosIapPricingEnabled,
  };
  return coreApi.staff.paymentSettingsSave({ settings, expectedVersion: current.version });
}

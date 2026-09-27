import { coreApi } from '../api/core';
import type { StaffBetaFeedbackItem, StaffBetaFeedbackPage } from '../api/core.gen';

export type BetaFeedbackStatus = 'new' | 'in_review' | 'resolved' | 'discarded';

export type BetaFeedbackItem = StaffBetaFeedbackItem;

export async function listBetaFeedback(status: BetaFeedbackStatus | null, limit: number, offset: number) {
  return coreApi.staff.betaFeedback({ status: status ?? undefined, limit, offset }) as Promise<StaffBetaFeedbackPage>;
}

export async function updateBetaFeedback(input: {
  id: string;
  status: BetaFeedbackStatus;
  internalNotes: string;
  expectedVersion: number;
}) {
  return coreApi.staff.betaFeedbackUpdate({
    id: input.id, status: input.status, internalNotes: input.internalNotes,
    expectedVersion: input.expectedVersion, idempotencyKey: crypto.randomUUID(),
  });
}

export async function createFeedbackScreenshotUrl(feedbackId: string) {
  return (await coreApi.staff.betaFeedbackScreenshot({ feedbackId })).url;
}

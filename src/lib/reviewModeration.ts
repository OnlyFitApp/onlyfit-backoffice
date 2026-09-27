import { coreApi } from '../api/core';
import type { StaffReviewReport } from '../api/core.gen';

export type ReviewReportStatus = 'pending' | 'kept' | 'hidden';
type ReviewModerationAction = 'keep' | 'hide';

export type ReviewReport = StaffReviewReport;

export async function listReviewReports(status: ReviewReportStatus, limit: number, offset: number) {
  return coreApi.staff.reviewReports({ status, limit, offset });
}

export async function resolveReviewReport(input: { reportId: string; action: ReviewModerationAction }) {
  return coreApi.staff.reviewReportAct({
    reportId: input.reportId,
    action: input.action,
  });
}

import { coreApi } from '../api/core';
import type { StaffCourseCommentReport, StaffMemberAccess } from '../api/core.gen';

export type AccessStatus = 'all' | 'active' | 'held' | 'ended';
export type ReportStatus = 'open' | 'resolved' | 'rejected';
export type MemberAreaAccess = StaffMemberAccess;
export type CourseCommentReport = StaffCourseCommentReport;
export type MemberAccessPage = Awaited<ReturnType<typeof coreApi.staff.memberAccesses>>;
export type CourseCommentReportPage = Awaited<ReturnType<typeof coreApi.staff.courseCommentReports>>;
export type MemberAreaAuditPage = Awaited<ReturnType<typeof coreApi.staff.memberAreaAudit>>;

export function listMemberAreaAccesses(input: {
  status: AccessStatus;
  query: string;
  limit?: number;
  offset?: number;
}): Promise<MemberAccessPage> {
  return coreApi.staff.memberAccesses({
    status: input.status === 'all' ? null : input.status,
    query: input.query.trim() || null,
    limit: input.limit ?? 40,
    offset: input.offset ?? 0,
  });
}

export function setMemberAreaAccess(input: {
  entitlementId: string;
  action: 'suspend' | 'resume';
  reason: string;
  expectedVersion: number;
  idempotencyKey: string;
}): Promise<StaffMemberAccess> {
  return coreApi.staff.memberAccessAct({ ...input, reason: input.reason.trim() });
}

export function listCourseCommentReports(input: {
  status: ReportStatus;
  limit?: number;
  offset?: number;
}): Promise<CourseCommentReportPage> {
  return coreApi.staff.courseCommentReports({
    status: input.status,
    limit: input.limit ?? 40,
    offset: input.offset ?? 0,
  });
}

export function moderateCourseCommentReport(input: {
  reportId: string;
  action: 'remove' | 'dismiss';
  reason: string;
  expectedVersion: number;
  idempotencyKey: string;
}) {
  return coreApi.staff.courseCommentReportAct({ ...input, reason: input.reason.trim() });
}

export function listMemberAreaAudit(input: {
  from: string;
  to: string;
  limit?: number;
  offset?: number;
}): Promise<MemberAreaAuditPage> {
  return coreApi.staff.memberAreaAudit({
    from: input.from,
    to: input.to,
    limit: input.limit ?? 40,
    offset: input.offset ?? 0,
  });
}

import { supabase } from './supabase';

export type AccessStatus = 'all' | 'active' | 'revoked' | 'suspended' | 'expired';
export type ReportStatus = 'open' | 'resolved' | 'dismissed';
export type AuditAction = 'all' | 'access_suspended' | 'comment_hidden' | 'report_dismissed';

export type PageCursor = { at: string; id: string };

export type MemberAreaAccess = {
  id: string;
  organization_id: string;
  organization_name: string;
  offering_id: string;
  offering_name: string;
  profile_id: string;
  member_name: string;
  member_email: string | null;
  source: 'purchase';
  granted_at: string;
  starts_at: string;
  expires_at: string | null;
  revoked_at: string | null;
  revocation_reason: string | null;
  suspension_reason: string | null;
  suspended_at: string | null;
  effective_status: Exclude<AccessStatus, 'all'>;
  content_count: number;
};

export type CourseCommentReport = {
  id: string;
  status: ReportStatus;
  reason: string;
  created_at: string;
  comment_id: string;
  comment_body: string;
  author_name: string;
  reporter_name: string;
  organization_id: string;
  organization_name: string;
  course_id: string;
  course_title: string;
  lesson_id: string;
  lesson_title: string;
};

export type MemberAreaAuditEntry = {
  id: number;
  action: Exclude<AuditAction, 'all'>;
  entity_type: 'offering_entitlement' | 'course_comment_report';
  entity_id: string;
  reason: string;
  occurred_at: string;
  organization_id: string;
  organization_name: string;
  actor_name: string;
  subject_name: string | null;
};

export type CursorPage<T> = {
  items: T[];
  has_more: boolean;
  next_cursor: PageCursor | null;
};

function parsePage<T>(value: unknown): CursorPage<T> {
  if (!value || typeof value !== 'object') return { items: [], has_more: false, next_cursor: null };
  const page = value as Partial<CursorPage<T>>;
  return {
    items: Array.isArray(page.items) ? page.items : [],
    has_more: page.has_more === true,
    next_cursor: page.next_cursor && typeof page.next_cursor.at === 'string'
      ? { at: page.next_cursor.at, id: String(page.next_cursor.id) }
      : null,
  };
}

export async function listMemberAreaAccesses(input: {
  status: AccessStatus;
  query: string;
  cursor: PageCursor | null;
  limit?: number;
}) {
  const { data, error } = await supabase.rpc('control_list_member_area_accesses_v1', {
    p_status: input.status,
    p_query: input.query.trim() || null,
    p_before_at: input.cursor?.at ?? null,
    p_before_id: input.cursor?.id ?? null,
    p_limit: input.limit ?? 40,
  });
  if (error) throw error;
  return parsePage<MemberAreaAccess>(data);
}

export async function suspendMemberAreaAccess(input: {
  entitlementId: string;
  reason: string;
  idempotencyKey: string;
}) {
  const { data, error } = await supabase.rpc('control_suspend_member_area_access_v1', {
    p_entitlement_id: input.entitlementId,
    p_reason: input.reason.trim(),
    p_idempotency_key: input.idempotencyKey,
  });
  if (error) throw error;
  return data as { entitlement_id: string; status: 'suspended'; already_suspended: boolean };
}

export async function listCourseCommentReports(input: {
  status: ReportStatus;
  cursor: PageCursor | null;
  limit?: number;
}) {
  const { data, error } = await supabase.rpc('control_list_course_comment_reports_v1', {
    p_status: input.status,
    p_before_at: input.cursor?.at ?? null,
    p_before_id: input.cursor?.id ?? null,
    p_limit: input.limit ?? 40,
  });
  if (error) throw error;
  return parsePage<CourseCommentReport>(data);
}

export async function moderateCourseCommentReport(input: {
  reportId: string;
  action: 'hide' | 'dismiss';
  reason: string;
}) {
  const { data, error } = await supabase.rpc('control_moderate_course_comment_report_v1', {
    p_report_id: input.reportId,
    p_action: input.action,
    p_reason: input.reason.trim(),
  });
  if (error) throw error;
  return data as { report_id: string; status: ReportStatus; already_moderated: boolean };
}

export async function listMemberAreaAudit(input: {
  action: AuditAction;
  cursor: PageCursor | null;
  limit?: number;
}) {
  const { data, error } = await supabase.rpc('control_list_member_area_audit_v1', {
    p_action: input.action,
    p_before_at: input.cursor?.at ?? null,
    p_before_id: input.cursor ? Number(input.cursor.id) : null,
    p_limit: input.limit ?? 40,
  });
  if (error) throw error;
  return parsePage<MemberAreaAuditEntry>(data);
}

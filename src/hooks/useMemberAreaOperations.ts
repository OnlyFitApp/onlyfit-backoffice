import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listCourseCommentReports,
  listMemberAreaAccesses,
  listMemberAreaAudit,
  moderateCourseCommentReport,
  suspendMemberAreaAccess,
  type AccessStatus,
  type AuditAction,
  type PageCursor,
  type ReportStatus,
} from '../lib/memberAreaOperations';

export function useMemberAreaAccesses(status: AccessStatus, query: string, cursor: PageCursor | null, enabled: boolean) {
  return useQuery({
    queryKey: ['member-area-operations', 'accesses', status, query, cursor],
    queryFn: () => listMemberAreaAccesses({ status, query, cursor }),
    placeholderData: keepPreviousData,
    staleTime: 20_000,
    enabled,
  });
}

export function useSuspendMemberAreaAccess() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: suspendMemberAreaAccess,
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ['member-area-operations', 'accesses'] }),
        client.invalidateQueries({ queryKey: ['member-area-operations', 'audit'] }),
      ]);
    },
  });
}

export function useCourseCommentReports(status: ReportStatus, cursor: PageCursor | null, enabled: boolean) {
  return useQuery({
    queryKey: ['member-area-operations', 'reports', status, cursor],
    queryFn: () => listCourseCommentReports({ status, cursor }),
    placeholderData: keepPreviousData,
    staleTime: 20_000,
    enabled,
  });
}

export function useModerateCourseCommentReport() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: moderateCourseCommentReport,
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ['member-area-operations', 'reports'] }),
        client.invalidateQueries({ queryKey: ['member-area-operations', 'audit'] }),
      ]);
    },
  });
}

export function useMemberAreaAudit(action: AuditAction, cursor: PageCursor | null, enabled: boolean) {
  return useQuery({
    queryKey: ['member-area-operations', 'audit', action, cursor],
    queryFn: () => listMemberAreaAudit({ action, cursor }),
    placeholderData: keepPreviousData,
    staleTime: 20_000,
    enabled,
  });
}

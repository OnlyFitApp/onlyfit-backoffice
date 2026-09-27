import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listCourseCommentReports,
  listMemberAreaAccesses,
  listMemberAreaAudit,
  moderateCourseCommentReport,
  setMemberAreaAccess,
  type AccessStatus,
  type ReportStatus,
} from '../lib/memberAreaOperations';

export function useMemberAreaAccesses(status: AccessStatus, query: string, page: number, enabled: boolean) {
  return useQuery({
    queryKey: ['member-area-operations', 'accesses', status, query, page],
    queryFn: () => listMemberAreaAccesses({ status, query, offset: page * 40 }),
    placeholderData: keepPreviousData,
    staleTime: 20_000,
    enabled,
  });
}

export function useSetMemberAreaAccess() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: setMemberAreaAccess,
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ['member-area-operations', 'accesses'] }),
        client.invalidateQueries({ queryKey: ['member-area-operations', 'audit'] }),
      ]);
    },
  });
}

export function useCourseCommentReports(status: ReportStatus, page: number, enabled: boolean) {
  return useQuery({
    queryKey: ['member-area-operations', 'reports', status, page],
    queryFn: () => listCourseCommentReports({ status, offset: page * 40 }),
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

export function useMemberAreaAudit(from: string, to: string, page: number, enabled: boolean) {
  return useQuery({
    queryKey: ['member-area-operations', 'audit', from, to, page],
    queryFn: () => listMemberAreaAudit({ from, to, offset: page * 40 }),
    placeholderData: keepPreviousData,
    staleTime: 20_000,
    enabled,
  });
}

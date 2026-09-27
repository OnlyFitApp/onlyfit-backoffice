import { coreApi } from '../api/core';
import type {
  StaffAccount,
  StaffAccountDetail,
  StaffAccountSummary,
  StaffAccounts,
} from '../api/core.gen';

export type UserListItem = StaffAccountSummary;
export type UserProfileRecord = StaffAccountDetail;
export type UserOverview = StaffAccount;

export type UserSearchFilters = {
  query?: string | null;
  filter?: 'all' | 'staff' | 'professional' | 'inactive';
  createdFrom?: string | null;
  createdTo?: string | null;
  cursor?: string | null;
  limit?: number;
};

export function searchUsers(filters: UserSearchFilters): Promise<StaffAccounts> {
  return coreApi.staff.accounts({
    search: filters.query?.trim() || undefined,
    filter: filters.filter ?? 'all',
    createdFrom: filters.createdFrom || undefined,
    createdTo: filters.createdTo || undefined,
    cursor: filters.cursor || undefined,
    limit: filters.limit ?? 25,
  });
}

export function fetchUserOverview(userId: string): Promise<UserOverview> {
  return coreApi.staff.account({ id: userId });
}

export function displayName(user: {
  display_name?: string | null;
  username?: string | null;
}): string {
  return user.display_name?.trim() || (user.username ? `@${user.username}` : 'Sem nome');
}

export function formatDocument(last4: string | null): string {
  if (last4?.length === 4) return `•••.•••.•${last4.slice(0, 2)}-${last4.slice(2)}`;
  return '—';
}

export function userAdminErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('staff.mfa_required')) return 'Refaça o login com verificação em duas etapas.';
  if (message.includes('staff.forbidden')) return 'Seu papel no backoffice não permite esta ação.';
  if (message.includes('staff.account_not_found')) return 'Conta não encontrada. Atualize a lista.';
  if (message.includes('staff.invalid_role')) return 'Nível interno inválido.';
  return 'Não foi possível concluir a operação. Atualize a página e tente novamente.';
}

import { coreApi } from '../api/core';
import type {
  StaffInviteEmailsSendResult,
  StaffInviteReleaseResult,
  StaffInviteSettings,
  StaffInviteWaitlistEntry,
  StaffInvitedEmail,
  StaffInvitedEmailsAddResult,
} from '../api/core.gen';

export type InviteSettings = StaffInviteSettings;
export type InvitedEmail = StaffInvitedEmail;
export type WaitlistEntry = StaffInviteWaitlistEntry;
export type WaitlistStatus = StaffInviteWaitlistEntry['status'];
export type AddInvitedEmailsResult = StaffInvitedEmailsAddResult;
export type ReleaseResult = StaffInviteReleaseResult;
export type SendInviteEmailsResult = StaffInviteEmailsSendResult;

function intentionKey(): string {
  return crypto.randomUUID();
}

export async function getInviteSettings(): Promise<InviteSettings> {
  return coreApi.staff.inviteSettings();
}

export async function setInviteOnlyEnabled(
  enabled: boolean,
  expectedVersion: number,
): Promise<InviteSettings> {
  return coreApi.staff.inviteSettingsSave({
    enabled,
    expectedVersion,
    idempotencyKey: intentionKey(),
  });
}

export async function listInvitedEmails(search: string, limit: number, offset: number) {
  return coreApi.staff.invitedEmails({ search: search || undefined, limit, offset });
}

export async function addInvitedEmails(
  emails: string[],
  note: string,
): Promise<AddInvitedEmailsResult> {
  return coreApi.staff.invitedEmailsAdd({
    emails,
    note: note.trim() || null,
    idempotencyKey: intentionKey(),
  });
}

export async function removeInvitedEmail(email: string): Promise<void> {
  await coreApi.staff.invitedEmailRemove({ email, idempotencyKey: intentionKey() });
}

export async function listWaitlist(
  status: WaitlistStatus,
  search: string,
  limit: number,
  offset: number,
) {
  const result = await coreApi.staff.inviteWaitlist({
    status,
    search: search || undefined,
    limit,
    offset,
  });
  return {
    items: result.items,
    total: result.total,
    waitingCount: result.waiting_count,
    releasedCount: result.released_count,
  };
}

export async function releaseWaitlistAccess(userId: string): Promise<ReleaseResult> {
  return coreApi.staff.inviteWaitlistRelease({
    accountId: userId,
    idempotencyKey: intentionKey(),
  });
}

export async function sendInviteEmails(emails: string[]): Promise<SendInviteEmailsResult> {
  return coreApi.staff.inviteEmailsSend({ emails, idempotencyKey: intentionKey() });
}

export function invitedSourceLabel(source: InvitedEmail['source']): string {
  switch (source) {
    case 'grandfathered':
      return 'Conta anterior';
    case 'waitlist_release':
      return 'Liberado da fila';
    default:
      return 'Convite manual';
  }
}

/** Aceita e-mails colados em lista, separados por vírgula, ponto e vírgula, espaço ou quebra de linha. */
export function parseEmailList(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(/[\s,;]+/)
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

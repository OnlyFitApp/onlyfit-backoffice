import { coreApi } from '../api/core';
import type {
  StaffFirstContactContract,
  StaffFirstContactSettings,
} from '../api/core.gen';

export type FirstContactSettings = StaffFirstContactSettings;
export type ContractWithoutFirstContact = StaffFirstContactContract;

export async function getFirstContactSettings(): Promise<FirstContactSettings> {
  return coreApi.staff.firstContactSettings();
}

export async function setFirstContactDeadlines(
  reminderHours: number,
  alertHours: number,
  expectedVersion: number,
): Promise<FirstContactSettings> {
  return coreApi.staff.firstContactSettingsSave({
    reminderHours,
    alertHours,
    expectedVersion,
  });
}

export async function listContractsWithoutFirstContact(
  limit: number,
  offset: number,
): Promise<{ items: ContractWithoutFirstContact[]; total: number; hasMore: boolean }> {
  const result = await coreApi.staff.firstContacts({ limit, offset });
  return {
    items: result.items,
    total: result.total,
    hasMore: result.has_more,
  };
}

/** Os erros do Core, em linguagem de quem opera. */
export function deadlineErrorMessage(code: string): string {
  if (code.includes('staff.forbidden')) {
    return 'Seu papel interno não permite mudar os prazos.';
  }
  if (code.includes('staff.invalid_first_contact_deadlines')) {
    return 'Os prazos devem ser horas inteiras entre 1 e 720.';
  }
  if (code.includes('staff.first_contact_alert_before_reminder')) {
    return 'O alerta ao cliente não pode vir antes do lembrete ao profissional.';
  }
  if (code.includes('staff.first_contact_settings_changed')) {
    return 'Outra pessoa alterou estes prazos. Atualize a página e tente novamente.';
  }
  return `Não foi possível salvar os prazos (${code}).`;
}

export function waitingLabel(hours: number): string {
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? 'dia' : 'dias'}`;
}

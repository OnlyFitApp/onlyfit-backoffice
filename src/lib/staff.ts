import { coreApi } from '../api/core';
import type { StaffAccount, StaffAccountSummary } from '../api/core.gen';

export type StaffRole = 'super_admin' | 'admin' | 'operator';
export type PlatformStaffMember = StaffAccountSummary;

export async function fetchCurrentStaffRole(userId: string): Promise<StaffRole | null> {
  try {
    return (await coreApi.staff.account({ id: userId })).account.staff_role;
  } catch (error) {
    if (error instanceof Error && error.message.includes('staff.forbidden')) return null;
    throw error;
  }
}

export async function fetchPlatformStaff(): Promise<PlatformStaffMember[]> {
  const items: PlatformStaffMember[] = [];
  let cursor: string | undefined;
  do {
    const page = await coreApi.staff.accounts({ filter: 'staff', cursor, limit: 50 });
    items.push(...page.items);
    cursor = page.next_cursor ?? undefined;
  } while (cursor);
  return items;
}

export async function setPlatformStaffRole(input: {
  userId: string;
  role: StaffRole;
}): Promise<StaffAccount> {
  const current = await coreApi.staff.account({ id: input.userId });
  return coreApi.staff.accountAct({
    id: input.userId,
    command: {
      action: 'setStaffRole',
      role: input.role,
      expected_role: current.account.staff_role,
      idempotency_key: crypto.randomUUID(),
    },
  });
}

export async function removePlatformStaff(userId: string): Promise<StaffAccount> {
  const current = await coreApi.staff.account({ id: userId });
  return coreApi.staff.accountAct({
    id: userId,
    command: {
      action: 'removeFromStaff',
      expected_role: current.account.staff_role,
      idempotency_key: crypto.randomUUID(),
    },
  });
}

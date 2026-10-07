import { coreApi } from '../api/core';
import type { StaffSessionTypeItem } from '../api/core.gen';

export type SessionType = {
  key: string;
  version: number;
  label: string;
  iconKey: string;
  sports: string[];
  sortOrder: number;
  active: boolean;
  inUseCount: number;
};

export type SessionTypeInput = {
  key: string;
  expectedVersion: number | null;
  label: string;
  iconKey: string;
  sports: string[];
  sortOrder: number;
  active: boolean;
};

function sessionType(item: StaffSessionTypeItem): SessionType {
  return {
    key: item.key,
    version: item.version,
    label: item.data.label,
    iconKey: item.data.icon_key,
    sports: item.data.sports,
    sortOrder: item.position,
    active: item.active,
    inUseCount: item.impact.total_links,
  };
}

function requireSessionType(item: Awaited<ReturnType<typeof coreApi.staff.catalogSave>>): StaffSessionTypeItem {
  if (item.kind !== 'session_types') throw new Error('staff.invalid_catalog_response');
  return item;
}

async function sessionTypeItems(): Promise<StaffSessionTypeItem[]> {
  const catalog = await coreApi.staff.catalog({ kind: 'session_types' });
  return catalog.items.filter((item): item is StaffSessionTypeItem => item.kind === 'session_types');
}

export async function listSessionTypes(): Promise<SessionType[]> {
  return (await sessionTypeItems()).map(sessionType);
}

export async function upsertSessionType(input: SessionTypeInput): Promise<string> {
  const key = input.key.trim().toLowerCase();
  const current = (await sessionTypeItems()).find((item) => item.key === key);
  const saved = requireSessionType(await coreApi.staff.catalogSave({
    item: {
      kind: 'session_types',
      key,
      label: input.label.trim(),
      public: current?.public ?? true,
      position: input.sortOrder,
      expected_version: input.expectedVersion,
      data: { icon_key: input.iconKey.trim(), sports: input.sports },
    },
  }));
  if (saved.active !== input.active) {
    const changed = input.active
      ? await coreApi.staff.catalogActivate({ kind: 'session_types', key, expectedVersion: saved.version })
      : await coreApi.staff.catalogDeactivate({
        kind: 'session_types', key, expectedVersion: saved.version, confirmation: saved.data.label,
      });
    requireSessionType(changed);
  }
  return saved.key;
}

export async function setSessionTypeActive(input: { key: string; active: boolean }): Promise<void> {
  const current = (await sessionTypeItems()).find((item) => item.key === input.key);
  if (!current) throw new Error('staff.catalog_item_not_found');
  if (current.active === input.active) return;
  const changed = input.active
    ? await coreApi.staff.catalogActivate({ kind: 'session_types', key: input.key, expectedVersion: current.version })
    : await coreApi.staff.catalogDeactivate({
      kind: 'session_types', key: input.key, expectedVersion: current.version, confirmation: current.data.label,
    });
  requireSessionType(changed);
}

export function sessionTypeErrorMessage(error: unknown): string {
  const code = error instanceof Error ? error.message : '';
  if (code.includes('staff.catalog_changed')) return 'Outra pessoa alterou este tipo. Atualize a lista e reabra a edição.';
  if (code.includes('staff.invalid_session_type')) return 'Revise o rótulo, o ícone e as modalidades do tipo de sessão.';
  if (code.includes('invalid_session_type_key')) return 'A chave aceita só letras minúsculas, números e _, começando por letra.';
  if (code.includes('invalid_session_type_label')) return 'O rótulo é obrigatório e vai até 60 caracteres.';
  if (code.includes('invalid_session_type_icon')) return 'Escolha um ícone.';
  if (code.includes('too_many_sports')) return 'São no máximo 20 esportes por tipo.';
  if (code.includes('session_type_not_found')) return 'Esse tipo de sessão não existe mais.';
  if (code.includes('staff_role_required')) return 'Seu perfil não tem permissão para manter os tipos de sessão.';
  return 'Não foi possível concluir a operação.';
}

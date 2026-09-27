import { coreApi } from '../api/core';
import type {
  StaffHealthDiet,
  StaffHealthDietPayload,
  StaffHealthLibraryItem,
  StaffHealthLibraryPage,
  StaffHealthProgram,
  StaffHealthProgramPayload,
  StaffHealthWorkout,
  StaffHealthWorkoutPayload,
} from '../api/core.gen';

export type LibraryKind = StaffHealthLibraryItem['kind'];
export type LibraryItem = StaffHealthLibraryItem;
export type LibraryPage = StaffHealthLibraryPage;
export type WorkoutCatalogItem = StaffHealthWorkout;
export type DietCatalogItem = StaffHealthDiet;
export type ProgramCatalogItem = StaffHealthProgram;
export type WorkoutInput = StaffHealthWorkoutPayload;
export type DietInput = StaffHealthDietPayload;
export type ProgramInput = StaffHealthProgramPayload;

export function listHealthLibrary(input: Parameters<typeof coreApi.staff.healthLibrary>[0]): Promise<LibraryPage> {
  return coreApi.staff.healthLibrary(input);
}

export function saveWorkout(input: { id: string | null; expectedVersion: number | null; payload: WorkoutInput }): Promise<LibraryItem> {
  return coreApi.staff.healthLibrarySave({ kind: 'workout', ...input, idempotencyKey: crypto.randomUUID() });
}

export function saveDiet(input: { id: string | null; expectedVersion: number | null; payload: DietInput }): Promise<LibraryItem> {
  return coreApi.staff.healthLibrarySave({ kind: 'diet', ...input, idempotencyKey: crypto.randomUUID() });
}

export function saveProgram(input: { id: string | null; expectedVersion: number | null; payload: ProgramInput }): Promise<LibraryItem> {
  return coreApi.staff.healthLibrarySave({ kind: 'program', ...input, idempotencyKey: crypto.randomUUID() });
}

export function setLibraryItemActive(input: {
  kind: LibraryKind;
  id: string;
  active: boolean;
  expectedVersion: number;
}): Promise<LibraryItem> {
  return coreApi.staff.healthLibraryAct({ ...input, idempotencyKey: crypto.randomUUID() });
}

export function libraryErrorMessage(error: unknown): string {
  const code = error instanceof Error ? error.message : '';
  if (code.includes('staff.forbidden')) return 'Seu perfil não tem permissão para manter a biblioteca.';
  if (code.includes('staff.invalid_health_library_item')) return 'Revise a estrutura do conteúdo antes de salvar.';
  if (code.includes('staff.health_library_item_not_found')) return 'Esse conteúdo não existe mais.';
  if (code.includes('staff.health_library_changed')) return 'O conteúdo foi alterado por outra pessoa. Atualize a lista antes de continuar.';
  if (code.includes('platform.idempotency_conflict')) return 'A operação já foi usada com outro conteúdo. Tente novamente.';
  return 'Não foi possível concluir a operação. Revise os campos e tente novamente.';
}

import { coreApi } from '../api/core';
import type { StaffExercise, StaffExerciseCatalogPage, StaffExerciseMediaReady, TrainingExercise } from '../api/core.gen';

export type ExerciseCatalogEntry = StaffExercise;
export type ExerciseCatalogPage = StaffExerciseCatalogPage;
export type ExerciseCatalogFilters = Parameters<typeof coreApi.staff.exerciseCatalog>[0];
export type ExerciseCatalogInput = Parameters<typeof coreApi.staff.exerciseCatalogSave>[0];

export function listExerciseCatalog(filters: ExerciseCatalogFilters): Promise<ExerciseCatalogPage> {
  return coreApi.staff.exerciseCatalog(filters);
}

export function saveExerciseCatalogEntry(
  input: Omit<ExerciseCatalogInput, 'idempotencyKey'>,
): Promise<StaffExercise> {
  return coreApi.staff.exerciseCatalogSave({
    ...input,
    idempotencyKey: crypto.randomUUID(),
  });
}

export function setExerciseCatalogActive(input: {
  exerciseId: string;
  active: boolean;
  expectedVersion: number;
}): Promise<TrainingExercise> {
  return coreApi.staff.exerciseCatalogAct({ ...input, idempotencyKey: crypto.randomUUID() });
}

type ExerciseMediaKind = 'video' | 'thumbnail';
type ExerciseMediaMime = 'video/mp4' | 'video/webm' | 'video/quicktime' | 'image/jpeg' | 'image/png' | 'image/webp';

function mediaMime(file: File, kind: ExerciseMediaKind): ExerciseMediaMime {
  if (kind === 'video') {
    if (file.type === 'video/mp4' || file.type === 'video/webm' || file.type === 'video/quicktime') return file.type;
    throw new Error('staff.invalid_exercise_video');
  }
  if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp') return file.type;
  throw new Error('staff.invalid_exercise_thumbnail');
}

export async function uploadExerciseMedia(file: File, kind: ExerciseMediaKind): Promise<StaffExerciseMediaReady> {
  if (file.size <= 0) throw new Error('staff.invalid_exercise_media');
  const pending = await coreApi.staff.exerciseMediaUpload({
    upload: {
      action: 'prepare',
      request_id: crypto.randomUUID(),
      media_kind: kind,
      filename: file.name,
      mime: mediaMime(file, kind),
      bytes: file.size,
    },
  });
  if (pending.status !== 'pending') throw new Error('staff.exercise_media_prepare_invalid');
  const uploaded = await fetch(pending.upload_url, {
    method: 'PUT',
    headers: { 'Content-Type': pending.upload_headers['Content-Type'] },
    body: file,
  });
  if (!uploaded.ok) throw new Error('staff.exercise_media_upload_failed');
  const ready = await coreApi.staff.exerciseMediaUpload({
    upload: {
      action: 'complete',
      request_id: pending.file_id,
      idempotency_key: crypto.randomUUID(),
    },
  });
  if (ready.status !== 'ready' || ready.media_kind !== kind) throw new Error('staff.exercise_media_complete_invalid');
  return ready;
}

export function exerciseCatalogErrorMessage(error: unknown): string {
  const code = error instanceof Error ? error.message : '';
  if (code.includes('staff.invalid_exercise_media')) return 'A mídia não está pronta ou não pertence à biblioteca oficial.';
  if (code.includes('staff.invalid_exercise_video')) return 'Use vídeo MP4, WebM ou QuickTime.';
  if (code.includes('staff.invalid_exercise_thumbnail')) return 'Use miniatura JPEG, PNG ou WebP.';
  if (code.includes('staff.exercise_media_upload_failed')) return 'Não foi possível enviar a mídia. Tente novamente.';
  if (code.includes('staff.invalid_exercise')) return 'Revise nome, modalidade, idioma e classificação do exercício.';
  if (code.includes('staff.exercise_not_found')) return 'Esse exercício não existe mais.';
  if (code.includes('staff.exercise_changed')) return 'O exercício foi alterado por outra pessoa. Atualize a lista antes de continuar.';
  if (code.includes('staff.forbidden')) return 'Seu perfil não tem permissão para alterar a biblioteca.';
  if (code.includes('platform.idempotency_conflict')) return 'A operação já foi usada com outro conteúdo. Tente novamente.';
  return 'Não foi possível concluir a operação.';
}

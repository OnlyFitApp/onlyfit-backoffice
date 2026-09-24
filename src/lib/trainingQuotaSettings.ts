import { api } from '../api';

export type TrainingQuotaSettings = {
  freePersonalWorkoutLimit: number;
  clubPersonalWorkoutLimit: number;
  updatedAt: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function positiveInteger(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
}

function parseSettings(value: unknown): TrainingQuotaSettings {
  const row = asRecord(value);
  return {
    freePersonalWorkoutLimit: positiveInteger(row.free_personal_workout_limit),
    clubPersonalWorkoutLimit: positiveInteger(row.club_personal_workout_limit),
    updatedAt: typeof row.updated_at === 'string' ? row.updated_at : '',
  };
}

export async function getTrainingQuotaSettings(): Promise<TrainingQuotaSettings> {
  const { data, error } = await api.staff.rpc('control_get_personal_workout_quota_settings_v1');
  if (error) throw error;
  return parseSettings(data);
}

export async function updateTrainingQuotaSettings(input: {
  freePersonalWorkoutLimit: number;
  expectedUpdatedAt: string;
}): Promise<TrainingQuotaSettings> {
  const { data, error } = await api.staff.rpc('control_update_personal_workout_quota_settings_v1', {
    p_free_personal_workout_limit: input.freePersonalWorkoutLimit,
    p_expected_updated_at: input.expectedUpdatedAt,
  });
  if (error) throw error;
  return parseSettings(data);
}

export function trainingQuotaErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? '');
  if (message.includes('invalid_free_personal_workout_limit')) {
    return 'Informe um limite entre 1 e 10.000 treinos.';
  }
  if (message.includes('training_settings_changed')) {
    return 'Outra pessoa alterou esta configuração. Atualize a página e tente novamente.';
  }
  if (message.includes('forbidden')) {
    return 'Seu papel interno não permite alterar esta configuração.';
  }
  return 'Não foi possível salvar a cota de treinos.';
}

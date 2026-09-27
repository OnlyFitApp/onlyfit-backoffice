import { coreApi } from '../api/core';

export type TrainingQuotaSettings = {
  freePersonalWorkoutLimit: number;
  clubPersonalWorkoutLimit: number;
  version: number;
};

export async function getTrainingQuotaSettings(): Promise<TrainingQuotaSettings> {
  const value = await coreApi.staff.trainingQuota();
  return {
    freePersonalWorkoutLimit: value.free_personal_workout_limit,
    clubPersonalWorkoutLimit: value.club_personal_workout_limit,
    version: value.version,
  };
}

export async function updateTrainingQuotaSettings(input: {
  freePersonalWorkoutLimit: number;
  expectedVersion: number;
}): Promise<TrainingQuotaSettings> {
  const value = await coreApi.staff.trainingQuotaSave({
    freePersonalWorkoutLimit: input.freePersonalWorkoutLimit,
    expectedVersion: input.expectedVersion,
  });
  return {
    freePersonalWorkoutLimit: value.free_personal_workout_limit,
    clubPersonalWorkoutLimit: value.club_personal_workout_limit,
    version: value.version,
  };
}

export function trainingQuotaErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? '');
  if (message.includes('staff.invalid_training_quota')) {
    return 'Informe um limite entre 1 e 10.000 treinos.';
  }
  if (message.includes('staff.training_quota_changed')) {
    return 'Outra pessoa alterou esta configuração. Atualize a página e tente novamente.';
  }
  if (message.includes('forbidden')) {
    return 'Seu papel interno não permite alterar esta configuração.';
  }
  return 'Não foi possível salvar a cota de treinos.';
}

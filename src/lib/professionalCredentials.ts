import { coreApi } from '../api/core';

export type CredentialStatus = 'pending' | 'approved' | 'rejected';

export type ProfessionalCredentialReview = {
  id: string;
  profileId: string;
  fullName: string;
  username: string | null;
  avatarUrl: string | null;
  specialty: string;
  council: string;
  jurisdiction: string;
  registration: string;
  status: CredentialStatus;
  rejectionReason: string | null;
  createdAt: string;
};

export async function listProfessionalCredentialReviews(status: CredentialStatus): Promise<{ total: number; items: ProfessionalCredentialReview[] }> {
  const response = await coreApi.staff.professionalCredentials({
    status,
    limit: 100,
  });
  return {
    total: response.total,
    items: response.items.map((row) => ({
      id: row.id,
      profileId: row.profile_id,
      fullName: row.full_name,
      username: row.username,
      avatarUrl: row.avatar_url,
      specialty: row.specialty,
      council: row.council,
      jurisdiction: row.jurisdiction,
      registration: row.registration,
      status: row.status,
      rejectionReason: row.rejection_reason,
      createdAt: row.created_at,
    })),
  };
}

export async function reviewProfessionalCredential(input: { id: string; action: 'approve' | 'reject'; reason?: string }): Promise<void> {
  await coreApi.staff.professionalCredentialAct({
    reviewId: input.id,
    action: input.action,
    reason: input.reason ?? null,
  });
}

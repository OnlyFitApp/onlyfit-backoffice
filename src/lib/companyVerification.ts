import { supabase } from './supabase';

/**
 * Fila de verificação de empresas.
 *
 * A empresa cadastrada nos apps nasce em análise e não vai ao ar antes de a
 * operação decidir. A decisão é humana hoje; quando for automatizada, muda
 * quem chama `control_review_company_verification` — não o contrato.
 */
export type CompanyVerificationStatus = 'pending_review' | 'rejected' | 'approved';

export type CompanyVerification = {
  id: string;
  name: string;
  slug: string;
  status: string;
  verified: boolean;
  logo_url: string | null;
  description: string | null;
  cnpj: string | null;
  website_url: string | null;
  market_niche: string | null;
  market_niche_label: string | null;
  created_at: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  reviewed_by: { id: string; name: string | null } | null;
  owner: {
    id: string;
    name: string | null;
    username: string | null;
    email: string | null;
    avatar_url: string | null;
  };
};

export type CompanyVerificationPage = { items: CompanyVerification[]; total: number };

export async function listCompanyVerifications(
  status: CompanyVerificationStatus,
  limit: number,
  offset: number,
) {
  const { data, error } = await supabase.rpc('control_list_company_verifications', {
    p_status: status,
    p_limit: limit,
    p_offset: offset,
  });
  if (error) throw error;
  return data as CompanyVerificationPage;
}

export async function reviewCompanyVerification(input: {
  organizationId: string;
  action: 'approve' | 'reject';
  notes?: string;
}) {
  const { data, error } = await supabase.rpc('control_review_company_verification', {
    p_organization_id: input.organizationId,
    p_action: input.action,
    p_notes: input.notes ?? null,
  });
  if (error) throw error;
  return data;
}

export function formatCnpj(value: string | null) {
  const digits = (value ?? '').replace(/\D/g, '');
  if (digits.length !== 14) return value ?? '—';
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

import { supabase } from './supabase';

export type AppleEnvironment = 'Production' | 'Sandbox';
export type AppleAccessStatus = 'active' | 'expired' | 'revoked';
type AppleTransaction = {
  id: string; transaction_id: string; original_transaction_id: string; product_id: string;
  offering_id: string; offering_name: string | null; organization_id: string | null; organization_name: string | null;
  buyer_profile_id: string; buyer_name: string; professional_profile_id: string | null; professional_name: string;
  environment: AppleEnvironment; status: AppleAccessStatus; has_access: boolean;
  purchase_date: string; expires_date: string | null; revoked_at: string | null;
  gross_value: number | null; currency: string | null; payment_transaction_id: string | null;
  provider_fee: number | null; platform_commission: number | null; professional_net: number | null;
  settlement_status: string | null;
};
type AppleTransactionsPage = { total: number; limit: number; offset: number; items: AppleTransaction[] };

export async function listAppStoreTransactions(filters: {
  environment: AppleEnvironment; search: string; status: AppleAccessStatus | ''; page: number;
}): Promise<AppleTransactionsPage> {
  const { data, error } = await supabase.rpc('control_list_app_store_transactions', {
    p_environment: filters.environment, p_search: filters.search.trim() || null,
    p_status: filters.status || null, p_limit: 25, p_offset: filters.page * 25,
  });
  if (error) throw new Error('Não foi possível carregar as compras Apple.');
  if (!data || !Array.isArray(data.items) || !Number.isFinite(data.total)) {
    throw new Error('Resposta inválida ao consultar as compras Apple.');
  }
  return data as AppleTransactionsPage;
}

export function appleMoney(value: number | null, currency: string | null): string {
  if (value === null || !Number.isFinite(value) || !currency || !/^[A-Z]{3}$/.test(currency)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);
}

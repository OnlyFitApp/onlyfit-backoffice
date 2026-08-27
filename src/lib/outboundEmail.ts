import { supabase } from './supabase';

export type SentEmailStatus = 'processing' | 'sent' | 'failed';

export type PlatformEmailSource =
  | 'backoffice_compose'
  | 'invite'
  | 'waitlist_release'
  | 'signup_confirmation'
  | 'password_reset'
  | 'credential_reset'
  | 'email_otp'
  | 'offering_price_policy'
  | 'coach_student_template';

export const EMAIL_SOURCE_OPTIONS: Array<{ value: PlatformEmailSource; label: string }> = [
  { value: 'backoffice_compose', label: 'Manual' },
  { value: 'invite', label: 'Convite' },
  { value: 'waitlist_release', label: 'Liberação' },
  { value: 'signup_confirmation', label: 'Confirmação' },
  { value: 'password_reset', label: 'Recuperação de senha' },
  { value: 'credential_reset', label: 'Reset administrativo' },
  { value: 'email_otp', label: 'Código de verificação' },
  { value: 'offering_price_policy', label: 'Política de preço' },
  { value: 'coach_student_template', label: 'Modelo de alunos' },
];

export const EMAIL_SOURCE_LABELS = Object.fromEntries(
  EMAIL_SOURCE_OPTIONS.map((option) => [option.value, option.label]),
) as Record<PlatformEmailSource, string>;

export type SentEmail = {
  id: string;
  resend_email_id: string | null;
  sender_email: string;
  sender_name: string;
  to_emails: string[];
  cc_emails: string[];
  bcc_emails: string[];
  subject: string;
  html_content: string;
  text_content: string;
  image_urls: string[];
  status: SentEmailStatus;
  error_message: string | null;
  source: PlatformEmailSource;
  sent_by: string | null;
  created_at: string;
  sent_at: string | null;
};

export type SentEmailListItem = Omit<SentEmail, 'html_content' | 'text_content' | 'image_urls'>;

export type SendEmailInput = {
  from: string;
  senderName: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  html: string;
  idempotencyKey: string;
};

export type SentEmailFilters = {
  query?: string | null;
  source?: PlatformEmailSource | null;
  status?: SentEmailStatus | null;
  createdFrom?: string | null;
  createdTo?: string | null;
  limit: number;
  offset: number;
};

export type SentEmailPage = {
  items: SentEmailListItem[];
  total: number;
};

export function splitEmailList(value: string): string[] {
  return [...new Set(value.split(/[;,\n]/).map((email) => email.trim().toLowerCase()).filter(Boolean))];
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value.trim());
}

export function isOnlyFitSender(value: string): boolean {
  return /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@onlyfitapp\.com$/i.test(value.trim());
}

export function emailSourceLabel(source: string): string {
  return EMAIL_SOURCE_LABELS[source as PlatformEmailSource] ?? source;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];
}

function parseListItem(value: unknown): SentEmailListItem {
  const row = asRecord(value);
  return {
    id: String(row.id ?? ''),
    resend_email_id: row.resend_email_id == null ? null : String(row.resend_email_id),
    sender_email: String(row.sender_email ?? ''),
    sender_name: String(row.sender_name ?? 'OnlyFit'),
    to_emails: stringArray(row.to_emails),
    cc_emails: stringArray(row.cc_emails),
    bcc_emails: stringArray(row.bcc_emails),
    subject: String(row.subject ?? ''),
    status: row.status === 'failed' || row.status === 'processing' ? row.status : 'sent',
    error_message: row.error_message == null ? null : String(row.error_message),
    source: (row.source as PlatformEmailSource) || 'backoffice_compose',
    sent_by: row.sent_by == null ? null : String(row.sent_by),
    created_at: String(row.created_at ?? ''),
    sent_at: row.sent_at == null ? null : String(row.sent_at),
  };
}

function parseSentEmail(value: unknown): SentEmail {
  const row = asRecord(value);
  return {
    ...parseListItem(row),
    html_content: String(row.html_content ?? ''),
    text_content: String(row.text_content ?? ''),
    image_urls: stringArray(row.image_urls),
  };
}

export async function sendOutboundEmail(input: SendEmailInput): Promise<{ id: string; resendEmailId: string }> {
  const { data, error } = await supabase.functions.invoke('control-send-email', { body: input });
  if (error) throw error;
  const response = data as { id?: unknown; resendEmailId?: unknown; error?: unknown } | null;
  if (!response || typeof response.id !== 'string' || typeof response.resendEmailId !== 'string') {
    throw new Error(typeof response?.error === 'string' ? response.error : 'invalid_send_response');
  }
  return { id: response.id, resendEmailId: response.resendEmailId };
}

export async function listSentEmails(filters: SentEmailFilters): Promise<SentEmailPage> {
  const { data, error } = await supabase.rpc('control_list_platform_emails', {
    p_query: filters.query?.trim() || null,
    p_source: filters.source || null,
    p_status: filters.status || null,
    p_created_from: filters.createdFrom || null,
    p_created_to: filters.createdTo || null,
    p_limit: filters.limit,
    p_offset: filters.offset,
  });
  if (error) throw error;
  const row = asRecord(data);
  return {
    items: Array.isArray(row.items) ? row.items.map(parseListItem) : [],
    total: Number(row.total ?? 0),
  };
}

export async function fetchSentEmail(id: string): Promise<SentEmail> {
  const { data, error } = await supabase
    .from('platform_sent_emails')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return parseSentEmail(data);
}

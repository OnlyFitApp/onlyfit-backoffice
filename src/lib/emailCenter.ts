import { api } from '../api';

export type EmailBox = 'all' | 'inbox' | 'sent';
export type EmailDirection = 'inbound' | 'outbound';
export type EmailDeliveryStatus =
  | 'processing'
  | 'queued'
  | 'sent'
  | 'delivered'
  | 'delivery_delayed'
  | 'bounced'
  | 'complained'
  | 'failed'
  | 'received';

export type EmailMailbox = {
  id: string;
  email: string;
  displayName: string;
  unreadCount: number;
};

type EmailThreadListItem = {
  id: string;
  mailboxId: string;
  mailboxEmail: string;
  mailboxName: string;
  subject: string;
  externalParticipants: string[];
  latestMessageAt: string;
  latestSnippet: string;
  latestDirection: EmailDirection;
  latestStatus: EmailDeliveryStatus;
  messageCount: number;
  hasAttachments: boolean;
  isUnread: boolean;
};

export type EmailAttachment = {
  id: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  contentDisposition: 'inline' | 'attachment';
  availabilityStatus: 'stored' | 'too_large' | 'download_failed';
};

export type EmailMessage = {
  id: string;
  resendEmailId: string | null;
  messageId: string | null;
  direction: EmailDirection;
  fromEmail: string;
  fromName: string | null;
  toEmails: string[];
  ccEmails: string[];
  bccEmails: string[];
  replyToEmails: string[];
  subject: string;
  htmlContent: string;
  textContent: string;
  status: EmailDeliveryStatus;
  errorMessage: string | null;
  inReplyTo: string | null;
  referenceMessageIds: string[];
  providerCreatedAt: string;
  attachments: EmailAttachment[];
};

export type EmailThread = {
  id: string;
  mailboxId: string;
  mailboxEmail: string;
  mailboxName: string;
  subject: string;
  externalParticipants: string[];
  latestMessageAt: string;
  messages: EmailMessage[];
};

type EmailThreadPage = { items: EmailThreadListItem[]; total: number };

export type EmailThreadFilters = {
  mailboxId: string | null;
  box: EmailBox;
  query: string;
  limit: number;
  offset: number;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function parseStatus(value: unknown): EmailDeliveryStatus {
  const status = String(value ?? 'processing') as EmailDeliveryStatus;
  return ['processing', 'queued', 'sent', 'delivered', 'delivery_delayed', 'bounced', 'complained', 'failed', 'received'].includes(status)
    ? status
    : 'processing';
}

function parseMailbox(value: unknown): EmailMailbox {
  const row = record(value);
  return {
    id: String(row.id ?? ''),
    email: String(row.email ?? ''),
    displayName: String(row.display_name ?? 'OnlyFit'),
    unreadCount: Number(row.unread_count ?? 0),
  };
}

function parseThreadItem(value: unknown): EmailThreadListItem {
  const row = record(value);
  return {
    id: String(row.id ?? ''),
    mailboxId: String(row.mailbox_id ?? ''),
    mailboxEmail: String(row.mailbox_email ?? ''),
    mailboxName: String(row.mailbox_name ?? 'OnlyFit'),
    subject: String(row.subject ?? '(sem assunto)'),
    externalParticipants: strings(row.external_participants),
    latestMessageAt: String(row.latest_message_at ?? ''),
    latestSnippet: String(row.latest_snippet ?? ''),
    latestDirection: row.latest_direction === 'inbound' ? 'inbound' : 'outbound',
    latestStatus: parseStatus(row.latest_status),
    messageCount: Number(row.message_count ?? 0),
    hasAttachments: Boolean(row.has_attachments),
    isUnread: Boolean(row.is_unread),
  };
}

function parseAttachment(value: unknown): EmailAttachment {
  const row = record(value);
  const availability = String(row.availability_status ?? 'stored');
  return {
    id: String(row.id ?? ''),
    filename: String(row.filename ?? 'anexo'),
    contentType: String(row.content_type ?? 'application/octet-stream'),
    sizeBytes: Number(row.size_bytes ?? 0),
    contentDisposition: row.content_disposition === 'inline' ? 'inline' : 'attachment',
    availabilityStatus: availability === 'too_large' || availability === 'download_failed' ? availability : 'stored',
  };
}

function parseMessage(value: unknown): EmailMessage {
  const row = record(value);
  return {
    id: String(row.id ?? ''),
    resendEmailId: row.resend_email_id == null ? null : String(row.resend_email_id),
    messageId: row.message_id == null ? null : String(row.message_id),
    direction: row.direction === 'inbound' ? 'inbound' : 'outbound',
    fromEmail: String(row.from_email ?? ''),
    fromName: row.from_name == null ? null : String(row.from_name),
    toEmails: strings(row.to_emails),
    ccEmails: strings(row.cc_emails),
    bccEmails: strings(row.bcc_emails),
    replyToEmails: strings(row.reply_to_emails),
    subject: String(row.subject ?? '(sem assunto)'),
    htmlContent: String(row.html_content ?? ''),
    textContent: String(row.text_content ?? ''),
    status: parseStatus(row.status),
    errorMessage: row.error_message == null ? null : String(row.error_message),
    inReplyTo: row.in_reply_to == null ? null : String(row.in_reply_to),
    referenceMessageIds: strings(row.reference_message_ids),
    providerCreatedAt: String(row.provider_created_at ?? ''),
    attachments: Array.isArray(row.attachments) ? row.attachments.map(parseAttachment) : [],
  };
}

export async function listEmailMailboxes(): Promise<EmailMailbox[]> {
  const { data, error } = await api.staff.rpc('control_list_email_mailboxes');
  if (error) throw error;
  return Array.isArray(data) ? data.map(parseMailbox) : [];
}

export async function listEmailThreads(filters: EmailThreadFilters): Promise<EmailThreadPage> {
  const { data, error } = await api.staff.rpc('control_list_email_threads', {
    p_mailbox_id: filters.mailboxId,
    p_box: filters.box,
    p_query: filters.query.trim() || null,
    p_limit: filters.limit,
    p_offset: filters.offset,
  });
  if (error) throw error;
  const result = record(data);
  return {
    items: Array.isArray(result.items) ? result.items.map(parseThreadItem) : [],
    total: Number(result.total ?? 0),
  };
}

export async function getEmailThread(id: string): Promise<EmailThread> {
  const { data, error } = await api.staff.rpc('control_get_email_thread', { p_thread_id: id });
  if (error) throw error;
  const row = record(data);
  return {
    id: String(row.id ?? ''),
    mailboxId: String(row.mailbox_id ?? ''),
    mailboxEmail: String(row.mailbox_email ?? ''),
    mailboxName: String(row.mailbox_name ?? 'OnlyFit'),
    subject: String(row.subject ?? '(sem assunto)'),
    externalParticipants: strings(row.external_participants),
    latestMessageAt: String(row.latest_message_at ?? ''),
    messages: Array.isArray(row.messages) ? row.messages.map(parseMessage) : [],
  };
}

export async function markEmailThreadRead(id: string): Promise<void> {
  const { error } = await api.staff.rpc('control_mark_email_thread_read', { p_thread_id: id });
  if (error) throw error;
}

export async function syncEmailCenter(): Promise<void> {
  const { error } = await api.staff.functions.invoke('control-sync-email-center', { body: {} });
  if (error) throw error;
}

export async function openEmailAttachment(id: string): Promise<void> {
  const { data, error } = await api.staff.functions.invoke('control-email-attachment', {
    body: { attachmentId: id },
  });
  if (error) throw error;
  const url = record(data).url;
  if (typeof url !== 'string' || !url.startsWith('https://')) throw new Error('invalid_attachment_url');
  const link = document.createElement('a');
  link.href = url;
  link.rel = 'noopener noreferrer';
  link.download = '';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

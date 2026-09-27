import { coreApi } from '../api/core';
import type { StaffEmailAttachment, StaffEmailMessage, StaffEmailThreadListItem } from '../api/core.gen';

export type EmailBox = 'all' | 'inbox' | 'sent';
type EmailDirection = 'inbound' | 'outbound';
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

function presentMailbox(row: import('../api/core.gen').StaffEmailMailbox): EmailMailbox {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    unreadCount: row.unread_count,
  };
}

function presentThreadItem(row: StaffEmailThreadListItem): EmailThreadListItem {
  return {
    id: row.id, mailboxId: row.mailbox_id, mailboxEmail: row.mailbox_email,
    mailboxName: row.mailbox_name, subject: row.subject,
    externalParticipants: row.external_participants, latestMessageAt: row.latest_message_at,
    latestSnippet: row.latest_snippet, latestDirection: row.latest_direction,
    latestStatus: row.latest_status, messageCount: row.message_count,
    hasAttachments: row.has_attachments, isUnread: row.is_unread,
  };
}

function presentAttachment(row: StaffEmailAttachment): EmailAttachment {
  return {
    id: row.id, filename: row.filename, contentType: row.content_type,
    sizeBytes: row.size_bytes, contentDisposition: row.content_disposition,
    availabilityStatus: row.availability_status,
  };
}

function presentMessage(row: StaffEmailMessage): EmailMessage {
  return {
    id: row.id, resendEmailId: row.resend_email_id, messageId: row.message_id,
    direction: row.direction, fromEmail: row.from_email, fromName: row.from_name,
    toEmails: row.to_emails, ccEmails: row.cc_emails, bccEmails: row.bcc_emails,
    replyToEmails: row.reply_to_emails, subject: row.subject, htmlContent: row.html_content,
    textContent: row.text_content, status: row.status, errorMessage: row.error_message,
    inReplyTo: row.in_reply_to, referenceMessageIds: row.reference_message_ids,
    providerCreatedAt: row.provider_created_at, attachments: row.attachments.map(presentAttachment),
  };
}

export async function listEmailMailboxes(): Promise<EmailMailbox[]> {
  return (await coreApi.staff.emailMailboxes()).map(presentMailbox);
}

export async function listEmailThreads(filters: EmailThreadFilters): Promise<EmailThreadPage> {
  const result = await coreApi.staff.emailThreads({
    mailboxId: filters.mailboxId ?? undefined, box: filters.box,
    query: filters.query.trim() || undefined, limit: filters.limit, offset: filters.offset,
  });
  return { items: result.items.map(presentThreadItem), total: result.total };
}

export async function getEmailThread(id: string): Promise<EmailThread> {
  const row = await coreApi.staff.emailThread({ threadId: id });
  return {
    id: row.id, mailboxId: row.mailbox_id, mailboxEmail: row.mailbox_email,
    mailboxName: row.mailbox_name, subject: row.subject,
    externalParticipants: row.external_participants, latestMessageAt: row.latest_message_at,
    messages: row.messages.map(presentMessage),
  };
}

export async function markEmailThreadRead(id: string): Promise<void> {
  await coreApi.staff.emailThreadRead({ threadId: id, idempotencyKey: crypto.randomUUID() });
}

export async function syncEmailCenter(): Promise<void> {
  await coreApi.staff.emailSync({ idempotencyKey: crypto.randomUUID() });
}

export async function openEmailAttachment(id: string): Promise<void> {
  const { url } = await coreApi.staff.emailAttachment({ attachmentId: id });
  const link = document.createElement('a');
  link.href = url;
  link.rel = 'noopener noreferrer';
  link.download = '';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

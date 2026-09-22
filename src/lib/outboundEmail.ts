import { supabase } from './supabase';

export type SendEmailInput = {
  from: string;
  senderName: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  html: string;
  idempotencyKey: string;
  attachments?: Array<{
    filename: string;
    contentType: string;
    contentBase64: string;
  }>;
  threadId?: string;
  replyToMessageId?: string;
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

export async function sendOutboundEmail(input: SendEmailInput): Promise<{
  id: string;
  resendEmailId: string;
  messageId: string | null;
  threadId: string | null;
}> {
  const { data, error } = await supabase.functions.invoke('control-send-email', { body: input });
  if (error) throw error;
  const response = data as {
    id?: unknown;
    resendEmailId?: unknown;
    messageId?: unknown;
    threadId?: unknown;
    error?: unknown;
  } | null;
  if (!response || typeof response.id !== 'string' || typeof response.resendEmailId !== 'string') {
    throw new Error(typeof response?.error === 'string' ? response.error : 'invalid_send_response');
  }
  return {
    id: response.id,
    resendEmailId: response.resendEmailId,
    messageId: typeof response.messageId === 'string' ? response.messageId : null,
    threadId: typeof response.threadId === 'string' ? response.threadId : null,
  };
}

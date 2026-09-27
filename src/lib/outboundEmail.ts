import { coreApi } from '../api/core';
import type { StaffEmailOutboundAttachment } from '../api/core.gen';

type SendEmailInput = {
  from: string;
  senderName: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  html: string;
  idempotencyKey: string;
  attachments?: Array<{ filename: string; contentType: string; contentBase64: string }>;
  threadId?: string;
  replyToMessageId?: string;
};

export function splitEmailList(value: string): string[] {
  return [...new Set(value.split(/[;,\n]/).map((email) => email.trim().toLowerCase()).filter(Boolean))];
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value.trim());
}

export async function sendOutboundEmail(input: SendEmailInput): Promise<{
  id: string;
  resendEmailId: string;
  messageId: string | null;
  threadId: string | null;
}> {
  const attachments: StaffEmailOutboundAttachment[] | undefined = input.attachments?.map((item) => ({
    filename: item.filename,
    content_type: item.contentType,
    content_base64: item.contentBase64,
  }));
  const response = await coreApi.staff.emailSend({ ...input, attachments });
  return {
    id: response.id,
    resendEmailId: response.resend_email_id,
    messageId: response.message_id,
    threadId: response.thread_id,
  };
}

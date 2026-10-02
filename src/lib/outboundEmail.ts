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

export async function outboundEmailErrorMessage(error: unknown): Promise<string> {
  let code = error instanceof Error ? error.message : '';
  if (error && typeof error === 'object' && 'context' in error && error.context instanceof Response) {
    const body: unknown = await error.context.clone().json().catch(() => null);
    if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') code = body.error;
  }
  const messages: Record<string, string> = {
    'auth.required': 'Sua sessão expirou. Entre novamente antes de enviar.',
    'staff.mfa_required': 'Confirme a autenticação em dois fatores antes de enviar.',
    'staff.forbidden': 'Sua conta não tem permissão para enviar e-mails.',
    'staff.email_send_invalid': 'Confira o remetente, destinatários, assunto, mensagem e anexos.',
    'staff.email_mailbox_not_found': 'Este remetente está indisponível. Use uma caixa ativa.',
    'staff.email_send_rate_limited': 'Limite de envios atingido. Aguarde um minuto e tente novamente.',
    'staff.email_send_in_progress': 'O envio ainda está sendo processado. Aguarde antes de tentar novamente.',
    'platform.idempotency_conflict': 'O rascunho mudou após a tentativa de envio. Revise-o antes de enviar novamente.',
    'staff.email_provider_unavailable': 'O provedor de e-mail não confirmou o envio. Tente novamente sem alterar a mensagem.',
    'staff.email_storage_unavailable': 'Não foi possível preparar os anexos. Tente novamente.',
  };
  return messages[code] ?? 'Não foi possível confirmar o envio. Seu rascunho foi preservado; tente novamente.';
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

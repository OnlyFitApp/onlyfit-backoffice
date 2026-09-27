import { coreApi } from '../api/core';
import type { StaffPayout, StaffPayoutDay } from '../api/core.gen';

export type PayoutStatus = StaffPayout['status'];
export type PayoutQueueDay = StaffPayoutDay;
export type PayoutRequest = StaffPayout;

export async function listPayoutQueueDays(): Promise<PayoutQueueDay[]> {
  const page = await coreApi.staff.payoutDays({ limit: 100, offset: 0 });
  return page.items;
}

export async function listPayoutQueueDay(settlementDate: string): Promise<PayoutRequest[]> {
  const page = await coreApi.staff.payouts({ settlementDate, limit: 200, offset: 0 });
  return page.items;
}

function payoutAction(
  payout: PayoutRequest,
  action: 'approve' | 'finalize',
): Promise<PayoutRequest> {
  return coreApi.staff.payoutAct({
    payoutId: payout.id,
    action,
    expectedVersion: payout.version,
    paymentReference: null,
    proofFileId: null,
    reason: null,
    idempotencyKey: crypto.randomUUID(),
  });
}

export function approvePayout(payout: PayoutRequest): Promise<PayoutRequest> {
  return payoutAction(payout, 'approve');
}

function payoutProofMime(value: string): 'application/pdf' | 'image/png' | 'image/jpeg' | null {
  if (value === 'application/pdf' || value === 'image/png' || value === 'image/jpeg') return value;
  return null;
}

export async function uploadPayoutProof(payout: PayoutRequest, file: File): Promise<string> {
  const mime = payoutProofMime(file.type);
  if (!mime) {
    throw new Error('Envie o comprovante em PDF, PNG ou JPG.');
  }
  if (file.size <= 0 || file.size > 10 * 1024 * 1024) {
    throw new Error('Envie um comprovante de até 10 MB.');
  }

  const requestId = crypto.randomUUID();
  const prepared = await coreApi.staff.payoutProofUpload({
    upload: {
      action: 'prepare',
      payout_id: payout.id,
      request_id: requestId,
      filename: file.name,
      mime,
      bytes: file.size,
    },
  });
  if (prepared.status !== 'pending') throw new Error('O envio do comprovante não foi preparado.');

  const upload = await fetch(prepared.upload_url, {
    method: 'PUT',
    headers: { 'Content-Type': prepared.upload_headers['Content-Type'] },
    body: file,
  });
  if (!upload.ok) throw new Error('Não foi possível enviar o comprovante.');

  const completed = await coreApi.staff.payoutProofUpload({
    upload: {
      action: 'complete',
      request_id: requestId,
      idempotency_key: crypto.randomUUID(),
    },
  });
  if (completed.status !== 'ready') throw new Error('O comprovante enviado não ficou disponível.');
  return completed.file_id;
}

export async function recordManualPayout(input: {
  payout: PayoutRequest;
  paymentReference: string;
  proof: File;
}): Promise<PayoutRequest> {
  const proofFileId = await uploadPayoutProof(input.payout, input.proof);
  return coreApi.staff.payoutAct({
    payoutId: input.payout.id,
    action: 'record',
    expectedVersion: input.payout.version,
    paymentReference: input.paymentReference,
    proofFileId,
    reason: null,
    idempotencyKey: crypto.randomUUID(),
  });
}

export function finalizeManualPayout(payout: PayoutRequest): Promise<PayoutRequest> {
  return payoutAction(payout, 'finalize');
}

export function createPayoutBatch(payoutIds: string[]) {
  return coreApi.staff.payoutBatchCreate({
    payoutIds,
    notes: null,
    idempotencyKey: crypto.randomUUID(),
  });
}

function payoutReasonAction(
  payout: PayoutRequest,
  action: 'reject' | 'fail' | 'reverse',
  reason: string,
): Promise<PayoutRequest> {
  return coreApi.staff.payoutAct({
    payoutId: payout.id,
    action,
    expectedVersion: payout.version,
    paymentReference: null,
    proofFileId: null,
    reason,
    idempotencyKey: crypto.randomUUID(),
  });
}

export function rejectPayout(payout: PayoutRequest, reason: string): Promise<PayoutRequest> {
  return payoutReasonAction(payout, 'reject', reason);
}

export function failManualPayout(payout: PayoutRequest, reason: string): Promise<PayoutRequest> {
  return payoutReasonAction(payout, 'fail', reason);
}

export function reversePaidPayout(payout: PayoutRequest, reason: string): Promise<PayoutRequest> {
  return payoutReasonAction(payout, 'reverse', reason);
}

export function payoutStatusLabel(status: PayoutStatus): string {
  switch (status) {
    case 'pending_approval': return 'Aguardando';
    case 'approved': return 'Aprovado';
    case 'payment_recorded': return 'Pagamento registrado';
    case 'paid': return 'Pago';
    case 'rejected': return 'Rejeitado';
    case 'failed': return 'Falhou';
    case 'reversed': return 'Revertido';
  }
}

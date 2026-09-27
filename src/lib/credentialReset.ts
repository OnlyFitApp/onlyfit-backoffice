import { coreApi } from '../api/core';

export type CredentialResetAction = 'password' | 'mfa';

type CredentialResetResult = {
  emailSent: boolean;
};

export function credentialResetErrorMessage(code: string): string {
  if (code.includes('staff.mfa_required')) {
    return 'Refaça o login com verificação em duas etapas para continuar.';
  }
  if (code.includes('staff.forbidden')) {
    return 'Seu papel interno não permite resetar esta conta.';
  }
  if (code.includes('staff.account_not_found') || code.includes('staff.account_email_not_found')) {
    return 'Esta conta não foi encontrada ou não possui e-mail confirmado.';
  }
  if (code.includes('staff.email_not_configured')) {
    return 'O envio de e-mail administrativo ainda não está configurado.';
  }
  if (code.includes('staff.invalid_credential_reset')) return 'Requisição inválida.';
  return 'Não foi possível concluir a ação.';
}

/**
 * Reset administrativo de senha (link por e-mail) ou de MFA (desativa o
 * autenticador) de outra conta, inclusive da equipe interna. A hierarquia e
 * a notificação por e-mail são garantidas pelo backend.
 */
export async function resetUserCredentials(
  userId: string,
  action: CredentialResetAction,
  reason?: string,
): Promise<CredentialResetResult> {
  try {
    const result = await coreApi.staff.credentialReset({
      targetId: userId,
      action,
      reason: reason || undefined,
    });
    return { emailSent: result.email_sent };
  } catch (error) {
    const code = error instanceof Error ? error.message : String(error ?? '');
    throw Object.assign(new Error(credentialResetErrorMessage(code)), {
      cause: error,
    });
  }
}

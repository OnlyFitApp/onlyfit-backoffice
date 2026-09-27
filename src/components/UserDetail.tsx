import {
  AlertTriangle,
  ArrowLeft,
  KeyRound,
  RefreshCw,
  ShieldOff,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useSetPlatformStaffRole } from '../hooks/useStaffManagement';
import { useUserOverview } from '../hooks/useUsers';
import type { CredentialResetAction } from '../lib/credentialReset';
import { formatCurrencyExact, formatDateTime } from '../lib/format';
import { displayName, formatDocument, userAdminErrorMessage } from '../lib/users';
import type { StaffRole } from '../lib/staff';
import { CredentialResetDialog } from './CredentialResetDialog';

const roleLabels: Record<StaffRole, string> = {
  super_admin: 'Superadministrador',
  admin: 'Administrador',
  operator: 'Operador',
};

function valueOrDash(value: string | null) {
  return value?.trim() || '—';
}

export function UserDetail({
  userId,
  currentRole,
  onBack,
}: {
  userId: string;
  currentRole: StaffRole | null;
  onBack: () => void;
}) {
  const { user: currentUser } = useAuth();
  const query = useUserOverview(userId);
  const setRole = useSetPlatformStaffRole();
  const [resetAction, setResetAction] = useState<CredentialResetAction | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const overview = query.data;
  const account = overview?.account;
  const isSelf = currentUser?.id === userId;
  const canReset = !isSelf && (currentRole === 'super_admin' || (currentRole === 'admin' && !account?.staff_role));
  const canManageRole = currentRole === 'super_admin' && !isSelf;

  if (query.isLoading) return <section className="content"><div className="skeleton staff-skeleton" /></section>;
  if (query.isError || !overview || !account) {
    return (
      <section className="content">
        <button className="button secondary" type="button" onClick={onBack}><ArrowLeft size={16} />Voltar</button>
        <div className="inline-alert danger" role="alert">
          <AlertTriangle size={18} />Não foi possível carregar esta conta.
        </div>
      </section>
    );
  }

  const name = displayName(account);
  const changeRole = (role: StaffRole) => {
    setMessage(null);
    setRole.mutate({ userId, role }, {
      onSuccess: () => {
        void query.refetch();
        setMessage({ type: 'success', text: 'Nível interno atualizado.' });
      },
      onError: (error) => setMessage({ type: 'error', text: userAdminErrorMessage(error) }),
    });
  };

  return (
    <>
      <header className="page-header">
        <div>
          <button className="button ghost compact" type="button" onClick={onBack}><ArrowLeft size={16} />Voltar</button>
          <p className="section-label">Conta da plataforma</p>
          <h1>{name}</h1>
          <span>@{account.username}</span>
        </div>
        <div className="header-actions">
          <button className="button secondary" type="button" onClick={() => query.refetch()} disabled={query.isFetching}>
            <RefreshCw className={query.isFetching ? 'spin' : ''} size={16} />Atualizar
          </button>
          {canReset && (
            <>
              <button className="button secondary" type="button" onClick={() => setResetAction('password')}>
                <KeyRound size={16} />Redefinir senha
              </button>
              <button className="button secondary" type="button" onClick={() => setResetAction('mfa')}>
                <ShieldOff size={16} />Resetar MFA
              </button>
            </>
          )}
        </div>
      </header>

      <section className="content">
        {message && <div className={`inline-alert ${message.type === 'error' ? 'danger' : ''}`} role="status">{message.text}</div>}

        <section className="staff-list-section">
          <div className="section-heading"><div><h2>Cadastro canônico</h2><p>Dados operacionais sem credenciais ou documentos completos.</p></div></div>
          <dl className="user-overview-grid">
            <div><dt>Nome</dt><dd>{valueOrDash(account.display_name)}</dd></div>
            <div><dt>E-mail</dt><dd>{valueOrDash(account.email)}</dd></div>
            <div><dt>Telefone</dt><dd>{valueOrDash(account.phone)}</dd></div>
            <div><dt>País</dt><dd>{valueOrDash(account.country_code)}</dd></div>
            <div><dt>Documento</dt><dd>{formatDocument(account.document_last4)}</dd></div>
            <div><dt>Cadastro</dt><dd>{formatDateTime(new Date(account.created_at))}</dd></div>
            <div><dt>Onboarding</dt><dd>{account.onboarded_at ? formatDateTime(new Date(account.onboarded_at)) : 'Pendente'}</dd></div>
            <div><dt>Acesso liberado</dt><dd>{account.access_granted_at ? formatDateTime(new Date(account.access_granted_at)) : 'Não'}</dd></div>
            <div><dt>Profissional</dt><dd>{account.is_professional ? 'Sim' : 'Não'}</dd></div>
            <div><dt>Nível interno</dt><dd>{account.staff_role ? roleLabels[account.staff_role] : 'Sem acesso interno'}</dd></div>
          </dl>
          {account.bio && <p className="empty-copy">{account.bio}</p>}
          {canManageRole && (
            <label className="user-field">
              <span>Conceder ou alterar nível interno</span>
              <select
                value={account.staff_role ?? ''}
                disabled={setRole.isPending}
                onChange={(event) => event.target.value && changeRole(event.target.value as StaffRole)}
              >
                <option value="">Selecione um nível</option>
                {Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          )}
        </section>

        <section className="staff-list-section">
          <div className="section-heading"><div><h2>Negócios</h2><p>{overview.businesses.length} vínculo(s) como proprietário.</p></div></div>
          {overview.businesses.length === 0 ? <p className="empty-copy">Nenhum negócio próprio.</p> : (
            <div className="table-wrapper"><table className="staff-table"><thead><tr><th>Negócio</th><th>Status</th><th>Criado em</th></tr></thead><tbody>
              {overview.businesses.map((business) => <tr key={business.id}><td>{business.name}</td><td>{business.status}</td><td>{formatDateTime(new Date(business.created_at))}</td></tr>)}
            </tbody></table></div>
          )}
        </section>

        <section className="staff-list-section">
          <div className="section-heading"><div><h2>Compras</h2><p>{overview.purchases.length} compra(s) registrada(s).</p></div></div>
          {overview.purchases.length === 0 ? <p className="empty-copy">Nenhuma compra.</p> : (
            <div className="table-wrapper"><table className="staff-table"><thead><tr><th>Oferta</th><th>Status</th><th>Valor</th><th>Data</th></tr></thead><tbody>
              {overview.purchases.map((purchase) => <tr key={purchase.id}><td>{purchase.offer_name}</td><td>{purchase.status}</td><td>{formatCurrencyExact(purchase.amount)}</td><td>{formatDateTime(new Date(purchase.created_at))}</td></tr>)}
            </tbody></table></div>
          )}
        </section>

        <section className="staff-list-section">
          <div className="section-heading"><div><h2>Atendimento</h2><p>{overview.mail.length} conversa(s) administrativa(s).</p></div></div>
          {overview.mail.length === 0 ? <p className="empty-copy">Nenhuma conversa.</p> : (
            <div className="table-wrapper"><table className="staff-table"><thead><tr><th>Assunto</th><th>Status</th><th>Última mensagem</th></tr></thead><tbody>
              {overview.mail.map((mail) => <tr key={mail.id}><td>{mail.subject}</td><td>{mail.status}</td><td>{formatDateTime(new Date(mail.last_message_at))}</td></tr>)}
            </tbody></table></div>
          )}
        </section>
      </section>

      {resetAction && (
        <CredentialResetDialog
          targetUserId={userId}
          targetLabel={name}
          action={resetAction}
          onCancel={() => setResetAction(null)}
          onDone={(text) => { setResetAction(null); setMessage({ type: 'success', text }); }}
        />
      )}
    </>
  );
}

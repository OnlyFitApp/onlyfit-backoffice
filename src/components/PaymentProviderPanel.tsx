import { AlertTriangle, CheckCircle2, KeyRound, RefreshCw, Save } from 'lucide-react';
import { useState } from 'react';
import { usePaymentProviderStatus, useSetPaymentProviderCredentials } from '../hooks/usePaymentProviders';
import type { PaymentEnvironment, PaymentEnvironmentStatus } from '../lib/paymentProviders';
import { formatDateTime } from '../lib/format';

function CredentialEditor({ environment }: { environment: PaymentEnvironment }) {
  const [values, setValues] = useState({
    asaas_api_key: '', asaas_webhook_token: '', stripe_publishable_key: '',
    stripe_secret_key: '', stripe_webhook_secret: '',
  });
  const mutation = useSetPaymentProviderCredentials();
  const entries = Object.entries(values).filter(([, value]) => value.trim());
  async function save() {
    if (!entries.length) return;
    await mutation.mutateAsync({ environment, credentials: Object.fromEntries(entries) });
    setValues({ asaas_api_key: '', asaas_webhook_token: '', stripe_publishable_key: '', stripe_secret_key: '', stripe_webhook_secret: '' });
  }
  const labels: Record<keyof typeof values, string> = {
    asaas_api_key: 'Asaas API key', asaas_webhook_token: 'Asaas webhook token',
    stripe_publishable_key: 'Stripe publishable key', stripe_secret_key: 'Stripe secret key',
    stripe_webhook_secret: 'Stripe webhook secret',
  };
  return <details className="provider-secret-details">
    <summary>Atualizar credenciais</summary>
    <form className="provider-secret-form" onSubmit={(event) => { event.preventDefault(); void save(); }}>
      {(Object.keys(values) as Array<keyof typeof values>).map((key) => <input
        key={key} aria-label={labels[key]} type="password" autoComplete="off"
        value={values[key]} placeholder={labels[key]}
        onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
      />)}
      <button className="button primary" type="submit" disabled={mutation.isPending || !entries.length}><Save size={16} /> Salvar</button>
    </form>
    {mutation.isError ? <div className="inline-alert danger" role="alert"><AlertTriangle size={18} /> Não foi possível salvar.</div> : null}
  </details>;
}

function Status({ configured, label, suffix }: { configured: boolean; label: string; suffix?: string | null }) {
  return <span className={`provider-status-pill ${configured ? 'configured' : 'missing'}`}>
    {configured ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}<b>{label}</b>
    <small>{configured ? (suffix ? `•••• ${suffix}` : 'ativo') : 'pendente'}</small>
  </span>;
}

function Environment({ value, canEdit }: { value: PaymentEnvironmentStatus; canEdit: boolean }) {
  const ready = value.asaas_api_key_configured && value.asaas_webhook_token_configured
    && value.stripe_publishable_key_configured && value.stripe_secret_key_configured
    && value.stripe_webhook_secret_configured;
  return <article className={`provider-card ${ready ? 'ready' : 'attention'}`}>
    <div className="provider-card-head"><div><span>{value.environment === 'production' ? 'Produção' : 'Sandbox'}</span><h3>{ready ? 'Stripe + Asaas prontos' : 'Configurar provedores'}</h3></div><KeyRound size={18} /></div>
    <div className="provider-card-body">
      <Status configured={value.asaas_api_key_configured} label="Asaas API" suffix={value.asaas_api_key_last4} />
      <Status configured={value.asaas_webhook_token_configured} label="Asaas webhook" />
      <Status configured={value.stripe_publishable_key_configured} label="Stripe pk" suffix={value.stripe_publishable_key_last4} />
      <Status configured={value.stripe_secret_key_configured} label="Stripe sk" suffix={value.stripe_secret_key_last4} />
      <Status configured={value.stripe_webhook_secret_configured} label="Stripe webhook" suffix={value.stripe_webhook_secret_last4} />
    </div>
    <div className="provider-card-foot"><span>{value.updated_at ? formatDateTime(new Date(value.updated_at)) : 'Nunca atualizado'}</span><span>Segredos protegidos no OnlyFit Core.</span></div>
    {canEdit ? <CredentialEditor environment={value.environment} /> : null}
  </article>;
}

export function PaymentProviderPanel({ canEdit }: { canEdit: boolean }) {
  const query = usePaymentProviderStatus(true);
  const environments = [...(query.data?.environments ?? [])].sort((a) => a.environment === 'production' ? -1 : 1);
  return <section className="finance-section" aria-labelledby="provider-integration-title">
    <div className="section-heading"><div><h2 id="provider-integration-title">Provedores</h2><p>Credenciais de Pix/Asaas e cartão/Stripe ficam somente no Core.</p></div>
      <button className="button secondary" type="button" onClick={() => query.refetch()} disabled={query.isFetching}><RefreshCw className={query.isFetching ? 'spin' : ''} size={16} /> Atualizar</button></div>
    {query.isError ? <div className="inline-alert danger" role="alert"><AlertTriangle size={18} /> Não foi possível carregar o status da integração.</div>
      : query.isLoading ? <div className="skeleton staff-skeleton" />
      : <div className="provider-grid">{environments.map((environment) => <Environment key={environment.environment} value={environment} canEdit={canEdit && query.data?.can_edit === true} />)}</div>}
  </section>;
}

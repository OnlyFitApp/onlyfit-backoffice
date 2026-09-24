import { Dumbbell, RefreshCw, Save, ShieldCheck } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useCurrentStaffRole } from '../hooks/useStaffManagement';
import { useTrainingQuotaSettings, useUpdateTrainingQuotaSettings } from '../hooks/useTrainingQuotaSettings';
import { formatDateTime } from '../lib/format';
import { trainingQuotaErrorMessage } from '../lib/trainingQuotaSettings';

export function TrainingQuotaSettingsPage() {
  const settings = useTrainingQuotaSettings();
  const update = useUpdateTrainingQuotaSettings();
  const role = useCurrentStaffRole();
  const canEdit = role.data === 'admin' || role.data === 'super_admin';
  const [draftLimit, setDraftLimit] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null);

  const freeLimit = draftLimit ?? String(settings.data?.freePersonalWorkoutLimit ?? '');
  const parsedLimit = Number(freeLimit);
  const valid = Number.isInteger(parsedLimit) && parsedLimit >= 1 && parsedLimit <= 10000;
  const dirty = settings.data ? parsedLimit !== settings.data.freePersonalWorkoutLimit : false;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    if (!settings.data || !valid || !canEdit) return;
    update.mutate(
      {
        freePersonalWorkoutLimit: parsedLimit,
        expectedUpdatedAt: settings.data.updatedAt,
      },
      {
        onSuccess: () => {
          setDraftLimit(null);
          setMessage({ tone: 'success', text: 'Cota gratuita atualizada. O novo limite já vale no app.' });
        },
        onError: (error) => setMessage({ tone: 'danger', text: trainingQuotaErrorMessage(error) }),
      },
    );
  }

  return (
    <>
      <header className="page-header">
        <div>
          <p className="section-label">Biblioteca da plataforma</p>
          <h1>Cotas de treinos próprios</h1>
          <p className="training-quota-lead">Limites totais da biblioteca pessoal usados pelo app.</p>
        </div>
        <button
          className="button secondary"
          type="button"
          onClick={() => void settings.refetch()}
          disabled={settings.isFetching}
        >
          <RefreshCw className={settings.isFetching ? 'spin' : ''} size={16} /> Atualizar
        </button>
      </header>

      <section className="content training-quota-page">
        {settings.isError ? (
          <p className="inline-alert danger" role="alert">Não foi possível carregar as cotas de treinos.</p>
        ) : null}

        {settings.isLoading ? (
          <div className="training-quota-loading"><RefreshCw className="spin" size={24} /></div>
        ) : settings.data ? (
          <form className="training-quota-panel" onSubmit={submit}>
            <div className="training-quota-heading">
              <span className="training-quota-icon"><Dumbbell size={21} /></span>
              <div>
                <h2>Biblioteca pessoal</h2>
                <p>A cota conta os treinos próprios mantidos na biblioteca e não é renovada mensalmente.</p>
              </div>
            </div>

            <div className="training-quota-grid">
              <label className="training-quota-field">
                <span>Plano gratuito</span>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  step="1"
                  inputMode="numeric"
                  value={freeLimit}
                  disabled={!canEdit || update.isPending}
                  aria-invalid={!valid}
                  onChange={(event) => {
                    setDraftLimit(event.target.value);
                    setMessage(null);
                  }}
                />
                <small>Quantidade total de treinos próprios.</small>
              </label>

              <div className="training-quota-field readonly">
                <span>OnlyFit Club</span>
                <strong>{settings.data.clubPersonalWorkoutLimit}</strong>
                <small>Regra atual do benefício Club.</small>
              </div>
            </div>

            {!valid ? <p className="form-error" role="alert">Informe um número inteiro entre 1 e 10.000.</p> : null}
            {message ? <p className={`inline-alert ${message.tone}`} role="status">{message.text}</p> : null}

            <div className="training-quota-footer">
              <span>
                <ShieldCheck size={16} />
                Aplicado pelo servidor
                {settings.data.updatedAt ? ` · atualizado em ${formatDateTime(new Date(settings.data.updatedAt))}` : ''}
              </span>
              {canEdit ? (
                <button className="button primary" type="submit" disabled={!valid || !dirty || update.isPending}>
                  <Save size={16} /> {update.isPending ? 'Salvando…' : 'Salvar limite'}
                </button>
              ) : null}
            </div>
          </form>
        ) : null}
      </section>
    </>
  );
}

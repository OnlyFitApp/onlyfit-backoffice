import { Check, ListChecks, Pencil, Plus, RefreshCw, Save, Star, Trash2, X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { useProtocolCatalog, useSetProtocolCatalogEntryActive, useUpsertProtocolCatalogEntry } from '../hooks/useProtocolCatalog';
import { useCurrentStaffRole } from '../hooks/useStaffManagement';
import { protocolIcon, protocolIconKeys } from '../lib/protocolIconCatalog';
import {
  protocolCatalogErrorMessage,
  protocolFlows,
  protocolLocales,
  protocolStepTranslation,
  protocolTranslation,
  type ProtocolCatalogEntry,
  type ProtocolCatalogInput,
  type ProtocolFlow,
  type ProtocolLocale,
  type ProtocolStep,
} from '../lib/protocolCatalog';
import { formatNumber } from '../lib/format';

type Draft = ProtocolCatalogInput & { isNew: boolean };

const emptyDraft: Draft = {
  isNew: true,
  id: '',
  translations: protocolLocales.map(({ value }) => ({
    locale: value,
    name: '',
    category: '',
    description: '',
  })),
  flow: 'generic',
  iconKey: 'sparkles',
  structureLocked: false,
  clinicalNotice: false,
  featured: false,
  defaultSteps: [],
  sortOrder: 0,
  active: true,
};

const slug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);

/**
 * F4 da jornada de templates — o catálogo de protocolos da plataforma.
 *
 * É a vitrine que o My Fit mostra ao usuário e a lista de onde o profissional
 * parte ao prescrever. Era constante replicada no app Flutter e no desktop;
 * agora é dado mantido aqui.
 *
 * Não há exclusão: a chave fica guardada em quem já segue o protocolo.
 * Desativar tira da vitrine sem apagar histórico.
 */
export function ProtocolCatalogPage({ embedded = false }: { embedded?: boolean }) {
  const query = useProtocolCatalog();
  const role = useCurrentStaffRole();
  const canGovern = role.data === 'admin' || role.data === 'super_admin';

  const upsert = useUpsertProtocolCatalogEntry();
  const setActive = useSetProtocolCatalogEntryActive();
  const [draft, setDraft] = useState<Draft | null>(null);

  const entries = useMemo(() => query.data ?? [], [query.data]);
  const activeCount = entries.filter((entry) => entry.active).length;
  const inUse = entries.reduce((total, entry) => total + entry.inUseCount, 0);
  const busy = upsert.isPending || setActive.isPending;
  const failure = upsert.error ?? setActive.error;

  const nextOrder = useMemo(
    () => (entries.length ? Math.max(...entries.map((entry) => entry.sortOrder)) + 10 : 0),
    [entries],
  );

  function openNew() {
    setDraft({ ...emptyDraft, sortOrder: nextOrder });
    upsert.reset();
    setActive.reset();
  }

  function openEdit(entry: ProtocolCatalogEntry) {
    setDraft({
      ...entry,
      isNew: false,
      translations: entry.translations.map((translation) => ({ ...translation })),
      defaultSteps: entry.defaultSteps.map((step) => ({
        ...step,
        translations: step.translations.map((translation) => ({ ...translation })),
      })),
    });
    upsert.reset();
    setActive.reset();
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft || !canGovern) return;
    const primary = protocolTranslation(draft, 'pt-BR');
    const id = draft.isNew ? slug(draft.id || primary.name) : draft.id;
    const translationsComplete = draft.translations.every((translation) =>
      translation.name.trim() && translation.category.trim() && translation.description.trim());
    const stepsComplete = draft.defaultSteps.every((step) =>
      step.translations.every((translation) => translation.name.trim()));
    if (!id || !translationsComplete || !stepsComplete) return;
    await upsert.mutateAsync({ ...draft, id });
    setDraft(null);
  }

  function patch(values: Partial<Draft>) {
    setDraft((current) => (current ? { ...current, ...values } : current));
  }

  function patchStep(index: number, values: Partial<ProtocolStep>) {
    setDraft((current) => {
      if (!current) return current;
      const steps = current.defaultSteps.map((step, position) =>
        position === index ? { ...step, ...values } : step,
      );
      return { ...current, defaultSteps: steps };
    });
  }

  function patchTranslation(locale: ProtocolLocale, values: { name?: string; category?: string; description?: string }) {
    setDraft((current) => current ? {
      ...current,
      translations: current.translations.map((translation) =>
        translation.locale === locale ? { ...translation, ...values } : translation),
    } : current);
  }

  function patchStepTranslation(index: number, locale: ProtocolLocale, values: { name?: string; instruction?: string }) {
    setDraft((current) => current ? {
      ...current,
      defaultSteps: current.defaultSteps.map((step, position) => position === index ? {
        ...step,
        translations: step.translations.map((translation) =>
          translation.locale === locale ? { ...translation, ...values } : translation),
      } : step),
    } : current);
  }

  return (
    <>
      <header className={embedded ? 'pcat-embedded-header' : 'page-header'}>
        <div>
          {!embedded ? <p className="section-label">Biblioteca da plataforma</p> : null}
          <h1>Catálogo de protocolos</h1>
        </div>
        <div className="pcat-row-actions">
          {canGovern ? (
            <button className="button primary" type="button" onClick={openNew} disabled={busy}>
              <Plus size={16} /> Novo protocolo
            </button>
          ) : null}
          <button
            className="button secondary"
            type="button"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            <RefreshCw className={query.isFetching ? 'spin' : ''} size={16} /> Atualizar
          </button>
        </div>
      </header>

      <section className={embedded ? 'pcat-page' : 'content pcat-page'}>
        <div className="pcat-summary">
          <span><strong>{formatNumber(entries.length)}</strong> no catálogo</span>
          <span><strong>{formatNumber(activeCount)}</strong> na vitrine</span>
          <span><strong>{formatNumber(inUse)}</strong> protocolos em uso</span>
        </div>

        {failure ? <p className="form-error" role="alert">{protocolCatalogErrorMessage(failure)}</p> : null}
        {query.isError ? <p className="form-error" role="alert">Não foi possível carregar o catálogo.</p> : null}

        <div className={draft ? 'pcat-workspace has-editor' : 'pcat-workspace'}>
          <div className="pcat-list-panel">
            {query.isLoading ? (
              <div className="pcat-loading"><RefreshCw className="spin" size={22} /></div>
            ) : null}

            {!query.isLoading && entries.length === 0 ? (
              <div className="pcat-empty">
                <ListChecks size={26} />
                <strong>Nenhum protocolo cadastrado</strong>
              </div>
            ) : null}

            {entries.length ? (
              <ul className="pcat-list">
                {entries.map((entry) => {
                  const Icon = protocolIcon(entry.iconKey);
                  const flow = protocolFlows.find((option) => option.value === entry.flow);
                  const primary = protocolTranslation(entry, 'pt-BR');
                  return (
                    <li className={entry.active ? 'pcat-row' : 'pcat-row inactive'} key={entry.id}>
                      <span className="pcat-icon"><Icon size={19} /></span>

                      <div className="pcat-row-main">
                        <div>
                          <strong>
                            {primary.name}
                            {entry.featured ? (
                              <Star size={13} aria-label="Abre a vitrine" className="pcat-featured" />
                            ) : null}
                          </strong>
                          <code>{entry.id}</code>
                        </div>
                        <span className="role-badge">{primary.category}</span>
                        <span className={entry.active ? 'pcat-status active' : 'pcat-status'}>
                          {entry.active ? 'Na vitrine' : 'Fora'}
                        </span>
                        <span className="pcat-muted">
                          {flow?.label ?? entry.flow} · {entry.defaultSteps.length} etapa(s) padrão ·{' '}
                          {formatNumber(entry.inUseCount)} em uso
                          {entry.structureLocked ? ' · estrutura travada' : ''}
                          {entry.clinicalNotice ? ' · aviso clínico' : ''}
                        </span>
                      </div>

                      {canGovern ? (
                        <div className="pcat-row-actions">
                          <button className="button secondary compact" type="button" disabled={busy} onClick={() => openEdit(entry)}>
                            <Pencil size={14} /> Editar
                          </button>
                          <button
                            className={entry.active ? 'button danger compact' : 'button primary compact'}
                            type="button"
                            disabled={busy}
                            onClick={() => void setActive.mutateAsync({ id: entry.id, active: !entry.active })}
                          >
                            {entry.active ? <X size={14} /> : <Check size={14} />}
                            {entry.active ? 'Tirar da vitrine' : 'Pôr na vitrine'}
                          </button>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          {draft ? (
            <form className="pcat-editor" onSubmit={submit}>
              <h2 className="pcat-section-heading">{draft.isNew ? 'Novo protocolo' : 'Editar protocolo'}</h2>

              {protocolLocales.map((locale, localeIndex) => {
                const translation = protocolTranslation(draft, locale.value);
                return (
                  <fieldset className="pcat-translation" key={locale.value}>
                    <legend>{locale.label}</legend>
                    <label className="pcat-field">
                      <span>Nome</span>
                      <input value={translation.name} maxLength={120} autoFocus={localeIndex === 0}
                        onChange={(event) => patchTranslation(locale.value, { name: event.target.value })} />
                    </label>
                    <label className="pcat-field">
                      <span>Categoria</span>
                      <input value={translation.category} maxLength={80}
                        onChange={(event) => patchTranslation(locale.value, { category: event.target.value })} />
                    </label>
                    <label className="pcat-field">
                      <span>Descrição</span>
                      <textarea rows={2} value={translation.description} maxLength={500}
                        onChange={(event) => patchTranslation(locale.value, { description: event.target.value })} />
                    </label>
                  </fieldset>
                );
              })}

              <div className="pcat-field">
                <span>Ícone</span>
                <div className="pcat-icon-picker" role="radiogroup" aria-label="Ícone do protocolo">
                  {protocolIconKeys.map((key) => {
                    const Icon = protocolIcon(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={draft.iconKey === key}
                        aria-label={key}
                        title={key}
                        className={draft.iconKey === key ? 'selected' : ''}
                        onClick={() => patch({ iconKey: key })}
                      >
                        <Icon size={17} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="pcat-field">
                <span>Fluxo</span>
                <select value={draft.flow} onChange={(event) => patch({ flow: event.target.value as ProtocolFlow })}>
                  {protocolFlows.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <p className="pcat-note">{protocolFlows.find((option) => option.value === draft.flow)?.hint}</p>

              <label className="pcat-field">
                <span>Ordem na vitrine</span>
                <input
                  type="number"
                  min={0}
                  max={999}
                  value={draft.sortOrder}
                  onChange={(event) => patch({ sortOrder: Number(event.target.value) || 0 })}
                />
              </label>

              <label className="pcat-choice-field">
                <input type="checkbox" checked={draft.featured} onChange={(event) => patch({ featured: event.target.checked })} />
                <span>Abre a vitrine do My Fit</span>
              </label>

              <label className="pcat-choice-field">
                <input
                  type="checkbox"
                  checked={draft.structureLocked}
                  onChange={(event) => patch({ structureLocked: event.target.checked })}
                />
                <span>Estrutura travada — o usuário ajusta horários, não as etapas</span>
              </label>

              <label className="pcat-choice-field">
                <input
                  type="checkbox"
                  checked={draft.clinicalNotice}
                  onChange={(event) => patch({ clinicalNotice: event.target.checked })}
                />
                <span>Mostra aviso de acompanhamento profissional</span>
              </label>

              <div className="pcat-field">
                <span>Etapas padrão</span>
                {draft.defaultSteps.map((step, index) => (
                  <div className="pcat-step" key={index}>
                    {protocolLocales.map((locale) => {
                      const translation = protocolStepTranslation(step, locale.value);
                      return (
                        <div className="pcat-step-translation" key={locale.value}>
                          <strong>{locale.label}</strong>
                          <input value={translation.name} placeholder="Etapa" maxLength={160}
                            onChange={(event) => patchStepTranslation(index, locale.value, { name: event.target.value })} />
                          <textarea rows={3} value={translation.instruction} placeholder="Instrução" maxLength={1000}
                            onChange={(event) => patchStepTranslation(index, locale.value, { instruction: event.target.value })} />
                        </div>
                      );
                    })}
                    <input
                      type="time"
                      value={step.time}
                      onChange={(event) => patchStep(index, { time: event.target.value })}
                    />
                    <input
                      type="number"
                      min={1}
                      max={10080}
                      placeholder="min"
                      value={step.durationMinutes ?? ''}
                      onChange={(event) =>
                        patchStep(index, { durationMinutes: Number(event.target.value) || null })
                      }
                    />
                    <button
                      className="icon-button"
                      type="button"
                      aria-label={`Remover etapa ${index + 1}`}
                      onClick={() =>
                        patch({ defaultSteps: draft.defaultSteps.filter((_, position) => position !== index) })
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                <button
                  className="button secondary compact"
                  type="button"
                  onClick={() =>
                    patch({
                      defaultSteps: [...draft.defaultSteps, {
                        translations: protocolLocales.map(({ value }) => ({ locale: value, name: '', instruction: '' })),
                        time: '08:00',
                        durationMinutes: null,
                      }],
                    })
                  }
                >
                  <Plus size={14} /> Etapa
                </button>
              </div>

              {draft.isNew ? (
                <label className="pcat-field">
                  <span>Chave técnica</span>
                  <input
                    value={draft.id}
                    maxLength={80}
                    placeholder={slug(protocolTranslation(draft, 'pt-BR').name) || 'ex.: mobilidade'}
                    onChange={(event) => patch({ id: event.target.value })}
                  />
                </label>
              ) : (
                <p className="pcat-note">
                  A chave <code>{draft.id}</code> não muda: é ela que os protocolos já criados guardam.
                </p>
              )}

              <div className="pcat-editor-actions">
                <button className="button secondary" type="button" onClick={() => setDraft(null)} disabled={busy}>
                  Cancelar
                </button>
                <button
                  className="button primary"
                  type="submit"
                  disabled={busy || draft.translations.some((translation) =>
                    !translation.name.trim() || !translation.category.trim() || !translation.description.trim())
                    || draft.defaultSteps.some((step) => step.translations.some((translation) => !translation.name.trim()))}
                >
                  <Save size={16} /> Salvar
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </section>
    </>
  );
}

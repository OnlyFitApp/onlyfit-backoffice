import { Check, Dumbbell, Pencil, Plus, RefreshCw, Save, X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { useAffinityGroups } from '../hooks/useAffinityGroups';
import { useSessionTypes, useSetSessionTypeActive, useUpsertSessionType } from '../hooks/useSessionTypes';
import { useCurrentStaffRole } from '../hooks/useStaffManagement';
import { sessionIcon, sessionIconKeys } from '../lib/protocolIconCatalog';
import {
  sessionTypeErrorMessage,
  type SessionType,
  type SessionTypeInput,
} from '../lib/sessionTypes';
import { formatNumber } from '../lib/format';

type Draft = SessionTypeInput & { isNew: boolean };

const emptyDraft: Draft = {
  isNew: true,
  key: '',
  label: '',
  iconKey: 'activity',
  sports: [],
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
    .replace(/^([0-9])/, 't$1')
    .slice(0, 40);

/**
 * F5.b — o vocabulário de sessão de treino.
 *
 * Era constante no portal e array em cada builder: acrescentar "boulder" ou dar
 * vocabulário a um esporte novo exigia release. Agora entra por cadastro.
 *
 * Sem esporte marcado, o tipo vale para todo esporte — é assim que descanso e
 * mobilidade aparecem em todos os builders. Não há exclusão: a chave fica nas
 * sessões já montadas, e desativar tira só da escolha de sessão nova.
 */
export function SessionTypesPage() {
  const query = useSessionTypes();
  const sports = useAffinityGroups();
  const role = useCurrentStaffRole();
  const canGovern = role.data === 'admin' || role.data === 'super_admin';

  const upsert = useUpsertSessionType();
  const setActive = useSetSessionTypeActive();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [sportFilter, setSportFilter] = useState<string>('all');

  const types = useMemo(() => query.data ?? [], [query.data]);
  const sportOptions = useMemo(
    () => (sports.data ?? []).filter((group) => group.active).map((group) => ({ key: group.key, label: group.label })),
    [sports.data],
  );

  const visible = useMemo(() => {
    if (sportFilter === 'all') return types;
    return types.filter((type) => type.sports.length === 0 || type.sports.includes(sportFilter));
  }, [types, sportFilter]);

  const activeCount = types.filter((type) => type.active).length;
  const inUse = types.reduce((total, type) => total + type.inUseCount, 0);
  const busy = upsert.isPending || setActive.isPending;
  const failure = upsert.error ?? setActive.error;

  const nextOrder = useMemo(
    () => (types.length ? Math.max(...types.map((type) => type.sortOrder)) + 10 : 0),
    [types],
  );

  function openNew() {
    setDraft({ ...emptyDraft, sortOrder: nextOrder });
    upsert.reset();
    setActive.reset();
  }

  function openEdit(type: SessionType) {
    setDraft({ ...type, isNew: false, sports: [...type.sports] });
    upsert.reset();
    setActive.reset();
  }

  function patch(values: Partial<Draft>) {
    setDraft((current) => (current ? { ...current, ...values } : current));
  }

  function toggleSport(key: string) {
    setDraft((current) => {
      if (!current) return current;
      const next = current.sports.includes(key)
        ? current.sports.filter((sport) => sport !== key)
        : [...current.sports, key];
      return { ...current, sports: next };
    });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft || !canGovern) return;
    const key = draft.isNew ? slug(draft.key || draft.label) : draft.key;
    if (!key || !draft.label.trim()) return;
    await upsert.mutateAsync({ ...draft, key });
    setDraft(null);
  }

  const sportLabel = (key: string) =>
    sportOptions.find((option) => option.key === key)?.label ?? key;

  return (
    <>
      <header className="page-header">
        <div>
          <p className="section-label">Biblioteca da plataforma</p>
          <h1>Tipos de sessão</h1>
        </div>
        <div className="pcat-row-actions">
          {canGovern ? (
            <button className="button primary" type="button" onClick={openNew} disabled={busy}>
              <Plus size={16} /> Novo tipo
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

      <section className="content pcat-page">
        <div className="pcat-summary">
          <span><strong>{formatNumber(types.length)}</strong> cadastrados</span>
          <span><strong>{formatNumber(activeCount)}</strong> disponíveis</span>
          <span><strong>{formatNumber(inUse)}</strong> sessões montadas</span>
        </div>

        <label className="pcat-field pcat-filter">
          <span>Esporte</span>
          <select value={sportFilter} onChange={(event) => setSportFilter(event.target.value)}>
            <option value="all">Todos</option>
            {sportOptions.map((option) => (
              <option key={option.key} value={option.key}>{option.label}</option>
            ))}
          </select>
        </label>

        {failure ? <p className="form-error" role="alert">{sessionTypeErrorMessage(failure)}</p> : null}
        {query.isError ? <p className="form-error" role="alert">Não foi possível carregar os tipos de sessão.</p> : null}

        <div className={draft ? 'pcat-workspace has-editor' : 'pcat-workspace'}>
          <div className="pcat-list-panel">
            {query.isLoading ? <div className="pcat-loading"><RefreshCw className="spin" size={22} /></div> : null}

            {!query.isLoading && visible.length === 0 ? (
              <div className="pcat-empty">
                <Dumbbell size={26} />
                <strong>Nenhum tipo de sessão neste filtro</strong>
              </div>
            ) : null}

            {visible.length ? (
              <ul className="pcat-list">
                {visible.map((type) => {
                  const Icon = sessionIcon(type.iconKey);
                  return (
                    <li className={type.active ? 'pcat-row' : 'pcat-row inactive'} key={type.key}>
                      <span className="pcat-icon"><Icon size={19} /></span>

                      <div className="pcat-row-main">
                        <div>
                          <strong>{type.label}</strong>
                          <code>{type.key}</code>
                        </div>
                        <span className={type.active ? 'pcat-status active' : 'pcat-status'}>
                          {type.active ? 'Disponível' : 'Fora'}
                        </span>
                        <span className="pcat-muted">
                          {type.sports.length === 0
                            ? 'Todo esporte'
                            : type.sports.map(sportLabel).join(' · ')}
                          {' · '}
                          {formatNumber(type.inUseCount)} sessões
                        </span>
                      </div>

                      {canGovern ? (
                        <div className="pcat-row-actions">
                          <button className="button secondary compact" type="button" disabled={busy} onClick={() => openEdit(type)}>
                            <Pencil size={14} /> Editar
                          </button>
                          <button
                            className={type.active ? 'button danger compact' : 'button primary compact'}
                            type="button"
                            disabled={busy}
                            onClick={() => void setActive.mutateAsync({ key: type.key, active: !type.active })}
                          >
                            {type.active ? <X size={14} /> : <Check size={14} />}
                            {type.active ? 'Desativar' : 'Ativar'}
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
              <h2 className="pcat-section-heading">{draft.isNew ? 'Novo tipo de sessão' : 'Editar tipo de sessão'}</h2>

              <label className="pcat-field">
                <span>Rótulo</span>
                <input
                  value={draft.label}
                  maxLength={60}
                  autoFocus
                  onChange={(event) => patch({ label: event.target.value })}
                />
              </label>

              <div className="pcat-field">
                <span>Ícone</span>
                <div className="pcat-icon-picker" role="radiogroup" aria-label="Ícone do tipo de sessão">
                  {sessionIconKeys.map((key) => {
                    const Icon = sessionIcon(key);
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

              <div className="pcat-field">
                <span>Esportes</span>
                <div className="pcat-sport-picker">
                  {sportOptions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      aria-pressed={draft.sports.includes(option.key)}
                      className={draft.sports.includes(option.key) ? 'selected' : ''}
                      onClick={() => toggleSport(option.key)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="pcat-note">
                {draft.sports.length === 0
                  ? 'Sem esporte marcado, o tipo aparece em todos — é assim que descanso e mobilidade funcionam.'
                  : `Aparece em ${draft.sports.length} esporte(s).`}
              </p>

              <label className="pcat-field">
                <span>Ordem na lista</span>
                <input
                  type="number"
                  min={0}
                  max={9999}
                  value={draft.sortOrder}
                  onChange={(event) => patch({ sortOrder: Number(event.target.value) || 0 })}
                />
              </label>

              {draft.isNew ? (
                <label className="pcat-field">
                  <span>Chave técnica</span>
                  <input
                    value={draft.key}
                    maxLength={40}
                    placeholder={slug(draft.label) || 'ex.: boulder'}
                    onChange={(event) => patch({ key: event.target.value })}
                  />
                </label>
              ) : (
                <p className="pcat-note">
                  A chave <code>{draft.key}</code> não muda: é ela que as sessões já montadas guardam.
                </p>
              )}

              <div className="pcat-editor-actions">
                <button className="button secondary" type="button" onClick={() => setDraft(null)} disabled={busy}>
                  Cancelar
                </button>
                <button className="button primary" type="submit" disabled={busy || !draft.label.trim()}>
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

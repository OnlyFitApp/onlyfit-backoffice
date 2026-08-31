import { FormEvent, useState } from 'react';
import { ExternalLink, FileText, RefreshCw, Upload } from 'lucide-react';
import {
  useLegalDocuments,
  usePublishLegalDocument,
  useSetLegalDocumentActive,
  useSetLegalDocumentJourney,
} from '../hooks/useLegalDocuments';
import {
  LEGAL_DOCUMENT_CATALOG,
  LEGAL_JOURNEYS,
  legalDocumentCatalogEntry,
  legalDocumentName,
  type LegalDocumentJourney,
  type LegalDocumentKey,
  type LegalDocumentKind,
} from '../lib/legalDocuments';
import { formatDateTime, formatNumber } from '../lib/format';

export function LegalDocumentsPage() {
  const query = useLegalDocuments();
  const publish = usePublishLegalDocument();
  const toggle = useSetLegalDocumentActive();
  const journey = useSetLegalDocumentJourney();
  const initial = LEGAL_DOCUMENT_CATALOG.find((entry) => entry.key === 'service_terms')!;
  const [key, setKey] = useState<LegalDocumentKey>(initial.key);
  const [version, setVersion] = useState('');
  const [kind, setKind] = useState<LegalDocumentKind>(initial.kind);
  const [title, setTitle] = useState<string>(initial.title);
  const [description, setDescription] = useState<string>(initial.description);
  const [acceptanceText, setAcceptanceText] = useState<string>(initial.acceptanceText);
  const [actionLabel, setActionLabel] = useState<string>(initial.actionLabel);
  const [required, setRequired] = useState<boolean>(initial.isRequired);
  const [activate, setActivate] = useState(true);
  const [sortOrder, setSortOrder] = useState<number>(initial.sortOrder);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const selected = legalDocumentCatalogEntry(key);

  /** Trocar de documento traz o formato publicado dele; o texto novo entra por cima. */
  function selectDocument(nextKey: LegalDocumentKey) {
    setKey(nextKey);
    const entry = legalDocumentCatalogEntry(nextKey);
    if (!entry) return;
    setKind(entry.kind);
    setSortOrder(entry.sortOrder);
    setTitle(entry.title);
    setDescription(entry.description);
    setAcceptanceText(entry.acceptanceText);
    setActionLabel(entry.actionLabel);
    setRequired(entry.isRequired);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    if (!file) return;
    try {
      await publish.mutateAsync({ key, version, kind, title, description, acceptanceText, actionLabel, isRequired: required, sortOrder, activate, file });
      setFile(null);
      setMessage('Documento publicado.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível publicar.');
    }
  }

  return <>
    <header className="page-header">
      <div><p className="section-label">Governança</p><h1>Documentos legais</h1></div>
      <button className="button secondary" type="button" onClick={() => void query.refetch()} disabled={query.isFetching}>
        <RefreshCw className={query.isFetching ? 'spin' : ''} size={16} /> Atualizar
      </button>
    </header>
    <section className="content legal-documents-layout">
      <form className="staff-create-panel legal-document-form" onSubmit={submit}>
        <div className="staff-create-copy"><Upload size={22} /><div><h2>Publicar versão</h2></div></div>
        <div className="staff-form">
          <label><span>Documento</span><select value={key} onChange={(event) => selectDocument(event.target.value as LegalDocumentKey)}>{LEGAL_DOCUMENT_CATALOG.map((entry) => <option key={entry.key} value={entry.key}>{entry.name}</option>)}</select></label>
          <label><span>Versão</span><input value={version} onChange={(event) => setVersion(event.target.value)} required maxLength={40} /></label>
          {selected ? <p className="legal-document-hint">{selected.summary}</p> : null}
          <label><span>Tipo</span><select value={kind} onChange={(event) => setKind(event.target.value as LegalDocumentKind)}><option value="acceptance">Aceite</option><option value="notice">Ciência</option><option value="declaration">Declaração</option></select></label>
          <label><span>Ordem</span><input type="number" min={0} max={10000} value={sortOrder} onChange={(event) => setSortOrder(Number(event.target.value))} /></label>
          <label className="legal-field-wide"><span>Título</span><input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={160} /></label>
          <label className="legal-field-wide"><span>Descrição</span><textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} required maxLength={1000} /></label>
          <label className="legal-field-wide"><span>Texto do aceite</span><textarea rows={3} value={acceptanceText} onChange={(event) => setAcceptanceText(event.target.value)} required maxLength={1000} /></label>
          <label><span>Rótulo da ação</span><input value={actionLabel} onChange={(event) => setActionLabel(event.target.value)} required maxLength={80} /></label>
          <label><span>PDF</span><input type="file" accept="application/pdf,.pdf" required onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label>
          <label className="legal-check"><input type="checkbox" checked={required} onChange={(event) => setRequired(event.target.checked)} /><span>Obrigatório</span></label>
          <label className="legal-check"><input type="checkbox" checked={activate} onChange={(event) => setActivate(event.target.checked)} /><span>Ativar ao publicar</span></label>
          {message ? <p className={publish.isError ? 'form-error legal-field-wide' : 'legal-field-wide'} role="status">{message}</p> : null}
          <button className="button primary legal-field-wide" type="submit" disabled={publish.isPending || !file}>{publish.isPending ? <RefreshCw className="spin" size={16} /> : <Upload size={16} />} Publicar PDF</button>
        </div>
      </form>

      <section className="staff-list-section" aria-labelledby="legal-version-title">
        <div className="staff-create-copy"><FileText size={22} /><div><h2 id="legal-version-title">Versões e cobertura</h2><p>{formatNumber(query.data?.length ?? 0)} versões publicadas</p></div></div>
        {query.isLoading ? <div className="skeleton staff-skeleton" /> : null}
        {query.isError ? <p className="form-error" role="alert">Não foi possível carregar os documentos.</p> : null}
        {journey.isError ? <p className="form-error" role="alert">Não foi possível mudar a jornada do documento.</p> : null}
        {query.data?.length ? <div className="table-wrapper"><table className="staff-table"><thead><tr><th>Documento</th><th>Jornada</th><th>Versão</th><th>Cobertura</th><th>Publicação</th><th>Estado</th><th><span className="sr-only">Ações</span></th></tr></thead><tbody>
          {query.data.map((item) => <tr key={`${item.key}:${item.version}`}><td><strong>{item.title}</strong>{legalDocumentName(item.key) === item.title ? null : <span>{legalDocumentName(item.key)}</span>}</td><td>{item.isCurrent ? <select className="legal-journey-select" aria-label={`Jornada de ${item.title}`} value={item.journey ?? ''} disabled={journey.isPending} onChange={(event) => journey.mutate({ key: item.key, journey: (event.target.value || null) as LegalDocumentJourney | null })}><option value="">Nenhuma</option>{LEGAL_JOURNEYS.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}</select> : <span className="legal-journey-past">—</span>}</td><td>{item.version}</td><td className="legal-coverage-cell"><strong>{formatNumber(item.acceptedCount)} aceites</strong><span>{formatNumber(item.pendingCount)} pendentes de {formatNumber(item.eligibleCount)}</span></td><td>{item.publishedAt ? formatDateTime(new Date(item.publishedAt)) : '—'}</td><td><span className={`role-badge ${item.isActive ? 'role-admin' : ''}`}>{item.isActive ? 'Ativo' : item.isCurrent ? 'Inativo' : 'Histórico'}</span></td><td className="staff-actions-cell"><a className="icon-button table-action" href={item.pdfUrl} target="_blank" rel="noreferrer" title="Abrir PDF"><ExternalLink size={16} /></a>{item.isCurrent ? <button className="button secondary" type="button" disabled={toggle.isPending} onClick={() => toggle.mutate({ key: item.key, active: !item.isActive })}>{item.isActive ? 'Desativar' : 'Ativar'}</button> : null}</td></tr>)}
        </tbody></table></div> : null}
      </section>
    </section>
  </>;
}

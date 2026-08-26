import { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  X,
} from 'lucide-react';
import { useCurrentStaffRole } from '../hooks/useStaffManagement';
import { useCompanyVerifications, useReviewCompanyVerification } from '../hooks/useCompanyVerification';
import {
  formatCnpj,
  type CompanyVerification,
  type CompanyVerificationStatus,
} from '../lib/companyVerification';

const pageSize = 50;

const filters: Array<{ value: CompanyVerificationStatus; label: string }> = [
  { value: 'pending_review', label: 'Em análise' },
  { value: 'approved', label: 'Verificadas' },
  { value: 'rejected', label: 'Recusadas' },
];

function dateLabel(value: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

export function CompanyVerificationPage() {
  const [status, setStatus] = useState<CompanyVerificationStatus>('pending_review');
  const [page, setPage] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  /* O motivo é por empresa: recusar sem dizer o quê deixa o dono sem saber o
     que corrigir, e o banco recusa a decisão sem texto (`notes_required`). */
  const [notes, setNotes] = useState<Record<string, string>>({});

  const companies = useCompanyVerifications(status, pageSize, page * pageSize);
  const review = useReviewCompanyVerification();
  const { data: role } = useCurrentStaffRole();
  const canDecide = role === 'super_admin' || role === 'admin' || role === 'support';

  const selectStatus = (value: CompanyVerificationStatus) => {
    setStatus(value);
    setPage(0);
    setMessage(null);
  };

  const decide = (company: CompanyVerification, action: 'approve' | 'reject') => {
    const reason = (notes[company.id] ?? '').trim();
    if (action === 'reject' && !reason) {
      setMessage('Escreva o motivo antes de recusar — é o texto que o dono do negócio lê.');
      return;
    }
    setMessage(null);
    review.mutate(
      { organizationId: company.id, action, notes: action === 'reject' ? reason : undefined },
      {
        onSuccess: () => {
          setNotes((current) => ({ ...current, [company.id]: '' }));
          setMessage(action === 'approve' ? 'Empresa verificada.' : 'Cadastro recusado e o dono foi avisado.');
        },
        onError: (error: unknown) => {
          const code = (error as { message?: string })?.message ?? '';
          setMessage(
            code.includes('not_pending')
              ? 'Esta empresa já foi decidida por outra pessoa. Atualize a fila.'
              : 'Não foi possível concluir a verificação.',
          );
        },
      },
    );
  };

  return <>
    <header className="page-header">
      <div>
        <p className="section-label">Operação</p>
        <h1>Verificação de empresas</h1>
        <span>Cadastros com CNPJ aguardando liberação para publicar.</span>
      </div>
      <button className="button secondary" type="button" onClick={() => companies.refetch()} disabled={companies.isFetching}>
        <RefreshCw className={companies.isFetching ? 'spin' : ''} size={16} /> Atualizar
      </button>
    </header>

    <section className="content">
      <div className="beta-segments" role="tablist" aria-label="Filtrar empresas">
        {filters.map((filter) => <button
          key={filter.value}
          type="button"
          role="tab"
          aria-selected={status === filter.value}
          className={status === filter.value ? 'active' : ''}
          onClick={() => selectStatus(filter.value)}
        >{filter.label}</button>)}
      </div>

      {message && <div className={`inline-alert ${message.startsWith('Não') || message.startsWith('Escreva') || message.startsWith('Esta') ? 'danger' : ''}`} role="status">{message}</div>}

      {companies.isLoading ? <div className="beta-empty"><RefreshCw className="spin" size={22} /> Carregando empresas…</div>
        : companies.isError ? <div className="inline-alert danger"><AlertTriangle size={18} /> Não foi possível carregar a fila.</div>
          : companies.data?.items.length === 0 ? <div className="beta-empty"><Building2 size={30} /><strong>Nenhuma empresa aqui</strong></div>
            : <div className="company-verification-list">{companies.data?.items.map((company) => <article className="company-verification-card" key={company.id}>
              <div className="company-verification-head">
                <div className="company-identity">
                  {company.logo_url
                    ? <img src={company.logo_url} alt="" className="company-logo" />
                    : <span className="company-logo placeholder"><Building2 size={20} /></span>}
                  <div>
                    <span>Enviada em {dateLabel(company.submitted_at)}</span>
                    <h2>{company.name}</h2>
                  </div>
                </div>
                <span className={`company-status ${company.verified ? 'approved' : company.status}`}>
                  {company.verified ? 'Verificada' : company.status === 'rejected' ? 'Recusada' : 'Em análise'}
                </span>
              </div>

              <dl className="company-verification-details">
                <div><dt>CNPJ</dt><dd>{formatCnpj(company.cnpj)}</dd></div>
                <div><dt>Nicho</dt><dd>{company.market_niche_label ?? company.market_niche ?? '—'}</dd></div>
                <div><dt>Site</dt><dd>{company.website_url
                  ? <a href={company.website_url} target="_blank" rel="noreferrer noopener">
                      {company.website_url} <ExternalLink size={13} />
                    </a>
                  : '—'}</dd></div>
                <div><dt>Responsável</dt><dd>{company.owner.name || company.owner.username || company.owner.id}{company.owner.email ? ` · ${company.owner.email}` : ''}</dd></div>
              </dl>

              <p className="company-description">{company.description || 'Sem descrição.'}</p>

              {company.status === 'rejected' && company.review_notes && <blockquote>
                <strong>Motivo da recusa · {dateLabel(company.reviewed_at)}</strong>
                {company.review_notes}
              </blockquote>}

              {company.status === 'pending_review' && canDecide && <div className="company-verification-decision">
                <label>
                  <span>Motivo da recusa</span>
                  <textarea
                    value={notes[company.id] ?? ''}
                    maxLength={400}
                    rows={2}
                    onChange={(event) => setNotes((current) => ({ ...current, [company.id]: event.target.value }))}
                  />
                </label>
                <div className="company-verification-actions">
                  <button className="button danger" type="button" disabled={review.isPending} onClick={() => decide(company, 'reject')}>
                    <X size={16} /> Recusar
                  </button>
                  <button className="button primary" type="button" disabled={review.isPending} onClick={() => decide(company, 'approve')}>
                    <Check size={16} /> Verificar
                  </button>
                </div>
              </div>}
            </article>)}</div>}

      {companies.data && companies.data.total > pageSize && <div className="beta-pagination">
        <button className="button secondary" type="button" disabled={page === 0} onClick={() => setPage((value) => value - 1)}>
          <ChevronLeft size={16} /> Anterior
        </button>
        <span>Página {page + 1} de {Math.ceil(companies.data.total / pageSize)}</span>
        <button className="button secondary" type="button" disabled={(page + 1) * pageSize >= companies.data.total} onClick={() => setPage((value) => value + 1)}>
          Próxima <ChevronRight size={16} />
        </button>
      </div>}
    </section>
  </>;
}

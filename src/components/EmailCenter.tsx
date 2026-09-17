import {
  AlertTriangle,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Archive,
  Bold,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  File,
  Inbox,
  Italic,
  List,
  ListOrdered,
  Mail,
  Paperclip,
  PenLine,
  RefreshCw,
  Reply,
  Search,
  Send,
  Underline,
  X,
} from 'lucide-react';
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  useEmailMailboxes,
  useEmailThread,
  useEmailThreads,
  useMarkEmailThreadRead,
  useSyncEmailCenter,
} from '../hooks/useEmailCenter';
import { useSendOutboundEmail } from '../hooks/useOutboundEmail';
import {
  openEmailAttachment,
  type EmailAttachment,
  type EmailBox,
  type EmailDeliveryStatus,
  type EmailMailbox,
  type EmailMessage,
  type EmailThread,
} from '../lib/emailCenter';
import { isValidEmail, splitEmailList } from '../lib/outboundEmail';

const PAGE_SIZE = 40;
const MAX_ATTACHMENT_BYTES = 20 * 1024 * 1024;
const MAX_TOTAL_ATTACHMENT_BYTES = 25 * 1024 * 1024;

type DraftAttachment = {
  id: string;
  filename: string;
  contentType: string;
  contentBase64: string;
  size: number;
};

function dateLabel(value: string): string {
  if (!value) return '—';
  const date = new Date(value);
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  return new Intl.DateTimeFormat('pt-BR', sameDay
    ? { hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
}

function sizeLabel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function statusLabel(status: EmailDeliveryStatus): string {
  return {
    processing: 'Processando',
    queued: 'Na fila',
    sent: 'Enviado',
    delivered: 'Entregue',
    delivery_delayed: 'Atrasado',
    bounced: 'Devolvido',
    complained: 'Spam',
    failed: 'Falhou',
    received: 'Recebido',
  }[status];
}

function ToolbarButton({ label, command, onCommand, children }: {
  label: string;
  command: string;
  onCommand: (command: string) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className="email-tool-button"
      type="button"
      aria-label={label}
      title={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onCommand(command)}
    >
      {children}
    </button>
  );
}

async function fileToAttachment(file: File): Promise<DraftAttachment> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  return {
    id: crypto.randomUUID(),
    filename: file.name,
    contentType: file.type || 'application/octet-stream',
    contentBase64: dataUrl.slice(dataUrl.indexOf(',') + 1),
    size: file.size,
  };
}

function AttachmentButton({ attachment }: { attachment: EmailAttachment }) {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const available = attachment.availabilityStatus === 'stored';
  const download = async () => {
    if (!available || loading) return;
    setLoading(true);
    setFailed(false);
    try {
      await openEmailAttachment(attachment.id);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button className="email-attachment" type="button" disabled={!available || loading} onClick={download}>
      <File size={16} />
      <span><strong>{attachment.filename}</strong><small>{failed ? 'Falha no download' : available ? sizeLabel(attachment.sizeBytes) : 'Indisponível'}</small></span>
      {loading ? <RefreshCw className="spin" size={15} /> : <Download size={15} />}
    </button>
  );
}

function MessageCard({ message }: { message: EmailMessage }) {
  const [expanded, setExpanded] = useState(true);
  const sender = message.fromName ? `${message.fromName} <${message.fromEmail}>` : message.fromEmail;
  const srcDoc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>body{box-sizing:border-box;margin:0;padding:18px;color:#202124;background:#fff;font:14px/1.55 Arial,sans-serif;overflow-wrap:anywhere}img{max-width:100%;height:auto}table{max-width:100%;border-collapse:collapse}a{color:#155eef}</style></head><body>${message.htmlContent || `<p>${message.textContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>')}</p>`}</body></html>`;
  return (
    <article className={`email-message-card ${message.direction}`}>
      <button className="email-message-head" type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
        <span className="email-avatar">{(message.fromName || message.fromEmail).slice(0, 1).toUpperCase()}</span>
        <span className="email-message-identity">
          <strong>{sender}</strong>
          <small>para {message.toEmails.join(', ')}</small>
        </span>
        <span className={`email-delivery-status status-${message.status}`}>{statusLabel(message.status)}</span>
        <time>{dateLabel(message.providerCreatedAt)}</time>
      </button>
      {expanded && (
        <div className="email-message-content">
          {(message.ccEmails.length > 0 || message.bccEmails.length > 0) && (
            <div className="email-message-recipients">
              {message.ccEmails.length > 0 && <span><strong>Cc:</strong> {message.ccEmails.join(', ')}</span>}
              {message.bccEmails.length > 0 && <span><strong>Cco:</strong> {message.bccEmails.join(', ')}</span>}
            </div>
          )}
          {message.errorMessage && <div className="inline-alert danger"><AlertTriangle size={16} /> {message.errorMessage}</div>}
          <iframe className="email-thread-frame" title={`Mensagem de ${sender}`} sandbox="" referrerPolicy="no-referrer" srcDoc={srcDoc} />
          {message.attachments.length > 0 && (
            <div className="email-attachments-list">{message.attachments.map((attachment) => <AttachmentButton key={attachment.id} attachment={attachment} />)}</div>
          )}
        </div>
      )}
    </article>
  );
}

function EmailComposer({ mailboxes, initialTo = '', thread = null, onCancel, onSent }: {
  mailboxes: EmailMailbox[];
  initialTo?: string;
  thread?: EmailThread | null;
  onCancel: () => void;
  onSent: (threadId: string | null) => void;
}) {
  const latestMessage = thread?.messages[thread.messages.length - 1] ?? null;
  const defaultMailbox = thread
    ? mailboxes.find((mailbox) => mailbox.id === thread.mailboxId)
    : mailboxes[0];
  const replyAddresses = latestMessage?.direction === 'inbound'
    ? latestMessage.replyToEmails.length ? latestMessage.replyToEmails : [latestMessage.fromEmail]
    : thread?.externalParticipants ?? [];
  const editorRef = useRef<HTMLDivElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [mailboxId, setMailboxId] = useState(defaultMailbox?.id ?? '');
  const selectedMailbox = mailboxes.find((mailbox) => mailbox.id === mailboxId) ?? defaultMailbox;
  const [senderName, setSenderName] = useState(defaultMailbox?.displayName ?? '');
  const effectiveSenderName = senderName || selectedMailbox?.displayName || 'OnlyFit';
  const [toInput, setToInput] = useState(thread ? replyAddresses.join(', ') : initialTo);
  const [ccInput, setCcInput] = useState('');
  const [bccInput, setBccInput] = useState('');
  const [showCopies, setShowCopies] = useState(false);
  const [subject, setSubject] = useState(thread ? (/^re\s*:/i.test(thread.subject) ? thread.subject : `Re: ${thread.subject}`) : '');
  const [html, setHtml] = useState('');
  const [attachments, setAttachments] = useState<DraftAttachment[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const sendMutation = useSendOutboundEmail();

  const recipients = useMemo(() => ({
    to: splitEmailList(toInput),
    cc: splitEmailList(ccInput),
    bcc: splitEmailList(bccInput),
  }), [bccInput, ccInput, toInput]);
  const invalid = [...recipients.to, ...recipients.cc, ...recipients.bcc].find((email) => !isValidEmail(email));
  const plainBody = html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  const canSend = Boolean(selectedMailbox && effectiveSenderName.trim() && recipients.to.length && !invalid && subject.trim() && plainBody && !sendMutation.isPending);

  const syncHtml = () => setHtml(editorRef.current?.innerHTML ?? '');
  const runCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncHtml();
  };
  const addAttachments = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files ?? [])];
    event.target.value = '';
    setFeedback(null);
    if (attachments.length + files.length > 10) {
      setFeedback('Você pode enviar no máximo 10 anexos por mensagem.');
      return;
    }
    if (files.some((file) => file.size > MAX_ATTACHMENT_BYTES)) {
      setFeedback('Cada anexo pode ter no máximo 20 MB.');
      return;
    }
    const currentBytes = attachments.reduce((total, item) => total + item.size, 0);
    if (currentBytes + files.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_ATTACHMENT_BYTES) {
      setFeedback('O total dos anexos pode ter no máximo 25 MB.');
      return;
    }
    try {
      const converted = await Promise.all(files.map(fileToAttachment));
      setAttachments((current) => [...current, ...converted]);
    } catch {
      setFeedback('Não foi possível ler um dos anexos.');
    }
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFeedback(null);
    if (!canSend || !selectedMailbox) return;
    try {
      const result = await sendMutation.mutateAsync({
        from: selectedMailbox.email,
        senderName: effectiveSenderName.trim(),
        ...recipients,
        subject: subject.trim(),
        html,
        attachments: attachments.map(({ filename, contentType, contentBase64 }) => ({ filename, contentType, contentBase64 })),
        idempotencyKey,
        threadId: thread?.id,
        replyToMessageId: latestMessage?.id,
      });
      onSent(result.threadId);
    } catch {
      setFeedback('Não foi possível enviar. Revise os dados e tente novamente.');
    }
  };

  return (
    <form className={`email-composer ${thread ? 'reply-composer' : ''}`} onSubmit={submit}>
      <div className="email-compose-head">
        <div><span>{thread ? <Reply size={16} /> : <PenLine size={16} />}</span><strong>{thread ? 'Responder' : 'Nova mensagem'}</strong></div>
        <button className="icon-button" type="button" onClick={onCancel} aria-label="Fechar"><X size={18} /></button>
      </div>
      <section className="email-address-panel">
        <div className="email-compose-row">
          <label><span>De</span><select value={selectedMailbox?.id ?? ''} onChange={(event) => {
            setMailboxId(event.target.value);
            const mailbox = mailboxes.find((item) => item.id === event.target.value);
            if (mailbox) setSenderName(mailbox.displayName);
          }} disabled={Boolean(thread)}>{mailboxes.map((mailbox) => <option key={mailbox.id} value={mailbox.id}>{mailbox.email}</option>)}</select></label>
          <label><span>Nome</span><input value={effectiveSenderName} maxLength={80} onChange={(event) => setSenderName(event.target.value)} /></label>
        </div>
        <div className="email-recipient-row">
          <span>Para</span><input value={toInput} onChange={(event) => setToInput(event.target.value)} placeholder="email@exemplo.com" />
          <button type="button" onClick={() => setShowCopies((value) => !value)}>Cc/Cco</button>
        </div>
        {showCopies && <div className="email-compose-row compact">
          <label><span>Cc</span><input value={ccInput} onChange={(event) => setCcInput(event.target.value)} /></label>
          <label><span>Cco</span><input value={bccInput} onChange={(event) => setBccInput(event.target.value)} /></label>
        </div>}
        <div className="email-subject-row"><span>Assunto</span><input value={subject} maxLength={200} onChange={(event) => setSubject(event.target.value)} /></div>
        {invalid && <p className="email-field-error">Endereço inválido: {invalid}</p>}
      </section>
      <section className="email-editor-panel">
        <div className="email-editor-toolbar" role="toolbar" aria-label="Formatação">
          <select aria-label="Estilo" defaultValue="p" onChange={(event) => runCommand('formatBlock', event.target.value)}><option value="p">Texto</option><option value="h2">Título</option><option value="h3">Subtítulo</option></select>
          <ToolbarButton label="Negrito" command="bold" onCommand={runCommand}><Bold size={16} /></ToolbarButton>
          <ToolbarButton label="Itálico" command="italic" onCommand={runCommand}><Italic size={16} /></ToolbarButton>
          <ToolbarButton label="Sublinhado" command="underline" onCommand={runCommand}><Underline size={16} /></ToolbarButton>
          <span className="email-tool-divider" />
          <ToolbarButton label="Lista" command="insertUnorderedList" onCommand={runCommand}><List size={17} /></ToolbarButton>
          <ToolbarButton label="Lista numerada" command="insertOrderedList" onCommand={runCommand}><ListOrdered size={17} /></ToolbarButton>
          <ToolbarButton label="Alinhar à esquerda" command="justifyLeft" onCommand={runCommand}><AlignLeft size={17} /></ToolbarButton>
          <ToolbarButton label="Centralizar" command="justifyCenter" onCommand={runCommand}><AlignCenter size={17} /></ToolbarButton>
          <ToolbarButton label="Alinhar à direita" command="justifyRight" onCommand={runCommand}><AlignRight size={17} /></ToolbarButton>
          <span className="email-toolbar-spacer" />
          <button className="email-tool-button image-button" type="button" onClick={() => attachmentInputRef.current?.click()}><Paperclip size={16} /> Anexar</button>
          <input ref={attachmentInputRef} className="sr-only" type="file" multiple onChange={addAttachments} />
        </div>
        <div className="email-editor" ref={editorRef} contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" data-placeholder="Escreva sua mensagem…" onInput={syncHtml} />
      </section>
      {attachments.length > 0 && <div className="email-draft-attachments">{attachments.map((attachment) => (
        <span key={attachment.id}><Paperclip size={14} /><strong>{attachment.filename}</strong><small>{sizeLabel(attachment.size)}</small><button type="button" onClick={() => setAttachments((items) => items.filter((item) => item.id !== attachment.id))}><X size={14} /></button></span>
      ))}</div>}
      <div className="email-send-bar">
        <div aria-live="polite">{feedback ? <span className="email-field-error">{feedback}</span> : <span>{recipients.to.length + recipients.cc.length + recipients.bcc.length} destinatário(s)</span>}</div>
        <button className="button primary email-send-button" type="submit" disabled={!canSend}>{sendMutation.isPending ? <RefreshCw className="spin" size={16} /> : <Send size={16} />}{sendMutation.isPending ? 'Enviando…' : 'Enviar'}</button>
      </div>
    </form>
  );
}

function ThreadDetail({ threadId, mailboxes, onClose, onSent }: {
  threadId: string;
  mailboxes: EmailMailbox[];
  onClose: () => void;
  onSent: () => void;
}) {
  const query = useEmailThread(threadId);
  const markRead = useMarkEmailThreadRead();
  const [replying, setReplying] = useState(false);
  useEffect(() => { markRead.mutate(threadId); }, [threadId]); // eslint-disable-line react-hooks/exhaustive-deps
  if (query.isLoading) return <section className="email-thread-detail"><div className="skeleton email-thread-skeleton" /></section>;
  if (query.isError || !query.data) return <section className="email-thread-detail"><div className="inline-alert danger"><AlertTriangle size={17} /> Não foi possível abrir a conversa.</div></section>;
  const thread = query.data;
  return (
    <section className="email-thread-detail">
      <header className="email-thread-head">
        <div><button className="email-mobile-back" type="button" onClick={onClose}><ChevronLeft size={18} /> Voltar</button><h2>{thread.subject}</h2><span>{thread.externalParticipants.join(', ')}</span></div>
        <button className="button secondary compact" type="button" onClick={() => setReplying(true)}><Reply size={15} /> Responder</button>
      </header>
      <div className="email-thread-messages">{thread.messages.map((message) => <MessageCard key={message.id} message={message} />)}</div>
      {replying && <EmailComposer mailboxes={mailboxes} thread={thread} onCancel={() => setReplying(false)} onSent={() => { setReplying(false); void query.refetch(); onSent(); }} />}
    </section>
  );
}

export function EmailCenterPage({ initialTo = '' }: { initialTo?: string }) {
  const mailboxesQuery = useEmailMailboxes();
  const mailboxes = mailboxesQuery.data ?? [];
  const [mailboxId, setMailboxId] = useState<string | null>(null);
  const [box, setBox] = useState<EmailBox>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [composing, setComposing] = useState(Boolean(initialTo));
  const sync = useSyncEmailCenter();

  useEffect(() => {
    const timer = window.setTimeout(() => { setSearch(searchInput.trim()); setPage(0); }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);
  const filters = useMemo(() => ({ mailboxId, box, query: search, limit: PAGE_SIZE, offset: page * PAGE_SIZE }), [box, mailboxId, page, search]);
  const threadsQuery = useEmailThreads(filters);
  const threads = threadsQuery.data?.items ?? [];
  const total = threadsQuery.data?.total ?? 0;
  const maxPage = Math.max(0, Math.ceil(total / PAGE_SIZE) - 1);
  const totalUnread = mailboxes.reduce((totalValue, mailbox) => totalValue + mailbox.unreadCount, 0);
  const refresh = async () => {
    try { await sync.mutateAsync(); } catch { /* Existing local data remains available. */ }
    await Promise.all([mailboxesQuery.refetch(), threadsQuery.refetch()]);
  };

  return (
    <>
      <header className="page-header email-page-header">
        <div><p className="section-label">Comunicação</p><h1>Caixa de e-mail</h1><span>Entrada, envios e respostas das contas @onlyfitapp.com.</span></div>
        <div className="header-actions">
          <button className="button secondary" type="button" onClick={refresh} disabled={sync.isPending || threadsQuery.isFetching}><RefreshCw className={sync.isPending || threadsQuery.isFetching ? 'spin' : ''} size={16} /> Sincronizar</button>
          <button className="button primary" type="button" onClick={() => { setComposing(true); setSelectedThreadId(null); }} disabled={!mailboxes.length}><PenLine size={16} /> Novo e-mail</button>
        </div>
      </header>
      <section className="content email-center-page">
        <div className="email-shell">
          <aside className="email-sidebar">
            <button className={box === 'all' && mailboxId === null ? 'active' : ''} type="button" onClick={() => { setBox('all'); setMailboxId(null); setPage(0); }}><Mail size={17} /><span>Todas</span>{totalUnread > 0 && <strong>{totalUnread}</strong>}</button>
            <button className={box === 'inbox' && mailboxId === null ? 'active' : ''} type="button" onClick={() => { setBox('inbox'); setMailboxId(null); setPage(0); }}><Inbox size={17} /><span>Entrada</span></button>
            <button className={box === 'sent' && mailboxId === null ? 'active' : ''} type="button" onClick={() => { setBox('sent'); setMailboxId(null); setPage(0); }}><Send size={17} /><span>Enviados</span></button>
            <div className="email-sidebar-label">Contas</div>
            {mailboxes.map((mailbox) => <button className={mailboxId === mailbox.id ? 'active' : ''} type="button" key={mailbox.id} onClick={() => { setMailboxId(mailbox.id); setPage(0); }}><span className="email-mailbox-dot" /><span>{mailbox.email}</span>{mailbox.unreadCount > 0 && <strong>{mailbox.unreadCount}</strong>}</button>)}
          </aside>

          <main className={`email-main ${selectedThreadId ? 'has-thread' : ''} ${composing ? 'is-composing' : ''}`}>
            {!composing && <section className={`email-thread-list ${selectedThreadId ? 'has-selection' : ''}`}>
              <div className="email-list-toolbar">
                <div className="search-box"><Search size={16} /><input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Buscar conversa" />{searchInput && <button className="icon-button" type="button" onClick={() => setSearchInput('')}><X size={14} /></button>}</div>
                <span>{total} conversa(s)</span>
              </div>
              {threadsQuery.isLoading ? <div className="skeleton email-thread-skeleton" /> : threadsQuery.isError ? <div className="email-empty-state"><AlertTriangle size={24} /><strong>Não foi possível carregar</strong></div> : threads.length === 0 ? <div className="email-empty-state"><Archive size={28} /><strong>Nenhuma conversa</strong><span>As mensagens desta caixa aparecerão aqui.</span></div> : <div className="email-thread-rows">{threads.map((thread) => (
                <button className={`email-thread-row ${selectedThreadId === thread.id ? 'selected' : ''} ${thread.isUnread ? 'unread' : ''}`} type="button" key={thread.id} onClick={() => { setSelectedThreadId(thread.id); setComposing(false); }}>
                  <span className="email-avatar">{(thread.externalParticipants[0] || thread.mailboxEmail).slice(0, 1).toUpperCase()}</span>
                  <span className="email-thread-summary"><span><strong>{thread.externalParticipants[0] || 'Sem destinatário externo'}</strong><time>{dateLabel(thread.latestMessageAt)}</time></span><b>{thread.subject}</b><small>{thread.latestSnippet || 'Sem prévia'}</small><em>{thread.mailboxEmail}{thread.hasAttachments && <Paperclip size={12} />}{thread.messageCount > 1 && ` · ${thread.messageCount}`}</em></span>
                  {thread.isUnread && <span className="email-unread-dot" />}
                </button>
              ))}</div>}
              {total > PAGE_SIZE && <footer className="email-pagination"><span>Página {page + 1} de {maxPage + 1}</span><div><button className="icon-button" type="button" disabled={page === 0} onClick={() => setPage((value) => Math.max(0, value - 1))}><ChevronLeft size={18} /></button><button className="icon-button" type="button" disabled={page >= maxPage} onClick={() => setPage((value) => Math.min(maxPage, value + 1))}><ChevronRight size={18} /></button></div></footer>}
            </section>}

            {composing ? <div className="email-compose-surface"><EmailComposer mailboxes={mailboxes} initialTo={initialTo} onCancel={() => setComposing(false)} onSent={(threadId) => { setComposing(false); setSelectedThreadId(threadId); void refresh(); }} /></div> : selectedThreadId ? <ThreadDetail threadId={selectedThreadId} mailboxes={mailboxes} onClose={() => setSelectedThreadId(null)} onSent={refresh} /> : <section className="email-no-selection"><Mail size={30} /><strong>Selecione uma conversa</strong><span>Ou crie um novo e-mail.</span></section>}
          </main>
        </div>
        {sync.isError && <div className="inline-alert danger"><AlertTriangle size={16} /> A sincronização com o Resend falhou. As mensagens já salvas continuam disponíveis.</div>}
        {sync.isSuccess && <div className="email-sync-ok" role="status"><Check size={14} /> Sincronização concluída</div>}
      </section>
    </>
  );
}

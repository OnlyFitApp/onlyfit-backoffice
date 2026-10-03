// Synthetic fixtures only. The preview server replaces API/hooks; no real mail is read or sent.
import { createRoot } from 'react-dom/client';
import { EmailCenterPage } from '../../src/components/EmailCenter';
import type { EmailThread, EmailThreadFilters } from '../../src/lib/emailCenter';
import '../../src/styles.css';

const mailboxes = ['contato', 'suporte', 'financeiro'].map((name, index) => ({ id: name, email: `${name}@onlyfitapp.com`, displayName: 'OnlyFit', unreadCount: index + 1 }));
const subjects = ['Proposta de parceria', 'Dúvida sobre minha assinatura', 'Documentação recebida', 'Confirmação de atendimento', 'Relatório de acompanhamento'];
const threads = subjects.map((subject, index) => ({ id: String(index), mailboxId: mailboxes[index % 3].id, mailboxEmail: mailboxes[index % 3].email, mailboxName: 'OnlyFit', subject, externalParticipants: [`pessoa${index + 1}@example.com`], latestMessageAt: '2026-10-02T17:30:00-03:00', latestSnippet: 'Olá, equipe. Seguem as informações para nossa conversa.', latestDirection: index % 2 ? 'outbound' : 'inbound', latestStatus: index % 2 ? 'delivered' : 'received', messageCount: 2, hasAttachments: false, isUnread: index < 2 }));
const ready = { isLoading: false, isError: false, isFetching: false, refetch: async () => undefined };
export function useEmailMailboxes() { return { ...ready, data: mailboxes }; }
export function useEmailThreads(filters: EmailThreadFilters) {
  const items = threads.filter((item) => (!filters.mailboxId || item.mailboxId === filters.mailboxId) && (filters.box === 'all' || item.latestDirection === (filters.box === 'inbox' ? 'inbound' : 'outbound')) && item.subject.toLowerCase().includes(filters.query.toLowerCase()));
  return { ...ready, data: { items, total: items.length } };
}
export function useEmailThread(id: string) {
  const item = threads.find((thread) => thread.id === id)!;
  const data: EmailThread = { ...item, messages: [
    { id: `${id}-1`, resendEmailId: null, messageId: null, direction: 'inbound', fromEmail: item.externalParticipants[0], fromName: 'Contato de exemplo', toEmails: [item.mailboxEmail], ccEmails: [], bccEmails: [], replyToEmails: [], subject: item.subject, htmlContent: '<p>Olá, equipe OnlyFit.</p><p>Gostaria de conversar sobre nossa proposta. Podemos agendar uma reunião na próxima semana?</p><p>Obrigado pela atenção.</p>', textContent: '', status: 'received', errorMessage: null, inReplyTo: null, referenceMessageIds: [], providerCreatedAt: item.latestMessageAt, attachments: [] },
  ] };
  return { ...ready, data };
}
export function useMarkEmailThreadRead() { return { mutate: () => undefined }; }
export function useSyncEmailCenter() { return { isPending: false, isError: false, isSuccess: false, mutateAsync: async () => undefined }; }
export function useSendOutboundEmail() { return { isPending: false, mutateAsync: async () => { throw new Error('Prévia: envio desativado.'); } }; }
export const coreApi = {};

createRoot(document.getElementById('root')!).render(<div style={{ maxWidth: 1440, margin: 'auto' }}><EmailCenterPage /></div>);

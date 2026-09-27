# Segurança e escalabilidade

Leitura obrigatória antes de alterar este backoffice.

- Toda sessão staff precisa de MFA AAL2 no OnlyFit Core. Nunca contorne o `MfaGate`.
- O Core autoriza; a UI apenas representa permissão.
- Segredos de Stripe/Asaas digitados aqui são enviados somente ao comando tipado protegido por AAL2, nunca armazenados em estado persistente, log, analytics ou erro.
- Nunca adicionar `service_role`, secret ou token ao bundle/Vite.
- Páginas financeiras usam paginação; nenhuma consulta pode baixar tabela inteira.
- Dados financeiros/saúde não entram em `console`, Sentry breadcrumbs, PostHog ou URL.
- Manter CSP/HSTS/`no-store` do `vercel.json`; ampliar allowlist só para dependência comprovada.
- Antes do PR: `npm audit --omit=dev --audit-level=high`, `npm run lint` e `npm run build`.

Os contratos e invariantes de segurança estão em `../onlyfit-core/contract` e na documentação canônica do Core.

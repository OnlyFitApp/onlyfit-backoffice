# `src/api` — a porta única para o backend

Toda chamada ao Supabase passa por aqui, separada pelos 8 domínios do plano
(identidade, organizacoes, treino, nutricao, saude, social, comercio, staff).

```ts
import { api } from '@/api';

await api.treino.rpc('get_student_workouts_for_date_v4', { … });
await api.social.from('posts').select('…');
await api.staff.functions.invoke('control-send-email', { body: … });
```

Cada domínio tem a mesma forma do cliente Supabase (`from`, `rpc`,
`functions.invoke`, `storage.from`, `channel`, `removeChannel`), mais:

- `loose` — escape temporário para chamadas que hoje contornam os tipos
  gerados. Some na F2, quando cada domínio ganhar fachadas `api.*_v1` tipadas.

## Regras

1. Fora de `src/api` e `src/lib/supabase.ts`, ninguém chama o
   cliente Supabase direto. O ESLint e o teste `tests/api-gateway.test.mjs`
   bloqueiam.
2. Cada operação é chamada pelo domínio dono dela. O dono está em
   `contract.gen.ts`, gerado por `onlyfit-supabase/contract/sync.mjs` a partir
   das regras de `contract/domains.mjs`. Operação nova: chame pelo domínio
   certo e rode `node contract/sync.mjs` no `onlyfit-supabase`.
3. `supabase.auth` continua direto: sessão não é operação de domínio.

## Telemetria

`src/lib/supabase.ts` mede cada chamada no `fetch` (tempo, erro, operação e
domínio). Em desenvolvimento, `window.__onlyfitBackend()` mostra a tabela no
console; `getBackendTelemetry()` devolve os números.

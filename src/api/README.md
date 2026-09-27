# `src/api` — acesso ao OnlyFit Core

O backoffice usa uma única sessão do OnlyFit Core. `core.gen.ts` é gerado a
partir dos contratos canônicos do Core e `core.ts` é o transporte autenticado.

As telas e bibliotecas chamam somente os métodos de `coreApi`. Consultas a
tabelas, RPCs soltas, Edge Functions e Storage direto são proibidas fora do
transporte gerado.

Para atualizar e validar o SDK:

```bash
npm run core:sync-sdk
npm run core:check-sdk
```

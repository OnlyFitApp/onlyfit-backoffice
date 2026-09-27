# onlyfit-backoffice

Portal operacional interno da plataforma OnlyFit. Todas as jornadas novas usam
exclusivamente o SDK TypeScript gerado pelo `onlyfit-core`.

## Ambiente

Copie `.env.example` e configure `VITE_ONLYFIT_CORE_URL` e
`VITE_ONLYFIT_CORE_PUBLISHABLE_KEY`. Somente valores publicáveis podem usar o
prefixo `VITE_`; credenciais administrativas ou de provedores nunca pertencem
ao navegador.

O Core é a fonte canônica das regras administradas por este portal. Consulte:

- [comércio e canais de pagamento](../onlyfit-core/docs/NATIVE_COMMERCE.md);
- [manifesto de ambiente do servidor](../onlyfit-core/docs/ENVIRONMENT.md);
- [estado verificável de F0–F3](../onlyfit-core/docs/STATUS.md).

## Verificação

```bash
npm run core:check-sdk
npm run build
npm run lint
npm test
```

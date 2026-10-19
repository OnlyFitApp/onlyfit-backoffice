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

O [manual completo do desktop e backoffice](docs/manual-de-testes-desktop-backoffice.md)
reúne rotas, seções, controles e ciclos entre profissional e aluno, com inventários
de fonte separados dos resultados de execução pelo navegador.

O [manual de testes profissionais](docs/manual-de-testes-profissionais.md)
descreve os testes funcionais pelas interfaces, os resultados esperados e o
registro de evidências para profissional, aluno e equipe do backoffice.

```bash
npm run core:check-sdk
npm run build
npm run lint
npm test
```

## Publicação

O [backoffice em produção](https://onlyfit-backoffice.vercel.app) é publicado
pela integração do GitHub com o projeto `onlyfit-backoffice` na Vercel.
Envie as mudanças em uma branch, valide a prévia do PR e faça o merge por
rebase em `main`. Confirme o status de sucesso da Vercel no commit final de
`main` e confira o endereço de produção antes de considerar a entrega publicada.

O plano Hobby da Vercel exige que este repositório da organização seja público.
Se um deploy for bloqueado por essa restrição, corrija a visibilidade e inicie
uma nova publicação; o status de falha anterior não confirma uma nova tentativa.
Consulte as [restrições da integração Git no Hobby](https://vercel.com/docs/git#using-hobby-teams).

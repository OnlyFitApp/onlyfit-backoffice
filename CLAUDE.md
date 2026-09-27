# CLAUDE.md — onlyfit-backoffice

Front end web do backoffice interno da OnlyFit, voltado para operação, gestão e suporte da plataforma.

## Stack

Vite · React 18 · TypeScript · OnlyFit Core SDK · TanStack Query · Lucide · CSS por tokens.

## Rodar

```bash
npm install
npm run dev
npm run build
npm run lint
```

Crie `.env` a partir de `.env.example` e configure somente a URL e a chave
publicável do OnlyFit Core. Nunca use segredo administrativo no cliente.

## Regras

1. Os contratos `coreApi.staff` e a autorização do Core são a fonte real de acesso.
2. Nenhum segredo no cliente.
3. O design herda o sistema canônico do produto: Inter, tokens semânticos, superfícies grafite, azul/teal oficiais e profundidade tonal.
4. O backoffice é operacional: densidade, leitura rápida, estados claros e navegação previsível valem mais do que efeito visual.
5. Backend, contratos e migrations vivem em `../onlyfit-core`.
6. Sincronize o SDK com `npm run core:sync-sdk`; nunca edite `core.gen.ts` à mão.

## Antes de dar por pronto

- `npm run build` passa.
- `npm run lint` limpo.
- Teste visual em desktop e mobile estreito.

# Auditoria integrada — Embaixadores e Associados

Data: 7 de setembro de 2026

## Escopo aprovado

1. O papel persistido continua sendo apenas `principal` ou `associate`.
2. A apresentação pública usa apenas **Embaixador** ou **Associado**.
3. O card de Embaixadores em Explorar mostra somente Embaixadores.
4. A lista “ver todos” mostra Embaixadores e Associados.
5. Em qualquer superfície que destaca um Embaixador, um Associado também recebe identidade visual própria, mais discreta.
6. Um Associado pode estar ligado a um Embaixador ou diretamente à plataforma.
7. Cristian Alessandro e Vinicius Mateus devem ser cadastrados como Associados de Musculação, diretamente com a plataforma, após identificação inequívoca das contas e liberação da operação em produção.

## Resultado da revisão

As cinco ondas formam um contrato coerente. O backend é a fonte de verdade do papel e deriva o selo; Flutter, desktop e backoffice interpretam os mesmos valores persistidos. Os clientes mantêm fallback para o endpoint público antigo durante a ordem de implantação, sem transformar valores de papel desconhecidos em Associado.

| Camada | Garantia verificada | Estado |
| --- | --- | --- |
| Supabase | Valores estritos, selo derivado, listagem paginada por papel, Associado sem Embaixador e assinatura legada preservada | Aprovado |
| Flutter | Identidade visual central, Explorar somente Embaixadores, “ver todos” com ambos e propagação pelas jornadas sociais | Aprovado |
| Desktop | Identidade visual central, filtros corretos e propagação por feed, stories, mensagens, perfis, desafios e comunidades | Aprovado |
| Backoffice | Criação/edição com os dois papéis, supervisão direta pela plataforma, rótulo derivado e falha fechada para papel inválido | Aprovado |

## Proteções contra regressão

- `role` é o único dado de classificação. `badge_label` permanece apenas na assinatura do RPC para compatibilidade com versões publicadas.
- O backoffice não oferece edição manual do selo e envia o rótulo canônico no parâmetro legado.
- Um papel desconhecido vindo do servidor interrompe o fluxo com erro de contrato; ele não é convertido silenciosamente em Associado.
- A atribuição de Embaixador sempre envia `principal_assignment_id = null`.
- A atribuição de Associado aceita `principal_assignment_id = null`, que significa supervisão direta pela plataforma.
- Alterações estruturais em atribuições já ativas continuam usando os RPCs de transferência com controle de concorrência por `updated_at`.
- Consultas públicas são autenticadas, paginadas e limitadas a 100 itens por chamada.

## Cadastro seguro dos primeiros Associados de Musculação

O cadastro não deve usar nome textual como identidade. Para cada pessoa, o operador deve pesquisar a conta no backoffice e confirmar o `@`, a foto e os vínculos existentes antes de selecionar o perfil.

Configuração para as duas atribuições:

| Pessoa | Papel | Vertical | Supervisão | Visibilidade inicial |
| --- | --- | --- | --- | --- |
| Cristian Alessandro | Associado | Musculação | Direta pela plataforma | Publicar ao ativar |
| Vinicius Mateus | Associado | Musculação | Direta pela plataforma | Publicar ao ativar |

Antes da gravação, confirmar a região contratual correta e que a conta selecionada corresponde à pessoa pretendida. Se o perfil ainda for membro, somente um superadministrador poderá habilitá-lo como profissional; a trilha de auditoria registra a preparação, criação e ativação.

Após cada cadastro, validar no snapshot administrativo:

1. `role = associate`;
2. vertical Musculação;
3. `principal_assignment_id = null`;
4. estado ativo e visibilidade pública;
5. presença em “ver todos” e ausência no card principal de Explorar;
6. selo “Associado” e anel visual secundário nas superfícies suportadas.

## Ordem de entrega

1. Integrar e aplicar a migração do Supabase.
2. Integrar o backoffice.
3. Integrar desktop e Flutter; os fallbacks permitem uma implantação gradual após o backend.
4. Executar os dois cadastros pelo backoffice com uma conta administrativa autenticada.
5. Fazer a verificação funcional nos clientes e registrar a evidência operacional.

## Evidência automatizada

- Supabase: testes de contrato da migração da Onda 1.
- Flutter: 1.136 testes aprovados e 7 ignorados; análise estática e validação de internacionalização aprovadas nas Ondas 2 e 3.
- Desktop: 1.155 testes em 215 arquivos; typecheck, lint, build e internacionalização aprovados na Onda 4.
- Backoffice: 30 testes aprovados; lint, TypeScript/build e auditoria de dependências aprovados na Onda 5.

Nenhuma alteração desta onda foi aplicada em produção. Os cadastros reais dependem da implantação do contrato e da confirmação visual das contas corretas no backoffice.

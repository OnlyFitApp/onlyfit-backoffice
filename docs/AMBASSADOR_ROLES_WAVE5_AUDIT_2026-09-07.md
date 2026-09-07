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

As cinco ondas formam um contrato coerente. O backend é a fonte de verdade do papel e deriva o selo; Flutter, desktop e backoffice interpretam os mesmos valores persistidos. A revisão de integração acrescentou proteção permanente para versões antigas: a RPC legada mantém o card principal restrito a Embaixadores, enquanto os clientes novos consultam e paginam os dois papéis para montar “ver todos”.

| Camada | Garantia verificada | Estado |
| --- | --- | --- |
| Supabase | Valores estritos, selo derivado, listagem paginada por papel, Associado sem Embaixador e RPC legada principal-only | Aprovado |
| Flutter | Identidade visual central, Explorar somente Embaixadores, “ver todos” completo e paginado, fallback legado e propagação social | Aprovado |
| Desktop | Identidade visual central, “ver todos” completo e paginado, fallback legado e propagação pelas jornadas | Aprovado |
| Backoffice | Criação/edição com os dois papéis, supervisão direta pela plataforma, rótulo derivado e falha fechada para papel inválido | Aprovado |

## Proteções contra regressão

- `role` é o único dado de classificação. `badge_label` permanece apenas na assinatura do RPC para compatibilidade com versões publicadas.
- O backoffice não oferece edição manual do selo e envia o rótulo canônico no parâmetro legado.
- Um papel desconhecido vindo do servidor interrompe o fluxo com erro de contrato; ele não é convertido silenciosamente em Associado.
- A atribuição de Embaixador sempre envia `principal_assignment_id = null`.
- A atribuição de Associado aceita `principal_assignment_id = null`, que significa supervisão direta pela plataforma.
- Alterações estruturais em atribuições já ativas continuam usando os RPCs de transferência com controle de concorrência por `updated_at`.
- Consultas públicas são autenticadas, paginadas e limitadas a 100 itens por chamada.
- Os clientes percorrem as páginas até o `total`; “ver todos” não fica limitado aos primeiros 100 registros.
- Contagens sociais e estado de seguimento são carregados em lotes de 50, respeitando o limite do RPC sem descartar perfis posteriores.
- A RPC legada `list_public_ambassadors` preserva assinatura e permissões, mas retorna somente `principal` para proteger aplicativos já instalados.
- A matriz cliente antigo/novo × backend antigo/novo é coberta pelos contratos de fallback e pelos testes automatizados.

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

1. Integrar e aplicar a migração do Supabase. A RPC legada passa a proteger imediatamente as versões antigas do aplicativo.
2. Verificar que `list_public_ambassadors` retorna apenas Embaixadores e que a nova RPC retorna cada papel separadamente.
3. Integrar desktop e backoffice. O desktop novo usa a RPC por papel e mantém fallback para o backend anterior.
4. Publicar o Flutter. Versões antigas continuam seguras pela RPC legada durante a adoção gradual da atualização.
5. Confirmar os quatro quadrantes da matriz de compatibilidade descrita abaixo.
6. Executar os dois cadastros pelo backoffice com uma conta administrativa autenticada.
7. Fazer a verificação funcional nos clientes e registrar a evidência operacional.

## Matriz de compatibilidade sem indisponibilidade

| Cliente | Backend | Comportamento esperado |
| --- | --- | --- |
| Antigo | Antigo | Fluxo atual, antes da criação de Associados públicos |
| Novo | Antigo | RPC por papel retorna `PGRST202`; cliente usa a RPC legada |
| Antigo | Novo | RPC legada retorna somente Embaixadores; card principal permanece correto |
| Novo | Novo | Card consulta `principal`; “ver todos” combina e pagina `principal` + `associate` |

Se um cliente novo falhar durante a implantação, o backend protegido pode permanecer no ar. Se a migração não for aplicada, os clientes novos continuam usando o fallback legado. Se houver anomalia depois dos cadastros, ocultar ou suspender as atribuições remove os perfis das consultas públicas sem apagar o histórico.

## Evidência automatizada

- Supabase: 816 testes em 175 arquivos, testes de contrato da migração, auditoria de segurança e `db push --dry-run` remoto aprovados. A recriação integral do banco local permanece bloqueada por uma migração histórica anterior que referencia `workout_sessions` antes da criação dessa relação; a falha antecede e não executa esta migração.
- Flutter: 1.140 testes aprovados e 7 ignorados; a suíte cobre paginação, composição dos papéis, fallback da integração e carregamento social sem truncamento.
- Desktop: 1.160 testes em 216 arquivos; lint, TypeScript e build aprovados, com cobertura de paginação, composição dos papéis, fallback e carregamento social sem truncamento.
- Backoffice: 30 testes aprovados; lint, TypeScript/build e auditoria de dependências aprovados na Onda 5.

Nenhuma alteração desta onda foi aplicada em produção. Os cadastros reais dependem da implantação do contrato e da confirmação visual das contas corretas no backoffice.

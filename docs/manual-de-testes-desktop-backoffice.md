# Manual de testes do desktop e do backoffice

Roteiro pelo frontend, preparado em 15/10/2026, fuso America/Belem. Complementa o [manual de testes profissionais](manual-de-testes-profissionais.md), que permanece válido para os casos e as evidências ali descritos.

Este documento define o que estudar e executar nas interfaces web. **Inventário de código, teste automatizado e teste funcional são registros distintos. Nenhuma rota, seção ou ação recebe aprovação automática por constar deste roteiro.** Os resultados da rodada devem ser preenchidos pelo executor e vinculados a evidência observada.

## Escopo, bases e anexos

- Desktop: OnlyFit web em `https://onlyfitapp.com`; baseline do inventário `65043630314f9964ee2b98d6848b06c27cf3404c`.
- Backoffice: `https://onlyfit-backoffice.vercel.app`; baseline do inventário `63383289966ec2fb443598b5c01c34f089efe48f`.
- Escopo de correção desta rodada: desktop e backoffice, reaproveitando as capacidades já existentes. Não alterar Core, contrato, tabela ou coluna para preencher um teste.
- Anexo detalhado desktop: [inventário desktop](testes-desktop-backoffice/inventario-desktop.json). São 114 declarações Route, 109 com caminho, 4 layouts sem caminho e 1 rota index; 2 aliases; 542 fontes TS/TSX; 611 declarações candidatas a componentes; 1.862 ocorrências de controles JSX; 2.522 linhas de ação; 403 links/navegações; 105 candidatos a parâmetros de URL. Inclui também 4 documentos HTML públicos e 13 regras do host.
- Anexo detalhado backoffice: [inventário backoffice](testes-desktop-backoffice/inventario-backoffice.json). São 7 grupos, 33 seções e 657 ocorrências de controle JSX, com arquivos, linhas, rótulos, handlers, condicionais e permissões encontradas.

As contagens incluem componentes genéricos, callbacks sobrepostos, estado condicional e possíveis helpers não montados. Não são a quantidade de botões únicos visíveis. Os anexos registram a fonte e a revisão; se uma alteração mudar linhas ou controles, conferir a versão entregue antes de executar.

## Preparação e registro da execução

Usar as duas contas fictícias de profissional e comprador já autorizadas e o negócio QA existente. Nunca usar dados de saúde, documentos, cartão ou pedido de outra pessoa para gerar massa de teste. Identificar o conteúdo com `QA`, data e descrição de que é fictício. Utilizar o material QA já existente ou novos arquivos fictícios apropriados ao caso.

Antes de cada cenário, anotar ambiente, build/SHA, conta/papel, entidade QA, pré-condição, URL ou caminho pelo menu, viewport e estado inicial. Não copiar senha, token, QR do autenticador, CPF, URL privada ou segredo para a evidência. Ao final, restaurar tema, fonte e viewport escolhidos para o teste.

| Estado | Uso correto |
| --- | --- |
| Não executado | Há roteiro ou controle no inventário, mas não houve interação comprovada nesta rodada. |
| Aprovado | Passos pela interface executados, resultado esperado observado e persistência/retorno conferidos quando aplicáveis. |
| Parcial | Apenas uma parte foi comprovada; dizer exatamente qual. |
| Falhou | Descrever ação, resultado observado, esperado e prova, sem substituir causa por suposição. |
| Bloqueado | Falta pré-requisito real, como vínculo, permissão, pedido QA ou pagamento autorizado. |
| Não aplicável | A interface atual não oferece a ação ao papel/cenário; registrar o motivo. Não criar funcionalidade ausente. |

Modelo por caso:

```text
Caso e controle(s):
Build/SHA, data/fuso e viewport:
Conta/papel e entidade QA:
URL ou Menu > Seção > Aba:
Estado inicial e pré-condições:
Passos realmente executados:
Esperado e observado:
Atualização/retorno/troca de conta:
Estado final: Não executado / Aprovado / Parcial / Falhou / Bloqueado / Não aplicável
Evidência e limite específico:
```

Para cobrir todos os botões, percorrer os controles efetivamente visíveis de cada página, aba, menu, linha e modal. Mapear às entradas `DESK-CTRL-*`, `DESK-ACT-*` ou `BO-C-*` dos anexos quando possível. Campos dinâmicos e várias linhas produzidas pelo mesmo componente exigem conferência na UI; não somar cada ocorrência como teste novo. Um botão sem callback local pode receber ação de um wrapper ou slot: verificar o clique real antes de classificá-lo como quebrado.

## Protocolo universal por rota ou seção

Aplicar U01–U12 em cada entrada da relação abaixo, registrando o que não puder ser exercitado.

| Caso | Procedimento pela interface | Conferência |
| --- | --- | --- |
| U01 Entrada | Entrar pelo menu/atalho real e, no desktop, pelo deep link correspondente com IDs QA. | Tela, título, seleção de navegação, conta e entidade corretos. Sem rota inventada. |
| U02 Acesso | Comparar visitante, comprador e profissional quando o recurso admitir esses papéis; no backoffice, usar apenas staff autorizado e MFA normal. | Estados de acesso claros; conteúdo de outra conta não aparece. Botão escondido não é prova da autorização do servidor. |
| U03 Hierarquia | Inspecionar título, abas, trilha, Voltar, cabeçalho, rodapé e conteúdo principal. | Um contexto claro, retorno coerente, sem cabeçalhos/Voltar duplicados ou ação primária escondida. |
| U04 Histórico e recarga | Abrir uma aba/detalhe, voltar, avançar, recarregar e reabrir por link no desktop. | Contexto e dados persistidos conforme o fluxo. No backoffice atual, seção é estado local: recarregar volta à Visão geral; não pressupor URL/histórico por seção. |
| U05 Formulário | Preencher, limpar obrigatório, usar valor inválido, corrigir, cancelar e salvar uma alteração QA permitida. | Rótulo, ajuda, validação e mensagem úteis; cancelamento não salva; rascunho não some em falha. Conferir efeito real depois de reabrir. |
| U06 Estados | Observar carregamento, vazio, resultado e erro real/controlado pelo navegador, se disponível; usar Tentar novamente/Atualizar. | Carregamento/erro não parecem zero confirmado. Recuperação não duplica ação nem perde dados. Não fabricar resposta por API. |
| U07 Listas | Buscar encontrado/inexistente, filtrar, limpar, ordenar e paginar quando houver dados suficientes. | Busca/filtro coerentes, sem duplicados, última página correta, total e limite verdadeiros. Sem massa suficiente, marcar bloqueado. |
| U08 Contexto e concorrência | Navegar rápido, trocar filtro/entidade e, com contas QA, sair/entrar durante leitura. Em criação QA reversível, conferir envio repetido sem disparar pagamento. | Resposta antiga não sobrescreve contexto novo; dados de A não aparecem em B; escrita pendente tem estado e evita duplicidade. |
| U09 Teclado | Percorrer Tab/Shift+Tab, ativar controle seguro por Enter/Espaço e fechar modal cancelável por Escape. | Ordem/foco visíveis, label acessível, foco retorna ao gatilho e não fica preso. Não acionar confirmação financeira por Enter. |
| U10 Responsividade | Conferir desktop de 1440 px e larguras 390/320 px, rolagem, modal e ação final. | Sem overflow involuntário; conteúdo legível; botão alcançável acima da navegação; tabela com rolagem controlada. |
| U11 Identidade | Conferir temas disponíveis, fonte grande, contraste, cores, estados, espaçamentos, datas, moeda e unidades. | Hierarquia e tokens coerentes com a identidade OnlyFit; mensagens compreensíveis; restaurar preferências depois. |
| U12 Evidência | Registrar antes/depois, atualizar a página e conferir com o outro papel quando houver efeito compartilhado. | Prova liga a ação ao resultado. Abrir tela, compilar ou receber HTTP 200 isoladamente não aprova o fluxo inteiro. |

## Matriz profissional → comprador/aluno

Cada linha é um ciclo independente. A criação de curso não aprova dieta; treino de musculação não aprova outra modalidade; checkout aberto não aprova compra.

| Caso | Profissional | Comprador/aluno | Retorno e limites |
| --- | --- | --- | --- |
| P01 Negócio | Criar/editar negócio QA pelos campos existentes; salvar, reabrir, conferir Perfil comercial e publicação permitida. | Abrir vitrine/perfil correspondente, ofertas, descrição e atalhos. | Conferir isolamento entre negócios e caminho de volta. Empresa que exija documento real fica bloqueada; não inventar cadastro legal. |
| P02 Oferta | Percorrer tipo real, detalhes, preço, recorrência/validade, recursos, estado e seções disponíveis; salvar e reabrir. | Abrir a oferta correta, identificar o que recebe e conferir acesso antes da compra. | Nome, tipo, valor e estado devem corresponder ao backoffice. Não criar tipo que a lista não oferece. |
| P03 Treino | Criar exercício QA com material, montar treino, prévia, salvar/editar e atribuir/agendar pela ação existente. | Conferir biblioteca e calendário, abrir o treino, executar, pausar, retomar após recarga e concluir. | Profissional confere histórico, duração, desempenho e situação do treino pelo painel disponível. Repetir por modalidade realmente oferecida. |
| P04 Programa | Criar modelo com semanas/dias/treinos; editar e reabrir; atribuir ou publicar oferta pelo caminho existente. | Aplicar/agendar, conferir início e ocorrências, abrir sessão e executar treino. | Datas e conteúdo persistem; reschedule não retorna silenciosamente para hoje; profissional acompanha a atribuição. |
| P05 Dieta | Criar/editar modelo, refeições e itens disponíveis; atribuir conforme vínculo e ferramentas permitidos. | Abrir dieta, registrar/alterar estado disponível no calendário e reabrir. | Conferir histórico e visão profissional. Se não houver vínculo válido, registrar bloqueio sem conceder acesso por banco. |
| P06 Protocolo | Criar/editar modelo e recorrência pelos controles existentes, atribuir quando permitido. | Abrir agenda, marcar ocorrência, desfazer quando houver ação e consultar histórico. | Recorrência, data, unidade e conclusão coerentes com o que foi prescrito. |
| P07 Curso e material | Criar curso, capa, módulo, aula, vídeo/áudio/PDF, quiz e opções disponíveis; conferir ordem, prévia, salvar, reabrir e publicar QA. | Pelo acesso legítimo existente, abrir área de membros, reproduzir/pausar/retomar, ler PDF, zoom/página, quiz, comentário, salvar aula e concluir. | Conferir progresso, persistência e acompanhamento profissional. Abrir PDF e receber download são casos distintos. Testar PDF de mais de uma página além da prova histórica de uma página. |
| P08 Clube | Configurar oferta/conteúdo premium por tela existente, editar/reabrir e conferir vitrine. | Visitar `/clube/:professionalId`, conferir conteúdo protegido e caminho de acesso. | Não confundir comunidade ou curso com ciclo integral de Clube. Não forjar acesso pago. |
| P09 Produto físico | Cadastrar produto QA, mídia, opções, estoque e disponibilidade; conferir pedidos somente se já houver pedido QA legítimo. | Abrir produto, disponibilidade, entrega/retirada e checkout até o limite permitido. | Sem pedido válido, expedição, entrega, devolução e reembolso ficam bloqueados; não criar compra cobrada para gerar fixture. |
| P10 Comunidade | Criar gratuita/mensal/avulsa conforme UI; regras, espaços, acesso, posts, material, enquete e evento; editar e reabrir. | Entrar/pedir acesso quando aplicável; reagir, comentar, votar, RSVP, ler material, compartilhar atividade com escolha de rota, sair e retornar. | Conferir privacidade, contagem, feed, presença e ranking com duas contas. Usar COM01–COM10 do manual complementar. |
| P11 Desafio | Criar gratuito/pago ou por comunidade; período, apuração, aprovação e foto; publicar, aprovar, acompanhar, editar permitido, encerrar/cancelar QA. | Solicitar entrada, fazer check-in, compartilhar atividade elegível, consultar ranking, histórico e contestação disponível. | Conferir deduplicação, contexto de comunidade, congelamento e oferta cancelada indisponível. Usar DES01–DES10/RAN01–RAN03 do complemento. |
| P12 Anamnese/saúde | Criar/editar os modelos que a UI oferece; consultar saúde do aluno apenas com acesso legítimo existente. | Responder anamnese pessoal inteira com dados fictícios; testar obrigatórios, falso, escolha simples/múltipla, número e condicionais; salvar, consultar histórico e corrigir registro permitido. | Modelo profissional e resposta pessoal são fluxos distintos. Envio/atribuição de questionário ao aluno não está disponível na UI auditada; registrar ausência, sem implementar. |
| P13 CRM/cliente | Buscar e filtrar Clientes/Leads, clicar indicadores, abrir ficha por menu e por negócio; percorrer ferramentas permitidas e histórico. | Realizar ação QA legítima que já tenha caminho, como concluir treino ou aula. | Profissional deve observar o efeito pertinente. Conferir assinantes ativos, Primeiro contato vindo de Leads e erro/carregamento do resumo; caso sem massa não é aprovado. |
| P14 Financeiro | Abrir saldo, histórico, filtros/retorno e situação do vínculo; conferir informações com backoffice autorizado. | Abrir compras/pagamentos e detalhe do vínculo existente; acessar checkout sem confirmar cobrança. | Isolamento por dono, erro/vazio honestos. Cobrança mensal, renovação, inadimplência, recuperação, saque e liquidação efetivos permanecem sem prova sem ciclo financeiro autorizado. |

### Tipos de oferta a confirmar na lista real

O levantamento anterior do frontend mostrou `premium_content`, `health_consultancy`, `standalone_workout`, `standalone_program`, `standalone_protocol`, `standalone_diet`, `physical_products`, `courses`, `challenge` e `community_access`. Confirmar a lista atual no formulário e executar os tipos disponíveis. “E-book” do inventário antigo corresponde ao caminho de conteúdo/PDF quando não há tipo independente; não criar uma opção nova para satisfazer o roteiro.

### Compras sem cobrança

1. Conferir oferta, entidade, preço, recorrência/validade e política de acesso antes do checkout.
2. Abrir o pagamento pelo CTA real. Conferir cartão/Pix somente onde disponibilizados e estados de carregamento/erro; dados de cartão permanecem no provedor.
3. Sem dados de cobrança legítimos ou autorização de cobrança, registrar a validação e parar. Não inventar CPF, cartão, comprovante, assinatura ou status pago.
4. Checkout gratuito só pode ser usado quando a própria oferta e o fluxo existente o permitem; não é prova de cobrança paga.
5. Oferta de desafio cancelado deve recusar aquisição antes de preparar pagamento. Conferir a mensagem pela UI.
6. Produto/vínculo Apple ou Google exibido no backoffice não comprova liberação da loja nem compra. Registrar o estado mostrado, sem alterar catálogo/credenciais apenas para obter resultado positivo.

## Rotas reais do desktop

Os caminhos abaixo vêm de `src/App.tsx` na revisão do inventário. `:parametro` exige uma entidade QA válida; `?` no parâmetro indica opcional. “Protegida” indica o layout AuthGuard no código, não aprovação do acesso em runtime. Executar U01–U12 e os ciclos correspondentes.

### Acesso e páginas públicas

| ID | Caminho | Tela/componente | Acesso da declaração | Fonte |
| --- | --- | --- | --- | --- |
| DESK-ROUTE-092 | `/onboarding` | Onboarding | Protegida | [App.tsx:1081](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1081) |
| DESK-ROUTE-094 | `/login` | Login | Pública/estado de acesso | [App.tsx:1097](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1097) |
| DESK-ROUTE-095 | `/signup` | Signup | Pública/estado de acesso | [App.tsx:1105](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1105) |
| DESK-ROUTE-096 | `/forgot-password` | ForgotPassword | Pública/estado de acesso | [App.tsx:1115](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1115) |
| DESK-ROUTE-097 | `/reset-password` | ResetPassword | Pública/estado de acesso | [App.tsx:1125](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1125) |
| DESK-ROUTE-098 | `/confirm-email` | ConfirmEmail | Pública/estado de acesso | [App.tsx:1136](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1136) |
| DESK-ROUTE-099 | `/confirm-email/editar` | EditPendingSignup | Pública/estado de acesso | [App.tsx:1146](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1146) |
| DESK-ROUTE-100 | `/recuperar-acesso` | RecuperarAcesso | Pública/estado de acesso | [App.tsx:1156](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1156) |
| DESK-ROUTE-101 | `/recuperar-acesso/verificacao` | RecuperarAcessoVerificacao | Pública/estado de acesso | [App.tsx:1166](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1166) |
| DESK-ROUTE-102 | `/auth/confirm` | AuthConfirm | Pública/estado de acesso | [App.tsx:1176](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1176) |
| DESK-ROUTE-103 | `/auth-loading` | AuthLoading | Pública/estado de acesso | [App.tsx:1186](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1186) |
| DESK-ROUTE-104 | `/auth-error` | AuthError | Pública/estado de acesso | [App.tsx:1187](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1187) |
| DESK-ROUTE-105 | `/form/:token` | PublicFormApp | Pública/estado de acesso | [App.tsx:1188](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1188) |
| DESK-ROUTE-106 | `/privacidade` | PrivacyPolicy | Pública/estado de acesso | [App.tsx:1198](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1198) |
| DESK-ROUTE-107 | `/termos` | TermsOfUse | Pública/estado de acesso | [App.tsx:1206](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1206) |
| DESK-ROUTE-108 | `/excluir-conta` | AccountDeletion | Pública/estado de acesso | [App.tsx:1214](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1214) |
| DESK-ROUTE-109 | `/suporte` | Support | Pública/estado de acesso | [App.tsx:1224](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1224) |
| DESK-ROUTE-110 | `/app` | AppInfo | Pública/estado de acesso | [App.tsx:1232](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1232) |
| DESK-ROUTE-111 | `/` | RootRoute | Pública/estado de acesso | [App.tsx:1240](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1240) |
| DESK-ROUTE-114 | `*` | NotFound | Pública/estado de acesso | [App.tsx:1260](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1260) |

### My Fit e execução

| ID | Caminho | Tela/componente | Acesso da declaração | Fonte |
| --- | --- | --- | --- | --- |
| DESK-ROUTE-002 | `/treinos/player` | WorkoutPlayerFullScreenPage | Protegida | [App.tsx:335](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L335) |
| DESK-ROUTE-003 | `/treinos/player/:workoutId` | WorkoutPlayerFullScreenPage | Protegida | [App.tsx:341](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L341) |
| DESK-ROUTE-012 | `/meu-fit` | MeuFit | Protegida | [App.tsx:424](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L424) |
| DESK-ROUTE-013 | `/meu-fit/ia` | MyFitAi | Protegida | [App.tsx:434](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L434) |
| DESK-ROUTE-014 | `/meu-fit/protocolo` | Routine | Protegida | [App.tsx:444](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L444) |
| DESK-ROUTE-015 | `/meu-fit/treino` | StudentWorkouts | Protegida | [App.tsx:454](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L454) |
| DESK-ROUTE-016 | `/meu-fit/dieta` | Nutrition | Protegida | [App.tsx:464](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L464) |
| DESK-ROUTE-017 | `/meu-fit/dieta/:dietId/editar` | PersonalDietEditorPage | Protegida | [App.tsx:474](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L474) |
| DESK-ROUTE-018 | `/meu-fit/saude` | MyFitHealthPage | Protegida | [App.tsx:475](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L475) |
| DESK-ROUTE-019 | `/meu-fit/saude/anamnese/questionario` | HealthProfilePage | Protegida | [App.tsx:488](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L488) |
| DESK-ROUTE-020 | `/meu-fit/saude/novo` | HealthProfilePage | Protegida | [App.tsx:498](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L498) |
| DESK-ROUTE-021 | `/meu-fit/saude/eventos/:eventId` | HealthProfilePage | Protegida | [App.tsx:508](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L508) |

### Comunidades e desafios

| ID | Caminho | Tela/componente | Acesso da declaração | Fonte |
| --- | --- | --- | --- | --- |
| DESK-ROUTE-026 | `/comunidades` | Community | Protegida | [App.tsx:522](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L522) |
| DESK-ROUTE-027 | `/comunidades/nova` | CommunityRoutePage | Protegida | [App.tsx:532](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L532) |
| DESK-ROUTE-028 | `/comunidades/:communityId/editar` | CommunityRoutePage | Protegida | [App.tsx:542](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L542) |
| DESK-ROUTE-029 | `/comunidades/:communityId/topicos/:topicId` | CommunityRoutePage | Protegida | [App.tsx:552](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L552) |
| DESK-ROUTE-030 | `/comunidades/:communityId` | CommunityRoutePage | Protegida | [App.tsx:562](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L562) |
| DESK-ROUTE-031 | `/clube/:professionalId` | ClubPage | Protegida | [App.tsx:572](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L572) |
| DESK-ROUTE-032 | `/desafios` | Challenges | Protegida | [App.tsx:582](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L582) |
| DESK-ROUTE-033 | `/desafios/novo` | ChallengeBuilder | Protegida | [App.tsx:592](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L592) |
| DESK-ROUTE-034 | `/desafios/:challengeId/editar` | ChallengeBuilder | Protegida | [App.tsx:596](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L596) |
| DESK-ROUTE-035 | `/desafios/:challengeId/check-ins/:topicId` | CommunityRoutePage | Protegida | [App.tsx:600](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L600) |
| DESK-ROUTE-036 | `/desafios/:challengeId` | ChallengeDetail | Protegida | [App.tsx:610](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L610) |

### Profissional, negócios e clientes

| ID | Caminho | Tela/componente | Acesso da declaração | Fonte |
| --- | --- | --- | --- | --- |
| DESK-ROUTE-009 | `/coach/editor/:studentId` | StudentTrainingProgramEditor | Protegida | [App.tsx:395](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L395) |
| DESK-ROUTE-054 | `/negocios` | CoachBusinesses | Protegida | [App.tsx:794](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L794) |
| DESK-ROUTE-055 | `/negocios/novo` | CoachBusinesses | Protegida | [App.tsx:804](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L804) |
| DESK-ROUTE-056 | `/negocios/:businessId` | ManagementBusinessWorkspacePage | Protegida | [App.tsx:814](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L814) |
| DESK-ROUTE-057 | `/negocios/:businessId/editar` | ManagementBusinessWorkspacePage | Protegida | [App.tsx:824](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L824) |
| DESK-ROUTE-058 | `/negocios/:businessId/ofertas/:offeringId` | OfferingWorkspacePage | Protegida | [App.tsx:834](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L834) |
| DESK-ROUTE-059 | `/clientes` | ProfessionalCrmPage | Protegida | [App.tsx:846](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L846) |
| DESK-ROUTE-060 | `/clientes/leads` | ProfessionalCrmPage | Protegida | [App.tsx:854](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L854) |
| DESK-ROUTE-061 | `/clientes/:clientId` | ClientWorkspacePage | Protegida | [App.tsx:865](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L865) |
| DESK-ROUTE-063 | `/clientes/:clientId/treino` | ClientToolPanels.training | Protegida | [App.tsx:876](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L876) |
| DESK-ROUTE-064 | `/clientes/:clientId/nutricao` | ClientToolPanels.diet | Protegida | [App.tsx:880](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L880) |
| DESK-ROUTE-065 | `/clientes/:clientId/nutricao/editor` | ClientToolPanels.dietEditor | Protegida | [App.tsx:881](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L881) |
| DESK-ROUTE-066 | `/clientes/:clientId/protocolos` | ClientToolPanels.protocols | Protegida | [App.tsx:885](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L885) |
| DESK-ROUTE-067 | `/clientes/:clientId/saude` | ClientToolPanels.health | Protegida | [App.tsx:889](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L889) |
| DESK-ROUTE-068 | `/clientes/:clientId/evolucao` | ClientToolPanels.photos | Protegida | [App.tsx:890](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L890) |
| DESK-ROUTE-069 | `/clientes/:clientId/relatorios` | ClientToolPanels.reports | Protegida | [App.tsx:894](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L894) |
| DESK-ROUTE-070 | `/clientes/:clientId/conteudo` | ClientToolPanels.content | Protegida | [App.tsx:898](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L898) |
| DESK-ROUTE-071 | `/clientes/:clientId/pedidos` | ClientToolPanels.orders | Protegida | [App.tsx:902](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L902) |
| DESK-ROUTE-072 | `/clientes/:clientId/*` | ClientOverviewPanel | Protegida | [App.tsx:903](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L903) |
| DESK-ROUTE-080 | `/coach/programs/builder` | UniversalWorkoutBuilder | Protegida | [App.tsx:975](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L975) |
| DESK-ROUTE-081 | `/coach/programs/builder/workout/new` | UniversalWorkoutBuilder | Protegida | [App.tsx:985](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L985) |
| DESK-ROUTE-082 | `/coach/programs/builder/workout/:id` | UniversalWorkoutBuilder | Protegida | [App.tsx:995](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L995) |
| DESK-ROUTE-083 | `/coach/programs/builder/plano-de-treino/:id?` | Alias → `/coach/programs/builder/programa-de-treino/:id?` | Protegida | [App.tsx:1005](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1005) |
| DESK-ROUTE-084 | `/coach/plano-de-treino-agenda/:studentId` | Alias → `/coach/programa-de-treino-agenda/:studentId` | Protegida | [App.tsx:1009](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1009) |
| DESK-ROUTE-085 | `/coach/programs/builder/programa-de-treino` | TrainingProgramBuilderPage | Protegida | [App.tsx:1010](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1010) |
| DESK-ROUTE-086 | `/coach/programs/builder/programa-de-treino/:id` | TrainingProgramBuilderPage | Protegida | [App.tsx:1020](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1020) |
| DESK-ROUTE-087 | `/coach/nutrition/templates/:templateId` | DietTemplateEditorPage | Protegida | [App.tsx:1030](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1030) |
| DESK-ROUTE-089 | `/coach/checks` | CoachCheckInboxPage | Protegida | [App.tsx:1050](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1050) |
| DESK-ROUTE-090 | `/coach/nutrition` | CoachNutrition | Protegida | [App.tsx:1060](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1060) |
| DESK-ROUTE-091 | `/coach/programa-de-treino-agenda/:studentId` | StudentTrainingProgramSchedulePage | Protegida | [App.tsx:1070](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1070) |

### Perfil, mensagens e rede

| ID | Caminho | Tela/componente | Acesso da declaração | Fonte |
| --- | --- | --- | --- | --- |
| DESK-ROUTE-011 | `/rede-embaixadores` | AmbassadorNetwork | Protegida | [App.tsx:416](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L416) |
| DESK-ROUTE-037 | `/perfil` | Profile | Protegida | [App.tsx:620](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L620) |
| DESK-ROUTE-038 | `/perfil/menu` | ProfileMenu | Protegida | [App.tsx:630](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L630) |
| DESK-ROUTE-039 | `/compras/:contractId` | PurchaseDetailPage | Protegida | [App.tsx:643](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L643) |
| DESK-ROUTE-040 | `/compras/compra/:purchaseId` | PurchaseDetailPage | Protegida | [App.tsx:653](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L653) |
| DESK-ROUTE-041 | `/perfil/configuracao-profissional` | ProfessionalProfileSettings | Protegida | [App.tsx:661](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L661) |
| DESK-ROUTE-042 | `/perfil/pagamentos` | ProfileParityPage | Protegida | [App.tsx:671](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L671) |
| DESK-ROUTE-043 | `/perfil/editar` | Config | Protegida | [App.tsx:681](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L681) |
| DESK-ROUTE-044 | `/perfil/visual` | VisualPreferencesPage | Protegida | [App.tsx:691](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L691) |
| DESK-ROUTE-045 | `/perfil/saude` | HealthProfilePage | Protegida | [App.tsx:701](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L701) |
| DESK-ROUTE-046 | `/perfil/saude/anamnese/questionario` | HealthProfilePage | Protegida | [App.tsx:714](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L714) |
| DESK-ROUTE-047 | `/perfil/saude/novo` | HealthProfilePage | Protegida | [App.tsx:724](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L724) |
| DESK-ROUTE-048 | `/perfil/saude/eventos/:eventId` | HealthProfilePage | Protegida | [App.tsx:734](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L734) |
| DESK-ROUTE-049 | `/perfil/privacidade-termos` | PrivacyPolicy | Protegida | [App.tsx:744](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L744) |
| DESK-ROUTE-050 | `/perfil/atualizacoes` | Notifications | Protegida | [App.tsx:754](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L754) |
| DESK-ROUTE-051 | `/perfil/financeiro` | FinancePage | Protegida | [App.tsx:764](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L764) |
| DESK-ROUTE-052 | `/mensagens` | Inbox | Protegida | [App.tsx:774](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L774) |
| DESK-ROUTE-053 | `/mensagens/:peerId` | Inbox | Protegida | [App.tsx:784](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L784) |
| DESK-ROUTE-073 | `/perfil/:username/feed/:postId` | PostDetail | Protegida | [App.tsx:905](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L905) |
| DESK-ROUTE-088 | `/settings/:section` | ProfileSettings | Protegida | [App.tsx:1040](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1040) |
| DESK-ROUTE-113 | `/perfil/:username` | PublicProfile | Shell opcional | [App.tsx:1249](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L1249) |

### Feed, explorar, programas e estúdio

| ID | Caminho | Tela/componente | Acesso da declaração | Fonte |
| --- | --- | --- | --- | --- |
| DESK-ROUTE-010 | `/explorar` | Discover | Protegida | [App.tsx:406](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L406) |
| DESK-ROUTE-022 | `/produtos` | MarketShell | Protegida | [App.tsx:518](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L518) |
| DESK-ROUTE-023 | `/produtos/destaques` | MarketShell | Protegida | [App.tsx:519](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L519) |
| DESK-ROUTE-024 | `/produtos/:productId` | MarketShell | Protegida | [App.tsx:520](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L520) |
| DESK-ROUTE-025 | `/ofertas/:offeringId` | MarketShell | Protegida | [App.tsx:521](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L521) |
| DESK-ROUTE-074 | `/video/:postId` | PostDetail | Protegida | [App.tsx:915](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L915) |
| DESK-ROUTE-075 | `/feed` | Feed | Protegida | [App.tsx:925](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L925) |
| DESK-ROUTE-076 | `/programas` | Programs | Protegida | [App.tsx:935](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L935) |
| DESK-ROUTE-077 | `/programas/:programId` | ProgramDetail | Protegida | [App.tsx:945](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L945) |
| DESK-ROUTE-078 | `/studio` | StudioComposePage | Protegida | [App.tsx:955](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L955) |
| DESK-ROUTE-079 | `/studio/camera` | StudioCameraPage | Protegida | [App.tsx:965](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L965) |

### Área de membros

| ID | Caminho | Tela/componente | Acesso da declaração | Fonte |
| --- | --- | --- | --- | --- |
| DESK-ROUTE-004 | `/area-de-membros` | MemberHomePage | Protegida | [App.tsx:352](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L352) |
| DESK-ROUTE-005 | `/area-de-membros/salvos` | MemberSavedPage | Protegida | [App.tsx:362](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L362) |
| DESK-ROUTE-006 | `/area-de-membros/:courseId` | MemberCoursePage | Protegida | [App.tsx:372](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L372) |
| DESK-ROUTE-007 | `/area-de-membros/:courseId/aulas/:lessonId` | MemberLessonPage | Protegida | [App.tsx:382](https://github.com/OnlyFitApp/onlyfit-desktop/blob/65043630314f9964ee2b98d6848b06c27cf3404c/src/App.tsx#L382) |

### Layouts, índice e aliases

- AuthGuard governa a árvore protegida. AppShell envolve o portal comum; player e área de membros possuem apresentação própria. Onboarding fica no ramo protegido fora do AppShell.
- AuthLayout envolve login, cadastro e recuperação de senha. OptionalAppShell escolhe a casca do perfil público conforme sessão.
- `/clientes/:clientId` tem uma rota index para `ClientOverviewPanel`, além da rota do workspace. Conferir que abrir a raiz mostra o Resumo e que subrota inválida cai no fallback previsto.
- Os dois aliases plano → programa preservam query e hash e substituem a entrada do histórico. `/` mostra Landing sem sessão ou segue para `/feed` com usuário carregado. Conferir ambos os estados; não contar redirecionamento condicional como página visitada.
- O fallback `*` mostra NotFound. Rotas e nomes não listados não devem ser inventados para acessar ferramenta embutida.

### Subtelas que uma lista de rotas não cobre

| Contexto | Seleção existente | O que conferir |
| --- | --- | --- |
| Negócio `/negocios/:businessId` | `ferramenta=perfil-comercial`, `ofertas`, `bibliotecas`, `clientes` | Seleção, título, recarga, Voltar e limpeza de `id/view` ao trocar ferramenta. |
| Bibliotecas do negócio | `segmento=workout`, `diet`, `protocol`, `forms` | Cada biblioteca e seu editor; conteúdo isolado por negócio; rascunho e retorno. |
| Oferta `/negocios/:businessId/ofertas/:offeringId` | `secao` e recursos dependentes do tipo | Detalhes, acesso/ferramentas quando houver, divulgação, avaliações, vendas e conteúdo específico. Não exigir todas as abas em todos os tipos. |
| Cliente `/clientes/:clientId` | Resumo, Treino, Nutrição, Protocolos, Saúde, Evolução, Relatórios, Conteúdo, Pedidos | Mostrar somente capacidades legítimas; origem do retorno preservada; contexto de consultoria quando necessário. |
| My Fit | Calendário, biblioteca, desafios e ações em gavetas/modais | Marcar Feito, duração prescrita, registro pessoal, editar/agendar, histórico e retorno sem recarga. |
| Comunidade/desafio | Abas, espaços, tipos de publicação, menu de item e diálogos | Todos os controles realmente disponíveis por papel/estado, inclusive cancelamento seguro e leitura de encerrado. |
| Perfil/atualizações | Menu da conta, tema/fonte/idioma, notificações e mensagens | Estados persistidos e navegação consistente ao alternar; evitar sobreposição em 320 px. |

### Páginas estáticas e regras do host

Além das rotas React, existem `/boas-vindas`, `/apple-saude`, `/roteiro-dr-lucas` e `/monte-seu-treino`, com versões terminadas em `/`, servidas por `public/<nome>/index.html`. Conferir links, mídia, legibilidade, teclado e retorno. São documentos web, não prova da integração descrita neles.

`public/_redirects` também declara associação de domínio, assets e fallback SPA. Regras `200` são reescritas do host, não novos fluxos de compra nem redirecionamentos de usuário. O inventário detalhado lista as 13 regras. Não editar arquivos de associação ou servidor para concluir esta rodada de frontend.

## Backoffice: navegação e 33 seções

O backoffice atual tem uma SPA em `/`. Os itens do menu alteram `activeSection` no estado local de `src/App.tsx`; não há uma URL `/finance`, `/users` ou outra por seção. Entrada/recarregamento mostram Visão geral. Abrir cada seção pelo menu real; registrar Menu > Seção > Aba na evidência. Navegação/recarga atuais devem ser descritas como observadas, sem criar um router novo por suposição.

Aplicar U01–U12 a cada linha. Os nomes de ações abaixo são inventário, não permissão para confirmar efeitos financeiros, de segurança, comunicação, documentos vigentes ou decisões sobre usuários reais. Em alvo sem fixture/autoridade, testar leitura, abertura/cancelamento quando seguro e registrar o restante como bloqueado.

### Dashboard

| Seção / identificador | Abas/painéis e ações a percorrer | Papel/limite encontrado | Fonte |
| --- | --- | --- | --- |
| **Visão geral** (`health-overview`) | Indicadores; Atividade nos últimos sete dias. Ações: Atualizar. | staff AAL2; leitura | [src/components/DashboardPages.tsx:26](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/DashboardPages.tsx#L26) |
| **Crescimento** (`health-growth`) | Indicadores de aquisição. Ações: Atualizar. | staff AAL2; leitura | [src/components/DashboardPages.tsx:26](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/DashboardPages.tsx#L26) |
| **Engajamento** (`health-engagement`) | Indicadores; Atividade nos últimos sete dias. Ações: Atualizar. | staff AAL2; leitura | [src/components/DashboardPages.tsx:26](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/DashboardPages.tsx#L26) |
| **Negócio** (`health-business`) | Indicadores; Financeiro nos últimos sete dias. Ações: Atualizar. | staff AAL2; leitura financeira | [src/components/DashboardPages.tsx:26](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/DashboardPages.tsx#L26) |
| **Operação** (`health-operations`) | Indicadores operacionais. Ações: Atualizar. | staff AAL2; leitura | [src/components/DashboardPages.tsx:26](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/DashboardPages.tsx#L26) |

### Usuários

| Seção / identificador | Abas/painéis e ações a percorrer | Papel/limite encontrado | Fonte |
| --- | --- | --- | --- |
| **Diretório** (`members`) | Diretório; Detalhe do usuário. Ações: Buscar; Filtros; Paginação; Abrir usuário; Voltar; Reset senha/MFA; Definir/remover papel. | staff AAL2; resets só outro usuário, super_admin ou admin de não-staff; papéis só super_admin | [src/components/UsersDirectory.tsx:47](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/UsersDirectory.tsx#L47) |
| **Recortes da rede** (`health-users`) | Resumo de contas. Ações: Atualizar. | staff AAL2; leitura | [src/components/DashboardPages.tsx:26](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/DashboardPages.tsx#L26) |
| **Invite Only** (`invite-only`) | Convites; Fila de espera. Ações: Adicionar convite; Reenviar; Remover convite; Liberar fila; Busca; Anterior/Próxima. | admin/super_admin para alterações; operador consulta | [src/components/InviteOnly.tsx:629](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/InviteOnly.tsx#L629) |
| **Equipe** (`users`) | Equipe; Remoção de acesso interno. Ações: Atualizar; Alterar nível; Enviar reset senha; Resetar MFA; Remover acesso; Cancelar. | super_admin; não alterar próprio acesso | [src/App.tsx:1829](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/App.tsx#L1829) |

### Conteúdo e comunidade

| Seção / identificador | Abas/painéis e ações a percorrer | Papel/limite encontrado | Fonte |
| --- | --- | --- | --- |
| **Feed** (`feed`) | Configuração de distribuição. Ações: Atualizar; Editar parâmetros expostos; Salvar. | admin/super_admin salvam; operador leitura | [src/App.tsx:937](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/App.tsx#L937) |
| **Grupos de afinidade** (`affinity-groups`) | Grupos; Editor. Ações: Novo grupo; Editar; Ativar/desativar; Ícone; Salvar; Cancelar; Atualizar; Reordenar por arraste/acima/abaixo; Impacto/seleção de destino antes de desativar; Último grupo ativo não desativa. | admin/super_admin governam; operador leitura | [src/components/AffinityGroupsPage.tsx:60](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/AffinityGroupsPage.tsx#L60) |
| **Moderação** (`review-moderation`) | Denúncias por status. Ações: Filtrar; Atualizar; Manter; Ocultar; Anterior/Próxima. | admin/super_admin resolvem; operador leitura | [src/components/ReviewModerationPage.tsx:22](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/ReviewModerationPage.tsx#L22) |
| **Comunidades** (`community-moderation`) | Todas; Ativas; Entradas pausadas; Somente leitura; Suspensas; Arquivadas. Ações: Buscar; Atualizar; Somente leitura (ativa); Restaurar (somente leitura/suspensa); Suspender; Arquivar; Motivo; Confirmar/cancelar; Paginação. | staff AAL2; controles sem guarda local de role; Core autoriza | [src/components/CommunityModerationPage.tsx:41](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/CommunityModerationPage.tsx#L41) |

### Comercial

| Seção / identificador | Abas/painéis e ações a percorrer | Papel/limite encontrado | Fonte |
| --- | --- | --- | --- |
| **Mercado** (`market-settings`) | Lojas oficiais; Categorias. Ações: Atualizar; Nova loja; Editar loja; Selecionar negócio; Upload/remover capa; Foco da capa; Destaque e período; Salvar; Nova categoria; Editar categoria. | admin/super_admin editam; operador leitura | [src/components/MarketSettingsPage.tsx:73](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/MarketSettingsPage.tsx#L73) |
| **Tipos de oferta** (`offering-types`) | Tipos de oferta; Novo tipo; Editor expandido. Ações: Atualizar; Criar tipo; Abrir/fechar edição; Salvar; Descartar alterações; Ativar/desativar; bloqueia desativar com ofertas ativas. | snapshot.canEdit; edição financeira protegida pelo Core | [src/App.tsx:1184](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/App.tsx#L1184) |
| **Ofertas** (`offerings`) | Catálogo de ofertas; Produtos das lojas nativas. Ações: Busca/filtros; Atualizar; Paginação; Ver links; App Store status/Atualizar; Google Play Product ID/preço/status/Salvar. | admin/super_admin preparam produtos; operador leitura | [src/App.tsx:1587](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/App.tsx#L1587) |
| **Rede de Embaixadores** (`ambassador-network`) | Rede; Países e regiões; Regras; Solicitações; Histórico. Ações: Atualizar; Busca/filtros; Atribuir/editar papel; Suspender/retomar/encerrar atribuição; Regiões criar/editar/ativar; Regras versionadas; Configuração do programa; Decidir solicitações; Paginação/auditoria. | admin/super_admin editam; operador leitura | [src/components/AmbassadorNetworkPage.tsx:52](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/AmbassadorNetworkPage.tsx#L52) |
| **Remuneração** (`ambassador-compensation`) | Percentuais; Custos por canal; Simulador. Ações: Atualizar; Filtro estado; Criar matriz; Abrir matriz; Selecionar cenário; Salvar cenário; Criar taxa; Abrir taxa; Publicar/Ativar/Encerrar; Simular; Fechar. | admin/super_admin para criação; editor/lifecycle não recebem canEdit (reproduzir sem executar mutação) | [src/components/AmbassadorCompensationPage.tsx:19](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/AmbassadorCompensationPage.tsx#L19) |

### Biblioteca da plataforma

| Seção / identificador | Abas/painéis e ações a percorrer | Papel/limite encontrado | Fonte |
| --- | --- | --- | --- |
| **OnlyFit Health** (`onlyfit-health-library`) | Treinos; Programas; Nutrição e dietas; Protocolos. Ações: Busca/filtros; Novo conteúdo; Editar; Publicar/despublicar; Estruturar exercícios/refeições/dias; Catálogo de protocolos embutido; Salvar/cancelar; Paginação. | admin/super_admin governam; operador leitura | [src/components/OnlyFitHealthLibraryPage.tsx:304](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/OnlyFitHealthLibraryPage.tsx#L304) |
| **Cotas de treinos** (`training-quotas`) | Biblioteca pessoal. Ações: Atualizar; Cotas gratuito/Clube; Salvar. | admin/super_admin editam; operador leitura | [src/components/TrainingQuotaSettingsPage.tsx:7](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/TrainingQuotaSettingsPage.tsx#L7) |
| **Exercícios** (`exercise-catalog`) | Catálogo; Editor. Ações: Buscar; Filtros; Paginação; Novo exercício; Editar; Publicar/despublicar; Vídeo e atributos; Salvar/cancelar. | admin/super_admin governam; operador leitura | [src/components/ExerciseCatalogPage.tsx:99](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/ExerciseCatalogPage.tsx#L99) |
| **Catálogos nutricionais** (`nutrition-catalogs`) | Fontes de alimentos; Nutrientes. Ações: Atualizar; Alternar catálogo; Novo item; Editar; Publicar/despublicar; Chave/nome/unidade; Origem/licença/prioridade; Salvar/cancelar. | admin/super_admin governam; operador leitura | [src/components/NutritionCatalogsPage.tsx:95](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/NutritionCatalogsPage.tsx#L95) |
| **Técnicas de luta** (`combat-techniques`) | Técnicas; Editor. Ações: Buscar; Filtros disciplina/distância/tipo; Nova técnica; Editar; Publicar/despublicar; Disciplinas; Salvar/cancelar; Paginação. | admin/super_admin governam; operador leitura | [src/components/CombatTechniquesPage.tsx:64](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/CombatTechniquesPage.tsx#L64) |
| **Tipos de sessão** (`session-types`) | Tipos; Editor. Ações: Atualizar; Novo tipo; Editar; Publicar/despublicar; Ícone/esportes; Salvar/cancelar. | admin/super_admin governam; operador leitura | [src/components/SessionTypesPage.tsx:48](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/SessionTypesPage.tsx#L48) |

### Profissionais

| Seção / identificador | Abas/painéis e ações a percorrer | Papel/limite encontrado | Fonte |
| --- | --- | --- | --- |
| **Registros profissionais** (`professional-credentials`) | Pendentes; Aprovados; Rejeitados. Ações: Atualizar; Status; Aprovar; Rejeitar; Motivo; Cancelar/confirmar rejeição. | staff AAL2; sem guarda local explícita de role; Core autoriza | [src/components/ProfessionalCredentialsPage.tsx:14](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/ProfessionalCredentialsPage.tsx#L14) |
| **Especialidades** (`professional-specialties`) | Especialidades; Editor. Ações: Atualizar; Nova especialidade; Editar; Publicar/despublicar; Salvar/cancelar; Mover acima/abaixo e limites. | admin/super_admin governam; operador leitura | [src/components/ProfessionalSpecialtiesPage.tsx:36](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/ProfessionalSpecialtiesPage.tsx#L36) |
| **Primeiro contato** (`first-contact`) | Prazos; Contratos sem primeiro contato. Ações: Salvar prazos; Filtrar; Atualizar; Anterior/Próxima. | admin/super_admin alteram prazos; operador leitura | [src/components/FirstContact.tsx:21](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/FirstContact.tsx#L21) |

### Operação

| Seção / identificador | Abas/painéis e ações a percorrer | Papel/limite encontrado | Fonte |
| --- | --- | --- | --- |
| **Verificação de empresas** (`company-verification`) | Fila por status; Detalhes documentais. Ações: Atualizar; Filtrar por status; Ler dados exibidos; Nota/justificativa; Aprovar/rejeitar (ação direta atual); Paginação. | admin/super_admin/operator podem decidir na UI | [src/components/CompanyVerificationPage.tsx:33](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/CompanyVerificationPage.tsx#L33) |
| **Área de membros** (`member-area-operations`) | Acessos; Denúncias; Histórico. Ações: Busca/filtros; Paginação; Suspender/Retomar acesso; Justificativa; Manter/Remover comentário; Histórico por período; Atualizar. | admin/super_admin suspendem/retomam; outras decisões com controle do Core | [src/components/MemberAreaOperationsPage.tsx:141](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/MemberAreaOperationsPage.tsx#L141) |
| **Financeiro** (`finance`) | Visão geral; Liquidação; Conciliação; Transações: provedores/Apple; Provedor. Ações: Atualizar; Parâmetros/taxas/Salvar; Relatórios por período; Liquidação por dia; Aprovar/rejeitar resgate; Selecionar/Criar lote; Registrar pagamento com comprovante; Confirmar/falhar/reverter pagamento; Conciliar período; Importar da Apple; Ver itens paginados; Registrar tesouraria; Buscar transações; Credenciais Salvar. | admin/super_admin editam e flag can_edit do servidor para credenciais; operador consulta | [src/App.tsx:1766](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/App.tsx#L1766) |
| **Feedback Beta** (`beta-feedback`) | Métricas/status; Detalhe do relato. Ações: Atualizar; Filtro/status; Abrir relato; Triagem/status/prioridade; Salvar; Fechar; Paginação. | staff AAL2; sem guarda local explícita de role; Core autoriza | [src/components/BetaFeedback.tsx:30](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/BetaFeedback.tsx#L30) |
| **E-mails** (`email-center`) | Caixas/pastas; Lista de conversas; Conversa; Compor/responder. Ações: Buscar; Atualizar; Paginação; Abrir conversa/mensagem; Anexo baixar; Compor; Cc/Cco; Anexar/remover; Enviar; Responder; Ações da conversa; Fechar/Voltar. | staff AAL2; permissões/endereços remetentes do Core | [src/components/EmailCenter.tsx:358](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/EmailCenter.tsx#L358) |
| **Documentos legais** (`legal-documents`) | Publicar versão; Versões e cobertura. Ações: Atualizar; Documento/tipo/jornada; Upload PDF; Publicar PDF; Abrir PDF; Ativar/desativar; Alterar jornada vigente. | staff AAL2; sem guarda local explícita de role; Core autoriza | [src/components/LegalDocumentsPage.tsx:20](https://github.com/OnlyFitApp/onlyfit-backoffice/blob/63383289966ec2fb443598b5c01c34f089efe48f/src/components/LegalDocumentsPage.tsx#L20) |

### Comandos globais e permissões

- Entrar: e-mail, senha, envio, erro e carregamento; MFA por fluxo normal. Não capturar QR/segredo nem contornar AAL2. Sem conta de papel apropriado, o teste desse papel fica bloqueado.
- Menu: abrir/fechar/recolher, grupo, item selecionado, scrim em largura estreita e Sair. O JSX antigo “Tema OnlyFit” está oculto por CSS; não registrar como botão visível quebrado sem observá-lo.
- Papéis: operador, admin e super_admin. Guardas locais diferem por componente; conferir as ações renderizadas sem executar escrita para provar exposição. Nenhum botão administrativo comprova que o servidor aceita uma ação indevida.
- Troca de conta: abrir apenas dados QA, sair/entrar B sem recarga, reabrir a seção e repetir com leitura em andamento se a ferramenta de navegador permitir. Dado/resultado atrasado de A não pode aparecer em B. O teste exige duas contas staff QA autorizadas; não alterar papel real para montá-lo.

### Atenções específicas que evitam roteiros falsos

1. Comunidades: `Entradas pausadas` é estado/filtro; o componente auditado não oferece Pausar/Reabrir entradas. Restaurar existe para estados específicos; arquivada não oferece essa ação. Não inventar botão.
2. Empresa: Aprovar/Rejeitar são ações diretas na implementação auditada. Não clicar esperando confirmação que não existe; usar apenas alvo QA e operação autorizada.
3. Equipe: remover acesso interno preserva a conta da plataforma. Não confundir com excluir aluno. Reset de senha/MFA e mudança de papel são ações de segurança distintas de leitura.
4. Catálogos nutricionais: as abas atuais são Fontes de alimentos e Nutrientes. Não há lista individual de alimentos ou paginação nesse componente; testar o que existe.
5. Área de membros staff: suspensão administrativa é operação staff. Ela não altera a regra solicitada para o profissional, cujo bloqueio é somente por inadimplência.
6. E-mails: abrir conversa pode marcar leitura; Sincronizar ingere mensagens. Compor, Responder, Enviar/Reenviar e reset por e-mail têm efeito externo. Usar apenas destinatário fictício autorizado; não disparar para pessoas reais por cobertura.
7. Financeiro: Liquidação contém resgates, lotes, comprovantes, confirmar/falhar/reverter. Conciliação contém Conciliar, Importar da Apple e Registrar tesouraria. Nesta rodada sem cobrança, leitura/filtro/detalhe não aprovam esses comandos; não executá-los só para obter verde.
8. Provedores: a entrada atual usa `PaymentProviderPanel`; helper antigo `ProviderIntegrationPanel` não equivale a controles montados. Não regravar credenciais, produto nativo ou política global para provar que um botão salva.
9. Documentos legais: publicar/ativar versão pode afetar aceites e contratação reais. Sem documento aprovado e autorização específica, verificar consulta/abertura/validação/cancelamento; não fabricar termo para liberar consultoria.
10. Remuneração/Registros: listas limitadas a 50/100 sem próximo controle devem ser conferidas somente se a massa já existir. Não criar dezenas de políticas/registros nem baixar tabelas completas para montar um teste.

## Casos focais de regressão nesta rodada

Estes casos foram apontados por revisão; o resultado atual pertence à execução pelo navegador e à build efetivamente entregue. Não marcar aprovado pelo patch ou pelo teste unitário.

| Caso | Reprodução | Critério e limite |
| --- | --- | --- |
| FPRO01 | Clientes → filtro Todas assinaturas → indicador Assinantes ativos. | O indicador executa a filtragem existente e reflete a seleção, com paginação reiniciada; conferir também a origem Leads. |
| FPRO02 | `/clientes/leads` → Primeiro contato → comparar com o mesmo clique em Clientes. | A origem não perde o filtro solicitado; URL, realce e lista coerentes. Ausência de contatos pendentes limita a prova da lista. |
| FPRO03 | Resumo CRM durante carregamento/erro recuperável. | Falha não exibe quatro zeros como totais confirmados; Atualizar recupera. Se falha exclusiva não for reproduzível pelo navegador, manter o caso não executado. |
| FPRO04 | Cliente → Pedidos → Gerir na oferta, se já houver pedido QA. | Destino e rótulo correspondem à superfície disponível. Não adivinhar `business_id` ausente nem criar contrato/compra para montar a linha. |
| FPRO05 | CRM com mais de 50 contatos → Carregar mais → mudança autorizada de um contato → Atualizar. | Registros já visíveis não ficam antigos nem duplicam. Sem massa suficiente, bloqueado. |
| BO01 | Remuneração com operador QA → abrir matriz/custo e inspecionar salvar/lifecycle, sem confirmar. | Controles respeitam o papel de edição; não alegar bypass do Core pelo botão. |
| BO02 | Após troca entre duas contas staff QA, voltar à seção antes de expirar cache. | Nenhum dado de A ou resposta tardia aparece em B; sem duas contas, bloqueado. |
| BO03 | Ofertas QA → Ver links → App Store e Google Play, desktop e largura estreita. | Consulta sem erro de filtro, modal alcançável, status de liberação explícito; vínculo não é compra. |
| UI01 | Saúde, PDF, desafio, CRM e demais telas exercitadas em 320/390 px e fonte grande. | Sem Voltar duplicado, overflow, texto sobreposto ou ação final coberta; foco/labels e estados claros. |

## Evidências anteriores e situação inicial

As referências abaixo registram a rodada anterior. Devem ser reutilizadas com seu alcance e data, sem aprovação automática de outra build, outra ação ou outro papel.

| Área | Evidência anterior disponível | O que continua separado |
| --- | --- | --- |
| Comunidades/desafios | `community-challenge-cycle.json`: 45 verificações; criação, acesso, mural, enquete, eventos/presença, material, check-in, aprovação, edição, encerramento, contestação e cancelamento. | Compra cobrada, exclusões irreversíveis, desempate de desafio com vários participantes, resolução staff de contestação e finalização após 48 h. |
| Ranking/calendário | `ranking-cards-refresh-frontend.json`: registro QA de 3 min atualizou cartões e semana sem recarga; `ranking-ended-stable-frontend.json`: atividade posterior não alterou o encerrado. | Nova modalidade/cenário exige incremento próprio; dias futuros não decorreram nessa prova. |
| Curso/material | `audit-state.json#buyer_course` e `pdfResponsiveRetest`: vídeo, quiz, PDF de uma página, zoom, aula salva, transcrição, comentário, conclusão e treino copiado/agendado. | PDF de várias páginas, recebimento do download, todas as opções de autoria e todas as mídias não são aprovados por essa amostra. |
| Treino/programa | `playerRegressionFixes`, `trainingProductionRetest20261014`, `programSessionAccessQA017`: musculação com recarga/retomada/conclusão e casos específicos de programa/agenda. | Sete outras modalidades, todas as ofertas avulsas e ciclo profissional completo de cada tipo. |
| Saúde/anamnese | `healthDelivery.questionnaireRetest` e `desktopFollowup`: resposta fictícia de cinco etapas, validações, criação/correção de registro e PDF, layout/retorno responsivo. | Envio profissional de questionário ao cliente não existe na UI auditada. Não confundir resposta pessoal com atribuição. |
| CRM/financeiro | `professionalCycle20261014` e `finance-cycle-matrix.json`: modelos, programa salvo, histórico comercial e isolamento/estado vazio do financeiro por conta. | Lista integral paginada, vida financeira paga e todos os estados de atendimento. |
| Backoffice | Ofertas sociais QA sincronizadas e catálogo Apple consultado após correção; configuração de provedores teve prova específica pela UI autenticada. | As 33 seções não foram todas aprovadas; configuração exibida não comprova transação, renovação ou liquidação. |

O `audit-state.json` inicial contém campos antigos pendentes/falhos já superados por seções posteriores de reteste. Exemplo: a falha antiga de PDF responsivo foi superada por `pdfResponsiveRetest`; a submissão de anamnese foi corrigida e retestada posteriormente. Preservar a origem e usar a evidência mais nova somente para a mesma afirmação. `work/desktop-next-qa.md` e `work/backoffice-next-qa.md` são filas de apoio à execução, não recibos de aprovação.

Os resultados novos do root devem ser registrados por caso, com imagem/artefato correspondente e limite específico. Uma captura isolada sem passos não comprova toda a página. Nenhum total de testes automatizados preenche o campo de resultado funcional.

## Limites conhecidos que esta rodada não corrige no Core

- Financeiro desktop: o recibo histórico registra problema de limite/cursor do produtor e a UI não consome próxima página. Não afirmar busca global ou paginação integral; cortar dados localmente ou inventar cursor não resolve. Registrar o comportamento com a massa acessível e manter a dependência fora desta rodada.
- Consultoria formal: faltava PDF aprovado de `service_terms` na execução registrada. Não contornar aceite/contratação ou criar documento por suposição para concluir P02/P14.
- Pedidos: se o DTO disponível não identifica o negócio com segurança, não adivinhar destino administrativo nem alterar contrato. Conferir e ajustar somente a ação frontend autorizada quando possível.
- Falta de vínculo, capacidade, papel staff, pedido QA ou massa de paginação é um pré-requisito ausente. Não inserir registros diretamente, marcar pago, criar tabela/coluna ou alterar autorização para preencher a planilha.
- Compra real, renovação, inadimplência, recuperação, repasse, saque, reembolso, liquidação, envio externo e publicação legal dependem de execução legítima específica. A rodada sem cobrança mantém esses casos separados e explícitos.

## Critério de conclusão e atualização do manual

Um caso só é aprovado com o comportamento relevante observado pelo frontend e com seu resultado persistido/compartilhado conferido quando aplicável. Toda falha precisa de reprodução e resultado após a correção entregue. Casos bloqueados e não executados continuam visíveis; não substituir por “100% funcionando”.

Ao publicar este manual, preservar o manual profissional existente, incluir os dois inventários JSON como anexos e ligar os documentos pelo README. A publicação é somente documentação no repositório do backoffice; não cria menu, tela ou funcionalidade. Os anexos preservam o retrato anterior às correções desta rodada. Para uma nova execução, conferir as diferenças da build entregue e registrar os controles adicionados ou alterados; os links de fonte continuam fixados nas revisões declaradas.

# Revisão do frontend administrativo — 15/10/2026

Escopo: frontend desktop e backoffice, incluindo compras, Remuneração e bibliotecas administrativas. Core, Flutter, contratos, SDK, tabelas e colunas estão fora das alterações desta rodada.

- No detalhe de usuário, a tabela Compras mostrava `pending`/`confirmed` em português. A apresentação passa a exibir Pendente/Confirmada, além dos outros estados comerciais conhecidos e um fallback neutro. Confirmada não afirma entrega, acesso ou liquidação financeira.
- Em Remuneração, a criação já dependia de admin/super_admin, mas abrir uma matriz ou custo expunha edição/publicação para operador. O mesmo `canEdit` agora alcança os editores: operador consulta cenários, valores e justificativa sem salvar ou executar lifecycle; administrador conserva as ações. Os handlers também recusam submissão sem permissão e durante envio.

As verificações automatizadas exercitam as árvores e handlers reais dos editores com hooks de transporte substituídos, sem chamada administrativa. Isso é uma regressão auxiliar, não uma execução no navegador.

Reteste pelo frontend após publicar: Diretório → conta QA → Compras mostra rótulos em português; Remuneração com operador QA abre consulta sem Salvar/Publicar/Ativar/Encerrar; com administrador QA, os controles pertinentes ao estado continuam disponíveis. Não executar mutações financeiras reais para testar visibilidade. Registrar resultado e evidência na auditoria operacional.

- Reteste real do simulador com Cursos e R$ 100,00 retornou `staff.compensation_policy_not_found` (HTTP 500). A UI agora explica a ausência de política aplicável, incluindo o formato de erro objeto recebido pelo transporte, sem criar ou ativar matrizes. Campos da Remuneração recebem nomes acessíveis e percentuais em português.
- Inventário anexado: 109 caminhos desktop e 33 seções backoffice. O manual descreve a execução ainda necessária, sem atribuir aprovação aos controles levantados por código.

## Continuação pelo frontend: bibliotecas e prazos

Defeitos reproduzidos em produção, sem salvar dados administrativos:

- OnlyFit Health: Treinos → Novo → preencher um rascunho → trocar para Nutrição mantinha o editor de Treino, com modalidade e exercícios do tipo anterior. Clicar Novo novamente também apagava o rascunho.
- Catálogos nutricionais: abrir uma fonte, preencher uma chave e trocar para Nutrientes fechava o editor e descartava o rascunho silenciosamente.
- Primeiro contato: apagar os dois prazos deixava os campos nativamente válidos e o botão Salvar habilitado. Não foi enviada alteração; a recarga conservou 24/48 horas.

A correção impede a troca de tipo enquanto o editor estiver aberto e mantém o rascunho até salvar ou cancelar. Cada tipo do OnlyFit Health inicia com seus próprios filtros e página; o salvamento também recusa um payload de tipo diferente antes da mutação. Protocolos participam do mesmo controle de editor. Os prazos vazios passam a ser obrigatórios e são recusados pelo handler antes de conversão numérica; limites e política existentes permanecem preservados.

Outros resultados reais, de alcance limitado:

- Exercícios: buscar agachamento retornou 139 itens em quatro páginas; avançar trouxe itens diferentes (41–80), e voltar restaurou a primeira página.
- Novo exercício oficial: Salvar bloqueado sem nome; preencher nome habilita; remover a única modalidade volta a bloquear. Cancelado sem criar registro.
- Novo tipo de sessão e nova especialidade: formulários abrem e cancelam; o salvamento vazio permanece bloqueado. Nenhum catálogo oficial foi criado ou alterado.
- Desktop profissional: dieta QA criada com refeição e alimento; quantidade e totais reagiram à duplicação/remoção, e a reabertura conservou o conteúdo salvo. O curso QA aparece no CRM profissional com uma aula de uma concluída e 100% de progresso. Atribuição de dieta/treino não foi forçada: a ficha QA indica ausência de consentimento para acompanhamento.

As regressões dos componentes administrativos são verificações auxiliares com fronteiras de transporte substituídas. O reteste da versão publicada e suas evidências são registrados separadamente na auditoria operacional. Esta rodada não comprova todos os caminhos do manual, papéis de operador sem sessão QA, cobranças, renovação, inadimplência, saques, reembolsos ou alterações dos catálogos reais.

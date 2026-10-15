# Revisão do frontend administrativo — 15/10/2026

Escopo: apresentação de compras no Diretório e controles da Remuneração. Sem alteração de Core, contrato, SDK, tabelas ou colunas.

- No detalhe de usuário, a tabela Compras mostrava `pending`/`confirmed` em português. A apresentação passa a exibir Pendente/Confirmada, além dos outros estados comerciais conhecidos e um fallback neutro. Confirmada não afirma entrega, acesso ou liquidação financeira.
- Em Remuneração, a criação já dependia de admin/super_admin, mas abrir uma matriz ou custo expunha edição/publicação para operador. O mesmo `canEdit` agora alcança os editores: operador consulta cenários, valores e justificativa sem salvar ou executar lifecycle; administrador conserva as ações. Os handlers também recusam submissão sem permissão e durante envio.

As verificações automatizadas exercitam as árvores e handlers reais dos editores com hooks de transporte substituídos, sem chamada administrativa. Isso é uma regressão auxiliar, não uma execução no navegador.

Reteste pelo frontend após publicar: Diretório → conta QA → Compras mostra rótulos em português; Remuneração com operador QA abre consulta sem Salvar/Publicar/Ativar/Encerrar; com administrador QA, os controles pertinentes ao estado continuam disponíveis. Não executar mutações financeiras reais para testar visibilidade. Registrar resultado e evidência na auditoria operacional.

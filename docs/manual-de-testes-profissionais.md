# Manual de testes profissionais

Roteiro de testes funcionais da OnlyFit pelas telas do portal, do app e do backoffice. O foco desta edição é comunidades, desafios, ranking e as ofertas associadas. O checklist complementar cobre os demais fluxos profissionais solicitados.

Execute os passos com contas fictícias de profissional e aluno. Para cada caso, registre o resultado observado na tela, a data, o perfil utilizado e uma captura de tela. Um roteiro descrito abaixo só recebe o status **Aprovado** depois da execução correspondente.

## Preparação

1. Separe uma conta profissional aprovada, uma conta de aluno aprovada e uma sessão de staff com o acesso habitual ao backoffice.
2. Use sessões separadas para profissional e aluno, ou saia da conta antes de trocar de perfil. Confira o nome da conta no menu.
3. Identifique todo conteúdo criado com `QA`, a data e a indicação de conteúdo fictício. Use foto, PDF e atividade demonstrativos, sem dados de pessoas reais.
4. Anote a versão publicada, a largura da tela e o fuso horário. Repita os fluxos principais no desktop e em uma tela estreita.
5. Antes de testar ranking, anote os totais atuais. Atividades anteriores do mesmo dia podem estar incluídas; a conta não precisa começar com zero.

Este roteiro de pagamento termina na validação dos dados de cobrança, sem gerar cobrança real, usar CPF inventado ou marcar pagamento artificialmente. A aprovação de acesso pago, renovação, liquidação e inadimplência exige uma execução financeira específica, com a autorização correspondente.

## Registro da execução

Copie uma linha por caso e por perfil. Use **Aprovado**, **Falhou**, **Bloqueado** ou **Não executado**.

| Caso | Perfil | Data e versão | Resultado observado | Status | Evidência |
| --- | --- | --- | --- | --- | --- |
| COM01 | Profissional | Preencher | Preencher | Não executado | Captura ou referência |

Quando houver falha, registre a sequência de cliques, o horário com fuso, a mensagem visível e o que deveria ocorrer. O erro exibido pela interface deve ser compreensível para a pessoa que está usando o produto.

## Comunidades

### COM01 Criar comunidade gratuita

1. Abra Comunidades e inicie a criação.
2. Preencha nome, descrição, regras, acesso e participação; crie um espaço de conversa quando essa opção estiver disponível.
3. Revise e publique. Reabra a comunidade.

**Esperado:** dados preservados, criador identificado, contagem de membros coerente e acesso às configurações pelo responsável.

### COM02 Participar com outra conta

1. Abra a comunidade com a conta de aluno antes de participar.
2. Confira apresentação, regras e conteúdo permitido ao visitante.
3. Participe e abra o mural. Atualize a página.

**Esperado:** entrada registrada uma única vez, contagem atualizada e conteúdo de membro disponível após a entrada. Conteúdo privado permanece protegido antes dela.

### COM03 Publicar texto e foto

1. No mural, abra Compartilhe com a comunidade e publique um texto fictício.
2. Publique uma foto demonstrativa no espaço escolhido.
3. Confira o filtro desse espaço e o filtro Tudo; reabra com a outra conta.

**Esperado:** cada publicação aparece uma vez, no espaço correto, com autor, texto e imagem preservados.

### COM04 Curtir e comentar

1. Com a outra conta, curta uma publicação e envie um comentário identificável como QA.
2. Reabra o tópico e atualize a página.

**Esperado:** reação e comentário persistem, com autoria correta. A interface mantém estados e contagens coerentes.

### COM05 Fixação e apresentação pública

1. Como responsável, use Mais ações para fixar uma publicação e usá-la na apresentação pública.
2. Confira a apresentação como visitante ou com uma conta que ainda não participa.
3. Desfaça a fixação e retire a publicação da apresentação pública.

**Esperado:** a fixação altera a posição no mural; a apresentação expõe somente o conteúdo selecionado. Ao desfazer, o menu passa a oferecer Fixar no topo e Usar como apresentação pública.

### COM06 Enquete

1. Crie uma enquete com pergunta e pelo menos duas opções diferentes.
2. Vote com as duas contas, usando opções diferentes.
3. Atualize a página.

**Esperado:** pergunta e opções têm rótulos claros; votos e percentuais correspondem às escolhas, sem duplicação ao atualizar.

### COM07 Eventos e presença

1. Crie um evento futuro com início, fim e local fictícios.
2. Na outra conta, confirme e retire a intenção de participar; depois confirme novamente.
3. Após o horário adequado, use Marcar presença com o responsável.
4. Compare Próximos e Anteriores para um evento já encerrado.

**Esperado:** intenção de participação pode ser alternada; presença e intenção são estados distintos. Eventos encerrados aparecem em Anteriores. A presença confirmada repercute no ranking conforme a regra vigente.

### COM08 Material PDF

1. Publique um PDF demonstrativo com título e descrição.
2. Localize-o no mural e no Acervo.
3. Use Abrir e confira o conteúdo renderizado. Use Baixar e confira o arquivo recebido pelo navegador.

**Esperado:** título e material corretos, acesso permitido ao membro e PDF legível. Registrar separadamente a abertura e o download: um não comprova o outro.

### COM09 Compartilhar atividade

1. Registre uma atividade fictícia no My Fit pelo formulário da interface.
2. No mural, selecione Treino e a atividade criada.
3. Confira a opção de compartilhar o desenho da rota antes de publicar.
4. Abra a publicação com a outra conta.

**Esperado:** distância, duração e calorias correspondem à atividade selecionada; a rota depende da escolha explícita. Uma conta sem atividades recebe uma mensagem clara, preservando o texto ao trocar de tipo de publicação.

### COM10 Sair e retornar

1. Com um membro comum, saia da comunidade pelo fluxo de confirmação.
2. Confira o conteúdo privado e o acesso a desafios vinculados.
3. Participe novamente.

**Esperado:** contagem de membros e acesso acompanham a saída e a entrada. O retorno não duplica o membro nem perde o histórico de pontuação que deve ser preservado.

## Desafios

### DES01 Criar desafio gratuito

1. Inicie a criação como profissional e preencha nome, modalidade de apuração, período e participação.
2. Configure exigência de foto, limite de participantes e aprovação, conforme o cenário.
3. Revise datas e regras antes de publicar; reabra o desafio.

**Esperado:** revisão e desafio publicado exibem os mesmos dados. Datas e duração são coerentes com o fuso usado na tela.

### DES02 Criar a partir de uma comunidade

1. Use Criar desafio dentro da comunidade.
2. Selecione um modelo e avance até a etapa de acesso.

**Esperado:** a comunidade de origem e a restrição aos seus membros continuam selecionadas depois de aplicar o modelo.

### DES03 Solicitar e aprovar entrada

1. Com o aluno, solicite entrada em um desafio que exige aprovação.
2. Confira Pedido enviado e a proteção do conteúdo antes da aprovação.
3. Como organizador, aprove a solicitação; retorne ao aluno.

**Esperado:** solicitação aparece ao organizador, desaparece da lista de pendências após aprovação e concede o acesso correto, uma única vez.

### DES04 Fazer check in com foto

1. Abra Fazer check-in ou Novo check-in com o aluno aprovado, conforme o estado exibido.
2. Preencha título e modalidade, deixando a foto ausente em um desafio que a exige.
3. Confira a validação; adicione a foto QA e envie uma vez.
4. Abra Check-ins como organizador e confira a publicação.

**Esperado:** o envio exige os campos obrigatórios; depois de concluído, foto, título e modalidade aparecem para aluno e organizador.

### DES05 Dois check ins no mesmo dia

1. Em um desafio por dias ativos, faça dois check-ins válidos no mesmo dia.
2. Confira as publicações e o ranking.

**Esperado:** as duas publicações existem, mas aquele dia conta uma vez.

### DES06 Uma atividade em vários desafios

1. Selecione uma atividade existente no formulário de check-in.
2. Marque vários desafios elegíveis e publique.
3. Compare os placares antes e depois; confira os respectivos murais.

**Esperado:** a atividade aparece nos desafios escolhidos. A mesma atividade não soma novamente só por ter sido compartilhada ou vinculada a outro check-in.

### DES07 Editar com participantes

1. Como organizador, edite o nome de um desafio que já tem participante e pontuação.
2. Confira os campos de período e regra que ficam bloqueados.
3. Salve e reabra.

**Esperado:** alteração permitida persiste sem mudar período, participantes ou pontuação. Campos protegidos continuam indisponíveis.

### DES08 Encerrar e preservar o placar

1. Anote o placar e encerre um desafio QA pelo organizador.
2. Confira Resultado provisório e a janela de contestação exibida.
3. Com o participante, registre uma nova atividade fictícia no My Fit, depois do encerramento.
4. Reabra o desafio encerrado e compare o placar; confira também um desafio ainda em andamento.

**Esperado:** o encerrado mantém a apuração; o ativo recebe os incrementos válidos. A edição comum do encerrado fica indisponível. A correção autorizada por contestação e staff segue o fluxo próprio.

### DES09 Contestar resultado provisório

1. Com um participante, abra Contestar durante a janela disponível e envie uma descrição claramente fictícia.
2. Reabra o desafio e confira o estado da contestação.
3. Confira que o histórico continua legível e que a conversa encerrada respeita os controles de escrita existentes.

**Esperado:** contestação registrada e estado preservado. O fim da janela de 48 horas precisa de conferência no horário real; a mera abertura da contestação não comprova a finalização posterior.

O backoffice auditado não oferece tela para resolver a contestação pela staff. Este caso confere o envio e o estado visíveis ao participante; a resolução operacional não está aprovada por este roteiro.

### DES10 Cancelar desafio pago de QA

1. Use um desafio QA sem compras ou participantes reais e cancele pelo organizador.
2. Com a conta compradora, confira a página do desafio e tente abrir o checkout da oferta vinculada.

**Esperado:** o desafio fica indisponível e a aquisição é recusada antes de preparar pagamento. O acesso pago não é concedido.

## Ranking

### RAN01 Conferir as modalidades

Crie desafios QA com cada modalidade disponível e anote o valor inicial. Registre uma atividade fictícia pelo formulário do My Fit. Compare o acréscimo no calendário, nos cartões e no detalhe, com o participante e com o organizador.

| Modalidade | Conferência |
| --- | --- |
| Calorias | Acréscimo das calorias da atividade elegível |
| Distância | Acréscimo da distância, respeitando unidade e arredondamento |
| Minutos | Acréscimo da duração registrada |
| Atividades | Uma nova atividade válida acrescenta uma atividade |
| Dias ativos ou sequência | Várias atividades no mesmo dia não criam dias extras |
| Pontos por modalidade | Peso configurado aplicado à modalidade selecionada; por exemplo, corrida com peso 3 |
| Passos | Valor proveniente da integração compatível; o formulário manual sem passos não comprova importação positiva |

A apuração considera o dia de entrada conforme a regra do produto. Use incrementos sobre o valor observado; não presuma que atividades anteriores do mesmo dia estejam excluídas.

### RAN02 Atualização imediata no calendário

1. Anote os cartões de desafio e o total semanal do My Fit.
2. Registre uma atividade fictícia com duração e métricas conhecidas.
3. Confira os valores sem recarregar a página; depois saia da tela e retorne.

**Esperado:** cartões e total semanal atualizam imediatamente e persistem ao retornar. Registro manual aparece como Registro pessoal.

### RAN03 Ordenação e posição

1. Na comunidade, abra Membros e Mais ativos do mês e compare os pontos de duas contas.
2. Faça uma ação que pontua conforme a regra vigente, como presença confirmada pelo responsável.
3. Confira a ordem e a posição antes e depois; atualize a página.

**Esperado:** ordem coerente com os totais e posição do resumo igual à do ranking. Para desafios com um único participante, a posição 1 não comprova desempate entre várias pessoas.

## Ofertas pagas e backoffice

### PAG01 Comunidade mensal

1. Como profissional, crie uma comunidade paga recorrente, revise preço e intervalo e publique.
2. Como aluno, confira a oferta vinculada e a proteção do conteúdo antes da compra.
3. Abra o checkout e confira preço, recorrência e formas permitidas; pare antes da cobrança.

**Esperado:** oferta gerada pelo fluxo de criação, dados corretos e acesso privado protegido. No cenário mensal executado, o checkout ofereceu cartão.

### PAG02 Comunidade avulsa e desafio pago

1. Crie uma comunidade de compra única com validade; confira que validade inválida impede avançar.
2. Crie um desafio pago e confira a oferta gerada.
3. Como aluno, abra cada oferta e confira preço e opções de pagamento disponíveis; pare antes da cobrança.

**Esperado:** validade e tipo preservados; cada botão leva à oferta correspondente. No cenário avulso executado, cartão e Pix chegaram à validação dos dados de cobrança.

### PAG03 Conferência operacional

1. No backoffice, abra Comercial e Ofertas e localize as ofertas QA criadas pelo profissional.
2. Compare nome, tipo, preço, recorrência, publicação e vínculo ao negócio.
3. Abra Ver vínculos nas lojas e confira App Store e Google Play separadamente.

**Esperado:** ofertas do frontend aparecem corretamente no backoffice. A consulta ao catálogo Apple abre sem erro de filtro. Product ID ou vínculo exibido não comprova habilitação da loja nem pagamento confirmado; registre também o estado de liberação mostrado.

## Checklist complementar profissional

Execute e registre cada item abaixo em uma nova rodada. Esta lista não atribui aprovação automática a esses fluxos.

- [ ] Criar e publicar oferta de consultoria, conferir acesso e ferramentas e abrir como aluno.
- [ ] Inserir material e abrir o conteúdo na área de membros, incluindo PDF e vídeo quando disponíveis.
- [ ] Criar e atribuir treino; conferir biblioteca e calendário do aluno.
- [ ] Executar o treino e conferir duração, conclusão, histórico e acompanhamento pelo profissional.
- [ ] Marcar Feito no calendário e conferir a duração prescrita na barra de atividade.
- [ ] Criar e editar os modelos de anamnese existentes e responder o questionário pessoal; conferir o histórico no perfil correto. Envio ou atribuição profissional de questionário ao aluno é uma lacuna do frontend auditado.
- [ ] Conferir CRM, situação do vínculo e informações disponibilizadas ao profissional.
- [ ] Conferir os fluxos existentes de assinatura, cobrança recorrente e financeiro; registrar separadamente os casos dependentes de pagamento efetivo.
- [ ] Conferir o bloqueio por inadimplência pelo fluxo existente, quando houver uma situação financeira válida para executar o caso.
- [ ] Testar Apple Health em aparelho iOS, incluindo permissões, importação, duplicidade e apresentação dos dados importados.

## Revisão visual e de navegação

- [ ] No desktop, conteúdo com largura legível e hierarquia consistente; no mobile, estrutura coerente com o app Flutter.
- [ ] Nenhuma rolagem horizontal involuntária nas telas estreitas.
- [ ] Novo check-in e demais ações não ficam cobertos pela navegação inferior; conferir também com 320 e 390 pixels de largura.
- [ ] Voltar, títulos, abas e seleção de conta são claros; o atalho para conteúdo leva ao conteúdo principal.
- [ ] Campos têm rótulos acessíveis; carregamento, vazio, erro e nova tentativa possuem estados compreensíveis.
- [ ] Datas, moeda, unidades, contraste, cores e espaçamento respeitam a identidade OnlyFit.
- [ ] As ações continuam funcionando depois de atualizar a página e de alternar entre os perfis.

## Resultados da rodada de 14 e 15 de outubro de 2026

Os seguintes resultados foram observados pelas interfaces com contas fictícias:

| Grupo | Resultado observado |
| --- | --- |
| Comunidade | Criação, entrada, mural com texto e foto, espaços, enquete com duas contas, comentários, reação, fixação, apresentação pública, saída e retorno |
| Eventos | Intenção de participação e presença; alteração do ranking de duas contas após a presença; separação de eventos próximos e anteriores |
| Material | PDF privado abriu e renderizou uma página; o botão Baixar foi acionado, mas o arquivo baixado não foi capturado para conferência |
| Atividade no mural | Métricas da atividade selecionada visíveis à outra conta; opção de rota desmarcada por padrão |
| Desafios | Criação gratuita e paga, aprovação, foto obrigatória, check-ins visíveis ao organizador e edição permitida sem perder período ou pontuação |
| Duplicidade | Dois check-ins no dia mantiveram um dia; uma atividade vinculada a sete desafios não duplicou os totais |
| Calendário | Atividade de 3 minutos atualizou os cartões sem recarga e levou o total semanal de 50 para 53 minutos |
| Encerramento | Depois da correção, uma atividade posterior de 2 minutos e 11 kcal atualizou os desafios ativos e o total semanal para 55 minutos; o desafio encerrado manteve 65 kcal |
| Contestação | Envio fictício durante o resultado provisório e estado de análise preservado ao reabrir |
| Pagamento | Ofertas mensal e avulsas abertas até a validação de dados de cobrança; nenhum pagamento real realizado |
| Cancelamento pago | Checkout da oferta de desafio cancelado recusado antes da solicitação de CPF |
| Backoffice | Três ofertas QA sincronizadas; consulta Apple corrigida e conferida em desktop e tela estreita |

Os valores acima são evidência daquela execução, não um saldo inicial obrigatório para repetir o roteiro. Passos importados por integração nativa, sequência em dias futuros, encerramento definitivo após 48 horas e o ciclo financeiro efetivo exigem a rodada específica correspondente.

No cenário QA consultado, a App Store indicava **não liberado**; no Google Play o produto estava sem Product ID e em rascunho. Esses cenários não comprovam compra nativa disponível.

As correções desta rodada estão nos PRs [Desktop 453](https://github.com/OnlyFitApp/onlyfit-desktop/pull/453), [454](https://github.com/OnlyFitApp/onlyfit-desktop/pull/454), [455](https://github.com/OnlyFitApp/onlyfit-desktop/pull/455), [Core 230](https://github.com/OnlyFitApp/onlyfit-core/pull/230), [231](https://github.com/OnlyFitApp/onlyfit-core/pull/231), [232](https://github.com/OnlyFitApp/onlyfit-core/pull/232) e [Backoffice 119](https://github.com/OnlyFitApp/onlyfit-backoffice/pull/119).

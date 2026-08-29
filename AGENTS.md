# AGENTS.md

## REGRA RÍGIDA E PRIORITÁRIA: ENTREGA SEMPRE NO GIT REMOTO

Esta é a primeira instrução operacional para qualquer agente. Quando o usuário pedir `push`, PR, merge ou deploy, é proibido encerrar com mudanças ou commits apenas locais. O agente deve partir da `main` atualizada, criar branch, fazer commit, enviar a branch ao remoto, abrir Pull Request para `main`, fazer merge do PR e confirmar que a `main` remota contém a entrega. Nunca faça commit ou push direto na `main`.

Leia primeiro `../CLAUDE.md` e depois `CLAUDE.md` deste repositório.
Leia também [`SECURITY-SCALABILITY.md`](SECURITY-SCALABILITY.md) antes de qualquer mudança.

Este app é o portal web interno da equipe de gestão OnlyFit. Ele consome o mesmo Supabase de produção via chave `anon` e respeita RLS/RPCs de staff. Nunca coloque `service_role` ou segredo no cliente.

Se o pedido incluir PR, merge ou deploy, siga o fluxo obrigatório do workspace: branch a partir da `main`, commit, push, PR para `main` e merge do PR. Nunca commite direto na `main`.

Migrations e Edge Functions pertencem ao `onlyfit-supabase` e são implantadas pelo GitHub Actions daquele repositório. Não execute deploy de backend a partir deste app.

## Fluxo obrigatório do Trello

> **Identificação do desenvolvedor.** Antes de aplicar este fluxo, procure
> `.claude/DANIEL.md` a partir do workspace. Se o arquivo existir, o
> desenvolvedor é Daniel e não é necessário haver card no Trello. Se não
> existir, o desenvolvedor é Matheus e todas as regras deste fluxo são
> obrigatórias.

- A fonte das tarefas é o quadro Onlyfit: https://trello.com/b/INcLFTEw/onlyfit.
- Só desenvolva cards que já estejam em `Implementar (Baico, Dani)`; leia descrição, comentários, checklists, anexos e ajustes antes de editar.
- Antes de qualquer alteração, abra `Membros` no card e adicione `matheus martins` (`matheusmartins42`, ARI `ari:cloud:trello::user/6a90ed725beaa073d9bdadc2`), confirmando que ele aparece como membro do cartão. Não use etiqueta com nome nem apenas uma menção. Se a integração não permitir atribuir, pare e informe; não pule a etapa.
- Priorize a etiqueta `PRIORIDADE`; mantenha o card em Implementar durante o trabalho. Ao concluir e testar, comente o resumo técnico e os testes e mova para `Validar (Nã, Deni)`, nunca diretamente para Pronto.

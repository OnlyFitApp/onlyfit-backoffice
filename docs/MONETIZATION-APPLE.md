# Monetização e compra no iPhone

Mapa conferido no catálogo de produção e nas jornadas em 18/09/2026.
Domínio proprietário: Comercial. O backoffice opera o contrato existente;
não define preços, prazos ou acesso por conta própria.

| Tipo ativo no backoffice | Cobrança atual do tipo | Tratamento |
| --- | --- | --- |
| Clube (`premium_content`) | Mensal | Assinatura Apple renovável, com produto/grupo próprios por oferta. |
| Consultoria (`health_consultancy`) | Mensal | Fora da automação StoreKit atual. Depende do serviço efetivamente prestado; não classificar como conteúdo digital só por ser mensal. |
| Treino avulso (`standalone_workout`) | Única | Compra não consumível; jornada J16 determina aquisição permanente na biblioteca. |
| Dieta avulsa (`standalone_diet`) | Única | Compra não consumível; jornada J16 determina aquisição permanente na biblioteca. |
| Produtos (`physical_products`) | Única por item | Pagamento de produto físico, sem StoreKit. Preço, estoque e frete pertencem ao item. |
| Cursos (`courses`) | Única | Não consumível se sem expiração; assinatura não renovável se houver acesso com prazo configurado. A preparação do catálogo não ativa a entrega/checkout da Área de membros. |

Comunidade, Desafios e Benefício da plataforma estão desativados na taxonomia
consultada. Este trabalho não os ativa. A decisão de comunidades gratuitas ou
pagas existe, mas não equivale à implantação de todos os seus fluxos.

## Regras preservadas

- Nome público continua o escolhido pelo profissional; o slug identifica a categoria.
- Produto Apple identifica uma oferta, não apenas uma faixa de preço.
- Cobrança zero de oferta digital não cria produto pago na Apple. Para produto
  físico, preço zero da oferta-contêiner não significa que item/frete são grátis.
- O backend fornece o preço cheio `ios_price`, sem descontar as taxas novamente
  e sem arredondar silenciosamente para outro preço da Apple.
- Curso com prazo exige dias válidos. A classificação exibida não concede acesso:
  o servidor verifica transação, comprador, oferta, duração, revogação e ambiente.
- Uma compra Sandbox não gera receita, saldo nem repasse real.
- O recorte TestFlight autorizado atualmente é o Clube. Não afirmar que teste
  de treino/dieta/curso está liberado apenas porque o catálogo os suporta.

## Operação existente, preparada sem publicar ofertas

Ofertas → Apple → dados reais de revisão → configurar e enviar. A automação
cria/reutiliza o produto exclusivo, configura preço e metadados, envia para
revisão e sincroniza o resultado. A imagem de perfil não substitui uma captura
real do funcionamento da oferta exigida para revisão.

O primeiro produto **de cada tipo Apple** exige uma versão de app no envio.
Se a build atual está em revisão e não há outra versão elegível, o envio do
novo tipo fica bloqueado com motivo explícito; nunca cancela o envio atual.
Compras seguintes do mesmo tipo já aprovado podem ser enviadas separadamente.
Um rascunho que contenha itens de outra operação não é submetido automaticamente.

## Gates ainda necessários para ativação real

1. Escolher uma oferta real, conteúdo pronto e preço final disponível na Apple.
2. Validar a entrega correspondente (biblioteca/curso), incluindo restauração,
   expiração quando aplicável e reembolso; não basta existir um botão de compra.
3. Capturar a tela real e preencher instruções de revisão.
4. Ter build elegível para o primeiro produto do tipo e obter aprovação Apple.
5. Validar a transação de ponta a ponta com comprador e vendedor corretos no
   backoffice, respeitando o recorte de testes autorizado.

Nenhum preço, comissão, oferta ou compra de produção foi alterado nesta preparação.

Fontes:
- `JOURNEYS.md` do Flutter: J12, J14, J16 (43/50), J29, J34, J35 e decisão 17/09.
- Catálogo `offering_types`, `business_offerings` e mapeamento `app_store_products`.
- https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-in-app-purchase
- https://developer.apple.com/documentation/appstoreconnectapi/migrating-in-app-purchase-metadata-to-v2

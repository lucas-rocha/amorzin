# Amorzin - Documento de Requisitos (PRD)

## 1. Visão geral

Amorzin é um microSaaS que permite ao usuário criar uma página/jogo personalizado no estilo "Flecha do Cupido", com fotos e mensagens próprias, para fazer um pedido de namoro/compromisso ou uma surpresa romântica. O usuário gera uma página com um link único e compartilha com a pessoa que quer conquistar ou surpreender.

## 2. Problema e proposta de valor

Pedidos de namoro/compromisso costumam ser feitos de formas genéricas (mensagens de texto, post em rede social). O Amorzin transforma isso numa experiência interativa e personalizada, fácil de criar (sem precisar programar) e fácil de de compartilhar (um link).

## 3. Público alvo
- Homens que querem fazer um pedido de compromisso para a companheira/companheiro.
- Casais que querem fazer uma surpresa romântica um para o outro.

## 4. Planos e monetização (proposta - ajustar valores conforme validação de mercado)

| Recurso | Básico | Premium
|---|---|---|
| Fotos-alvo (fotos que aparecem a cada acerto) | 5 | 10 |
| Mensagens de acerto personalizadas | 3 personalizadas | Ilimitadas |
| Mensages de erro personalizadas | 3 personalizadas | Ilimitadas|
| Mensagem final personalizada | 2 (padrões do sistema) | Sim |
| Marca d'água "Feito com Momozim" | Sim | Não |
| Link válido por | 24 horas | 1 ano (renovável com o plano) |
| Preço sugerido | 19,90 | 39,90 |

> Observação: como é um caso de uso de "evento único" (o pedido acontece uma vez), pagamento único por página tende a converter melhor que assinatura recorrente. Se quiser manter o modelo de assinatura mensal, o mais comum seria vender como "crie quantas páginas quiser enquanto a assinatura estiver ativa" — vale decidir isso antes de desenhar o banco de dados, pois muda o modelo de dados (ver seção 8).

## 5. Requisitos funcionais (RF)

### Criação e configuração a página
- **RF01** — O usuário pode se cadastrar e fazer login (e-mail/senha ou OAuth).
- **RF02** — O usuário pode criar uma nova página/jogo, escolhendo um slug único (ex: `Amorzin.com/p/joao-e-maria`).
- **RF03** — O usuário pode fazer upload de um número determinado de fotos-alvo, conforme o limite do seu plano.
- **RF04** — O usuário pode escolher/editar as mensagens exibidas quando o jogador **erra** o alvo, dentro do limite do seu plano (usuários do plano Grátis usam mensagens padrão do sistema).
- **RF05** — O usuário pode escolher/editar as mensagens exibidas quando o jogador **acerta** o alvo, dentro do limite do seu plano.
- **RF06** — O usuário pode definir a mensagem final (o "pedido") e o texto do botão de aceite.
- **RF07** — O usuário pode pré-visualizar a página/jogo antes de publicar.
- **RF08** — O sistema valida os limites do plano no momento do upload/cadastro de conteúdo (não permite exceder o limite contratado).

### Gestão da conta e páginas
- **RF09** — O usuário pode ver todas as páginas que criou, em um painel (dashboard).
- **RF10** — O usuário pode editar ou excluir uma página já criada.
- **RF11** — O usuário pode fazer upgrade de plano a qualquer momento (ex: de Grátis para Premium), destravando os limites correspondentes.

### Compartilhamento e experiência do jogador
- **RF12** — Cada página tem uma URL pública única, sem necessidade de login para jogar.
- **RF13** — A página é responsiva e otimizada para celular (principal forma de acesso, já que o link será compartilhado via WhatsApp/redes sociais).
- **RF14** — Ao concluir o jogo, o jogador vê a mensagem final personalizada e o botão de aceite.
- **RF15** — (Opcional/futuro) O criador da página pode ser notificado (e-mail/push) quando a pessoa aceitar o pedido.

### Pagamento
- **RF16** — O sistema integra com um provedor de pagamento (Stripe) para cobrar upgrades de plano ou pagamento único por página.
- **RF17** — O sistema atualiza automaticamente os limites/acessos do usuário após confirmação de pagamento (via webhook).


## 6. Requisitos não funcionais (RNF)
 
- **RNF01 — Performance:** a página pública deve carregar rápido mesmo em conexões móveis mais lentas (otimização de imagens obrigatória, já que fotos de casal tendem a ser pesadas).
- **RNF02 — Responsividade:** o jogo já é desenhado para uso vertical/mobile; a página de criação (painel) também deve funcionar bem em celular.
- **RNF03 — Privacidade e dados sensíveis:** fotos de pessoas são dados pessoais (e possivelmente de terceiros que não criaram a conta). É necessário: política de privacidade clara, opção de exclusão de conta e dados, e cuidado especial por se tratar de fotos de rosto (dado biométrico-adjacente em alguns entendimentos da LGPD).
- **RNF04 — Armazenamento de mídia:** fotos devem ficar em object storage (não no banco de dados), com controle de acesso (evitar que qualquer pessoa possa adivinhar a URL de fotos de outro usuário).
- **RNF05 — Expiração de conteúdo:** páginas do plano Grátis expiram (ver seção 4); é preciso um job periódico para expirar/limpar essas páginas e as fotos associadas.
- **RNF06 — Disponibilidade:** como o link é usado num momento emocionalmente importante (o pedido em si), a página pública precisa ter alta disponibilidade — vale monitoramento e alertas.
- **RNF07 — Moderação de conteúdo:** por ser upload livre de imagens, considerar alguma camada mínima de moderação (mesmo que manual/denúncia no início) para evitar abuso da plataforma.

## 7. Fluxo do usuário (happy path)
 
1. Usuário cria conta.
2. Usuário clica em "Criar novo Amorzin".
3. Usuário escolhe/faz upload das fotos-alvo (limitado pelo plano).
4. Usuário escreve as mensagens de acerto, erro e a mensagem final.
5. Usuário pré-visualiza o jogo.
6. Usuário publica e recebe o link único.
7. Usuário compartilha o link com a pessoa.
8. A pessoa acessa o link, joga, e ao final vê a mensagem/pedido e o botão de aceite.
9. (Opcional) Usuário é notificado do resultado.

## 8. Modelo de dados (conceitual)
 
Entidades principais:
 
- **User** — dados de conta, plano atual, status de assinatura/pagamento.
- **Plan** — nome do plano, limites (nº de fotos, nº de mensagens de acerto/erro, expiração, marca d'água).
- **GamePage** — pertence a um User; contém slug, status (rascunho/publicado), mensagem final, texto do botão, data de expiração.
- **TargetPhoto** — pertence a uma GamePage; URL da foto no object storage, ordem de exibição.
- **HitMessage** — pertence a uma GamePage; texto exibido a cada acerto.
- **MissMessage** — pertence a uma GamePage; texto exibido a cada erro.
- **Payment/Subscription** — histórico de pagamentos, plano contratado, status (ativo/expirado), referência ao Stripe.
> Decisão pendente antes de modelar no Prisma: pagamento único por página vs. assinatura recorrente (ver seção 4) — isso muda se o limite (fotos/mensagens) fica associado ao **User** (assinatura) ou à **GamePage** (plano comprado individualmente por página).
 
## 9. Stack técnica (resumo do que já foi definido)
 
- **Framework:** Next.js (App Router), full-stack — Route Handlers como backend, sem Express separado.
- **Banco de dados:** PostgreSQL + Prisma.
- **Armazenamento de fotos:** Cloudflare R2 (upload via presigned URL).
- **Autenticação:** Auth.js (NextAuth) ou Clerk.
- **Pagamento:** Stripe (Checkout + webhooks).
- **Deploy:** Vercel (ou self-host com Coolify/Dokploy, se preferir manter no ambiente Docker já usado).
## 10. Escopo do MVP
 
**Dentro do MVP:**
- RF01 a RF14, RNF01 a RNF04.
- Um único método de pagamento (Stripe Checkout), plano Grátis + 1 plano pago.
**Fora do MVP (versão 2+):**
- RF15 (notificações), RF16/17 completos com múltiplos planos, RNF07 (moderação automatizada), múltiplos idiomas, temas visuais alternativos ao "Cupido".
## 11. Métricas de sucesso (sugestão)
 
- Nº de páginas criadas / semana.
- Taxa de conversão Grátis → pago.
- Taxa de conclusão do jogo (jogador chega até a mensagem final).
- Taxa de "aceite" (clique no botão final) — funciona como proxy de engajamento emocional do produto.

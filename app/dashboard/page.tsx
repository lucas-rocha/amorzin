// TODO: proteger esta rota com autenticação (Auth.js/Clerk) antes de ir pra produção.
// TODO: listar as GamePage do usuário logado (prisma.gamePage.findMany({ where: { userId } })).
// TODO: formulário de criação (upload de fotos via presigned URL do R2 + mensagens,
//       respeitando os limites de lib/plans.ts).

export default function Dashboard() {
  return (
    <main className="min-h-dvh bg-momozin-bg-deep text-momozin-cream px-6 py-10">
      <h1 className="font-serif text-2xl font-bold mb-2">Seus Momozins</h1>
      <p className="text-momozin-blush text-sm mb-8">
        Painel ainda não conectado ao login nem ao banco — próximo passo do projeto.
      </p>
      <div className="border border-dashed border-white/25 rounded-2xl p-8 text-center text-sm text-white/60">
        Nenhuma página criada ainda.
        <br />
        (Aqui entra o botão "Criar novo Momozin" + formulário de fotos e mensagens.)
      </div>
    </main>
  );
}

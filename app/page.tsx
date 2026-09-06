'use client'

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#FFFCFA] font-sans text-[#35131F]">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <header className="sticky top-0 z-50 border-b border-[#35131F]/[0.06] bg-[#FFFCFA]/90 px-5 py-4 backdrop-blur-md md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="font-serif text-sm font-bold text-[#35131F] transition-opacity hover:opacity-80 md:text-base"
          >
            🏹 Amorzin
          </a>

          {/* Navigation */}
          <nav className="flex items-center gap-4 md:gap-7">
            <a
              href="#como-funciona"
              className="hidden text-xs font-medium text-[#795C66] transition-colors hover:text-[#E6395B] md:inline"
            >
              Como funciona
            </a>

            <a
              href="#planos"
              className="hidden text-xs font-medium text-[#795C66] transition-colors hover:text-[#E6395B] md:inline"
            >
              Planos
            </a>

            <a
              href="#"
              className="text-xs font-semibold text-[#E6395B] transition-colors hover:text-[#C92F4D]"
            >
              Entrar
            </a>
          </nav>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative overflow-hidden border-b border-[#35131F]/[0.05] bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#FFE8EE_0%,#FFF7F8_45%,#FFFCFA_100%)] px-5 py-14 md:px-10 md:py-20">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -left-24 top-16 h-52 w-52 rounded-full bg-[#E6395B]/[0.05] blur-3xl" />

        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#F7B2C2]/[0.10] blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
          {/* =====================================================
              HERO CONTENT
          ====================================================== */}
          <div className="text-center md:text-left">
            {/* Badge */}
            <span className="mb-5 inline-flex items-center rounded-full border border-[#E6395B]/15 bg-white/80 px-3.5 py-1.5 text-[11px] font-medium text-[#E6395B] shadow-sm">
              💘 O pedido que se joga, não só se lê
            </span>

            {/* Title */}
            <h1 className="mx-auto mb-4 max-w-xl font-serif text-[32px] font-bold leading-[1.12] tracking-[-0.02em] text-[#35131F] md:mx-0 md:text-[48px]">
              Transforme seu pedido de namoro em um jogo inesquecível
            </h1>

            {/* Description */}
            <p className="mx-auto mb-7 max-w-lg text-[14px] leading-7 text-[#795C66] md:mx-0 md:text-[15px]">
              Crie um jogo personalizado com suas fotos, mensagens e
              desafios. Mande o link e deixe a pessoa descobrir o pedido
              passo a passo.
            </p>

            {/* Actions */}
            <div className="flex flex-col items-center gap-3 md:flex-row">
              <button
                type="button"
                className="w-full rounded-full bg-[#E6395B] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_25px_rgba(230,57,91,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C92F4D] hover:shadow-[0_12px_32px_rgba(230,57,91,0.28)] active:translate-y-0 md:w-auto"
                onClick={() => router.push('/criar')
                }
              >
                Criar meu Momozin grátis
              </button>

              <a
                href="#como-funciona"
                className="group flex items-center gap-1 text-xs font-semibold text-[#795C66] transition-colors hover:text-[#E6395B]"
              >
                Ver como funciona
                <span className="transition-transform duration-200 group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
            </div>

            {/* Trust points */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10.5px] text-[#795C66]/70 md:justify-start">
              <span>✓ Sem cartão de crédito</span>

              <span className="hidden text-[#35131F]/20 sm:inline">
                •
              </span>

              <span>✓ Pronto em 5 minutos</span>

              <span className="hidden text-[#35131F]/20 sm:inline">
                •
              </span>

              <span>✓ Pagamento único</span>
            </div>
          </div>

          {/* =====================================================
              GAME PREVIEW
          ====================================================== */}
          <div className="relative flex justify-center md:justify-end">
            {/* Glow */}
            <div className="absolute h-[320px] w-[320px] rounded-full bg-[#E6395B]/10 blur-3xl" />

            <div className="relative">
              {/* Floating information card */}
              <div className="absolute -left-16 top-16 z-20 hidden rounded-2xl border border-[#35131F]/[0.06] bg-white px-3 py-2 shadow-[0_10px_35px_rgba(53,19,31,0.10)] sm:block">
                <div className="text-[9px] font-bold text-[#35131F]">
                  Seu jogo
                </div>

                <div className="mt-0.5 text-[8px] text-[#795C66]">
                  feito só para vocês 💘
                </div>
              </div>

              {/* Phone */}
              <div className="w-[190px] sm:w-[210px]">
                <div className="rounded-[31px] bg-[#150109] p-[6px] shadow-[0_30px_80px_rgba(53,19,31,0.28)]">
                  <div className="relative h-[370px] overflow-hidden rounded-[25px] bg-[radial-gradient(120%_60%_at_50%_0%,#55123a_0%,#3d0f2b_45%,#22051a_100%)]">
                    {/* Stars / sky decoration */}
                    <div className="pointer-events-none absolute inset-0">
                      <span className="absolute left-[20%] top-[18%] h-[2px] w-[2px] rounded-full bg-white/50" />

                      <span className="absolute left-[75%] top-[12%] h-[1.5px] w-[1.5px] rounded-full bg-white/40" />

                      <span className="absolute left-[55%] top-[30%] h-[1.5px] w-[1.5px] rounded-full bg-white/35" />

                      <span className="absolute left-[85%] top-[40%] h-[2px] w-[2px] rounded-full bg-white/30" />

                      <span className="absolute left-[32%] top-[42%] h-[1px] w-[1px] rounded-full bg-white/30" />

                      <span className="absolute left-[15%] top-[52%] h-[1px] w-[1px] rounded-full bg-white/20" />
                    </div>

                    {/* HUD */}
                    <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-3.5 pt-3.5">
                      {/* Hits */}
                      <div className="rounded-full border border-[#e8b34e]/50 bg-black/35 px-3 py-1 text-[10px] font-semibold text-[#fbeee0]">
                        💘 1 / 8
                      </div>

                      {/* Errors */}
                      <div className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[9px] text-[#fbeee0]/75">
                        erros: 0
                      </div>
                    </div>

                    {/* Target */}
                    <div className="absolute left-1/2 top-[14%] -translate-x-1/2">
                      <div className="relative h-[125px] w-[125px] rounded-full bg-[conic-gradient(from_0deg,#e8b34e,#f3a8c4,#a9721f,#e8b34e)] p-[5px] shadow-[0_10px_18px_rgba(0,0,0,0.45)]">
                        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-white/85 bg-[radial-gradient(circle_at_35%_30%,#ffd9e6,#f3a8c4_45%,#b8577f_100%)]">
                          <span className="text-[38px]">
                            💞
                          </span>

                          <span className="absolute bottom-1 left-0 right-0 text-center text-[7px] font-semibold text-[#50142d]/60">
                            💗 MOMENTO ESPECIAL
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Caption */}
                    <div className="absolute left-1/2 top-[calc(14%+132px)] w-[80%] -translate-x-1/2 text-center font-serif text-[10px] italic leading-4 text-[#ffd9e6]/80">
                      cada acerto é um pouco mais
                      <br />
                      de você
                    </div>

                    {/* Aim line */}
                    <div className="absolute bottom-[25%] left-1/2 h-[100px] w-px -translate-x-1/2 rotate-[2deg] border-l border-dashed border-[#e8b34e]/30" />

                    {/* Bow glow */}
                    <div className="absolute bottom-[7%] left-1/2 h-20 w-36 -translate-x-1/2 rounded-full bg-[#e8b34e]/10 blur-2xl" />

                    {/* Bow */}
                    <div className="absolute bottom-[7%] left-1/2 h-[90px] w-[105px] -translate-x-1/2">
                      <svg
                        viewBox="0 0 118 100"
                        className="h-full w-full drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]"
                      >
                        <defs>
                          <linearGradient
                            id="landingBowGrad"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop
                              offset="0%"
                              stopColor="#a9721f"
                            />

                            <stop
                              offset="50%"
                              stopColor="#f3d38a"
                            />

                            <stop
                              offset="100%"
                              stopColor="#a9721f"
                            />
                          </linearGradient>
                        </defs>

                        <path
                          d="M0 65 Q59 83 118 65"
                          fill="none"
                          stroke="url(#landingBowGrad)"
                          strokeWidth={6}
                          strokeLinecap="round"
                        />

                        <line
                          x1={2}
                          y1={65}
                          x2={116}
                          y2={65}
                          stroke="#e9dcc9"
                          strokeWidth={1.6}
                        />

                        <line
                          x1={59}
                          y1={63}
                          x2={59}
                          y2={26}
                          stroke="#c99a4e"
                          strokeWidth={3}
                          strokeLinecap="round"
                        />

                        <path
                          d="M59 20 L50 34 L68 34 Z"
                          fill="#f3d38a"
                          stroke="#a9721f"
                          strokeWidth={0.6}
                        />
                      </svg>
                    </div>

                    {/* Arrow indicator */}
                    <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 translate-y-6 text-[#f3d38a]">
                      ▼
                    </div>

                    {/* Instruction */}
                    <div className="absolute bottom-3 left-0 right-0 text-center text-[7px] text-[#fbeee0]/35">
                      arraste para mirar
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating heart */}
              <div className="absolute -bottom-3 -right-8 flex h-11 w-11 rotate-6 items-center justify-center rounded-2xl border border-[#E6395B]/10 bg-white text-lg shadow-[0_10px_30px_rgba(53,19,31,0.12)]">
                💗
              </div>

              {/* Floating message */}
              <div className="absolute -right-14 top-28 hidden rotate-3 rounded-2xl border border-[#35131F]/[0.06] bg-white px-3 py-2 shadow-[0_10px_35px_rgba(53,19,31,0.10)] sm:block">
                <div className="text-[8px] text-[#795C66]">
                  quase lá...
                </div>

                <div className="mt-0.5 text-[9px] font-bold text-[#E6395B]">
                  💘 5 acertos
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          COMO FUNCIONA
      ========================================================== */}
      <section
        id="como-funciona"
        className="px-5 py-14 md:px-10 md:py-20"
      >
        <div className="mx-auto max-w-6xl">
          {/* Section heading */}
          <div className="mx-auto mb-10 max-w-xl text-center md:mb-12">
            <div className="mb-2 text-[10px] font-bold tracking-[0.15em] text-[#E6395B]">
              COMO FUNCIONA
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#35131F] md:text-3xl">
              Você cria. A outra pessoa joga.
            </h2>

            <p className="mt-2 text-xs leading-6 text-[#795C66] md:text-sm">
              Transforme seu pedido em uma pequena aventura feita só
              para vocês.
            </p>
          </div>

          {/* Steps */}
          <div className="grid gap-3 md:grid-cols-3 md:gap-5">
            {[
              {
                number: "01",
                icon: "📷",
                title: "Adicione suas fotos",
                desc: "Escolha os momentos que contam a história de vocês.",
              },
              {
                number: "02",
                icon: "💬",
                title: "Escreva suas mensagens",
                desc: "Crie desafios, pistas e a mensagem do pedido final.",
              },
              {
                number: "03",
                icon: "🔗",
                title: "Envie o link",
                desc: "Mande pelo WhatsApp e acompanhe a resposta em tempo real.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-[#35131F]/[0.07] bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#E6395B]/20 hover:shadow-[0_15px_40px_rgba(53,19,31,0.07)] md:p-6"
              >
                {/* Number + icon */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFE8EE] text-lg transition-transform duration-200 group-hover:scale-105">
                    {step.icon}
                  </div>

                  <span className="font-serif text-xs font-bold text-[#E6395B]/30">
                    {step.number}
                  </span>
                </div>

                {/* Title */}
                <div className="mb-1 text-sm font-bold text-[#35131F]">
                  {step.title}
                </div>

                {/* Description */}
                <div className="text-xs leading-6 text-[#795C66]">
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          BENEFITS / PRODUCT
      ========================================================== */}
      <section className="bg-white px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
          {/* Visual */}
          <div className="order-2 flex justify-center md:order-1">
            <div className="relative w-full max-w-md">
              {/* Main card */}
              <div className="rounded-3xl border border-[#35131F]/[0.07] bg-[#FFF5F7] p-6 shadow-[0_20px_60px_rgba(53,19,31,0.07)] md:p-8">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#E6395B]">
                      Seu Momozin
                    </div>

                    <div className="mt-1 font-serif text-lg font-bold text-[#35131F]">
                      Uma experiência só de vocês
                    </div>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    💌
                  </div>
                </div>

                {/* Photo grid */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square rounded-xl bg-[radial-gradient(circle_at_35%_30%,#ffd9e6,#f3a8c4_45%,#b8577f_100%)] flex items-center justify-center text-2xl">
                    🥰
                  </div>

                  <div className="aspect-square rounded-xl bg-[radial-gradient(circle_at_35%_30%,#ffd9e6,#f3a8c4_45%,#b8577f_100%)] flex items-center justify-center text-2xl">
                    💞
                  </div>

                  <div className="aspect-square rounded-xl bg-[radial-gradient(circle_at_35%_30%,#ffd9e6,#f3a8c4_45%,#b8577f_100%)] flex items-center justify-center text-2xl">
                    💗
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-5 rounded-2xl border border-white bg-white p-4">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-[#35131F]">
                      Progresso
                    </span>

                    <span className="font-semibold text-[#E6395B]">
                      5 / 8
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#FFE8EE]">
                    <div className="h-full w-[62%] rounded-full bg-[#E6395B]" />
                  </div>
                </div>
              </div>

              {/* Decoration */}
              <div className="absolute -bottom-5 -right-4 flex h-14 w-14 rotate-6 items-center justify-center rounded-2xl border border-[#35131F]/[0.06] bg-white text-2xl shadow-[0_12px_30px_rgba(53,19,31,0.10)]">
                🏹
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 md:order-2">
            <div className="mb-2 text-[10px] font-bold tracking-[0.15em] text-[#E6395B]">
              FEITO PARA SER ESPECIAL
            </div>

            <h2 className="font-serif text-2xl font-bold leading-tight text-[#35131F] md:text-3xl">
              Não é só um pedido.
              <br />
              É uma experiência.
            </h2>

            <p className="mt-4 max-w-lg text-[13px] leading-7 text-[#795C66] md:text-sm">
              O Momozin transforma aquele momento importante em uma
              experiência interativa. A pessoa joga, relembra momentos e
              chega ao pedido final sem saber exatamente o que está por
              vir.
            </p>

            <div className="mt-6 space-y-3">
              {[
                {
                  icon: "💗",
                  title: "Personalizado",
                  desc: "Fotos e mensagens que contam a história de vocês.",
                },
                {
                  icon: "🏹",
                  title: "Interativo",
                  desc: "A pessoa participa do pedido em vez de apenas ler.",
                },
                {
                  icon: "💌",
                  title: "Compartilhável",
                  desc: "É só enviar o link pelo WhatsApp ou onde quiser.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#FFE8EE] text-sm">
                    {item.icon}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-[#35131F]">
                      {item.title}
                    </div>

                    <div className="mt-0.5 text-[11px] leading-5 text-[#795C66]">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PLANOS
      ========================================================== */}
      <section
        id="planos"
        className="border-y border-[#35131F]/[0.05] bg-[#FFF5F7] px-5 py-14 md:px-10 md:py-20"
      >
        <div className="mx-auto max-w-6xl">
          {/* Heading */}
          <div className="mx-auto mb-9 max-w-xl text-center md:mb-11">
            <div className="mb-2 text-[10px] font-bold tracking-[0.15em] text-[#E6395B]">
              PLANOS
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#35131F] md:text-3xl">
              Comece grátis. Evolua quando quiser.
            </h2>

            <p className="mt-2 text-xs leading-6 text-[#795C66] md:text-sm">
              Escolha a experiência que combina com o seu pedido.
            </p>
          </div>

          {/* Plans */}
          <div className="grid items-start gap-4 md:grid-cols-3 md:gap-5">
            <PlanCard
              title="Grátis"
              price="R$0"
              features={[
                "2 fotos",
                "mensagens padrão",
                "link válido por 7 dias",
              ]}
              note="com marca d'água"
            />

            <PlanCard
              title="Básico"
              price="R$14,90"
              suffix="pagamento único"
              highlighted
              features={[
                "5 fotos",
                "3 mensagens personalizadas",
                "link válido por 90 dias",
                "sem marca d'água",
              ]}
            />

            <PlanCard
              title="Premium"
              price="R$29,90"
              suffix="pagamento único"
              features={[
                "10 fotos",
                "mensagens ilimitadas",
                "link sem expirar",
                "sem marca d'água",
              ]}
            />
          </div>

          <p className="mt-7 text-center text-[10px] text-[#795C66]/60">
            Pagamento único. Sem mensalidade.
          </p>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================== */}
      <section className="relative overflow-hidden px-5 py-16 text-center md:px-10 md:py-24">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E6395B]/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-xl">
          <div className="mb-3 text-2xl">
            💌
          </div>

          <h2 className="font-serif text-2xl font-bold leading-tight text-[#35131F] md:text-3xl">
            Transforme seu pedido em uma história.
          </h2>

          <p className="mx-auto mt-3 max-w-md text-[13px] leading-6 text-[#795C66] md:text-sm">
            Leva menos de 5 minutos para criar uma experiência que a
            outra pessoa não vai esquecer.
          </p>

          <button
            type="button"
            className="mt-6 rounded-full bg-[#E6395B] px-8 py-3.5 text-[13px] font-bold text-white shadow-[0_8px_25px_rgba(230,57,91,0.20)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C92F4D] hover:shadow-[0_12px_32px_rgba(230,57,91,0.28)] active:translate-y-0"
          >
            Criar meu Momozin
          </button>

          <div className="mt-3 text-[10px] text-[#795C66]/60">
            Grátis para começar · sem cartão de crédito
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================== */}
      <footer className="border-t border-[#35131F]/[0.06] bg-white px-5 py-5 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 md:flex-row">
          <div className="font-serif text-xs font-bold text-[#35131F]">
            🏹 Momozin
          </div>

          <div className="text-center text-[10px] text-[#795C66]/60">
            Feito com ❤️ para histórias que merecem ser lembradas.
          </div>

          <div className="text-[10px] text-[#795C66]/50">
            © Momozin
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ===============================================================
   PLAN CARD
================================================================ */

interface PlanCardProps {
  title: string;
  price: string;
  suffix?: string;
  features: string[];
  note?: string;
  highlighted?: boolean;
}

function PlanCard({
  title,
  price,
  suffix,
  features,
  note,
  highlighted,
}: PlanCardProps) {
  return (
    <div
      className={`relative w-full rounded-2xl p-5 transition-all duration-200 md:p-6 ${
        highlighted
          ? "border-2 border-[#E6395B] bg-white shadow-[0_15px_45px_rgba(230,57,91,0.12)] md:-translate-y-1"
          : "border border-[#35131F]/[0.08] bg-white hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(53,19,31,0.06)]"
      }`}
    >
      {/* Recommended badge */}
      {highlighted && (
        <span className="absolute -top-3 left-5 rounded-full bg-[#E6395B] px-3 py-1 text-[9px] font-bold tracking-wide text-white shadow-sm">
          MAIS ESCOLHIDO
        </span>
      )}

      {/* Header */}
      <div className="mb-1 flex items-center justify-between">
        <div className="text-xs font-bold text-[#35131F]">
          {title}
        </div>

        {highlighted && (
          <span className="text-sm">
            💗
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mb-4">
        <span className="text-2xl font-bold tracking-tight text-[#35131F] md:text-3xl">
          {price}
        </span>

        {suffix && (
          <span className="ml-1 text-[10px] text-[#795C66]">
            {suffix}
          </span>
        )}
      </div>

      {/* Features */}
      <div
        className={`space-y-2 text-[11px] leading-relaxed md:text-xs ${
          highlighted
            ? "text-[#35131F]/80"
            : "text-[#795C66]"
        }`}
      >
        {features.map((feature) => (
          <div
            key={feature}
            className="flex items-start gap-2"
          >
            <span
              className={`mt-px flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                highlighted
                  ? "bg-[#FFE8EE] text-[#E6395B]"
                  : "bg-[#35131F]/[0.05] text-[#795C66]"
              }`}
            >
              ✓
            </span>

            <span>{feature}</span>
          </div>
        ))}

        {note && (
          <div className="flex items-start gap-2 pt-1 text-[#795C66]/70">
            <span className="mt-px flex h-4 w-4 flex-shrink-0 items-center justify-center text-[9px]">
              ·
            </span>

            <span>{note}</span>
          </div>
        )}
      </div>

      {/* CTA only on recommended plan */}
      {highlighted && (
        <button
          type="button"
          className="mt-5 w-full rounded-full bg-[#E6395B] py-2.5 text-[11px] font-bold text-white transition-colors hover:bg-[#C92F4D]"
        >
          Escolher Básico
        </button>
      )}
    </div>
  );
}
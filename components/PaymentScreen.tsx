import { Amorzin } from "@/app/p/[slug]/AmorzinSlugClient";
import { ArrowLeft, CheckCircle2, Share2 } from "lucide-react"

interface PaymentScreenProps {
  Amorzin: Amorzin
  onBack: () => void
}

export default function PaymentScreen({
  Amorzin,
  onBack,
}: PaymentScreenProps) {
  async function handlePay() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gamePageId: Amorzin.id, plan: Amorzin.plan }),
    });
    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <main className="min-h-screen bg-[#FFFCFA] px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-md items-center justify-center">
        <div className="w-full rounded-[28px] border border-[#35131F]/10 bg-white p-6 shadow-[0_20px_60px_rgba(53,19,31,0.08)] sm:p-8">

          <button
            type="button"
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-sm font-medium text-[#8F747C] transition hover:text-[#E6395B]"
          >
            <ArrowLeft size={16} />

            Voltar
          </button>

          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFE8EE]">
              <CheckCircle2
                size={32}
                className="text-[#E6395B]"
              />
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E6395B]">
              Seu Amorzin está pronto
            </p>

            <h1 className="mt-2 font-serif text-2xl font-bold text-[#35131F]">
              Agora é só compartilhar 💗
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#8F747C]">
              Para liberar o compartilhamento do seu Amorzin,
              finalize o pagamento.
            </p>
          </div>

          <div className="mt-7 rounded-2xl bg-[#FFF5F7] p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8F747C]">
                Amorzin
              </span>

              <span className="text-sm font-bold text-[#35131F]">
                {Amorzin.loverName}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#E6395B] text-sm font-bold text-white shadow-[0_8px_24px_rgba(230,57,91,0.22)] transition hover:bg-[#D62F50] active:scale-[0.98]"
            onClick={() => handlePay()}
          >
            <Share2 size={17} />

            Liberar e compartilhar
          </button>

          <p className="mt-4 text-center text-[11px] leading-5 text-[#A1888F]">
            Pagamento seguro. Depois da confirmação,
            você receberá o link para compartilhar.
          </p>
        </div>
      </div>
    </main>
  )
}
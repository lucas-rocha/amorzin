// app/compartilhar/[slug]/CompartilharClient.tsx
"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, Mail, MessageCircle } from "lucide-react";

const MAX_RETRIES = 6;
const RETRY_DELAY_MS = 1500;

interface StatusData {
  status: "DRAFT" | "PUBLISHED" | "EXPIRED";
  payerEmail: string | null;
}

export default function CompartilharClient({ slug }: { slug: string }) {
  const [data, setData] = useState<StatusData | null>(null);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  const link = typeof window !== "undefined" ? `${window.location.origin}/p/${slug}` : "";

  useEffect(() => {
    let cancelled = false;

    async function check(attempt: number) {
      try {
        const res = await fetch(`/api/game-pages/${slug}/status`);
        const json: StatusData = await res.json();

        if (cancelled) return;

        if (json.status === "PUBLISHED") {
          setData(json);
          return;
        }

        if (attempt < MAX_RETRIES) {
          setTimeout(() => check(attempt + 1), RETRY_DELAY_MS);
        } else {
          setFailed(true);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    }

    check(0);
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (failed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFFCFA] px-4">
        <p className="max-w-sm text-center text-sm text-[#35131F]">
          Seu pagamento foi confirmado, mas estamos demorando um pouco pra liberar o link. Atualize
          esta página em alguns instantes.
        </p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFFCFA]">
        <p className="text-sm text-[#35131F]">Confirmando seu pagamento...</p>
      </main>
    );
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`Preparei uma surpresa pra você 💛 ${link}`)}`;

  return (
    <main className="min-h-screen bg-[#FFFCFA] px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-md items-center justify-center">
        <div className="w-full rounded-[28px] border border-[#35131F]/10 bg-white p-6 text-center shadow-[0_20px_60px_rgba(53,19,31,0.08)] sm:p-8">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFE8EE]">
            <Check size={28} className="text-[#E6395B]" />
          </div>

          <h1 className="font-serif text-2xl font-bold text-[#35131F]">Prontinho! 💛</h1>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#8F747C]">
            Seu Amorzin está no ar. Também mandamos esse link
            {data.payerEmail && (
              <>
                {" "}
                para <strong className="text-[#35131F]">{data.payerEmail}</strong>
              </>
            )}
            , caso queira guardar.
          </p>

          <div className="mt-6 flex justify-center">
            <div className="rounded-2xl border border-[#E8DADD] bg-white p-4">
              <QRCodeSVG value={link} size={160} bgColor="#FFFFFF" fgColor="#35131F" />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#E8DADD] bg-[#FFFDFC] p-2">
            <span className="flex-1 truncate px-2 text-left text-xs text-[#35131F]">{link}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFE8EE] text-[#E6395B] transition hover:bg-[#FFD8E3]"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-2.5">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-bold text-white transition hover:brightness-95 active:scale-[0.98]"
            >
              <MessageCircle size={17} />
              Enviar pelo WhatsApp
            </a>

            {data.payerEmail && (
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#A1888F]">
                <Mail size={13} />
                Confirmação também enviada por e-mail
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
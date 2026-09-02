// app/checkout/[id]/page.tsx
"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function CheckoutRedirect() {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gamePageId: id, plan: "PREMIUM" }),
    })
      .then((res) => res.json())
      .then(({ url }) => {
        window.location.href = url;
      });
  }, [id]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFFCFA]">
      <p className="text-sm text-[#8F747C]">Preparando seu pagamento...</p>
    </main>
  );
}
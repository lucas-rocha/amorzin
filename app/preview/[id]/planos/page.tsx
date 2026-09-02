// app/preview/[id]/planos/page.tsx
import PlanosClient from "./PlanosClient";

export default async function PlanosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PlanosClient gamePageId={id} />;
}
// app/compartilhar/[slug]/page.tsx
import CompartilharClient from "./CompartilharClient";

export default async function CompartilharPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CompartilharClient slug={slug} />;
}
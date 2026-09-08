// lib/slug.ts
export function generateSlug(name: string): string {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${normalized || "meu-Amorzin"}-${Math.random().toString(36).substring(2, 7)}`;
}
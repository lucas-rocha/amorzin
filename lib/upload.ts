export async function uploadImageToR2(file: File): Promise<string> {
  const presignRes = await fetch("/api/upload/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileType: file.type, fileSize: file.size }),
  });

  if (!presignRes.ok) {
    const { error } = await presignRes.json();
    throw new Error(error ?? "Falha ao preparar upload");
  }

  const { uploadUrl, publicUrl } = await presignRes.json();

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadRes.ok) throw new Error("Falha ao enviar a imagem");

  return publicUrl;
}
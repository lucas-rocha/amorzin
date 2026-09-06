import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { r2 } from "./r2";
import { prisma } from "./prisma";

function extractR2Key(url: string): string | null {
  const prefix = `${process.env.R2_PUBLIC_URL}/`;
  if (!url.startsWith(prefix)) return null;
  return url.slice(prefix.length);
}

/**
 * Apaga as fotos de um GamePage no R2 e remove os registros TargetPhoto do banco.
 * Não mexe no GamePage em si — quem chama decide o que fazer com ele depois
 * (marcar EXPIRED, deletar de vez, etc.).
 */
export async function deleteGamePhotos(gamePageId: string): Promise<{ deleted: number }> {
  const photos = await prisma.targetPhoto.findMany({ where: { gamePageId } });
  const keys = photos.map((p) => extractR2Key(p.url)).filter((k): k is string => !!k);

  if (keys.length > 0) {
    await r2.send(
      new DeleteObjectsCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Delete: { Objects: keys.map((Key) => ({ Key })) },
      })
    );
  }

  await prisma.targetPhoto.deleteMany({ where: { gamePageId } });

  return { deleted: keys.length };
}
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { r2 } from "@/lib/r2";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 8;

export async function POST(req: NextRequest) {
  try {
    const { fileType, fileSize } = (await req.json()) as { fileType: string; fileSize: number };

    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json({ error: "Formato não permitido (use JPG, PNG, WEBP ou GIF)" }, { status: 400 });
    }
    if (fileSize > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json({ error: `Arquivo maior que ${MAX_SIZE_MB}MB` }, { status: 400 });
    }

    const ext = fileType.split("/")[1];
    const key = `amorzin/${randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 }); // 5 min pra completar o upload
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (err) {
    console.error("Erro ao gerar URL de upload:", err);
    return NextResponse.json({ error: "Não foi possível preparar o upload" }, { status: 500 });
  }
}
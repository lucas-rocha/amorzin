// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: "E-mail e senha (mín. 8 caracteres) são obrigatórios" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Já existe uma conta com esse e-mail" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });

  return NextResponse.json({ id: user.id, email: user.email });
}
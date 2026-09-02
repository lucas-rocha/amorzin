-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE', 'BASIC', 'PREMIUM');

-- CreateEnum
CREATE TYPE "PageStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'EXPIRED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamePage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "PageStatus" NOT NULL DEFAULT 'DRAFT',
    "plan" "PlanType" NOT NULL DEFAULT 'FREE',
    "requiredHits" INTEGER NOT NULL DEFAULT 8,
    "finalQuestion" TEXT NOT NULL DEFAULT 'Quer namorar comigo?',
    "finalSub" TEXT NOT NULL DEFAULT 'Você é meu amor 💛',
    "acceptedTitle" TEXT NOT NULL DEFAULT 'Combinado! 💛',
    "acceptedSub" TEXT NOT NULL DEFAULT 'Prometo fazer você feliz todos os dias.',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GamePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TargetPhoto" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "gamePageId" TEXT NOT NULL,

    CONSTRAINT "TargetPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HitMessage" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "gamePageId" TEXT NOT NULL,

    CONSTRAINT "HitMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissMessage" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "gamePageId" TEXT NOT NULL,

    CONSTRAINT "MissMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'brl',
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "gamePageId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GamePage_slug_key" ON "GamePage"("slug");

-- CreateIndex
CREATE INDEX "GamePage_userId_idx" ON "GamePage"("userId");

-- CreateIndex
CREATE INDEX "TargetPhoto_gamePageId_idx" ON "TargetPhoto"("gamePageId");

-- CreateIndex
CREATE INDEX "HitMessage_gamePageId_idx" ON "HitMessage"("gamePageId");

-- CreateIndex
CREATE INDEX "MissMessage_gamePageId_idx" ON "MissMessage"("gamePageId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripeSessionId_key" ON "Payment"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_gamePageId_key" ON "Payment"("gamePageId");

-- AddForeignKey
ALTER TABLE "GamePage" ADD CONSTRAINT "GamePage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TargetPhoto" ADD CONSTRAINT "TargetPhoto_gamePageId_fkey" FOREIGN KEY ("gamePageId") REFERENCES "GamePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HitMessage" ADD CONSTRAINT "HitMessage_gamePageId_fkey" FOREIGN KEY ("gamePageId") REFERENCES "GamePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissMessage" ADD CONSTRAINT "MissMessage_gamePageId_fkey" FOREIGN KEY ("gamePageId") REFERENCES "GamePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_gamePageId_fkey" FOREIGN KEY ("gamePageId") REFERENCES "GamePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('PAGE_UNLOCK', 'PREMIUM_ACCOUNT');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "type" "PaymentType" NOT NULL DEFAULT 'PAGE_UNLOCK';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isPremiumMember" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "premiumSince" TIMESTAMP(3);

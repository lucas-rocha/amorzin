/*
  Warnings:

  - The values [FREE,BASIC] on the enum `PlanType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `payerEmail` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlanType_new" AS ENUM ('BASICO', 'SUPER', 'PREMIUM');
ALTER TABLE "public"."GamePage" ALTER COLUMN "plan" DROP DEFAULT;
ALTER TABLE "GamePage" ALTER COLUMN "plan" TYPE "PlanType_new" USING ("plan"::text::"PlanType_new");
ALTER TYPE "PlanType" RENAME TO "PlanType_old";
ALTER TYPE "PlanType_new" RENAME TO "PlanType";
DROP TYPE "public"."PlanType_old";
ALTER TABLE "GamePage" ALTER COLUMN "plan" SET DEFAULT 'BASICO';
COMMIT;

-- AlterTable
ALTER TABLE "GamePage" ALTER COLUMN "plan" SET DEFAULT 'BASICO',
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "payerEmail" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

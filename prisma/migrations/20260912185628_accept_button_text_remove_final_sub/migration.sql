/*
  Warnings:

  - You are about to drop the column `acceptedSub` on the `GamePage` table. All the data in the column will be lost.
  - You are about to drop the column `acceptedTitle` on the `GamePage` table. All the data in the column will be lost.
  - You are about to drop the column `finalSub` on the `GamePage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GamePage" DROP COLUMN "acceptedSub",
DROP COLUMN "acceptedTitle",
DROP COLUMN "finalSub";

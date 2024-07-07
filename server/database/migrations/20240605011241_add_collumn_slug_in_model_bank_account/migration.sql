/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `bank_accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `bank_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bank_accounts" ADD COLUMN     "slug" VARCHAR(45) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_slug_key" ON "bank_accounts"("slug");

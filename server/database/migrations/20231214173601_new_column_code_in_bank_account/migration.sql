/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `bank_account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `bank_account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bank_account" ADD COLUMN     "code" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bank_account_code_key" ON "bank_account"("code");

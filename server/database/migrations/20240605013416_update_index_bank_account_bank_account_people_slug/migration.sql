/*
  Warnings:

  - A unique constraint covering the columns `[people_id,slug]` on the table `bank_accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "bank_accounts_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "bank_account_people_slug" ON "bank_accounts"("people_id", "slug");

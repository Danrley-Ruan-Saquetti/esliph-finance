/*
  Warnings:

  - You are about to drop the column `user_id` on the `bank_account` table. All the data in the column will be lost.
  - Added the required column `bank_account_id` to the `bank_account` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bank_account" DROP CONSTRAINT "bank_account_user_id_fkey";

-- AlterTable
ALTER TABLE "bank_account" DROP COLUMN "user_id",
ADD COLUMN     "bank_account_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "bank_account" ADD CONSTRAINT "bank_account_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

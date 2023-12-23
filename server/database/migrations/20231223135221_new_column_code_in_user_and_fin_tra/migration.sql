/*
  Warnings:

  - You are about to drop the column `password_master` on the `bank_account` table. All the data in the column will be lost.
  - The `type_occurrence` column on the `financial_transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[code]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `bank_account` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "financial_transaction_type_occurrence" AS ENUM ('SINGLE', 'PROGRAMMATIC');

-- AlterTable
ALTER TABLE "bank_account" DROP COLUMN "password_master",
ADD COLUMN     "password" VARCHAR(120) NOT NULL,
ALTER COLUMN "code" SET DEFAULT '',
ALTER COLUMN "code" SET DATA TYPE VARCHAR(15);

-- AlterTable
ALTER TABLE "financial_transaction" DROP COLUMN "type_occurrence",
ADD COLUMN     "type_occurrence" "financial_transaction_type_occurrence" NOT NULL DEFAULT 'SINGLE';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "code" VARCHAR(9) NOT NULL DEFAULT '';

-- DropEnum
DROP TYPE "financial_transaction_occurrence";

-- CreateIndex
CREATE UNIQUE INDEX "user_code_key" ON "user"("code");

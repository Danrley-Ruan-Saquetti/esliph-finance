-- CreateEnum
CREATE TYPE "financial_transaction_frequency" AS ENUM ('NULL', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMIANNUALLY', 'ANNUALLY');

-- AlterTable
ALTER TABLE "financial_transaction" ADD COLUMN     "frequency" "financial_transaction_frequency" NOT NULL DEFAULT 'NULL';

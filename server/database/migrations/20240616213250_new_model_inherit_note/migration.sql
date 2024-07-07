/*
  Warnings:

  - You are about to drop the column `created_at` on the `emails` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `financial_transaction_notes` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `financial_transaction_notes` table. All the data in the column will be lost.
  - You are about to drop the `log_change` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `log_error` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_financial_transaction_id_fkey";

-- AlterTable
ALTER TABLE "emails" DROP COLUMN "created_at";

-- AlterTable
ALTER TABLE "financial_transaction_notes" DROP COLUMN "created_at",
DROP COLUMN "description";

-- DropTable
DROP TABLE "log_change";

-- DropTable
DROP TABLE "log_error";

-- DropTable
DROP TABLE "payment";

-- CreateTable
CREATE TABLE "notes" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "financial_transaction_id" INTEGER NOT NULL,
    "value_paid" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "increase" INTEGER NOT NULL DEFAULT 0,
    "observation" TEXT NOT NULL DEFAULT '',
    "paid_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "errors_log" (
    "id" SERIAL NOT NULL,
    "operation" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "stack" TEXT NOT NULL DEFAULT '',
    "causes" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "date_time" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "errors_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "changes_log" (
    "id" SERIAL NOT NULL,
    "record_id" INTEGER NOT NULL,
    "entity" TEXT NOT NULL,
    "data" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "date_time" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "changes_log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "financial_transaction_notes" ADD CONSTRAINT "financial_transaction_notes_id_fkey" FOREIGN KEY ("id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_financial_transaction_id_fkey" FOREIGN KEY ("financial_transaction_id") REFERENCES "financial_transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

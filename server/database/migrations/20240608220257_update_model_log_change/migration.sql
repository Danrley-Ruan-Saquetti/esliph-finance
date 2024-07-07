/*
  Warnings:

  - You are about to drop the `log_history` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "observation" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "log_history";

-- DropEnum
DROP TYPE "log_type";

-- CreateTable
CREATE TABLE "log_change" (
    "id" SERIAL NOT NULL,
    "record_id" INTEGER NOT NULL,
    "entity" TEXT NOT NULL,
    "data" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "date_time" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_change_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "financial_transaction" ADD COLUMN     "date_time_competence" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "email" SET DATA TYPE VARCHAR(254);

-- AlterTable
ALTER TABLE "bank_account" ALTER COLUMN "password_master" SET DATA TYPE VARCHAR(120);

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "password" SET DATA TYPE VARCHAR(120);

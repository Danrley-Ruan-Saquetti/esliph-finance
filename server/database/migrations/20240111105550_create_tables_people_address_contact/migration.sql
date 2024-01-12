/*
  Warnings:

  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[login]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `login` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peopleId` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "contect_type" AS ENUM ('EMAIL', 'PHONE', 'TELEPHONE');

-- CreateEnum
CREATE TYPE "address_type" AS ENUM ('COMMERCIAL', 'RESIDENTIAL');

-- CreateEnum
CREATE TYPE "people_type" AS ENUM ('NATURAL_PERSON', 'LEGAL_ENTITY');

-- CreateEnum
CREATE TYPE "people_gender" AS ENUM ('MASCULINE', 'FEMININE');

-- CreateEnum
CREATE TYPE "user_type" AS ENUM ('CUSTOMER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "financial_transaction_category" DROP CONSTRAINT "financial_transaction_category_category_id_fkey";

-- DropForeignKey
ALTER TABLE "financial_transaction_category" DROP CONSTRAINT "financial_transaction_category_financial_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "mail" DROP CONSTRAINT "mail_notification_id_fkey";

-- DropForeignKey
ALTER TABLE "note" DROP CONSTRAINT "note_financial_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_financial_transaction_id_fkey";

-- DropIndex
DROP INDEX "user_email_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "login" VARCHAR(254) NOT NULL,
ADD COLUMN     "peopleId" INTEGER NOT NULL,
ADD COLUMN     "type" "user_type" NOT NULL;

-- CreateTable
CREATE TABLE "contact" (
    "id" SERIAL NOT NULL,
    "people_id" INTEGER NOT NULL,
    "type" "contect_type" NOT NULL,
    "contact" VARCHAR(254) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" SERIAL NOT NULL,
    "people_id" INTEGER NOT NULL,
    "type" "address_type" NOT NULL DEFAULT 'RESIDENTIAL',
    "street" VARCHAR(60) NOT NULL,
    "number" VARCHAR(9) NOT NULL,
    "neighborhood" VARCHAR(56) NOT NULL,
    "city" VARCHAR(60) NOT NULL,
    "state" VARCHAR(60) NOT NULL,
    "zip_code" VARCHAR(9) NOT NULL,
    "complement" TEXT NOT NULL DEFAULT '',
    "reference" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people" (
    "id" SERIAL NOT NULL,
    "type" "people_type" NOT NULL DEFAULT 'NATURAL_PERSON',
    "itin_cnpj" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "gender" "people_gender",
    "date_of_birth" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "people_itin_cnpj_key" ON "people"("itin_cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "user_login_key" ON "user"("login");

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_people_id_fkey" FOREIGN KEY ("people_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_people_id_fkey" FOREIGN KEY ("people_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_peopleId_fkey" FOREIGN KEY ("peopleId") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mail" ADD CONSTRAINT "mail_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transaction_category" ADD CONSTRAINT "financial_transaction_category_financial_transaction_id_fkey" FOREIGN KEY ("financial_transaction_id") REFERENCES "financial_transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transaction_category" ADD CONSTRAINT "financial_transaction_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_financial_transaction_id_fkey" FOREIGN KEY ("financial_transaction_id") REFERENCES "financial_transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_financial_transaction_id_fkey" FOREIGN KEY ("financial_transaction_id") REFERENCES "financial_transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

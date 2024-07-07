-- CreateEnum
CREATE TYPE "people_type" AS ENUM ('NATURAL_PERSON', 'LEGAL_ENTITY');

-- CreateEnum
CREATE TYPE "people_gender" AS ENUM ('MASCULINE', 'FEMININE');

-- CreateEnum
CREATE TYPE "contect_type" AS ENUM ('EMAIL', 'TELEPHONE');

-- CreateEnum
CREATE TYPE "address_type" AS ENUM ('COMMERCIAL', 'RESIDENTIAL');

-- CreateEnum
CREATE TYPE "user_type" AS ENUM ('CUSTOMER', 'ADMIN');

-- CreateEnum
CREATE TYPE "notification_situation" AS ENUM ('IN_QUEUE', 'ERROR', 'SENT');

-- CreateEnum
CREATE TYPE "notification_type" AS ENUM ('PUSH', 'INTERNAL', 'EMAIL');

-- CreateEnum
CREATE TYPE "financial_transaction_type" AS ENUM ('EXPENSE', 'INCOME');

-- CreateEnum
CREATE TYPE "financial_transaction_frequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMIANNUALLY', 'ANNUALLY');

-- CreateEnum
CREATE TYPE "financial_transaction_type_occurrence" AS ENUM ('SINGLE', 'PROGRAMMATIC');

-- CreateEnum
CREATE TYPE "financial_transaction_situation" AS ENUM ('PENDING', 'PAID_OUT', 'PARTIALLY_PAID', 'RECEIVED', 'PARTIALLY_RECEIVED', 'LATE', 'CANCELED');

-- CreateEnum
CREATE TYPE "log_type" AS ENUM ('HISTORIC', 'ERROR');

-- CreateTable
CREATE TABLE "peoples" (
    "id" SERIAL NOT NULL,
    "type" "people_type" NOT NULL DEFAULT 'NATURAL_PERSON',
    "name" VARCHAR(128) NOT NULL,
    "itin_cnpj" VARCHAR(14) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "gender" "people_gender",
    "date_of_birth" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "peoples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" SERIAL NOT NULL,
    "people_id" INTEGER NOT NULL,
    "type" "contect_type" NOT NULL,
    "contact" VARCHAR(254) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adresses" (
    "id" SERIAL NOT NULL,
    "people_id" INTEGER NOT NULL,
    "type" "address_type" NOT NULL DEFAULT 'RESIDENTIAL',
    "street" VARCHAR(60) NOT NULL,
    "number" VARCHAR(9),
    "neighborhood" VARCHAR(56) NOT NULL,
    "country" VARCHAR(56) NOT NULL,
    "city" VARCHAR(60) NOT NULL,
    "state" VARCHAR(60) NOT NULL,
    "zip_code" VARCHAR(9) NOT NULL,
    "complement" TEXT DEFAULT '',
    "reference" TEXT DEFAULT '',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "peopleId" INTEGER NOT NULL,
    "type" "user_type" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "code" VARCHAR(9) NOT NULL,
    "login" VARCHAR(254) NOT NULL,
    "password" VARCHAR(120) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_accounts" (
    "id" SERIAL NOT NULL,
    "people_id" INTEGER NOT NULL,
    "code" VARCHAR(15) NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "password" VARCHAR(120) NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "bank_account_id" INTEGER,
    "subject" VARCHAR(45) NOT NULL,
    "body" TEXT NOT NULL,
    "type" "notification_type" NOT NULL,
    "situation" "notification_situation" NOT NULL DEFAULT 'IN_QUEUE',
    "send_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emails" (
    "id" SERIAL NOT NULL,
    "recipient" VARCHAR(45) NOT NULL,
    "sender" VARCHAR(45) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "bank_account_id" INTEGER NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "color" VARCHAR(15) NOT NULL,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_transactions" (
    "id" SERIAL NOT NULL,
    "bank_account_id" INTEGER NOT NULL,
    "title" VARCHAR(55) NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "value" INTEGER NOT NULL,
    "is_observable" BOOLEAN NOT NULL DEFAULT false,
    "is_send_notification" BOOLEAN NOT NULL DEFAULT false,
    "times_to_repeat" INTEGER NOT NULL DEFAULT 0,
    "count_repeated_occurrences" INTEGER NOT NULL DEFAULT 0,
    "type" "financial_transaction_type" NOT NULL,
    "sender_recipient" TEXT NOT NULL,
    "type_occurrence" "financial_transaction_type_occurrence" NOT NULL DEFAULT 'SINGLE',
    "frequency" "financial_transaction_frequency",
    "situation" "financial_transaction_situation" NOT NULL DEFAULT 'PENDING',
    "expires_in" TIMESTAMPTZ(3) NOT NULL,
    "date_time_competence" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_transaction_categories" (
    "financial_transaction_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_transaction_categories_pkey" PRIMARY KEY ("financial_transaction_id","category_id")
);

-- CreateTable
CREATE TABLE "financial_transaction_notes" (
    "id" SERIAL NOT NULL,
    "financial_transaction_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_transaction_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "financial_transaction_id" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "increase" INTEGER NOT NULL DEFAULT 0,
    "paid_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_error" (
    "id" SERIAL NOT NULL,
    "operation" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "stack" TEXT NOT NULL DEFAULT '',
    "causes" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "date_time" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_error_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_history" (
    "id" SERIAL NOT NULL,
    "type" "log_type" NOT NULL,
    "origin" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "date_time" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "peoples_itin_cnpj_key" ON "peoples"("itin_cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "users_code_key" ON "users"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_people_type" ON "users"("peopleId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "user_login_type" ON "users"("login", "type");

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_code_key" ON "bank_accounts"("code");

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_people_id_fkey" FOREIGN KEY ("people_id") REFERENCES "peoples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adresses" ADD CONSTRAINT "adresses_people_id_fkey" FOREIGN KEY ("people_id") REFERENCES "peoples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_peopleId_fkey" FOREIGN KEY ("peopleId") REFERENCES "peoples"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_people_id_fkey" FOREIGN KEY ("people_id") REFERENCES "peoples"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_id_fkey" FOREIGN KEY ("id") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transactions" ADD CONSTRAINT "financial_transactions_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transaction_categories" ADD CONSTRAINT "financial_transaction_categories_financial_transaction_id_fkey" FOREIGN KEY ("financial_transaction_id") REFERENCES "financial_transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transaction_categories" ADD CONSTRAINT "financial_transaction_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transaction_notes" ADD CONSTRAINT "financial_transaction_notes_financial_transaction_id_fkey" FOREIGN KEY ("financial_transaction_id") REFERENCES "financial_transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_financial_transaction_id_fkey" FOREIGN KEY ("financial_transaction_id") REFERENCES "financial_transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

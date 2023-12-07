-- CreateEnum
CREATE TYPE "notification_type" AS ENUM ('Push', 'Internal', 'Mail');

-- CreateEnum
CREATE TYPE "financial_transaction_type" AS ENUM ('EXPENSE', 'INCOME');

-- CreateEnum
CREATE TYPE "financial_transaction_occurrence" AS ENUM ('SINGLE', 'PROGRAMMATIC');

-- CreateEnum
CREATE TYPE "financial_transaction_situation" AS ENUM ('PENDING', 'PAID_OUT', 'PARTIALLY_PAID', 'RECEIVED', 'PARTIALLY_RECEIVED', 'LATE', 'CANCELED');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "email" VARCHAR(25) NOT NULL,
    "password" VARCHAR(15) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_account" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "password_master" VARCHAR(15) NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" SERIAL NOT NULL,
    "bank_account_id" INTEGER NOT NULL,
    "subject" VARCHAR(45) NOT NULL,
    "content" TEXT NOT NULL,
    "was_read" BOOLEAN NOT NULL DEFAULT false,
    "type" "notification_type" NOT NULL,
    "is_send" BOOLEAN NOT NULL DEFAULT false,
    "send_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mail" (
    "id" SERIAL NOT NULL,
    "notification_id" INTEGER NOT NULL,
    "recipient" VARCHAR(45) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "bank_account_id" INTEGER NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "color" VARCHAR(15) NOT NULL,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_transaction" (
    "id" SERIAL NOT NULL,
    "bank_account_id" INTEGER NOT NULL,
    "title" VARCHAR(55) NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "value" DOUBLE PRECISION NOT NULL,
    "priority" INTEGER NOT NULL,
    "is_observable" BOOLEAN NOT NULL DEFAULT false,
    "is_send_notification" BOOLEAN NOT NULL DEFAULT false,
    "times_to_repeat" INTEGER NOT NULL DEFAULT 0,
    "count_repeated_occurrences" INTEGER NOT NULL DEFAULT 0,
    "type" "financial_transaction_type" NOT NULL,
    "receiver" TEXT NOT NULL DEFAULT '',
    "sender" TEXT NOT NULL DEFAULT '',
    "type_occurrence" "financial_transaction_occurrence" NOT NULL DEFAULT 'SINGLE',
    "situation" "financial_transaction_situation" NOT NULL DEFAULT 'PENDING',
    "expires_in" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note" (
    "id" SERIAL NOT NULL,
    "financial_transaction_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "financial_transaction_id" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "increase" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paid_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mail_notification_id_key" ON "mail"("notification_id");

-- AddForeignKey
ALTER TABLE "bank_account" ADD CONSTRAINT "bank_account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mail" ADD CONSTRAINT "mail_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transaction" ADD CONSTRAINT "financial_transaction_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_financial_transaction_id_fkey" FOREIGN KEY ("financial_transaction_id") REFERENCES "financial_transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_financial_transaction_id_fkey" FOREIGN KEY ("financial_transaction_id") REFERENCES "financial_transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

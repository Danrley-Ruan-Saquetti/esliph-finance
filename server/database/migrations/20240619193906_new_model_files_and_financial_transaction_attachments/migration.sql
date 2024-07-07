-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "filename_original" VARCHAR(255) NOT NULL,
    "filename_stored" VARCHAR(255) NOT NULL,
    "extension" VARCHAR(10) NOT NULL,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_transaction_attachments" (
    "id" SERIAL NOT NULL,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "financial_transaction_id" INTEGER NOT NULL,

    CONSTRAINT "financial_transaction_attachments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "financial_transaction_attachments" ADD CONSTRAINT "financial_transaction_attachments_id_fkey" FOREIGN KEY ("id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transaction_attachments" ADD CONSTRAINT "financial_transaction_attachments_financial_transaction_id_fkey" FOREIGN KEY ("financial_transaction_id") REFERENCES "financial_transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

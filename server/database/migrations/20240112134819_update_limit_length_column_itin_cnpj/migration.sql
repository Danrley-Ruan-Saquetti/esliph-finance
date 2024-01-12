/*
  Warnings:

  - You are about to alter the column `itin_cnpj` on the `people` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(14)`.

*/
-- AlterTable
ALTER TABLE "people" ALTER COLUMN "itin_cnpj" SET DATA TYPE VARCHAR(14);

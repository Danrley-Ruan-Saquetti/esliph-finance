/*
  Warnings:

  - You are about to drop the column `value` on the `payment` table. All the data in the column will be lost.
  - Added the required column `value_paid` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" DROP COLUMN "value",
ADD COLUMN     "value_paid" INTEGER NOT NULL;

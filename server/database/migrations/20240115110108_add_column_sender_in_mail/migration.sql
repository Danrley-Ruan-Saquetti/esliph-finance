/*
  Warnings:

  - Added the required column `sender` to the `mail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mail" ADD COLUMN     "sender" VARCHAR(45) NOT NULL;

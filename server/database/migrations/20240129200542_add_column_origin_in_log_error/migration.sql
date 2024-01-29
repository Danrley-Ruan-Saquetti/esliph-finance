/*
  Warnings:

  - Added the required column `origin` to the `log_error` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "log_error" ADD COLUMN     "origin" TEXT NOT NULL;

/*
  Warnings:

  - Added the required column `name` to the `people` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "people" ADD COLUMN     "name" VARCHAR(128) NOT NULL;

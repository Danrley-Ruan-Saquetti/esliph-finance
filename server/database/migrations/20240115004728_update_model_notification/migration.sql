/*
  Warnings:

  - You are about to drop the column `is_send` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `was_read` on the `notification` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "notification_situation" AS ENUM ('IN_QUEUE', 'ERROR', 'SENT');

-- AlterTable
ALTER TABLE "notification" DROP COLUMN "is_send",
DROP COLUMN "was_read",
ADD COLUMN     "situation" "notification_situation" NOT NULL DEFAULT 'IN_QUEUE';

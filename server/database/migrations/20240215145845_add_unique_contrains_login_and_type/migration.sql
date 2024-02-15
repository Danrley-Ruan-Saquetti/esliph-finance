/*
  Warnings:

  - A unique constraint covering the columns `[login,type]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_login_key";

-- CreateIndex
CREATE UNIQUE INDEX "user_login_type" ON "user"("login", "type");

-- RenameIndex
ALTER INDEX "user_peopleId_type_key" RENAME TO "user_people_type";

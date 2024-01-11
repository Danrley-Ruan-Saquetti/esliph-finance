/*
  Warnings:

  - A unique constraint covering the columns `[peopleId,type]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_peopleId_type_key" ON "user"("peopleId", "type");

/*
  Warnings:

  - The primary key for the `Follows` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[followerId,followingId]` on the table `Follows` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "Follows_followerId_followingId_key" ON "Follows"("followerId", "followingId");

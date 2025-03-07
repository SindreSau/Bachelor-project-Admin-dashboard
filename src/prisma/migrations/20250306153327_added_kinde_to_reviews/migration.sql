/*
  Warnings:

  - You are about to drop the column `author` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[applicationId,kindeUserId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kindeUserId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kindeGivenName` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kindeUserId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Review_applicationId_userId_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "author",
ADD COLUMN     "kindeUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "userId",
ADD COLUMN     "kindeGivenName" TEXT NOT NULL,
ADD COLUMN     "kindeUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_applicationId_kindeUserId_key" ON "Review"("applicationId", "kindeUserId");

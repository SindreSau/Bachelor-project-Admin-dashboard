/*
  Warnings:

  - You are about to drop the `_StudentToApplication` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `applicationId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "_StudentToApplication" DROP CONSTRAINT "_StudentToApplication_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudentToApplication" DROP CONSTRAINT "_StudentToApplication_B_fkey";

-- DropIndex
DROP INDEX "Student_email_key";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "applicationId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_StudentToApplication";

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

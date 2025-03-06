/*
  Warnings:

  - Added the required column `kindeFamilyName` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kindeGivenName` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kindeUserImage` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "kindeFamilyName" TEXT NOT NULL,
ADD COLUMN     "kindeGivenName" TEXT NOT NULL,
ADD COLUMN     "kindeUserImage" TEXT NOT NULL;

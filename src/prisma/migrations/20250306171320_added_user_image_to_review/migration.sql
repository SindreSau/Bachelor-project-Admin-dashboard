/*
  Warnings:

  - Added the required column `kindeUserImage` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "kindeUserImage" TEXT NOT NULL;

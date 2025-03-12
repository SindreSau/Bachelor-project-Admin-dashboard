-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "taskpriorityids" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

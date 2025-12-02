/*
  Warnings:

  - The `chats` column on the `Chat` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `patientName` on table `Chat` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "chats",
ADD COLUMN     "chats" JSONB[],
ALTER COLUMN "patientName" SET NOT NULL;

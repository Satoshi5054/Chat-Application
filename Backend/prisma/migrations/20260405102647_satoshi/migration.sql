/*
  Warnings:

  - You are about to drop the `Meeting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MeetingParticipant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MessageRead` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_createdById_fkey";

-- DropForeignKey
ALTER TABLE "MeetingParticipant" DROP CONSTRAINT "MeetingParticipant_meetingId_fkey";

-- DropForeignKey
ALTER TABLE "MeetingParticipant" DROP CONSTRAINT "MeetingParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "MessageRead" DROP CONSTRAINT "MessageRead_messageId_fkey";

-- DropForeignKey
ALTER TABLE "MessageRead" DROP CONSTRAINT "MessageRead_userId_fkey";

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "lastMessage" TEXT,
ADD COLUMN     "lastMessageAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ConversationMember" ADD COLUMN     "lastReadMessageId" TEXT;

-- DropTable
DROP TABLE "Meeting";

-- DropTable
DROP TABLE "MeetingParticipant";

-- DropTable
DROP TABLE "MessageRead";

-- CreateIndex
CREATE INDEX "Conversation_companyId_idx" ON "Conversation"("companyId");

-- CreateIndex
CREATE INDEX "ConversationMember_userId_idx" ON "ConversationMember"("userId");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

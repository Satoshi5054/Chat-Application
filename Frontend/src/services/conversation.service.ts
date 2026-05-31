import api from "./api"

export type ConversationMember = {
  userId: string
  lastReadMessageId?: string | null
  user: {
    id: string
    name: string
  }
}

export type Conversation = {
  id: string
  name: string
  isGroup: boolean
  lastMessage: string
  lastMessageAt: string | null
  members: ConversationMember[]
}

export const fetchConversations = async () => {
  const res = await api.get<Conversation[]>("/conversations")
  return res.data
}
import api from "./api"

//////////////////////////////////////////////////////
// TYPES
//////////////////////////////////////////////////////

export type Conversation = {
  id: string
  isGroup?: boolean
  lastMessage?: string
  lastMessageAt?: string
  members: {
    user: {
      id: string
      name: string
    }
  }[]
}

export const getConversationTitle = (
  conversation: Conversation,
  currentUserId?: string
) => {
  const otherMembers = conversation.members
    .map((member) => member.user)
    .filter((user) => user.id !== currentUserId)

  if (conversation.isGroup) {
    const names = otherMembers.map((user) => user.name)
    return names.length > 0 ? names.join(", ") : "Group chat"
  }

  return otherMembers[0]?.name ?? conversation.members[0]?.user.name ?? "Chat"
}

export type Message = {
  id: string
  content: string
  createdAt: string
  sender: {
    id: string
    name: string
  }
}

export type GetMessagesResponse = {
  messages: Message[]
  nextCursor?: string | null
}

//////////////////////////////////////////////////////
// GET CONVERSATIONS
//////////////////////////////////////////////////////

export const getConversations = async (): Promise<Conversation[]> => {
  const res = await api.get("/chat/conversations")
  return res.data
}

//////////////////////////////////////////////////////
// GET MESSAGES
//////////////////////////////////////////////////////

export const getMessages = async (conversationId: string): Promise<GetMessagesResponse> => {
  const res = await api.get("/chat/messages", {
    params: { conversationId }
  })

  return res.data
}
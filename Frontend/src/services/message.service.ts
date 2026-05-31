import api from "./api"

export type MessageSender = {
  id: string
  name: string
}

export type Message = {
  id: string
  content: string
  conversationId: string
  senderId: string
  sender: MessageSender
  createdAt: string
}

export type SendMessagePayload = {
  conversationId: string
  content: string
}

export const fetchMessages = async (conversationId: string) => {
  const res = await api.get<Message[]>(`/messages/${conversationId}`)
  return res.data
}

export const sendMessage = async (payload: SendMessagePayload) => {
  const res = await api.post<Message>("/messages", payload)
  return res.data
}
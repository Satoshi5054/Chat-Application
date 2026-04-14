import { getConversationTitle } from "../../../services/message.service"
import type { Conversation } from "../../../services/message.service"

type Props = {
  chat: Conversation | null
  currentUserId?: string
}

const ChatHeader = ({ chat, currentUserId }: Props) => {
  if (!chat) {
    return (
      <div className="p-4 border-b border-gray-800">
        Select a chat
      </div>
    )
  }

  return (
    <div className="p-4 border-b border-gray-800 flex justify-between">
      <h2 className="font-semibold">{getConversationTitle(chat, currentUserId)}</h2>
      <span className="text-sm text-gray-400">Online</span>
    </div>
  )
}

export default ChatHeader
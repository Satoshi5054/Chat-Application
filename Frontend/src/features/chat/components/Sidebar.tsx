import { getConversationTitle } from "../../../services/message.service"
import type { Conversation } from "../../../services/message.service"

type Props = {
  conversations: Conversation[]
  selectedChat: Conversation | null
  onSelect: (chat: Conversation) => void
  currentUserId?: string
}

const Sidebar = ({ conversations, selectedChat, onSelect, currentUserId }: Props) => {
  return (
    <div className="w-1/4 border-r bg-[#020617] p-4">

      <h2 className="text-lg font-semibold mb-4">Chats</h2>

      {conversations.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelect(chat)}
          className={`p-3 rounded-lg cursor-pointer mb-2 ${
            selectedChat?.id === chat.id
              ? "bg-blue-600"
              : "hover:bg-gray-800"
          }`}
        >
          <p className="font-medium">
            {getConversationTitle(chat, currentUserId)}
          </p>
          {chat.lastMessage && (
            <p className="text-xs text-gray-100 mt-1 truncate">
              {chat.lastMessage}
            </p>
          )}
        </div>
      ))}

    </div>
  )
}

export default Sidebar
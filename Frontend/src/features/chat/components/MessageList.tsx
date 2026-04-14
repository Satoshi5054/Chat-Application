import type { Message } from "../../../services/message.service"

type Props = {
  messages: Message[]
  currentUserId?: string
}

const MessageList = ({ messages, currentUserId }: Props) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">

      {messages.length === 0 && (
        <p className="text-gray-500">No messages</p>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`max-w-xs p-3 rounded-lg ${
            msg.sender?.id === currentUserId
              ? "bg-blue-500 ml-auto"
              : "bg-gray-800"
          }`}
        >
          {msg.content}
        </div>
      ))}

    </div>
  )
}

export default MessageList
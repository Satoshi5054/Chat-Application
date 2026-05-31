import type { Message } from "../../../services/message.service"

type BodyProps = {
  messages: Message[]
  loading: boolean
  currentUserId: string | null
}

const Body = ({ messages, loading, currentUserId }: BodyProps) => {
  return (
    <section className="flex-1 min-h-0 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,_#f8faf7_0%,_#f1f5f9_100%)] px-6 py-6">
      {loading ? (
        <div className="flex h-full items-center justify-center text-sm text-slate-500">
          Loading messages...
        </div>
      ) : messages.length > 0 ? (
        messages.map((message) => {
          const isOwnMessage = currentUserId === message.sender.id

          return (
            <div key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-[22px] px-5 py-4 shadow-sm ring-1 ${
                  isOwnMessage
                    ? "bg-slate-800 text-white ring-slate-800/10"
                    : "bg-white text-slate-800 ring-slate-200/80"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className={`text-sm font-semibold ${isOwnMessage ? "text-slate-100" : "text-slate-700"}`}>
                    {isOwnMessage ? "You" : message.sender.name}
                  </p>
                  <span className={`text-xs ${isOwnMessage ? "text-slate-300" : "text-slate-500"}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
                <p className={`leading-6 ${isOwnMessage ? "text-slate-100" : "text-slate-600"}`}>{message.content}</p>
              </div>
            </div>
          )
        })
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-slate-500">
          No messages yet. Send the first message.
        </div>
      )}
    </section>
  )
}

export default Body
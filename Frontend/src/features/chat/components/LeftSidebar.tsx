import { Search, MessageSquareText } from "lucide-react"
import { logout } from "../../../services/auth.service"

type ConversationItem = {
  id: string
  name: string
  isGroup: boolean
  lastMessage: string
  lastMessageAt: string | null
  members: {
    userId: string
    user: {
      id: string
      name: string
    }
  }[]
}

type LeftSidebarProps = {
  conversations: ConversationItem[]
  activeConversationId: string
  currentUserId: string | null
  onSelectConversation: (conversationId: string) => void
  onLogout?: () => void
  loading?: boolean
}

const LeftSidebar = ({ conversations, activeConversationId, currentUserId, onSelectConversation, onLogout, loading }: LeftSidebarProps) => {
  const handleLogout = async () => {
    if (onLogout) return onLogout()
    try {
      await logout()
    } catch (e) {
      console.error("Logout failed:", e)
    } finally {
      try {
        localStorage.removeItem("token")
      } catch (e) {
        // ignore
      }
      window.location.href = "/auth/login"
    }
  }
  return (
    <aside className="flex h-full w-full min-h-0 flex-col border-r border-slate-800/80 bg-[#111827] text-slate-100 lg:w-80">
      <div className="border-b border-slate-800/80 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-slate-100 ring-1 ring-white/10">
            <MessageSquareText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Chat</p>
            <h2 className="text-lg font-semibold">Conversations</h2>
          </div>
          <div className="ml-auto">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/70 px-4 py-3 text-slate-400">
          <Search className="h-4 w-4" />
          <span className="text-sm">Search chats</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 space-y-2 overflow-y-auto p-3">
        {loading ? (
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 px-4 py-4 text-sm text-slate-400">
            Loading conversations...
          </div>
        ) : conversations.length > 0 ? (
          conversations.map((conversation) => {
            const directMember = conversation.members.find((member) => member.userId !== currentUserId)
            const conversationTitle = conversation.isGroup
              ? conversation.name
              : directMember?.user.name ?? conversation.name ?? "Direct chat"

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                  conversation.id === activeConversationId
                    ? "border-slate-500/40 bg-slate-800/80"
                    : "border-transparent bg-slate-900/60 hover:border-slate-700/70 hover:bg-slate-900/80"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-50">{conversationTitle}</p>
                  <p className="mt-1 truncate text-sm text-slate-400">
                    {conversation.isGroup
                      ? `${conversation.members.length} members`
                      : `Direct chat with ${directMember?.user.name ?? "member"}`}
                    {conversation.lastMessage ? ` · ${conversation.lastMessage}` : ""}
                  </p>
                </div>

                <span className="ml-4 shrink-0 text-xs text-slate-500">
                  {conversation.lastMessageAt
                    ? new Date(conversation.lastMessageAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "Now"}
                </span>
              </button>
            )
          })
        ) : (
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 px-4 py-4 text-sm text-slate-400">
            No conversations found.
          </div>
        )}
      </div>
    </aside>
  )
}

export default LeftSidebar
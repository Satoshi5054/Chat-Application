import LeftSidebar from "../components/LeftSidebar"
import Header from "../components/Header"
import Body from "../components/Body"
import MessageInput from "../components/MessageInput"
import { useEffect, useMemo, useRef, useState } from "react"
import { fetchMessages, sendMessage, type Message } from "../../../services/message.service"
import { fetchConversations, type Conversation } from "../../../services/conversation.service"
import { checkAuth } from "../../../services/auth.service"

import { socket } from "../../../services/socket"

const Dashboard = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState("")
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [loadingConversations, setLoadingConversations] = useState(false)
  const [loadingCurrentUser, setLoadingCurrentUser] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [typingUserId, setTypingUserId] = useState<string | null>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const loadCurrentUser = async () => {
      setLoadingCurrentUser(true)

      try {
        const data = await checkAuth()
        setCurrentUserId(data.loggedIn ? data.user?.userId ?? null : null)
      } catch (error) {
        console.error(error)
        setCurrentUserId(null)
      } finally {
        setLoadingCurrentUser(false)
      }
    }

    void loadCurrentUser()
  }, [])

  useEffect(() => {
    const loadConversations = async () => {
      setLoadingConversations(true)

      try {
        const data = await fetchConversations()
        setConversations(data)

        if (data.length > 0) {
          setActiveConversationId((currentConversationId) => currentConversationId || data[0].id)
        }
      } catch (error) {
        console.error(error)
        setConversations([])
      } finally {
        setLoadingConversations(false)
      }
    }

    void loadConversations()
  }, [])

  useEffect(() => {
    if (!activeConversationId) {
      return
    }

    const loadMessages = async () => {
      setLoadingMessages(true)

      try {
        const data = await fetchMessages(activeConversationId)
        setMessages(data)
      } catch (error) {
        console.error(error)
        setMessages([])
      } finally {
        setLoadingMessages(false)
      }
    }

    void loadMessages()
  }, [activeConversationId])

  useEffect(() => {
    const handleOnlineUsers = (users: string[]) => {
      setOnlineUsers(users)
    }

    socket.on("online-users", handleOnlineUsers)

    return () => {
      socket.off("online-users", handleOnlineUsers)
    }
  }, [])

  useEffect(() => {
    if (!activeConversationId) return

    socket.emit(
      "join-conversation",
      activeConversationId
    )

    socket.emit("mark-read", activeConversationId)

    return () => {
      socket.emit("leave-conversation", activeConversationId)
      socket.emit("stop-typing", activeConversationId)
      setTypingUserId(null)
    }
  }, [activeConversationId])

  useEffect(() => {
  const handleNewMessage = (message: Message) => {
    if (message.conversationId !==activeConversationId) { return }

    setMessages((currentMessages) => [
      ...currentMessages,
      message
    ])
  }

  socket.on("new-message",handleNewMessage)

  return () => {socket.off("new-message",handleNewMessage)}
}, [activeConversationId])

  useEffect(() => {
    const handleUserTyping = (userId: string) => {
      if (userId === currentUserId) {
        return
      }

      setTypingUserId(userId)
    }

    const handleUserStopTyping = (userId: string) => {
      if (userId === currentUserId) {
        return
      }

      setTypingUserId((currentTypingUserId) => (currentTypingUserId === userId ? null : currentTypingUserId))
    }

    socket.on("user-typing", handleUserTyping)
    socket.on("user-stop-typing", handleUserStopTyping)

    return () => {
      socket.off("user-typing", handleUserTyping)
      socket.off("user-stop-typing", handleUserStopTyping)
    }
  }, [currentUserId])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId)
    setMessageText("")
  }

  const handleSendMessage = async () => {
    const trimmedMessage = messageText.trim()

    if (!trimmedMessage) {
      return
    }

    setSendingMessage(true)

    try {
      await sendMessage({
        conversationId: activeConversationId,
        content: trimmedMessage
      })
      setMessageText("")
      socket.emit("stop-typing", activeConversationId)
    } catch (error) {
      console.error(error)
    } finally {
      setSendingMessage(false)
    }
  }

  const handleTyping = () => {
    if (!activeConversationId) {
      return
    }

    socket.emit("typing", activeConversationId)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", activeConversationId)
    }, 1000)
  }

  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) ?? conversations[0]
  const directMember = activeConversation?.members.find((member) => member.userId !== currentUserId)
  const isDirectMemberOnline = directMember ? onlineUsers.includes(directMember.user.id) : false

  const activeConversationTitle = activeConversation
    ? activeConversation.isGroup
      ? activeConversation.name ?? "Group Chat"
      : directMember?.user.name ??
        activeConversation.name ??
        "Direct chat"
    : "Select a conversation"

  const typingUserName = useMemo(() => {
    if (!typingUserId || !activeConversation) {
      return null
    }

    return activeConversation.members.find((member) => member.userId === typingUserId)?.user.name ?? null
  }, [typingUserId, activeConversation])

  return (
    <div className="h-dvh overflow-hidden bg-slate-950 p-3 sm:p-4 lg:p-6">
      <div className="grid h-full overflow-hidden rounded-[28px] border border-slate-700/80 bg-slate-50 shadow-lg shadow-slate-950/25 lg:grid-cols-[320px_1fr]">
        <LeftSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          currentUserId={currentUserId}
          onSelectConversation={handleSelectConversation}
          loading={loadingConversations}
        />

        <main className="flex min-h-0 flex-col overflow-hidden bg-[#f7f7f5]">
          <Header
            title={activeConversationTitle}
            subtitle={
              activeConversation
                ? activeConversation.isGroup
                  ? `${activeConversation.members.length} members`
                  : isDirectMemberOnline
                    ? "Online"
                    : "Offline"
                : "No conversations loaded"
            }
          />
          <Body
            messages={messages}
            loading={loadingMessages || loadingCurrentUser}
            currentUserId={currentUserId}
            typingUserName={typingUserName}
          />
          <MessageInput
            value={messageText}
            onChange={setMessageText}
            onTyping={handleTyping}
            onSend={handleSendMessage}
            disabled={sendingMessage || !activeConversationId}
          />
        </main>
      </div>
    </div>
  )
}

export default Dashboard
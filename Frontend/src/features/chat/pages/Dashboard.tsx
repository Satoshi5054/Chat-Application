"use client"

import Sidebar from "../components/Sidebar"
import ChatHeader from "../components/ChatHeader"
import MessageList from "../components/MessageList"
import MessageInput from "../components/MessageInput"
import RightPanel from "../components/RightPanel"

import { useEffect, useState } from "react"
import { socket } from "../../../services/socket"

import { getConversations, getMessages } from "../../../services/message.service"
import type { Conversation, Message } from "../../../services/message.service"
import { checkAuth } from "../../../services/auth.service"

const Dashboard = () => {

  const [conversations,setConversations] = useState<Conversation[]>([])  
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [currentUserId, setCurrentUserId] = useState<string | undefined>()

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const data = await checkAuth()
        setCurrentUserId(data.user?.userId)
      } catch (error) {
        console.error(error)
      }
    }

    fetchCurrentUser()
  }, [])

  useEffect(()=>{
    const fetchConversations = async ()=>{
      try{
        const data = await getConversations()
        setConversations(data)

        if(data.length > 0) setSelectedChat(data[0])

      }catch(error){
        console.error(error)
      }
    }
    fetchConversations()
  },[])

  useEffect(()=>{
    if(!selectedChat) return

    const fetchMessages = async ()=>{
      try{
        const data = await getMessages(selectedChat.id)
        setMessages(data.messages)

      }catch(error){
        console.error(error)
      }
    }

    fetchMessages()
  },[selectedChat])

  useEffect(()=>{
    socket.connect()

    return ()=>{ socket.disconnect() }
  },[])

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      createdAt: new Date().toISOString(),
      sender: {
        id: currentUserId ?? "me",
        name: "You"
      }
    }

    setMessages((prev)=>[...prev, newMessage])
    setInput("")
  }

  return (
    <div className="h-screen flex bg-[#0b1120] text-white">

      <Sidebar
        conversations={conversations}
        selectedChat={selectedChat}
        onSelect={(chat) => {setSelectedChat(chat)}}
        currentUserId={currentUserId}
      />

      <div className="flex-1 flex flex-col">

        <ChatHeader chat={selectedChat} currentUserId={currentUserId} />

        <MessageList messages={messages} currentUserId={currentUserId} />

        <MessageInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
        />

      </div>

      <RightPanel />

    </div>
  )
}

export default Dashboard
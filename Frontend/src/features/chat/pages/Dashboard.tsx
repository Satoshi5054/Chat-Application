import Sidebar from "../components/Sidebar"
import ChatHeader from "../components/ChatHeader"
import MessageList from "../components/MessageList"
import MessageInput from "../components/MessageInput"
import RightPanel from "../components/RightPanel"

import { useState, useEffect } from "react"
import { getMessages, sendMessage } from "../../auth/services/message.service"

const Dashboard = () => {

  const [selectedChat, setSelectedChat] = useState<{id:string | null,name:string | null}>({id:null,name:""})
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")

  useEffect(()=>{
    const fetchMessages = async ()=>{
      try {
        const data = await getMessages(selectedChat.id!)
        setMessages(data.reverse())
      }catch(err){
        console.error(err)
      }
    }

    if(selectedChat?.id) fetchMessages()
  },[selectedChat])

  const handleSelectChat = (chat: any)=>{
    setSelectedChat(chat)
    setMessages(chat.id)
  }

  const handleSend = async ()=>{
    if(!input.trim()) return

    try{
      const message = await sendMessage({
        conversationId: selectedChat.id!,
        content: input
      })

      setMessages((prev)=>[...prev, message])
      setInput("")
    }catch(error){
      console.error(error)
    }
  }

  return (
      <div className="h-screen flex bg-[#0b1120] text-white">
        <Sidebar 
          conversations = {conversations}
          selectedChat = {selectedChat}
          onSelect = {handleSelectChat}
        />

        <div className="flex-1 flex flex-col">
          <ChatHeader chat={selectedChat} />
          <MessageList messages={messages} />
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
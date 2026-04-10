const ChatHeader = ({ chat }: any) => {
  return (
    <div className="p-4 border-b border-gray-800">
      <h2 className="font-semibold">{chat.name}</h2>
    </div>
  )
}

export default ChatHeader
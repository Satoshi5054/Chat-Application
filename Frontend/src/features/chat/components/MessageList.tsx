const MessageList = ({messages} : any) => {
  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
      {messages.map((msg: any) => (
        <div
          key={msg.id}
          className={`p-3 rounded-lg w-fit ${
            msg.sender === "me" ? "bg-blue-600 ml-auto" : "bg-gray-700"
          }`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  )
}

export default MessageList
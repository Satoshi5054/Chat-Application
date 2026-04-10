const Sidebar = ({ conversations, onSelect, selectedChat }: any) => {
  return (
    <div className="w-1/4 border-r border-gray-800 p-4">
      <h2 className="text-lg font-semibold mb-4">Chats</h2>

      {conversations.map((chat: any) => (
        <div
          key={chat.id}
          onClick={() => onSelect(chat)}
          className={`p-3 rounded-lg cursor-pointer ${
            selectedChat.id === chat.id ? "bg-[#1e293b]" : "hover:bg-[#1e293b]"
          }`}
        >
          <p className="font-medium">{chat.name}</p>
        </div>
      ))}
      
    </div>
  )
}

export default Sidebar
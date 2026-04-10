const MessageInput = ({ input, setInput, onSend }: any) => {
  return (
    <div className="p-4 border-t border-gray-800 flex gap-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 p-3 rounded-lg bg-[#1e293b] border border-gray-700"
        placeholder="Type a message..."
      />
      <button onClick={onSend} className="bg-blue-600 px-4 rounded-lg">
        Send
      </button>
    </div>
  )
}

export default MessageInput
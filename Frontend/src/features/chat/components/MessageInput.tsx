type Props = {
  input: string
  setInput: (val: string) => void
  onSend: () => void
}

const MessageInput = ({ input, setInput, onSend }: Props) => {
  return (
    <div className="p-3 border-t border-gray-800 flex gap-2">

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-3 py-2 rounded bg-gray-900 border border-gray-700 outline-none"
      />

      <button
        onClick={onSend}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        Send
      </button>

    </div>
  )
}

export default MessageInput
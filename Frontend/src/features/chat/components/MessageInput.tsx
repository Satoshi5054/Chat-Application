import { Paperclip, Smile } from "lucide-react"
import SendMessage from "./SendMessage"

type MessageInputProps = {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
}

const MessageInput = ({ value, onChange, onSend, disabled }: MessageInputProps) => {
  return (
    <footer className="border-t border-slate-200 bg-[#f7f7f5] px-6 py-4">
      <div className="flex items-end gap-3 rounded-[22px] border border-slate-200 bg-white p-3 shadow-sm">
        <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
          <Paperclip className="h-4 w-4" />
        </button>

        <div className="flex-1">
          <label className="sr-only" htmlFor="message-input">
            Type a message
          </label>
          <textarea
            id="message-input"
            rows={1}
            placeholder="Write your message..."
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="min-h-12 w-full resize-none rounded-2xl border border-transparent bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-300"
          />
        </div>

        <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
          <Smile className="h-4 w-4" />
        </button>

        <SendMessage onClick={onSend} disabled={disabled} />
      </div>
    </footer>
  )
}

export default MessageInput
import { SendHorizontal } from "lucide-react"

type SendMessageProps = {
  onClick?: () => void
  disabled?: boolean
}

const SendMessage = ({ onClick, disabled }: SendMessageProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-12 items-center gap-2 rounded-2xl bg-cyan-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <SendHorizontal className="h-4 w-4" />
      {disabled ? "Sending..." : "Send"}
    </button>
  )
}

export default SendMessage
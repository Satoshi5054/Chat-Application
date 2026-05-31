import { ChevronDown, Phone, Video } from "lucide-react"

type HeaderProps = {
  title: string
  subtitle: string
}

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-[#f7f7f5] px-6 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Workspace</p>
        <div className="mt-1 flex items-center gap-2">
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3 text-slate-600">
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-100">
          <Phone className="h-4 w-4" />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-100">
          <Video className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white pl-1 pr-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            SG
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">Support</p>
            <p className="text-xs text-emerald-600">Online</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
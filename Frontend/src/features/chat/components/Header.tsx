import { ChevronDown } from "lucide-react"

type HeaderProps = {
  title: string
  subtitle: string
}

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="border-b border-slate-200 bg-[#f7f7f5] px-6 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Workspace</p>
        <div className="mt-1 flex items-center gap-2">
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </header>
  )
}

export default Header
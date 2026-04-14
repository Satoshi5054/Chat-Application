interface AuthInputProps {
  name : string
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (e : React.ChangeEvent<HTMLInputElement>) => void
}

const AuthInput: React.FC<AuthInputProps> = ({
  name,
  label,
  type = "text",
  value,
  placeholder,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>
      <input
        name = {name}
        type={type}
        value={value} 
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

export default AuthInput

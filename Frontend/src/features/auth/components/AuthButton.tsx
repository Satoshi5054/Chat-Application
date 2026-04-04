interface AuthButtonProps {
  text: string
}

const AuthButton: React.FC<AuthButtonProps> = ({ text }) => {
  return (
    <button type = "submit" className="w-full py-3 rounded-lg bg-blue-600 cursor-pointer hover:bg-blue-800 transition text-white font-medium">
      {text}
    </button>
  )
}

export default AuthButton
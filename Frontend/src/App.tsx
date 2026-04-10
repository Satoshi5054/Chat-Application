import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Dashboard from "./features/chat/pages/Dashboard"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App
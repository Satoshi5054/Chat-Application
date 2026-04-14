import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

import { register } from "../../../services/auth.service"
import AuthLayout from "../components/AuthLayout"
import AuthInput from "../components/AuthInput"
import AuthButton from "../components/AuthButton"

const Register = () => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [form, setForm]  = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    companyId: "",
  })

  const handleChange = (e : React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
    setForm({
      ...form,
      [e.target.name] : e.target.value
    })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await register(form)

      console.log("Register success")
      navigate("/auth/login")
    }catch (err: any) {
      console.error(err.response?.data?.message)
    }finally{
            setLoading(false)
      }
  }

  return (
    <AuthLayout>
      <div className="space-y-10">

        <div>
          <h2 className="text-2xl font-semibold text-white">
            Create an account
          </h2>
          <p className="text-gray-400 text-sm">
            Get started with your workspace
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-10">
          <AuthInput name = "name" label="Full Name" value= {form.name} onChange={handleChange} placeholder="John Doe" />
          <AuthInput name = "email" label="Email" type="email" value= {form.email} onChange={handleChange} placeholder="name@company.com" />
          <AuthInput name = "password" label="Password" type="password" value= {form.password} onChange={handleChange} placeholder="••••••••" />

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Role</label>

            <select
                name = "role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="" disabled className="bg-[#0f172a]">Select role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
            </select>
            </div>

          <AuthInput name="companyId" label="Company ID" value={form.companyId} onChange={handleChange} placeholder="Enter company ID" />
          <AuthButton text={loading ? "Creating..." : "Create Account"} />
        </form>

        <p className="text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-blue-500 cursor-pointer"> Sign in </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Register
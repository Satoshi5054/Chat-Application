import { Link, useNavigate } from "react-router-dom"
import  { useState } from "react"

import { login } from "../../../services/auth.service"
import AuthLayout from "../components/AuthLayout"
import AuthButton from "../components/AuthButton"
import AuthInput from "../components/AuthInput"


const Login = ()=>{

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const[form,setForm] = useState({
        email : "", 
        password : "", 
        companyId : ""
    })

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) =>{
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }

    const handleFormSubmit = async  (e : React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setLoading(true)

        try{
            await login(form)

            console.log("Login success")
            navigate("/dashboard")
        }catch(err: any){
            console.error(err.response?.data?.messaga)
        }finally{
            setLoading(false)
        }
    }

    return (
        <AuthLayout>
            <div className="space-y-10">

                <div>
                    <h2 className="text-2xl font-semibold text-white">
                        Sign in to your account
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Enter your credentials to continue
                    </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-10">
                    <AuthInput name="email" label="Email" type="email" value= {form.email} onChange = {handleChange} placeholder="name@company.com" />
                    <AuthInput name="password" label="Password" type="password" value = {form.password} onChange = {handleChange}  placeholder="••••••••" />
                    <AuthInput name="companyId" label="Company ID" value= {form.companyId} onChange = {handleChange}  placeholder="Enter your company ID" />
               
                    <AuthButton text={loading ? "Signing in..." : "Sign In"} />
                 </form>
                 
                    <p className="text-1xl text-gray-400 text-center">
                    Don't have an account?
                    <Link to="/auth/register" className="text-blue-500 cursor-pointer"> Sign up </Link>
                    </p>
            </div>
        </AuthLayout>
    )
}

export default Login
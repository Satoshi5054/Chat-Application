import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

interface userSignInData {
    email: string,
    password: string,
    companyId: string,
    role: string
}

export const  signIn = (data: userSignInData)=>{
    api.post("/auth/me",data)
}
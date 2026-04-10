import  api  from "./api"

// ================= GET MESSAGES =================
export const getMessages = async (conversationId: string)=>{
    const res = await api.get("/chat/messages",{
        params: {conversationId}
    })

    return res.data
}

// ================= SEND MESSAGES =================
export const sendMessage = async (data: {
    conversationId: string
    content: string
}) =>{
    const res = await api.post("/chat/messages",data)
    return res.data
}
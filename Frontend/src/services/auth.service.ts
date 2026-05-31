import api from "./api"

export type AuthUser = {
  userId: string
}

export type AuthMeResponse = {
  loggedIn: boolean
  user?: AuthUser
}

// ================= LOGIN =================
export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// ================= REGISTER =================
export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// ================= CHECK AUTH =================
export const checkAuth = async () => {
  const res = await api.get<AuthMeResponse>("/auth/me")
  return res.data
};

// ================= LOGOUT =================
export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};
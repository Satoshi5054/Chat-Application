import api from "./api"

// ================= LOGIN =================
export const login = async (data: {
  email: string;
  password: string;
  companyId: string;
}) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// ================= REGISTER =================
export const register = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
  companyId: string;
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// ================= CHECK AUTH =================
export const checkAuth = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

// ================= LOGOUT =================
export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};
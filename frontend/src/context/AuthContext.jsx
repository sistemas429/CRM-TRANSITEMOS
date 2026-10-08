import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Al montar (o al cambiar el token), intenta recuperar el usuario actual
  useEffect(() => {
    if (!token) return;
    api
      .get("/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        // Token inválido o expirado: limpia la sesión
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        setToken(null);
        setUser(null);
      });
  }, [token]);

  async function login(username, password) {
    const response = await api.post("/auth/login", { username, password });
    const { access_token, refresh_token } = response.data;
    localStorage.setItem("token", access_token);
    localStorage.setItem("access_token", access_token);
    if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
    setToken(access_token);
    return response.data;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setToken(null);
    setUser(null);
  }

  const role = user?.role?.name ?? user?.role ?? null;

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}






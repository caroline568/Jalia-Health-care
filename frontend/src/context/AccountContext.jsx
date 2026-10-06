import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("checking");

  const refresh = useCallback(async () => {
    try {
      const result = await api.get("/auth/me");
      setUser(result.user);
      setStatus("ready");
    } catch {
      setUser(null);
      setStatus("unavailable");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email, password) => {
    const result = await api.post("/auth/login", { email, password });
    setUser(result.user);
    setStatus("ready");
    return result.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const result = await api.post("/auth/register", { name, email, password });
    setUser(result.user);
    setStatus("ready");
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    await api.post("/auth/logout");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, status, login, register, logout, refresh }),
    [user, status, login, register, logout, refresh],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) throw new Error("useAccount must be used inside AccountProvider.");
  return context;
}

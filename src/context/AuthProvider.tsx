import { useState, useEffect } from "react";
import { AuthContext, type User } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  //Recupera utente quando l'app si carica
  useEffect(() => {
    getUser();
  }, []);

  //Get User
  const getUser = async () => {
    try {
      const res = await fetch("../utils/mock/user.json");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  };

  //LOGIN
  const login = async (email: string, password: string) => {
    setLoading(true);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setLoading(false);
      throw new Error("Invalid credentials");
    }

    const data = await res.json();
    setUser(data.user);
    setLoading(false);
  };

  // === LOGOUT ===
  const logout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

import { UsuarioAdmin } from "@/types/usuario";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";


interface AuthContextProps {
  user: UsuarioAdmin | null;
  setUser: (user: UsuarioAdmin | null) => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UsuarioAdmin | null>(null);

  // opcional: carregar usuário de localStorage ou cookie
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
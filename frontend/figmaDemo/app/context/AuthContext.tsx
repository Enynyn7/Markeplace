import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  type: "comunidad" | "externo";
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, type: "comunidad" | "externo") => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, type: "comunidad" | "externo") => {
    // Simulación de login
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setUser({
      id: "1",
      name: "Usuario Demo",
      email: email,
      type: type,
      verified: type === "comunidad",
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

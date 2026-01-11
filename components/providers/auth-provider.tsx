"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, getMe, getToken, removeToken } from "@/lib/auth-api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  refreshUser: async () => {},
  logoutUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await getMe();
      setUser(userData);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      // Only log error if it's not a 401 (Unauthorized) which is expected when token expires
      if (message !== "No autorizado") {
        console.error("Error fetching user:", error);
      }
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    removeToken();
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // Optional: Protect routes logic here or in middleware
  // For now, we just provide the state

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        refreshUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

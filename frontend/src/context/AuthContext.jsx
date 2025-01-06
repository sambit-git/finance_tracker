import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    // Simulate API call
    const mockUser = {
      fullName: "Sambit Kumar",
      username: "sambit",
    };
    setUser(mockUser);
  };

  const register = async (fullName, username, password) => {
    // Simulate API call
    const mockUser = {
      fullName,
      username,
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

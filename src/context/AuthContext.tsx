import React, { createContext, useContext, useState, useCallback } from 'react';

export interface UserProfile {
  name: string;
  role: string;
  avatar: string;
  email: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const defaultUser: UserProfile = {
  name: 'Ikmal Rizal',
  role: 'Kepala Bappeda',
  avatar: 'IR',
  email: 'admin@instansi.go.id',
};

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
  login: () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = useCallback((email: string, password: string): boolean => {
    if (email === 'admin@instansi.go.id' && password === 'password123') {
      setIsAuthenticated(true);
      setUser(defaultUser);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

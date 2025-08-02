import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  sendPasswordSetupLink: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string): Promise<void> => {
    // Mock authentication with delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const mockUser: User = {
      id: '1',
      email,
      name: 'Admin User',
      role: 'admin'
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const sendPasswordSetupLink = (email: string) => {
    console.log("Password setup link sent to:", email);
  };

  const value = {
    isAuthenticated,
    user,
    signIn,
    signOut,
    sendPasswordSetupLink
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
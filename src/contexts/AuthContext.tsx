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
  isSettingUp: boolean;
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
  const [isSettingUp, setIsSettingUp] = useState(false);

  const signIn = async (email: string, password: string): Promise<void> => {
    // Mock authentication with delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const SUPER_ADMIN_EMAIL = 'superadmin@example.com';
    const TEMP_PASSWORD = 'SUPER_ADMIN_TEMP_PASSWORD';
    
    // Check for Super Admin first-time login
    if (email === SUPER_ADMIN_EMAIL && password === TEMP_PASSWORD) {
      setIsSettingUp(true);
      setIsAuthenticated(true);
      setUser({
        id: 'super-admin',
        email,
        name: 'Super Admin',
        role: 'super_admin'
      });
      return;
    }
    
    // Mock user data for normal users or completed Super Admin
    const mockUser: User = {
      id: email === SUPER_ADMIN_EMAIL ? 'super-admin' : '1',
      email,
      name: email === SUPER_ADMIN_EMAIL ? 'Super Admin' : 'Admin User',
      role: email === SUPER_ADMIN_EMAIL ? 'super_admin' : 'admin'
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    setIsSettingUp(false);
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsSettingUp(false);
  };

  const sendPasswordSetupLink = (email: string) => {
    console.log("Password setup link sent to:", email);
  };

  const value = {
    isAuthenticated,
    user,
    isSettingUp,
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
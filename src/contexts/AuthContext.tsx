import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Partner {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isSettingUp: boolean;
  partners: Partner[];
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  sendPasswordSetupLink: (email: string) => void;
  addPartner: (partner: Omit<Partner, 'id' | 'status'>) => void;
  activateUser: (email: string) => void;
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

const initialPartners: Partner[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    role: "Faculty Member",
    status: "Active"
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    email: "m.chen@business.edu",
    role: "Judge",
    status: "Active"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    email: "emily.r@institute.org",
    role: "Ambassador",
    status: "Inactive"
  }
];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [partners, setPartners] = useState<Partner[]>(initialPartners);

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

  const addPartner = (partner: Omit<Partner, 'id' | 'status'>) => {
    const newPartner: Partner = {
      ...partner,
      id: Math.max(...partners.map(p => p.id)) + 1,
      status: "Inactive"
    };
    setPartners(prev => [...prev, newPartner]);
    // Automatically send password setup link
    sendPasswordSetupLink(partner.email);
  };

  const activateUser = (email: string) => {
    setPartners(prev => 
      prev.map(partner => 
        partner.email === email 
          ? { ...partner, status: "Active" }
          : partner
      )
    );
    console.log("User activated:", email);
  };

  const value = {
    isAuthenticated,
    user,
    isSettingUp,
    partners,
    signIn,
    signOut,
    sendPasswordSetupLink,
    addPartner,
    activateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
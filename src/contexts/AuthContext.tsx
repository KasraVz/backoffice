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
  pendingEmail: string | null;
  partners: Partner[];
  signIn: (email: string, password: string) => Promise<boolean>;
  verifyOtpAndSignIn: (otp: string) => Promise<void>;
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
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [partners, setPartners] = useState<Partner[]>(initialPartners);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Mock password validation with delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Simple mock validation: require at least 4 characters
    if (!password || password.length < 4) {
      throw new Error('Invalid email or password');
    }

    // Stage pending email for OTP verification
    setPendingEmail(email);
    setUser(null);
    setIsAuthenticated(false);
    return true;
  };

  const verifyOtpAndSignIn = async (otp: string): Promise<void> => {
    // Mock OTP verification with delay
    await new Promise(resolve => setTimeout(resolve, 600));

    if (!/^\d{6}$/.test(otp)) {
      throw new Error('Invalid OTP');
    }

    const email = pendingEmail || 'user@example.com';
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0] || 'User',
      role: 'admin',
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    setPendingEmail(null);
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    setPendingEmail(null);
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
    pendingEmail,
    partners,
    signIn,
    verifyOtpAndSignIn,
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
import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  roles?: string[];
  status: string;
  permissionOverrides?: {
    granted: string[];
    revoked: string[];
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  pendingEmail: string | null;
  admins: Admin[];
  signIn: (email: string, password: string) => Promise<boolean>;
  verifyOtpAndSignIn: (otp: string) => Promise<void>;
  signOut: () => void;
  sendPasswordSetupLink: (email: string) => void;
  updateAdminStatus: (adminId: string, status: string) => void;
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

const initialAdmins: Admin[] = [
  { id: "1", name: "John Smith", email: "john.smith@company.com", role: "Admin", status: "Active" },
  { id: "2", name: "Sarah Johnson", email: "sarah.johnson@company.com", role: "Admin", status: "Active" },
  { id: "3", name: "Mike Wilson", email: "mike.wilson@company.com", role: "Admin", status: "Inactive" },
  { id: "4", name: "Emily Davis", email: "emily.davis@company.com", role: "Admin", status: "Active" },
  {
    id: "5",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    role: "Faculty Member",
    roles: ["Faculty Member"],
    status: "Active"
  },
  {
    id: "6",
    name: "Prof. Michael Chen",
    email: "m.chen@business.edu",
    role: "Judge",
    roles: ["Judge"],
    status: "Active"
  },
  {
    id: "7",
    name: "Dr. Emily Rodriguez",
    email: "emily.r@institute.org",
    role: "Ambassador",
    roles: ["Ambassador"],
    status: "Inactive"
  }
];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);

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

  const updateAdminStatus = (adminId: string, status: string) => {
    setAdmins(prev => 
      prev.map(admin => 
        admin.id === adminId 
          ? { ...admin, status }
          : admin
      )
    );
  };

  const activateUser = (email: string) => {
    setAdmins(prev => 
      prev.map(admin => 
        admin.email === email 
          ? { ...admin, status: "Active" }
          : admin
      )
    );
    console.log("User activated:", email);
  };

  const value = {
    isAuthenticated,
    user,
    pendingEmail,
    admins,
    signIn,
    verifyOtpAndSignIn,
    signOut,
    sendPasswordSetupLink,
    updateAdminStatus,
    activateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
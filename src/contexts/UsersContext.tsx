import { createContext, useContext, useState, ReactNode } from "react";

export type UserStatus = "Active" | "Inactive";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role?: string; // primary role (first of roles)
  roles: string[]; // multi-role support
  status: UserStatus;
  permissionOverrides?: {
    granted: string[];
    revoked: string[];
  };
}

interface UsersContextType {
  users: AdminUser[];
  addUser: (user: AdminUser) => void;
  updateUser: (user: AdminUser) => void;
  toggleUserStatus: (id: string) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const useUsers = () => {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error("useUsers must be used within a UsersProvider");
  return ctx;
};

const initialUsers: AdminUser[] = [
  // Existing admins
  { id: "1", name: "John Smith", email: "john.smith@company.com", role: "Super Admin", roles: ["Super Admin"], status: "Active" },
  { id: "2", name: "Sarah Johnson", email: "sarah.johnson@company.com", role: "Admin", roles: ["Admin"], status: "Active" },
  { id: "3", name: "Mike Wilson", email: "mike.wilson@company.com", role: "Admin", roles: ["Admin"], status: "Inactive" },
  { id: "4", name: "Emily Davis", email: "emily.davis@company.com", role: "Admin", roles: ["Admin"], status: "Active" },
  // Existing partners
  { id: "p1", name: "Dr. Sarah Johnson", email: "sarah.johnson@university.edu", role: "Faculty Member", roles: ["Faculty Member"], status: "Active" },
  { id: "p2", name: "Prof. Michael Chen", email: "m.chen@business.edu", role: "Judge", roles: ["Judge"], status: "Active" },
  { id: "p3", name: "Dr. Emily Rodriguez", email: "emily.r@institute.org", role: "Ambassador", roles: ["Ambassador"], status: "Inactive" },
];

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);

  const addUser = (user: AdminUser) => {
    setUsers((prev) => [{ ...user, id: user.id || Date.now().toString(), role: user.roles?.[0] }, ...prev]);
  };

  const updateUser = (user: AdminUser) => {
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, ...user, role: user.roles?.[0] || user.role } : u)));
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u))
    );
  };

  return (
    <UsersContext.Provider value={{ users, addUser, updateUser, toggleUserStatus }}>
      {children}
    </UsersContext.Provider>
  );
};

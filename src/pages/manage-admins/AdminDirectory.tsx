import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const mockAdmins = [
  { id: "1", name: "John Smith", email: "john.smith@company.com", role: "Super Admin", status: "Active" },
  { id: "2", name: "Sarah Johnson", email: "sarah.johnson@company.com", role: "Admin", status: "Active" },
  { id: "3", name: "Mike Wilson", email: "mike.wilson@company.com", role: "Admin", status: "Inactive" },
  { id: "4", name: "Emily Davis", email: "emily.davis@company.com", role: "Admin", status: "Active" },
];

const AdminDirectory = () => {
  const [admins, setAdmins] = useState(mockAdmins);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("");
  const { sendPasswordSetupLink } = useAuth();
  const { toast } = useToast();

  const adminRoles = ["Admin", "Content Manager"];
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdminEmail);
  const isFormValid = isEmailValid && newAdminRole !== "";

  const handleSendPasswordLink = (email: string, name: string) => {
    sendPasswordSetupLink(email);
    toast({
      title: "Password Link Sent",
      description: `Password setup/reset link has been sent to ${name} at ${email}`,
    });
  };

  const handleAddAdmin = () => {
    const newAdmin = {
      id: Date.now().toString(),
      name: newAdminEmail.split('@')[0], // Use email prefix as temporary name
      email: newAdminEmail,
      role: newAdminRole,
      status: "Active"
    };

    setAdmins(prev => [...prev, newAdmin]);
    setNewAdminEmail("");
    setNewAdminRole("");
    setShowAddDialog(false);
    
    toast({
      title: "Admin Added",
      description: `${newAdminEmail} has been added as ${newAdminRole}`,
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Admin Directory</h1>
          </header>
          <main className="flex-1 p-6 bg-background mx-[27px]">
            <div className="max-w-6xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Admin Directory</h2>
                  <p className="text-muted-foreground">Manage administrator accounts and permissions</p>
                </div>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button>Add New Admin</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Admin</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          placeholder="admin@example.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role *</Label>
                        <Select value={newAdminRole} onValueChange={setNewAdminRole} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            {adminRoles.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleAddAdmin}
                        disabled={!isFormValid}
                        className="w-full"
                      >
                        Done
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">{admin.name}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>{admin.role}</TableCell>
                        <TableCell>
                          <Badge variant={admin.status === "Active" ? "default" : "secondary"}>
                            {admin.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Send Password Link
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Send Password Setup Link</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to send a password setup/reset link to this user?
                                    This will allow them to set or reset their password.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleSendPasswordLink(admin.email, admin.name)}
                                  >
                                    Send Link
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              {admin.status === "Active" ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDirectory;
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const InviteAdminPage = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { sendPasswordSetupLink } = useAuth();
  const { toast } = useToast();

  const mockRoles = ['Admin', 'Super Admin', 'Content Manager'];

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isEmailValid && role !== "";

  const handleSendInvitation = () => {
    sendPasswordSetupLink(email);
    toast({
      title: "Success",
      description: "Invitation sent successfully!"
    });
    
    // Clear form
    setEmail("");
    setRole("");
    setShowConfirmDialog(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="h-12 flex items-center border-b bg-background px-4">
            <SidebarTrigger />
          </header>
          <div className="container mx-auto p-6">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">Invite New Admin</h1>
              <p className="text-muted-foreground mb-8">
                Send an invitation to a new user to set up their back-office account.
              </p>

              <Card>
                <CardHeader>
                  <CardTitle>Admin Invitation Form</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Admin's Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Assign a Role *</Label>
                    <Select value={role} onValueChange={setRole} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockRoles.map((roleName) => (
                          <SelectItem key={roleName} value={roleName}>
                            {roleName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <AlertDialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        disabled={!isFormValid}
                        onClick={() => setShowConfirmDialog(true)}
                      >
                        Send Invitation
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Invitation</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to invite {email} as a {role}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSendInvitation}>
                          Send Invitation
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default InviteAdminPage;
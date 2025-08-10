import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
const OperationalPartnerDirectory = () => {
  const { partners, sendPasswordSetupLink, addPartner } = useAuth();
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: "",
    email: "",
    role: ""
  });

  const handleSendPasswordLink = (email: string, name: string) => {
    sendPasswordSetupLink(email);
    toast({
      title: "Password Link Sent",
      description: `Password setup/reset link has been sent to ${name} at ${email}`,
    });
  };

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.email || !newPartner.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    addPartner(newPartner);
    setNewPartner({ name: "", email: "", role: "" });
    setIsAddModalOpen(false);
    
    toast({
      title: "Partner Added",
      description: `${newPartner.name} has been added and will receive a password setup link.`,
    });
  };

  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Operational Partner Directory</h1>
          </header>
          <main className="flex-1 p-8 bg-gray-50 mx-[27px]">
            <div className="max-w-6xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Operational Partner Directory</h2>
                  <p className="text-muted-foreground">
                    Manage faculty members, judges, and ambassadors
                  </p>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Add New Partner
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleAddPartner}>
                      <DialogHeader>
                        <DialogTitle>Add New Partner</DialogTitle>
                        <DialogDescription>
                          Create a new partner account. They will receive an email to set up their password.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name *
                          </Label>
                          <Input
                            id="name"
                            value={newPartner.name}
                            onChange={(e) => setNewPartner(prev => ({ ...prev, name: e.target.value }))}
                            className="col-span-3"
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Email *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={newPartner.email}
                            onChange={(e) => setNewPartner(prev => ({ ...prev, email: e.target.value }))}
                            className="col-span-3"
                            placeholder="Enter email address"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="role" className="text-right">
                            Role *
                          </Label>
                          <Select value={newPartner.role} onValueChange={(value) => setNewPartner(prev => ({ ...prev, role: value }))}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Faculty Reviewer">Faculty Reviewer</SelectItem>
                              <SelectItem value="Faculty Member">Faculty Member</SelectItem>
                              <SelectItem value="Judge">Judge</SelectItem>
                              <SelectItem value="Ambassador">Ambassador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Add Partner</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Partner Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners.map(partner => <TableRow key={partner.id}>
                        <TableCell className="font-medium">{partner.name}</TableCell>
                        <TableCell>{partner.email}</TableCell>
                        <TableCell>{partner.role}</TableCell>
                        <TableCell>
                          <Badge variant={partner.status === "Active" ? "default" : "secondary"}>
                            {partner.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-1">
                              <Edit className="h-3 w-3" />
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
                                    onClick={() => handleSendPasswordLink(partner.email, partner.name)}
                                  >
                                    Send Link
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <Button variant="outline" size="sm" className={partner.status === "Active" ? "text-destructive" : ""}>
                              {partner.status === "Active" ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>;
};
export default OperationalPartnerDirectory;
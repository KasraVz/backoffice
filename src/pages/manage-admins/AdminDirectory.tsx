import { useState, useEffect } from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { permissionCategories } from "@/data/permissions";

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

  // Role to permissions mapping for inheritance
  const rolePermissionsMap: Record<string, string[]> = {
    "Admin": [
      "questionnaire:view","questionnaire:create","questionnaire:edit","questionnaire:publish","questionnaire:archive","questionnaire:delete",
      "bank:view","bank:create","bank:edit","bank:delete",
      "submission:view","submission:review",
      "partner:view","partner:create","partner:edit","partner:assign_review",
      "admin:view","admin:create","admin:edit_roles",
      "faculty:review_questions"
    ],
    "Content Manager": [
      "questionnaire:view","questionnaire:create","questionnaire:edit","questionnaire:publish",
      "bank:view","bank:create","bank:edit",
      "submission:view"
    ]
  };

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any | null>(null);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [editStatus, setEditStatus] = useState("Active");

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const getBasePermissions = (roles: string[]) => {
    const perms = new Set<string>();
    roles.forEach(r => rolePermissionsMap[r]?.forEach(p => perms.add(p)));
    return Array.from(perms);
  };

  useEffect(() => {
    if (isEditOpen && editingAdmin) {
      setEditName(editingAdmin.name || "");
      setEditEmail(editingAdmin.email || "");
      const rolesFromAdmin = Array.isArray(editingAdmin.roles)
        ? editingAdmin.roles
        : (adminRoles.includes(editingAdmin.role) ? [editingAdmin.role] : []);
      setSelectedRoles(rolesFromAdmin);
      setEditStatus(editingAdmin.status || "Active");
      const base = getBasePermissions(rolesFromAdmin);
      let effective = [...base];
      const overrides = editingAdmin.permissionOverrides;
      if (overrides?.granted) {
        effective = Array.from(new Set([...effective, ...overrides.granted]));
      }
      if (overrides?.revoked) {
        effective = effective.filter((p: string) => !overrides.revoked.includes(p));
      }
      setSelectedPermissions(effective);
    }
  }, [isEditOpen, editingAdmin]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleCategoryToggle = (categoryPermissions: string[]) => {
    const allSelected = categoryPermissions.every(p => selectedPermissions.includes(p));
    setSelectedPermissions(prev => {
      if (allSelected) return prev.filter(p => !categoryPermissions.includes(p));
      const toAdd = categoryPermissions.filter(p => !prev.includes(p));
      return [...prev, ...toAdd];
    });
  };

  const isCategorySelected = (categoryPermissions: string[]) =>
    categoryPermissions.every(p => selectedPermissions.includes(p));

  const isCategoryIndeterminate = (categoryPermissions: string[]) => {
    const count = categoryPermissions.filter(p => selectedPermissions.includes(p)).length;
    return count > 0 && count < categoryPermissions.length;
  };

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  const handleSaveChanges = () => {
    if (!editingAdmin) return;
    const base = getBasePermissions(selectedRoles);
    const granted = selectedPermissions.filter(p => !base.includes(p));
    const revoked = base.filter(p => !selectedPermissions.includes(p));

    const updated = {
      ...editingAdmin,
      name: editName,
      email: editEmail,
      status: editStatus,
      role: selectedRoles[0] || editingAdmin.role || "",
      roles: selectedRoles,
      permissionOverrides: { granted, revoked }
    };

    setAdmins(prev => prev.map(a => a.id === editingAdmin.id ? updated : a));
    setIsEditOpen(false);
    setEditingAdmin(null);
    toast({ title: "Admin Updated", description: `${editName} has been updated.` });
  };

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

              {/* Edit Admin Dialog */}
              <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setEditingAdmin(null); }}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Edit Admin</DialogTitle>
                  </DialogHeader>

                  <Tabs defaultValue="profile">
                    <TabsList className="mb-4">
                      <TabsTrigger value="profile">Profile</TabsTrigger>
                      <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Name</Label>
                          <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-email">Email</Label>
                          <Input id="edit-email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Roles</Label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-full justify-between">
                                {selectedRoles.length > 0 ? selectedRoles.join(", ") : "Select roles"}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                              {adminRoles.map((role) => (
                                <DropdownMenuCheckboxItem
                                  key={role}
                                  checked={selectedRoles.includes(role)}
                                  onCheckedChange={() => toggleRole(role)}
                                >
                                  {role}
                                </DropdownMenuCheckboxItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Status</Label>
                          <Select value={editStatus} onValueChange={setEditStatus}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="permissions">
                      <div className="space-y-6 max-h-[50vh] overflow-auto pr-2">
                        {Object.entries(permissionCategories).map(([category, permissions]) => {
                          const categoryPermissionIds = permissions.map(p => p.id);
                          const selected = isCategorySelected(categoryPermissionIds);
                          const indeterminate = isCategoryIndeterminate(categoryPermissionIds);
                          
                          return (
                            <div key={category} className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={selected}
                                  data-state={indeterminate ? 'indeterminate' : undefined}
                                  onCheckedChange={() => handleCategoryToggle(categoryPermissionIds)}
                                />
                                <h3 className="font-semibold">{category}</h3>
                              </div>

                              <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                                {permissions.map((permission) => (
                                  <div key={permission.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      checked={selectedPermissions.includes(permission.id)}
                                      onCheckedChange={() => handlePermissionToggle(permission.id)}
                                    />
                                    <label className="text-sm">{permission.label}</label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => { setIsEditOpen(false); setEditingAdmin(null); }}>Cancel</Button>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                  </div>
                </DialogContent>
              </Dialog>

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
                        <TableCell>{Array.isArray((admin as any).roles) ? (admin as any).roles.join(", ") : admin.role}</TableCell>
                        <TableCell>
                          <Badge variant={admin.status === "Active" ? "default" : "secondary"}>
                            {admin.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => { setEditingAdmin(admin); setIsEditOpen(true); }}>
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
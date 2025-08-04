import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Users } from "lucide-react";

const mockRoles = [
  {
    id: "1",
    name: "Standard User",
    description: "Basic access to standard assessments",
    userCount: 892,
    permissions: {
      accessStandardAssessments: true,
      accessPremiumAssessments: false,
      viewDetailedReports: false,
      accessCommunityFeatures: true,
      exportResults: false,
    }
  },
  {
    id: "2",
    name: "Premium Subscriber",
    description: "Enhanced access with detailed analytics",
    userCount: 234,
    permissions: {
      accessStandardAssessments: true,
      accessPremiumAssessments: true,
      viewDetailedReports: true,
      accessCommunityFeatures: true,
      exportResults: true,
    }
  },
  {
    id: "3",
    name: "Corporate Client",
    description: "Enterprise-level access for organizations",
    userCount: 121,
    permissions: {
      accessStandardAssessments: true,
      accessPremiumAssessments: true,
      viewDetailedReports: true,
      accessCommunityFeatures: true,
      exportResults: true,
    }
  },
];

const permissionLabels = {
  accessStandardAssessments: "Access to Standard Assessments",
  accessPremiumAssessments: "Access to Premium Assessments",
  viewDetailedReports: "View Detailed Reports & Analytics",
  accessCommunityFeatures: "Access Community Features",
  exportResults: "Export Assessment Results",
};

const UserRolesPermissions = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<typeof mockRoles[0] | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: {
      accessStandardAssessments: false,
      accessPremiumAssessments: false,
      viewDetailedReports: false,
      accessCommunityFeatures: false,
      exportResults: false,
    }
  });

  const handleCreateRole = () => {
    const newRole = {
      id: (roles.length + 1).toString(),
      name: formData.name,
      description: formData.description,
      userCount: 0,
      permissions: { ...formData.permissions }
    };
    setRoles([...roles, newRole]);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleEditRole = () => {
    if (!editingRole) return;
    
    setRoles(roles.map(role => 
      role.id === editingRole.id 
        ? { ...role, name: formData.name, description: formData.description, permissions: { ...formData.permissions } }
        : role
    ));
    setEditingRole(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      permissions: {
        accessStandardAssessments: false,
        accessPremiumAssessments: false,
        viewDetailedReports: false,
        accessCommunityFeatures: false,
        exportResults: false,
      }
    });
  };

  const openEditModal = (role: typeof mockRoles[0]) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: { ...role.permissions }
    });
  };

  const updatePermission = (permission: keyof typeof formData.permissions, checked: boolean) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permission]: checked
      }
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">User Roles & Permissions</h1>
          </header>
          <main className="flex-1 p-6 bg-background mx-[27px] space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>End-User Roles</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    Manage user roles and permissions for platform access
                  </p>
                </div>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Role</DialogTitle>
                      <DialogDescription>
                        Define a new user role with specific permissions
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Role Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Premium User"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Brief description of this role"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Permissions</Label>
                        <div className="space-y-2">
                          {Object.entries(permissionLabels).map(([key, label]) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox
                                id={key}
                                checked={formData.permissions[key as keyof typeof formData.permissions]}
                                onCheckedChange={(checked) => updatePermission(key as keyof typeof formData.permissions, checked as boolean)}
                              />
                              <Label htmlFor={key} className="text-sm font-normal">{label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleCreateRole}>Create Role</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>User Count</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                            {role.userCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(role.permissions)
                              .filter(([_, enabled]) => enabled)
                              .map(([permission]) => (
                                <Badge key={permission} variant="secondary" className="text-xs">
                                  {permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </Badge>
                              ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Dialog open={editingRole?.id === role.id} onOpenChange={(open) => !open && setEditingRole(null)}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => openEditModal(role)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Edit Role</DialogTitle>
                                <DialogDescription>
                                  Modify role settings and permissions
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-name">Role Name</Label>
                                  <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Input
                                    id="edit-description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Permissions</Label>
                                  <div className="space-y-2">
                                    {Object.entries(permissionLabels).map(([key, label]) => (
                                      <div key={key} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`edit-${key}`}
                                          checked={formData.permissions[key as keyof typeof formData.permissions]}
                                          onCheckedChange={(checked) => updatePermission(key as keyof typeof formData.permissions, checked as boolean)}
                                        />
                                        <Label htmlFor={`edit-${key}`} className="text-sm font-normal">{label}</Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit" onClick={handleEditRole}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserRolesPermissions;
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { permissionCategories } from "@/data/permissions";

interface Role {
  id: number;
  name: string;
  permissions: string[];
}

const mockRoles: Role[] = [
  { 
    id: 1, 
    name: 'Super Admin', 
    permissions: Object.values(permissionCategories).flat().map(p => p.id)
  },
  { 
    id: 2, 
    name: 'Faculty Reviewer', 
    permissions: ['faculty:review_questions', 'submission:view']
  },
  { 
    id: 3, 
    name: 'Content Manager', 
    permissions: ['questionnaire:view', 'questionnaire:create', 'questionnaire:edit', 'bank:view', 'bank:create', 'bank:edit']
  },
];

const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(roles[0]?.permissions || []);
  const { toast } = useToast();

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setSelectedPermissions(role.permissions);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSavePermissions = () => {
    if (!selectedRole) return;

    setRoles(prev => prev.map(role => 
      role.id === selectedRole.id 
        ? { ...role, permissions: selectedPermissions }
        : role
    ));

    setSelectedRole({ ...selectedRole, permissions: selectedPermissions });

    toast({
      title: "Permissions Updated",
      description: `Permissions for ${selectedRole.name} have been saved successfully.`,
    });
  };

  const handleAddNewRole = () => {
    const newRole: Role = {
      id: Math.max(...roles.map(r => r.id)) + 1,
      name: `New Role ${roles.length + 1}`,
      permissions: []
    };
    setRoles(prev => [...prev, newRole]);
    setSelectedRole(newRole);
    setSelectedPermissions([]);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Role Management</h1>
          </header>
          <main className="flex-1 p-6 bg-background mx-[27px]">
            <div className="max-w-7xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Role Management</h2>
                <p className="text-muted-foreground">Configure roles and permissions for administrator accounts</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Roles List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      Roles
                      <Button onClick={handleAddNewRole} size="sm">
                        Add New Role
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {roles.map((role) => (
                        <div
                          key={role.id}
                          onClick={() => handleRoleSelect(role)}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedRole?.id === role.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{role.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {role.permissions.length} permissions assigned
                              </p>
                            </div>
                            <Badge variant="secondary">
                              {role.permissions.length}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Right Column - Permissions Checklist */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedRole ? `Permissions for ${selectedRole.name}` : 'Select a role'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedRole ? (
                      <div className="space-y-6">
                        {Object.entries(permissionCategories).map(([category, permissions]) => (
                          <div key={category}>
                            <h4 className="font-semibold text-sm mb-3 text-foreground/80">
                              {category}
                            </h4>
                            <div className="space-y-2 ml-4">
                              {permissions.map((permission) => (
                                <div key={permission.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={permission.id}
                                    checked={selectedPermissions.includes(permission.id)}
                                    onCheckedChange={() => handlePermissionToggle(permission.id)}
                                  />
                                  <label
                                    htmlFor={permission.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    {permission.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        <div className="pt-4 border-t">
                          <Button onClick={handleSavePermissions} className="w-full">
                            Save Permissions
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Select a role from the left to view and edit its permissions
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default RoleManagement;
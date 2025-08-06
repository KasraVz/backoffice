import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { permissionCategories } from '@/data/permissions';
import { useToast } from '@/hooks/use-toast';

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

const mockRoles: Role[] = [
  { id: '1', name: 'Admin', permissions: ['questionnaire:view', 'questionnaire:create', 'bank:view', 'admin:view'] },
  { id: '2', name: 'Content Manager', permissions: ['questionnaire:view', 'questionnaire:create', 'bank:view', 'bank:create'] },
  { id: '3', name: 'Faculty Member', permissions: ['faculty:review_questions'] },
  { id: '4', name: 'Ambassador', permissions: ['questionnaire:view', 'submission:view'] },
  { id: '5', name: 'Judge', permissions: ['submission:view', 'submission:review'] }
];

const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (selectedRole) {
      setSelectedPermissions([...selectedRole.permissions]);
      setHasChanges(false);
    }
  }, [selectedRole]);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setIsAddingRole(false);
    setNewRoleName('');
  };

  const handlePermissionToggle = (permissionId: string) => {
    const newPermissions = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter(p => p !== permissionId)
      : [...selectedPermissions, permissionId];
    
    setSelectedPermissions(newPermissions);
    setHasChanges(true);
  };

  const handleCategoryToggle = (categoryPermissions: string[]) => {
    const allCategorySelected = categoryPermissions.every(p => selectedPermissions.includes(p));
    
    let newPermissions: string[];
    if (allCategorySelected) {
      // Remove all category permissions
      newPermissions = selectedPermissions.filter(p => !categoryPermissions.includes(p));
    } else {
      // Add all category permissions
      const permissionsToAdd = categoryPermissions.filter(p => !selectedPermissions.includes(p));
      newPermissions = [...selectedPermissions, ...permissionsToAdd];
    }
    
    setSelectedPermissions(newPermissions);
    setHasChanges(true);
  };

  const isCategorySelected = (categoryPermissions: string[]) => {
    return categoryPermissions.every(p => selectedPermissions.includes(p));
  };

  const isCategoryIndeterminate = (categoryPermissions: string[]) => {
    const selectedCount = categoryPermissions.filter(p => selectedPermissions.includes(p)).length;
    return selectedCount > 0 && selectedCount < categoryPermissions.length;
  };

  const handleSavePermissions = () => {
    if (selectedRole) {
      const updatedRoles = roles.map(role =>
        role.id === selectedRole.id
          ? { ...role, permissions: selectedPermissions }
          : role
      );
      setRoles(updatedRoles);
      setSelectedRole({ ...selectedRole, permissions: selectedPermissions });
      setHasChanges(false);
      toast({
        title: "Permissions Updated",
        description: `Permissions for ${selectedRole.name} have been saved successfully.`,
      });
    }
  };

  const handleAddNewRole = () => {
    if (newRoleName.trim()) {
      const newRole: Role = {
        id: Date.now().toString(),
        name: newRoleName.trim(),
        permissions: []
      };
      setRoles([...roles, newRole]);
      setSelectedRole(newRole);
      setIsAddingRole(false);
      setNewRoleName('');
      toast({
        title: "Role Added",
        description: `${newRole.name} role has been created successfully.`,
      });
    }
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
                <p className="text-muted-foreground">
                  Manage administrative roles and their permissions
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Roles List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Roles</CardTitle>
                    <Button
                      onClick={() => setIsAddingRole(true)}
                      className="w-full"
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Role
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {isAddingRole && (
                      <div className="flex gap-2 p-2 border rounded-md">
                        <Input
                          placeholder="Role name"
                          value={newRoleName}
                          onChange={(e) => setNewRoleName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddNewRole()}
                        />
                        <Button size="sm" onClick={handleAddNewRole} disabled={!newRoleName.trim()}>
                          Add
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setIsAddingRole(false);
                          setNewRoleName('');
                        }}>
                          Cancel
                        </Button>
                      </div>
                    )}
                    
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                          selectedRole?.id === role.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                        onClick={() => handleRoleSelect(role)}
                      >
                        <div className="font-medium">{role.name}</div>
                        <div className="text-sm opacity-70">
                          {role.permissions.length} permissions
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Right Column - Permissions */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedRole ? `Permissions for ${selectedRole.name}` : 'Select a Role'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedRole ? (
                      <div className="space-y-6">
                        {Object.entries(permissionCategories).map(([category, permissions]) => {
                          const categoryPermissionIds = permissions.map(p => p.id);
                          const isSelected = isCategorySelected(categoryPermissionIds);
                          const isIndeterminate = isCategoryIndeterminate(categoryPermissionIds);

                          return (
                            <div key={category} className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={isSelected}
                                  data-state={isIndeterminate ? 'indeterminate' : undefined}
                                  onCheckedChange={() => handleCategoryToggle(categoryPermissionIds)}
                                />
                                <h3 className="font-semibold">{category}</h3>
                              </div>
                              
                              <div className="ml-6 space-y-2">
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

                        <Button
                          onClick={handleSavePermissions}
                          disabled={!hasChanges}
                          className="w-full mt-6"
                        >
                          Save Permissions
                        </Button>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Select a role from the left to manage its permissions
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
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUsers } from "@/contexts/UsersContext";
const OperationalPartnerDirectory = () => {
  const { users, toggleUserStatus } = useUsers();
  const partnerRoles = ["Faculty Member", "Judge", "Ambassador"];
  const filteredUsers = users.filter(u => Array.isArray((u as any).roles) && (u as any).roles.some((r: string) => partnerRoles.includes(r)));


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
                </div>
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
                    {filteredUsers.map((u: any) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{Array.isArray(u.roles) ? u.roles.join(", ") : u.role}</TableCell>
                        <TableCell>
                          <Badge variant={u.status === "Active" ? "default" : "secondary"}>
                            {u.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className={u.status === "Active" ? "text-destructive" : ""}
                              onClick={() => toggleUserStatus(u.id)}
                            >
                              {u.status === "Active" ? "Deactivate" : "Activate"}
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
    </SidebarProvider>;
};
export default OperationalPartnerDirectory;
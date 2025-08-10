import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
const OperationalPartnerDirectory = () => {
  const { admins, updateAdminStatus } = useAuth();
  const { toast } = useToast();

  // Filter to show only partners (Faculty Member, Judge, Ambassador)
  const partners = admins.filter(admin => {
    const roles = Array.isArray(admin.roles) ? admin.roles : [admin.role];
    return roles.some(role => ["Faculty Member", "Judge", "Ambassador"].includes(role));
  });

  const handleToggleStatus = (adminId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    updateAdminStatus(adminId, newStatus);
    toast({
      title: "Status Updated",
      description: `Partner status has been ${newStatus.toLowerCase()}.`,
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
                    View faculty members, judges, and ambassadors. To add new partners, use the Admin Directory.
                  </p>
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
                    {partners.map(partner => (
                      <TableRow key={partner.id}>
                        <TableCell className="font-medium">{partner.name}</TableCell>
                        <TableCell>{partner.email}</TableCell>
                        <TableCell>{Array.isArray(partner.roles) ? partner.roles.join(", ") : partner.role}</TableCell>
                        <TableCell>
                          <Badge variant={partner.status === "Active" ? "default" : "secondary"}>
                            {partner.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={partner.status === "Active" ? "text-destructive" : ""}
                            onClick={() => handleToggleStatus(partner.id, partner.status)}
                          >
                            {partner.status === "Active" ? "Deactivate" : "Activate"}
                          </Button>
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
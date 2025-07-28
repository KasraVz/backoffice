import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, UserPlus } from "lucide-react";
const mockPartners = [{
  id: 1,
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@university.edu",
  role: "Faculty Member",
  status: "Active"
}, {
  id: 2,
  name: "Prof. Michael Chen",
  email: "m.chen@business.edu",
  role: "Judge",
  status: "Active"
}, {
  id: 3,
  name: "Dr. Emily Rodriguez",
  email: "emily.r@institute.org",
  role: "Ambassador",
  status: "Inactive"
}];
const OperationalPartnerDirectory = () => {
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
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add New Partner
                </Button>
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
                    {mockPartners.map(partner => <TableRow key={partner.id}>
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
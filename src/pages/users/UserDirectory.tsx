import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Users, UserPlus, TrendingUp, Eye, UserX } from "lucide-react";
import { Link } from "react-router-dom";

const mockUsers = [
  { id: "1", name: "John Smith", email: "john.smith@example.com", status: "Active", dateJoined: "2024-01-15", assessmentsCompleted: 5 },
  { id: "2", name: "Sarah Johnson", email: "sarah.j@example.com", status: "Active", dateJoined: "2024-02-03", assessmentsCompleted: 3 },
  { id: "3", name: "Mike Wilson", email: "m.wilson@example.com", status: "Inactive", dateJoined: "2024-01-28", assessmentsCompleted: 1 },
  { id: "4", name: "Emma Davis", email: "emma.davis@example.com", status: "Pending Verification", dateJoined: "2024-03-10", assessmentsCompleted: 0 },
  { id: "5", name: "David Brown", email: "d.brown@example.com", status: "Active", dateJoined: "2024-02-20", assessmentsCompleted: 8 },
];

const kpiData = [
  { title: "Total Users", value: "1,247", icon: Users },
  { title: "New Users (Last 30 Days)", value: "89", icon: UserPlus },
  { title: "Total Assessments Completed", value: "3,456", icon: TrendingUp },
];

const UserDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Inactive": return "secondary";
      case "Pending Verification": return "outline";
      default: return "default";
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">User Directory</h1>
          </header>
          <main className="flex-1 p-6 bg-background mx-[27px] space-y-6">
            {/* KPI Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {kpiData.map((kpi) => {
                const IconComponent = kpi.icon;
                return (
                  <Card key={kpi.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{kpi.value}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="max-w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Pending Verification">Pending Verification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Joined</TableHead>
                      <TableHead>Assessments Completed</TableHead>
                      <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.dateJoined}</TableCell>
                        <TableCell>{user.assessmentsCompleted}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/users/profiles/${user.id}`} className="flex items-center">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Profile
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

export default UserDirectory;
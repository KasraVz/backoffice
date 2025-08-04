import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Download, Filter } from "lucide-react";
import { useState, useMemo } from "react";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target?: string;
  ipAddress: string;
  severity: "low" | "medium" | "high";
}

const mockAuditData: AuditLogEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-15 14:30:22",
    user: "admin@company.com",
    action: "User Login",
    ipAddress: "192.168.1.100",
    severity: "low"
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:25:15",
    user: "sarah.johnson@university.edu",
    action: "Questionnaire Published",
    target: "FPA Assessment Q1 2024",
    ipAddress: "10.0.1.45",
    severity: "medium"
  },
  {
    id: "3",
    timestamp: "2024-01-15 13:45:33",
    user: "m.chen@business.edu",
    action: "Password Reset Attempt",
    ipAddress: "203.0.113.42",
    severity: "medium"
  },
  {
    id: "4",
    timestamp: "2024-01-15 12:22:11",
    user: "admin@company.com",
    action: "Role Permissions Changed",
    target: "Faculty Reviewer Role",
    ipAddress: "192.168.1.100",
    severity: "high"
  },
  {
    id: "5",
    timestamp: "2024-01-15 11:15:44",
    user: "emily.r@institute.org",
    action: "Question Bank Access",
    target: "EEA Industry Specific Questions",
    ipAddress: "172.16.0.23",
    severity: "low"
  },
  {
    id: "6",
    timestamp: "2024-01-15 10:33:17",
    user: "admin@company.com",
    action: "User Account Created",
    target: "newuser@domain.com",
    ipAddress: "192.168.1.100",
    severity: "medium"
  },
  {
    id: "7",
    timestamp: "2024-01-15 09:18:55",
    user: "judge@review.com",
    action: "Review Set Assigned",
    target: "Q1 2024 Review Set #15",
    ipAddress: "198.51.100.14",
    severity: "low"
  },
  {
    id: "8",
    timestamp: "2024-01-15 08:47:29",
    user: "suspicious@temp.com",
    action: "Failed Login Attempt",
    ipAddress: "185.220.100.240",
    severity: "high"
  },
  {
    id: "9",
    timestamp: "2024-01-15 08:12:03",
    user: "sarah.johnson@university.edu",
    action: "Expertise Profile Updated",
    target: "FPA Finance Expertise",
    ipAddress: "10.0.1.45",
    severity: "low"
  },
  {
    id: "10",
    timestamp: "2024-01-14 18:55:41",
    user: "admin@company.com",
    action: "System Configuration Changed",
    target: "Security Settings",
    ipAddress: "192.168.1.100",
    severity: "high"
  },
  {
    id: "11",
    timestamp: "2024-01-14 17:22:18",
    user: "reviewer@panel.org",
    action: "Question Review Completed",
    target: "Question ID: FPA-2024-001",
    ipAddress: "203.0.113.87",
    severity: "low"
  },
  {
    id: "12",
    timestamp: "2024-01-14 16:08:32",
    user: "admin@company.com",
    action: "Data Export Performed",
    target: "User Analytics Report",
    ipAddress: "192.168.1.100",
    severity: "medium"
  }
];

const actionTypes = [
  "All Actions",
  "User Login",
  "Failed Login Attempt", 
  "Password Reset Attempt",
  "Questionnaire Published",
  "Role Permissions Changed",
  "Question Bank Access",
  "User Account Created",
  "Review Set Assigned",
  "Expertise Profile Updated",
  "System Configuration Changed",
  "Question Review Completed",
  "Data Export Performed"
];

const getSeverityBadge = (severity: "low" | "medium" | "high") => {
  const variants = {
    low: "secondary",
    medium: "outline", 
    high: "destructive"
  } as const;
  
  return <Badge variant={variants[severity]}>{severity.toUpperCase()}</Badge>;
};

const AuditLogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("All Actions");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredData = useMemo(() => {
    return mockAuditData.filter(entry => {
      const matchesSearch = entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (entry.target?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      const matchesAction = selectedAction === "All Actions" || entry.action === selectedAction;
      
      return matchesSearch && matchesAction;
    });
  }, [searchTerm, selectedAction]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    console.log("Exporting audit log data...");
    // Here you would implement the actual export functionality
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Security & Audit Log</h1>
          </header>
          
          <main className="flex-1 p-8 bg-gray-50 mx-[28px]">
            <div className="max-w-7xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Activity Overview</CardTitle>
                  <CardDescription>
                    Monitor all security events and system activities across your platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Filter Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by user, action, or target..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="pl-9"
                      />
                    </div>
                    
                    <Select value={selectedAction} onValueChange={(value) => {
                      setSelectedAction(value);
                      setCurrentPage(1);
                    }}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter by action" />
                      </SelectTrigger>
                      <SelectContent>
                        {actionTypes.map((action) => (
                          <SelectItem key={action} value={action}>
                            {action}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>

                  {/* Results Summary */}
                  <div className="mb-4 text-sm text-muted-foreground">
                    Showing {paginatedData.length} of {filteredData.length} entries
                  </div>

                  {/* Audit Log Table */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Target</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Severity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedData.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-mono text-sm">
                              {entry.timestamp}
                            </TableCell>
                            <TableCell>{entry.user}</TableCell>
                            <TableCell className="font-medium">{entry.action}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {entry.target || "—"}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {entry.ipAddress}
                            </TableCell>
                            <TableCell>
                              {getSeverityBadge(entry.severity)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          );
                        })}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AuditLogPage;
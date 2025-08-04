import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Download, Activity, Users, TrendingUp, Filter } from "lucide-react";
import { DateRange } from "react-day-picker";

const mockActivityLogs = [
  { id: "1", timestamp: "2024-03-10 14:30:22", user: "john.smith@example.com", activity: "Started Assessment", details: "FPA General Knowledge", activityType: "Assessment" },
  { id: "2", timestamp: "2024-03-10 14:25:15", user: "sarah.j@example.com", activity: "Completed Module", details: "Risk Management Fundamentals", activityType: "Learning" },
  { id: "3", timestamp: "2024-03-10 14:20:08", user: "m.wilson@example.com", activity: "User Login", details: "Successful login", activityType: "Authentication" },
  { id: "4", timestamp: "2024-03-10 14:15:30", user: "emma.davis@example.com", activity: "Profile Updated", details: "Changed contact information", activityType: "Profile" },
  { id: "5", timestamp: "2024-03-10 14:10:45", user: "d.brown@example.com", activity: "Completed Assessment", details: "EEA Industry Specific - Score: 87%", activityType: "Assessment" },
  { id: "6", timestamp: "2024-03-10 14:05:12", user: "jane.doe@example.com", activity: "Started Learning Path", details: "Financial Planning Certification", activityType: "Learning" },
  { id: "7", timestamp: "2024-03-10 14:00:00", user: "alex.taylor@example.com", activity: "Downloaded Certificate", details: "FPA Certification", activityType: "Certificate" },
  { id: "8", timestamp: "2024-03-10 13:55:33", user: "lisa.martinez@example.com", activity: "Community Post", details: "Posted question in Study Group", activityType: "Community" },
  { id: "9", timestamp: "2024-03-10 13:50:20", user: "robert.jones@example.com", activity: "Password Reset", details: "Password reset successful", activityType: "Authentication" },
  { id: "10", timestamp: "2024-03-10 13:45:18", user: "michelle.lee@example.com", activity: "Purchased Subscription", details: "Premium Plan - 1 Year", activityType: "Commerce" },
];

const activityTypes = [
  "Assessment",
  "Learning", 
  "Authentication",
  "Profile",
  "Certificate",
  "Community",
  "Commerce"
];

const UserActivityLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activityFilter, setActivityFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLogs = mockActivityLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActivity = activityFilter === "all" || log.activityType === activityFilter;
    return matchesSearch && matchesActivity;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const getActivityTypeVariant = (type: string) => {
    switch (type) {
      case "Assessment": return "default";
      case "Learning": return "secondary";
      case "Authentication": return "outline";
      case "Profile": return "destructive";
      case "Certificate": return "default";
      case "Community": return "secondary";
      case "Commerce": return "outline";
      default: return "outline";
    }
  };

  const exportToCsv = () => {
    const headers = ["Timestamp", "User", "Activity", "Details", "Type"];
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map(log => 
        [log.timestamp, log.user, log.activity, log.details, log.activityType].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "user_activity_logs.csv";
    link.click();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">User Activity Logs</h1>
          </header>
          <main className="flex-1 p-6 bg-background mx-[27px] space-y-6">
            {/* Activity Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Activities (Today)</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">342</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assessments Started</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assessments Completed</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">67</div>
                </CardContent>
              </Card>
            </div>

            {/* Activity Feed */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Activity Feed</CardTitle>
                  <p className="text-muted-foreground">
                    Real-time feed of user activities across the platform
                  </p>
                </div>
                <Button onClick={exportToCsv}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Input
                    placeholder="Search by user, activity, or details..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Select value={activityFilter} onValueChange={setActivityFilter}>
                    <SelectTrigger className="max-w-[180px]">
                      <SelectValue placeholder="Filter by activity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Activities</SelectItem>
                      {activityTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                </div>

                {/* Activity Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell className="font-medium">{log.activity}</TableCell>
                        <TableCell>{log.details}</TableCell>
                        <TableCell>
                          <Badge variant={getActivityTypeVariant(log.activityType)}>
                            {log.activityType}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLogs.length)} of {filteredLogs.length} activities
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserActivityLogs;
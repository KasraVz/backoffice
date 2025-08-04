import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, Mail, Hash, ExternalLink } from "lucide-react";

const mockUserData = {
  "1": {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    status: "Active",
    dateJoined: "2024-01-15",
    assessments: [
      { id: "A1", name: "FPA General Knowledge", status: "Completed", score: 85, date: "2024-03-01" },
      { id: "A2", name: "EEA Industry Specific", status: "Completed", score: 92, date: "2024-02-15" },
      { id: "A3", name: "Risk Management Assessment", status: "In Progress", score: null, date: "2024-03-10" },
    ],
    auditLog: [
      { timestamp: "2024-03-10 14:30:22", action: "Started Assessment", target: "Risk Management Assessment", ipAddress: "192.168.1.100" },
      { timestamp: "2024-03-01 09:15:45", action: "Completed Assessment", target: "FPA General Knowledge", ipAddress: "192.168.1.100" },
      { timestamp: "2024-02-20 16:22:10", action: "Password Changed", target: null, ipAddress: "192.168.1.100" },
      { timestamp: "2024-01-15 08:00:00", action: "Account Created", target: null, ipAddress: "192.168.1.100" },
    ]
  }
};

const PrimaryProfiles = () => {
  const { userId } = useParams();
  const userData = userId ? mockUserData[userId as keyof typeof mockUserData] : null;

  if (!userData) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-lg font-semibold">User Profile</h1>
            </header>
            <main className="flex-1 p-6 bg-background mx-[27px]">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
                <Button asChild>
                  <Link to="/users/directory">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to User Directory
                  </Link>
                </Button>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed": return "default";
      case "In Progress": return "outline";
      case "Failed": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <Button variant="ghost" asChild className="mr-4">
              <Link to="/users/directory">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <h1 className="text-lg font-semibold">User Profile</h1>
          </header>
          <main className="flex-1 p-6 bg-background mx-[27px] space-y-6">
            {/* User Summary Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{userData.name}</CardTitle>
                      <p className="text-muted-foreground">{userData.email}</p>
                    </div>
                  </div>
                  <Badge variant={userData.status === "Active" ? "default" : "secondary"}>
                    {userData.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Tabbed Interface */}
            <Tabs defaultValue="profile" className="space-y-4">
              <TabsList>
                <TabsTrigger value="profile">Profile Details</TabsTrigger>
                <TabsTrigger value="assessments">Assessment History</TabsTrigger>
                <TabsTrigger value="audit">Audit Log</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">User ID:</span>
                        <span>{userData.id}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Full Name:</span>
                        <span>{userData.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Email:</span>
                        <span>{userData.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Registration Date:</span>
                        <span>{userData.dateJoined}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assessments">
                <Card>
                  <CardHeader>
                    <CardTitle>Assessment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assessment</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userData.assessments.map((assessment) => (
                          <TableRow key={assessment.id}>
                            <TableCell className="font-medium">{assessment.name}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusVariant(assessment.status)}>
                                {assessment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {assessment.score ? `${assessment.score}%` : "—"}
                            </TableCell>
                            <TableCell>{assessment.date}</TableCell>
                            <TableCell>
                              {assessment.status === "Completed" && (
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/questionnaires/submission-review/${assessment.id}`}>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View Submission
                                  </Link>
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audit">
                <Card>
                  <CardHeader>
                    <CardTitle>User Activity Audit Log</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Target</TableHead>
                          <TableHead>IP Address</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userData.auditLog.map((log, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                            <TableCell>{log.action}</TableCell>
                            <TableCell>{log.target || "—"}</TableCell>
                            <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PrimaryProfiles;
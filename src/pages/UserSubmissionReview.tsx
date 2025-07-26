import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Search, User, Calendar as CalendarIcon, Eye } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Mock data for submissions
const mockSubmissions = [{
  id: 9501,
  userName: "Priya Sharma",
  userEmail: "priya.s@example.com",
  questionnaireName: "FPA - Seed Stage v1.3",
  finalScore: "88/100",
  dateSubmitted: "2025-07-22"
}, {
  id: 9502,
  userName: "John Chen",
  userEmail: "j.chen@example.com",
  questionnaireName: "GEB v2.1",
  finalScore: "76/100",
  dateSubmitted: "2025-07-21"
}, {
  id: 9503,
  userName: "Sarah Johnson",
  userEmail: "sarah.j@example.com",
  questionnaireName: "FPA - Seed Stage v1.3",
  finalScore: "92/100",
  dateSubmitted: "2025-07-20"
}];
export default function UserSubmissionReview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<typeof mockSubmissions>([]);
  const navigate = useNavigate();
  const handleSearch = () => {
    // Simulate search logic
    let filteredResults = mockSubmissions;
    if (searchTerm) {
      filteredResults = filteredResults.filter(submission => submission.userName.toLowerCase().includes(searchTerm.toLowerCase()) || submission.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) || submission.id.toString().includes(searchTerm));
    }
    if (selectedQuestionnaire !== "all") {
      filteredResults = filteredResults.filter(submission => submission.questionnaireName === selectedQuestionnaire);
    }
    setResults(filteredResults);
    setHasSearched(true);
  };
  const handleViewDetails = (submissionId: number) => {
    navigate(`/questionnaires/submission-review/${submissionId}`);
  };
  const renderResultsArea = () => {
    if (!hasSearched) {
      return <div className="flex items-center justify-center h-64 text-muted-foreground">
          Please use the filters above to search for user submissions.
        </div>;
    }
    if (results.length === 0) {
      return <div className="flex items-center justify-center h-64 text-muted-foreground">
          No submissions found matching your criteria.
        </div>;
    }
    return <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Showing 1-{results.length} of {results.length} results
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Submission ID</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>User Email</TableHead>
              <TableHead>Questionnaire Name</TableHead>
              <TableHead>Final Score</TableHead>
              <TableHead>Date Submitted</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map(submission => <TableRow key={submission.id}>
                <TableCell>{submission.id}</TableCell>
                <TableCell>{submission.userName}</TableCell>
                <TableCell>{submission.userEmail}</TableCell>
                <TableCell>{submission.questionnaireName}</TableCell>
                <TableCell>{submission.finalScore}</TableCell>
                <TableCell>{submission.dateSubmitted}</TableCell>
                <TableCell className="text-center">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(submission.id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2 pt-4">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>;
  };
  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[28px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-2xl font-bold">User Submission Review</h1>
          </header>
          
          <main className="flex-1 p-6 bg-background mx-[28px]">
            {/* Search Form */}
            <Card className="bg-muted/50 mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="search-user">Search User</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input id="search-user" placeholder="Search by User Name, Email, or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Filter by Questionnaire</Label>
                    <Select value={selectedQuestionnaire} onValueChange={setSelectedQuestionnaire}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Questionnaires</SelectItem>
                        <SelectItem value="FPA - Seed Stage v1.3">FPA - Seed Stage v1.3</SelectItem>
                        <SelectItem value="GEB v2.1">GEB v2.1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Filter by Date Range</Label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "MMM dd") : "Start Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "MMM dd") : "End Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <Button onClick={handleSearch} className="h-10">
                    <Search className="mr-2 h-4 w-4" />
                    Search Submissions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Area */}
            <Card>
              <CardContent className="p-6">
                {renderResultsArea()}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>;
}
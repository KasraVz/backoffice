import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

// Mock data
const kpiData = {
  totalSubmissions: 1482,
  averageScore: 78.5,
  avgCompletionTime: "22:30"
};
const trendData = [{
  date: "Jul 15",
  score: 76
}, {
  date: "Jul 16",
  score: 78
}, {
  date: "Jul 17",
  score: 75
}, {
  date: "Jul 18",
  score: 81
}, {
  date: "Jul 19",
  score: 79
}, {
  date: "Jul 20",
  score: 82
}, {
  date: "Jul 21",
  score: 80
}, {
  date: "Jul 22",
  score: 85
}];
const behavioralCodeData = [{
  code: "Resilience",
  score: 85
}, {
  code: "Strategy",
  score: 78
}, {
  code: "Leadership",
  score: 82
}, {
  code: "Innovation",
  score: 76
}, {
  code: "Communication",
  score: 88
}, {
  code: "Problem Solving",
  score: 79
}, {
  code: "Decision Making",
  score: 84
}, {
  code: "Team Building",
  score: 77
}, {
  code: "Adaptability",
  score: 81
}, {
  code: "Critical Thinking",
  score: 83
}, {
  code: "Emotional Intelligence",
  score: 86
}, {
  code: "Risk Management",
  score: 74
}];
const difficultQuestions = [{
  rank: 1,
  title: "When faced with unexpected negative cash flow...",
  avgScore: 45
}, {
  rank: 2,
  title: "Which legal structure provides the most liability protection...",
  avgScore: 52
}, {
  rank: 3,
  title: "Describe the best approach to calculating TAM, SAM, and SOM...",
  avgScore: 55
}, {
  rank: 4,
  title: "How should equity be distributed among co-founders...",
  avgScore: 58
}, {
  rank: 5,
  title: "What are the key metrics for measuring product-market fit...",
  avgScore: 61
}];
const easyQuestions = [{
  rank: 1,
  title: "Is a clear value proposition important?",
  avgScore: 98
}, {
  rank: 2,
  title: "Should a startup have a business plan?",
  avgScore: 95
}, {
  rank: 3,
  title: "What does MVP stand for?",
  avgScore: 94
}, {
  rank: 4,
  title: "Is customer feedback valuable for product development?",
  avgScore: 93
}, {
  rank: 5,
  title: "Should startups focus on solving real problems?",
  avgScore: 92
}];
export default function PerformanceAnalytics() {
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedDateRange, setSelectedDateRange] = useState("all-time");
  const handleExportData = () => {
    console.log("Exporting analytics data...");
  };
  const handleQuickDateSelect = (range: string) => {
    setSelectedDateRange(range);
    const today = new Date();
    switch (range) {
      case "last-30":
        setStartDate(new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000));
        setEndDate(today);
        break;
      case "last-90":
        setStartDate(new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000));
        setEndDate(today);
        break;
      case "all-time":
        setStartDate(undefined);
        setEndDate(undefined);
        break;
    }
  };
  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[28px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-2xl font-bold">Performance Analytics</h1>
            
            {/* Global Controls */}
            <div className="ml-auto flex items-center space-x-4">
              <Select value={selectedQuestionnaire} onValueChange={setSelectedQuestionnaire}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Questionnaire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Questionnaires</SelectItem>
                  <SelectItem value="fpa-seed">FPA - Seed Stage v1.3</SelectItem>
                  <SelectItem value="geb">GEB v2.1</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Filter by Date Range:</span>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className={cn("justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
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
                      <Button variant="outline" size="sm" className={cn("justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "MMM dd") : "End Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex gap-1">
                  <Button variant={selectedDateRange === "last-30" ? "default" : "outline"} size="sm" onClick={() => handleQuickDateSelect("last-30")}>
                    Last 30 Days
                  </Button>
                  <Button variant={selectedDateRange === "last-90" ? "default" : "outline"} size="sm" onClick={() => handleQuickDateSelect("last-90")}>
                    Last 90 Days
                  </Button>
                  <Button variant={selectedDateRange === "all-time" ? "default" : "outline"} size="sm" onClick={() => handleQuickDateSelect("all-time")}>
                    All Time
                  </Button>
                </div>
              </div>

              <Button onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </header>
          
          <main className="flex-1 p-6 bg-background mx-[28px]">
            {/* Dashboard Grid */}
            <div className="space-y-6">
              {/* Widget 1: KPIs - Full Width */}
              <div className="grid grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Total Submissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{kpiData.totalSubmissions.toLocaleString()}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Overall Average Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{kpiData.averageScore}%</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Avg. Completion Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{kpiData.avgCompletionTime} min</div>
                  </CardContent>
                </Card>
              </div>

              {/* Widgets 2 & 3: Charts Row */}
              <div className="grid grid-cols-3 gap-6">
                {/* Widget 2: Average Score Trend - 2/3 width */}
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Average Score Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} />
                        <YAxis label={{
                        value: 'Average Score (%)',
                        angle: -90,
                        position: 'insideLeft'
                      }} axisLine={false} tickLine={false} />
                        <Tooltip formatter={(value, name) => [`${value}%`, 'Average Score']} labelFormatter={label => `Date: ${label}`} />
                        <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{
                        fill: "hsl(var(--primary))",
                        strokeWidth: 2,
                        r: 4
                      }} activeDot={{
                        r: 6,
                        stroke: "hsl(var(--primary))"
                      }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Widget 3: Performance by Behavioral Code - 1/3 width */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance by Behavioral Code</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={behavioralCodeData.slice(0, 6)}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="code" tick={{
                        fontSize: 10
                      }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{
                        fontSize: 10
                      }} />
                        <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} strokeWidth={2} />
                        <Tooltip formatter={value => [`${value}%`, 'Average Score']} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Widgets 4 & 5: Question Tables Row */}
              <div className="grid grid-cols-2 gap-6">
                {/* Widget 4: Most Difficult Questions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Most Difficult Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Rank</TableHead>
                          <TableHead>Question Title</TableHead>
                          <TableHead className="w-24 text-right">Avg Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {difficultQuestions.map(question => <TableRow key={question.rank}>
                            <TableCell className="font-medium">{question.rank}</TableCell>
                            <TableCell className="text-sm">{question.title}</TableCell>
                            <TableCell className="text-right font-medium text-red-600">
                              {question.avgScore}%
                            </TableCell>
                          </TableRow>)}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Widget 5: Easiest Questions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Easiest Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Rank</TableHead>
                          <TableHead>Question Title</TableHead>
                          <TableHead className="w-24 text-right">Avg Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {easyQuestions.map(question => <TableRow key={question.rank}>
                            <TableCell className="font-medium">{question.rank}</TableCell>
                            <TableCell className="text-sm">{question.title}</TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                              {question.avgScore}%
                            </TableCell>
                          </TableRow>)}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>;
}
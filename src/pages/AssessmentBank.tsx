import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateQuestionModal } from "@/components/CreateQuestionModal";

// Mock data
const mockQuestions = [
  {
    id: 101,
    title: "When a key feature launch is delayed, what is the best course of action?",
    type: "SJT",
    category: "Crisis",
    status: "Published",
    lastModified: "2025-07-22"
  },
  {
    id: 102,
    title: "Is validating market fit before building an MVP essential?",
    type: "True/False",
    category: "Market Entry",
    status: "Draft",
    lastModified: "2025-07-21"
  }
];

const mockBehavioralCodes = [
  {
    id: 1,
    codeName: "Comfortable with risk",
    description: "The ability to handle uncertain situations and calculated risks."
  },
  {
    id: 2,
    codeName: "Comfortable with being the center of attention",
    description: "The comfort level with public speaking and leadership visibility."
  },
  {
    id: 3,
    codeName: "Energetic",
    description: "The drive and enthusiasm to pursue goals actively."
  },
  {
    id: 4,
    codeName: "Comfortable with long-term goals",
    description: "The ability to focus on and work towards distant objectives."
  },
  {
    id: 5,
    codeName: "Curious",
    description: "The desire to learn and explore new ideas and opportunities."
  },
  {
    id: 6,
    codeName: "Responsibility",
    description: "The willingness to be accountable for decisions and outcomes."
  },
  {
    id: 7,
    codeName: "Achievement",
    description: "The drive to accomplish goals and exceed expectations."
  },
  {
    id: 8,
    codeName: "Organized",
    description: "The ability to structure tasks and manage resources efficiently."
  },
  {
    id: 9,
    codeName: "Managing emotions",
    description: "The skill in controlling emotional responses under pressure."
  },
  {
    id: 10,
    codeName: "Self-efficacy",
    description: "The belief in one's ability to execute tasks successfully."
  },
  {
    id: 11,
    codeName: "Resilience and persistence",
    description: "The ability to recover from setbacks and maintain effort."
  },
  {
    id: 12,
    codeName: "Ability to delegate responsibility to others",
    description: "The skill in entrusting tasks and authority to team members."
  }
];

export default function AssessmentBank() {
  const [activeTab, setActiveTab] = useState("questions");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [questions, setQuestions] = useState(mockQuestions);
  const { toast } = useToast();

  const handleQuestionCreated = (newQuestion: any) => {
    setQuestions(prev => [...prev, newQuestion]);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold">Assessment Bank</h1>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="behavioral-codes">Behavioral Codes</TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="space-y-6">
              <div className="flex justify-end">
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Question
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search by question title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-4">
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="sjt">SJT</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="crisis">Crisis</SelectItem>
                      <SelectItem value="market-entry">Market Entry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell>{question.id}</TableCell>
                      <TableCell className="max-w-md truncate">{question.title}</TableCell>
                      <TableCell>{question.type}</TableCell>
                      <TableCell>{question.category}</TableCell>
                      <TableCell>
                        <Badge variant={question.status === "Published" ? "default" : "secondary"}>
                          {question.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{question.lastModified}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="behavioral-codes" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Behavioral Codes</h2>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Code
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Code Name</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBehavioralCodes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell>{code.id}</TableCell>
                      <TableCell>{code.codeName}</TableCell>
                      <TableCell>{code.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>

          <CreateQuestionModal 
            open={showCreateModal}
            onOpenChange={setShowCreateModal}
            onQuestionCreated={handleQuestionCreated}
          />
        </main>
      </div>
    </SidebarProvider>
  );
}
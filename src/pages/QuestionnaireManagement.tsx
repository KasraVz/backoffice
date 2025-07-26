import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

// Mock data for the table
const mockQuestionnaires = {
  drafts: [
    { id: 1, name: "FPA General - Pre-seed v1.0", indexCode: "FPA", stage: "Pre-seed", industry: "General", version: "1.0", status: "Draft", questions: 25, lastModified: "2024-01-15" },
    { id: 2, name: "EEA Fintech - Seed v1.2", indexCode: "EEA", stage: "Seed", industry: "Fintech", version: "1.2", status: "Draft", questions: 18, lastModified: "2024-01-12" },
  ],
  active: [
    { id: 3, name: "FPA General - Series A v2.0", indexCode: "FPA", stage: "Series A", industry: "General", version: "2.0", status: "Active", questions: 32, lastModified: "2024-01-10" },
    { id: 4, name: "EEA Healthcare - Seed v1.5", indexCode: "EEA", stage: "Seed", industry: "Healthcare", version: "1.5", status: "Active", questions: 15, lastModified: "2024-01-08" },
  ],
  archived: [
    { id: 5, name: "FPA SaaS - Series B v3.0", indexCode: "FPA", stage: "Series B", industry: "SaaS", version: "3.0", status: "Archived", questions: 28, lastModified: "2023-12-20" },
    { id: 6, name: "EEA General - Seed v2.0", indexCode: "EEA", stage: "Seed", industry: "General", version: "2.0", status: "Archived", questions: 22, lastModified: "2023-12-15" },
  ]
};

export default function QuestionnaireManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("drafts");
  const [indexFilter, setIndexFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestionnaire, setNewQuestionnaire] = useState({
    name: "",
    indexCode: "",
    stage: "",
    industry: ""
  });

  const handleCreateNew = () => {
    if (newQuestionnaire.name && newQuestionnaire.indexCode && newQuestionnaire.stage) {
      // Navigate to builder with the questionnaire data
      navigate(`/questionnaires/builder/new`, {
        state: {
          name: newQuestionnaire.name,
          indexCode: newQuestionnaire.indexCode,
          stage: newQuestionnaire.stage,
          industry: newQuestionnaire.industry === "None (General)" ? "General" : newQuestionnaire.industry,
          version: "1.0"
        }
      });
      
      // Reset and close modal
      setIsModalOpen(false);
      setNewQuestionnaire({ name: "", indexCode: "", stage: "", industry: "" });
    }
  };

  const isFormValid = newQuestionnaire.name && 
    newQuestionnaire.indexCode && 
    newQuestionnaire.stage &&
    newQuestionnaire.industry;

  const renderActionButtons = (row: any, tab: string) => {
    switch (tab) {
      case "drafts":
        return (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/questionnaires/builder/${row.id}`)}
            >
              Edit Builder
            </Button>
            <Button variant="outline" size="sm">Preview</Button>
            <Button variant="default" size="sm">Publish</Button>
            <Button variant="destructive" size="sm">Delete</Button>
          </div>
        );
      case "active":
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">View</Button>
            <Button variant="outline" size="sm">Duplicate</Button>
            <Button variant="secondary" size="sm">Archive</Button>
          </div>
        );
      case "archived":
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">View Results</Button>
            <Button variant="default" size="sm">Restore to Draft</Button>
          </div>
        );
      default:
        return null;
    }
  };

  const getCurrentData = () => {
    return mockQuestionnaires[activeTab as keyof typeof mockQuestionnaires] || [];
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <div className="flex-1 space-y-6 p-6">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Questionnaire Management</h1>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Questionnaire
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background border border-border max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Questionnaire</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="questionnaire-name">Questionnaire Name</Label>
                      <Input
                        id="questionnaire-name"
                        value={newQuestionnaire.name}
                        onChange={(e) => setNewQuestionnaire({ ...newQuestionnaire, name: e.target.value })}
                        placeholder="e.g., FPA General - Pre-Seed v1.0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="index-code">Select Index Code</Label>
                      <Select value={newQuestionnaire.indexCode} onValueChange={(value) => setNewQuestionnaire({ ...newQuestionnaire, indexCode: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Index Code" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border z-50">
                          <SelectItem value="FPA">FPA</SelectItem>
                          <SelectItem value="EEA">EEA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="stage">Select Stage</Label>
                      <Select value={newQuestionnaire.stage} onValueChange={(value) => setNewQuestionnaire({ ...newQuestionnaire, stage: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Stage" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border z-50">
                          <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                          <SelectItem value="Seed">Seed</SelectItem>
                          <SelectItem value="Series A">Series A</SelectItem>
                          <SelectItem value="Series B">Series B</SelectItem>
                          <SelectItem value="Series C">Series C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="industry">Select Industry</Label>
                      <Select value={newQuestionnaire.industry} onValueChange={(value) => setNewQuestionnaire({ ...newQuestionnaire, industry: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Industry" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border z-50">
                          <SelectItem value="None (General)">None (General)</SelectItem>
                          <SelectItem value="HR Tech">HR Tech</SelectItem>
                          <SelectItem value="Fintech">Fintech</SelectItem>
                          <SelectItem value="Healthtech">Healthtech</SelectItem>
                          <SelectItem value="SaaS">SaaS</SelectItem>
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
                          <SelectItem value="EdTech">EdTech</SelectItem>
                          <SelectItem value="CleanTech">CleanTech</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateNew}
                      disabled={!isFormValid}
                    >
                      Save and Open Builder
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <div className="flex gap-4 py-4">
          <Select value={indexFilter} onValueChange={setIndexFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Index" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              <SelectItem value="all">All Index Codes</SelectItem>
              <SelectItem value="FPA">FPA</SelectItem>
              <SelectItem value="GEB">GEB</SelectItem>
              <SelectItem value="TEC">TEC</SelectItem>
              <SelectItem value="MRK">MRK</SelectItem>
            </SelectContent>
          </Select>

          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Stage" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="Pre-seed">Pre-seed</SelectItem>
              <SelectItem value="Seed">Seed</SelectItem>
              <SelectItem value="Series A">Series A</SelectItem>
              <SelectItem value="Series B">Series B</SelectItem>
              <SelectItem value="Series C">Series C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table Content for each tab */}
        <TabsContent value="drafts" className="space-y-4">
          <DataTable data={getCurrentData()} tab="drafts" renderActions={renderActionButtons} />
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <DataTable data={getCurrentData()} tab="active" renderActions={renderActionButtons} />
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          <DataTable data={getCurrentData()} tab="archived" renderActions={renderActionButtons} />
        </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

interface DataTableProps {
  data: any[];
  tab: string;
  renderActions: (row: any, tab: string) => React.ReactNode;
}

function DataTable({ data, tab, renderActions }: DataTableProps) {
  return (
    <div className="border border-border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Index Code</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Version</TableHead>
            <TableHead># of Questions</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.indexCode}</TableCell>
              <TableCell>{row.stage}</TableCell>
              <TableCell>{row.industry}</TableCell>
              <TableCell>{row.version}</TableCell>
              <TableCell>{row.questions}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{renderActions(row, tab)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
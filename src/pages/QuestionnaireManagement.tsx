import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowLeft, Pen, Eye, Trash2, Send, Copy, Archive, RotateCcw, Rocket, ArrowUp, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const mockQuestionnaires = {
  drafts: [
    { 
      id: 1, 
      name: "FPA General - Pre-seed v1.0", 
      indexCode: "FPA", 
      stage: "Pre-seed", 
      industry: "General", 
      version: "1.0", 
      status: "Draft", 
      questions: 25, 
      lastModified: "2024-01-15",
      selectedQuestions: [
        "Which of the following best defines a 'problem worth solving'?",
        "Match each revenue model with the typical product or service.",
        "A core principle of Agile software development is..."
      ]
    },
    { 
      id: 2, 
      name: "EEA Fintech - Seed v1.2", 
      indexCode: "EEA", 
      stage: "Seed", 
      industry: "Fintech", 
      version: "1.2", 
      status: "Draft", 
      questions: 18, 
      lastModified: "2024-01-12",
      selectedQuestions: [
        "What is the most critical regulatory consideration for fintech startups?",
        "Which payment processing model offers the best scalability?"
      ]
    },
  ],
  active: [
    { 
      id: 3, 
      name: "FPA General - Series A v2.0", 
      indexCode: "FPA", 
      stage: "Series A", 
      industry: "General", 
      version: "2.0", 
      status: "Active", 
      questions: 32, 
      lastModified: "2024-01-10",
      selectedQuestions: []
    },
    { 
      id: 4, 
      name: "EEA Healthcare - Seed v1.5", 
      indexCode: "EEA", 
      stage: "Seed", 
      industry: "Healthcare", 
      version: "1.5", 
      status: "Active", 
      questions: 15, 
      lastModified: "2024-01-08",
      selectedQuestions: []
    },
  ],
  archived: [
    { 
      id: 5, 
      name: "FPA SaaS - Series B v3.0", 
      indexCode: "FPA", 
      stage: "Series B", 
      industry: "SaaS", 
      version: "3.0", 
      status: "Archived", 
      questions: 28, 
      lastModified: "2023-12-20",
      selectedQuestions: []
    },
    { 
      id: 6, 
      name: "EEA General - Seed v2.0", 
      indexCode: "EEA", 
      stage: "Seed", 
      industry: "General", 
      version: "2.0", 
      status: "Archived", 
      questions: 22, 
      lastModified: "2023-12-15",
      selectedQuestions: []
    },
  ]
};

export default function QuestionnaireManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("draftActive");
  const [indexFilter, setIndexFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<any>(null);
  const [questionnaires, setQuestionnaires] = useState(mockQuestionnaires);
  const [newQuestionnaire, setNewQuestionnaire] = useState({
    name: "",
    indexCode: "",
    stage: "",
    industry: ""
  });

  // Handle questionnaire data returned from QuestionnaireBuilder
  useEffect(() => {
    if (location.state?.updatedQuestionnaire) {
      const updated = location.state.updatedQuestionnaire;
      setQuestionnaires(prev => ({
        ...prev,
        drafts: prev.drafts.map(q => 
          q.id === updated.id 
            ? { ...q, selectedQuestions: updated.selectedQuestions, questions: updated.questions, lastModified: updated.lastModified }
            : q
        )
      }));
      // Clear the location state
      window.history.replaceState({}, document.title);
    } else if (location.state?.newQuestionnaire) {
      const newQ = location.state.newQuestionnaire;
      const newId = Math.max(...questionnaires.drafts.map(q => q.id), ...questionnaires.active.map(q => q.id), ...questionnaires.archived.map(q => q.id)) + 1;
      setQuestionnaires(prev => ({
        ...prev,
        drafts: [...prev.drafts, { ...newQ, id: newId, status: "Draft" }]
      }));
      // Clear the location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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

  const handlePreview = (questionnaire: any) => {
    setSelectedQuestionnaire(questionnaire);
    setIsPreviewOpen(true);
  };

  const handleDelete = (questionnaire: any) => {
    setSelectedQuestionnaire(questionnaire);
    setIsDeleteConfirmOpen(true);
  };

  const handlePublish = (questionnaire: any) => {
    setQuestionnaires(prev => ({
      ...prev,
      drafts: prev.drafts.map(q => 
        q.id === questionnaire.id ? { ...q, status: "Active" } : q
      ),
      active: [...prev.active, { ...questionnaire, status: "Active" }]
    }));
  };

  const handleArchive = (questionnaire: any) => {
    setQuestionnaires(prev => ({
      ...prev,
      active: prev.active.filter(q => q.id !== questionnaire.id),
      archived: [...prev.archived, { ...questionnaire, status: "Archived" }]
    }));
  };

  const handleActivate = (questionnaire: any) => {
    setQuestionnaires(prev => ({
      ...prev,
      archived: prev.archived.filter(q => q.id !== questionnaire.id),
      drafts: [...prev.drafts, { ...questionnaire, status: "Draft" }]
    }));
    setActiveTab("draftActive");
  };

  const confirmDelete = () => {
    if (selectedQuestionnaire) {
      setQuestionnaires(prev => ({
        ...prev,
        drafts: prev.drafts.filter(q => q.id !== selectedQuestionnaire.id),
        active: prev.active.filter(q => q.id !== selectedQuestionnaire.id),
        archived: prev.archived.filter(q => q.id !== selectedQuestionnaire.id)
      }));
    }
    setIsDeleteConfirmOpen(false);
    setSelectedQuestionnaire(null);
  };

  const renderActionButtons = (row: any) => {
    if (row.status === "Draft") {
      return (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/questionnaires/builder`, {
              state: {
                questionnaire: row,
                mode: 'edit'
              }
            })}
            title="Edit Builder"
          >
            <Pen className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handlePreview(row)}
            title="Preview"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => handlePublish(row)}
            title="Publish"
          >
            <Rocket className="h-4 w-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => handleDelete(row)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    } else if (row.status === "Active") {
      return (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handlePreview(row)}
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => handleArchive(row)}
            title="Archive"
          >
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      );
    } else if (row.status === "Archived") {
      return (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handlePreview(row)}
            title="Preview"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => handleActivate(row)}
            title="Activate"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => handleDelete(row)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    }
    return null;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Draft":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">Draft</Badge>;
      case "Active":
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
      case "Archived":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-300">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCurrentData = () => {
    if (activeTab === "draftActive") {
      return [...questionnaires.drafts, ...questionnaires.active];
    } else if (activeTab === "archived") {
      return questionnaires.archived;
    }
    return [];
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
                          <SelectItem value="ideation">Ideation</SelectItem>
                          <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                          <SelectItem value="Seed">Seed</SelectItem>
                          <SelectItem value="Series A">Series A</SelectItem>
                          <SelectItem value="growth stage (Series B & C)">Growth Stage (Series B & C)</SelectItem>
                          <SelectItem value="expansion">Expansion</SelectItem>
                          <SelectItem value="maturity">Maturity</SelectItem>
                          <SelectItem value="exit/evolution">Exit/Evolution</SelectItem>
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="draftActive">Draft & Active</TabsTrigger>
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
              <SelectItem value="EEA">EEA</SelectItem>
            </SelectContent>
          </Select>

          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Stage" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="ideation">Ideation</SelectItem>
              <SelectItem value="Pre-seed">Pre-seed</SelectItem>
              <SelectItem value="Seed">Seed</SelectItem>
              <SelectItem value="Series A">Series A</SelectItem>
              <SelectItem value="growth stage (Series B & C)">Growth Stage (Series B & C)</SelectItem>
              <SelectItem value="expansion">Expansion</SelectItem>
              <SelectItem value="maturity">Maturity</SelectItem>
              <SelectItem value="exit/evolution">Exit/Evolution</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table Content for each tab */}
        <TabsContent value="draftActive" className="space-y-4">
          <DataTable data={getCurrentData()} getStatusBadge={getStatusBadge} renderActions={renderActionButtons} />
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          <DataTable data={getCurrentData()} getStatusBadge={getStatusBadge} renderActions={renderActionButtons} />
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="bg-background border border-border max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              Preview: {selectedQuestionnaire?.name}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsPreviewOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            {selectedQuestionnaire && (
              <div className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Sample Question 1</h3>
                  <p className="text-muted-foreground mb-4">What is your company's current revenue stage?</p>
                  <RadioGroup defaultValue="option1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option1" id="option1" />
                      <Label htmlFor="option1">Pre-revenue</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option2" id="option2" />
                      <Label htmlFor="option2">$0-$100K ARR</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option3" id="option3" />
                      <Label htmlFor="option3">$100K-$1M ARR</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Sample Question 2</h3>
                  <p className="text-muted-foreground mb-4">How many full-time employees does your company have?</p>
                  <Input placeholder="Enter number of employees" />
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline">Previous Question</Button>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close Preview
            </Button>
            <Button variant="outline">Next Question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="bg-background border border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to permanently delete this {selectedQuestionnaire?.status?.toLowerCase()} questionnaire? This action cannot be undone.</p>
            <p className="font-medium mt-2">{selectedQuestionnaire?.name}</p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

interface DataTableProps {
  data: any[];
  getStatusBadge: (status: string) => React.ReactElement;
  renderActions: (row: any) => React.ReactNode;
}

function DataTable({ data, getStatusBadge, renderActions }: DataTableProps) {
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
              <TableCell>{getStatusBadge(row.status)}</TableCell>
              <TableCell>{renderActions(row)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
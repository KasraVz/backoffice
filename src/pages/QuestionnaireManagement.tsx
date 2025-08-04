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
import { Plus, ArrowLeft, Pen, Eye, Trash2, Send, Copy, Archive, RotateCcw, Rocket, ArrowUp, X, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/hooks/use-toast";
const idAbbreviations = {
  stages: {
    "Pre-seed": "PRE",
    "Seed": "SEE",
    "Early Stage": "EAR",
    "Growth Stage": "GRO"
  },
  industries: {
    "General": "GEN",
    "HR Tech": "HRT",
    "Fintech": "FIN",
    "Healthtech": "HTH",
    "SaaS": "SAA",
    "E-commerce": "ECO",
    "EdTech": "EDU",
    "CleanTech": "CTH"
  }
};

const mockQuestionnaires = {
  drafts: [{
    name: "FPA-GEN-PRE-1",
    series: 1,
    indexCode: "FPA",
    stage: "Pre-seed",
    industry: "General",
    version: "1.0",
    status: "Draft",
    questions: 25,
    lastModified: "2024-01-15",
    selectedQuestions: ["Which of the following best defines a 'problem worth solving'?", "Match each revenue model with the typical product or service.", "A core principle of Agile software development is..."]
  }, {
    name: "EEA-FIN-SEE-1",
    series: 1,
    indexCode: "EEA",
    stage: "Seed",
    industry: "Fintech",
    version: "1.2",
    status: "Draft",
    questions: 18,
    lastModified: "2024-01-12",
    selectedQuestions: ["What is the most critical regulatory consideration for fintech startups?", "Which payment processing model offers the best scalability?"]
  }],
  active: [{
    name: "FPA-GEN-EAR-2",
    series: 2,
    indexCode: "FPA",
    stage: "Early Stage",
    industry: "General",
    version: "2.0",
    status: "Active",
    questions: 32,
    lastModified: "2024-01-10",
    selectedQuestions: []
  }, {
    name: "EEA-HEA-SEE-1",
    series: 1,
    indexCode: "EEA",
    stage: "Seed",
    industry: "Healthcare",
    version: "1.5",
    status: "Active",
    questions: 15,
    lastModified: "2024-01-08",
    selectedQuestions: []
  }],
  archived: [{
    name: "FPA-SAA-GRO-3",
    series: 3,
    indexCode: "FPA",
    stage: "Growth Stage",
    industry: "SaaS",
    version: "3.0",
    status: "Archived",
    questions: 28,
    lastModified: "2023-12-20",
    selectedQuestions: []
  }, {
    name: "EEA-GEN-SEE-2",
    series: 2,
    indexCode: "EEA",
    stage: "Seed",
    industry: "General",
    version: "2.0",
    status: "Archived",
    questions: 22,
    lastModified: "2023-12-15",
    selectedQuestions: []
  }]
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
    indexCode: "",
    stage: "",
    industry: ""
  });
  const { toast } = useToast();

  // Handle questionnaire data returned from QuestionnaireBuilder
  useEffect(() => {
    if (location.state?.updatedQuestionnaire) {
      const updated = location.state.updatedQuestionnaire;
      setQuestionnaires(prev => ({
        ...prev,
        drafts: prev.drafts.map(q => q.name === updated.name ? {
          ...q,
          selectedQuestions: updated.selectedQuestions,
          questions: updated.questions,
          lastModified: updated.lastModified
        } : q)
      }));
      // Clear the location state
      window.history.replaceState({}, document.title);
    } else if (location.state?.newQuestionnaire) {
      const newQ = location.state.newQuestionnaire;
      const newSeries = Math.max(...questionnaires.drafts.map(q => q.series), ...questionnaires.active.map(q => q.series), ...questionnaires.archived.map(q => q.series)) + 1;
      setQuestionnaires(prev => ({
        ...prev,
        drafts: [...prev.drafts, {
          ...newQ,
          series: newSeries,
          status: "Draft"
        }]
      }));
      // Clear the location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  const generateQuestionnaireId = () => {
    const industry = newQuestionnaire.industry === "None (General)" ? "General" : newQuestionnaire.industry;
    const industryAbbr = idAbbreviations.industries[industry] || "GEN";
    const stageAbbr = idAbbreviations.stages[newQuestionnaire.stage] || "PRE";
    
    // Find highest existing series for this combination
    const allQuestionnaires = [...questionnaires.drafts, ...questionnaires.active, ...questionnaires.archived];
    const matchingQuestionnaires = allQuestionnaires.filter(q => 
      q.indexCode === newQuestionnaire.indexCode &&
      q.industry === industry &&
      q.stage === newQuestionnaire.stage
    );
    
    const nextSeries = matchingQuestionnaires.length > 0 
      ? Math.max(...matchingQuestionnaires.map(q => q.series)) + 1 
      : 1;
    
    return `${newQuestionnaire.indexCode}-${industryAbbr}-${stageAbbr}-${nextSeries}`;
  };

  const handleCreateNew = () => {
    if (newQuestionnaire.indexCode && newQuestionnaire.stage) {
      const questionnaireId = generateQuestionnaireId();
      const industry = newQuestionnaire.industry === "None (General)" ? "General" : newQuestionnaire.industry;
      
      // Navigate to builder with the questionnaire data
      navigate(`/questionnaires/builder/new`, {
        state: {
          questionnaireId: questionnaireId,
          name: questionnaireId,
          indexCode: newQuestionnaire.indexCode,
          stage: newQuestionnaire.stage,
          industry: industry,
          version: "1.0"
        }
      });

      // Reset and close modal
      setIsModalOpen(false);
      setNewQuestionnaire({
        indexCode: "",
        stage: "",
        industry: ""
      });
    }
  };
  const isFormValid = newQuestionnaire.indexCode && newQuestionnaire.stage && newQuestionnaire.industry;
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
      drafts: prev.drafts.filter(q => q.name !== questionnaire.name),
      active: [...prev.active, {
        ...questionnaire,
        status: "Active"
      }]
    }));
  };
  const handleArchive = (questionnaire: any) => {
    setQuestionnaires(prev => ({
      ...prev,
      active: prev.active.filter(q => q.name !== questionnaire.name),
      archived: [...prev.archived, {
        ...questionnaire,
        status: "Archived"
      }]
    }));
  };
  const handleActivate = (questionnaire: any) => {
    setQuestionnaires(prev => ({
      ...prev,
      archived: prev.archived.filter(q => q.name !== questionnaire.name),
      drafts: [...prev.drafts, {
        ...questionnaire,
        status: "Draft"
      }]
    }));
    setActiveTab("draftActive");
  };
  const confirmDelete = () => {
    if (selectedQuestionnaire) {
      setQuestionnaires(prev => ({
        ...prev,
        drafts: prev.drafts.filter(q => q.name !== selectedQuestionnaire.name),
        active: prev.active.filter(q => q.name !== selectedQuestionnaire.name),
        archived: prev.archived.filter(q => q.name !== selectedQuestionnaire.name)
      }));
    }
    setIsDeleteConfirmOpen(false);
    setSelectedQuestionnaire(null);
  };
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Name copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleEdit = (questionnaire: any) => {
    if (questionnaire.status === "Active") {
      // Create new draft version for active questionnaire
      const currentVersion = parseFloat(questionnaire.version);
      const newVersion = (currentVersion + 1.0).toFixed(1);
      
      const newDraft = {
        ...questionnaire,
        version: newVersion,
        status: "Draft",
        lastModified: new Date().toISOString().split('T')[0]
      };
      
      setQuestionnaires(prev => ({
        ...prev,
        drafts: [...prev.drafts, newDraft]
      }));
      
      // Navigate to builder with new draft
      navigate(`/questionnaires/builder`, {
        state: {
          questionnaire: newDraft,
          mode: 'edit'
        }
      });
    } else {
      // For drafts, just open in builder
      navigate(`/questionnaires/builder`, {
        state: {
          questionnaire: questionnaire,
          mode: 'edit'
        }
      });
    }
  };

  const renderActionButtons = (row: any) => {
    if (row.status === "Draft") {
      return <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleEdit(row)} title="Edit Builder">
            <Pen className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handlePreview(row)} title="Preview">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="default" size="sm" onClick={() => handlePublish(row)} title="Publish">
            <Rocket className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(row)} title="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>;
    } else if (row.status === "Active") {
      return <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleEdit(row)} title="Edit (Create New Version)">
            <Pen className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handlePreview(row)} title="View">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleArchive(row)} title="Archive">
            <Archive className="h-4 w-4" />
          </Button>
        </div>;
    } else if (row.status === "Archived") {
      return <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handlePreview(row)} title="Preview">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="default" size="sm" onClick={() => handleActivate(row)} title="Activate">
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(row)} title="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>;
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
  return <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <div className="flex-1 space-y-6 p-6 mx-[32px] px-[23px]">

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
                      <Label htmlFor="index-code">Select Index Code</Label>
                      <Select value={newQuestionnaire.indexCode} onValueChange={value => setNewQuestionnaire({
                      ...newQuestionnaire,
                      indexCode: value
                    })}>
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
                      <Select value={newQuestionnaire.stage} onValueChange={value => setNewQuestionnaire({
                      ...newQuestionnaire,
                      stage: value
                    })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Stage" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border z-50">
                          <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                          <SelectItem value="Seed">Seed</SelectItem>
                          <SelectItem value="Early Stage">Early Stage</SelectItem>
                          <SelectItem value="Growth Stage">Growth Stage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="industry">Select Industry</Label>
                      <Select value={newQuestionnaire.industry} onValueChange={value => setNewQuestionnaire({
                      ...newQuestionnaire,
                      industry: value
                    })}>
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
                    <Button onClick={handleCreateNew} disabled={!isFormValid}>
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
              <SelectItem value="Pre-seed">Pre-seed</SelectItem>
              <SelectItem value="Seed">Seed</SelectItem>
              <SelectItem value="Early Stage">Early Stage</SelectItem>
              <SelectItem value="Growth Stage">Growth Stage</SelectItem>
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
              <Button variant="ghost" size="sm" onClick={() => setIsPreviewOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            {selectedQuestionnaire && <div className="space-y-6">
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
              </div>}
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
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
          </div>
        </main>
      </div>
    </SidebarProvider>;
}
interface DataTableProps {
  data: any[];
  getStatusBadge: (status: string) => React.ReactElement;
  renderActions: (row: any) => React.ReactNode;
}
function DataTable({
  data,
  getStatusBadge,
  renderActions
}: DataTableProps) {
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Name copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return <div className="border border-border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Series</TableHead>
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
          {data.map(row => <TableRow key={row.name}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span>{row.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(row.name)}
                    className="h-6 w-6 p-0 hover:bg-muted"
                    title="Copy Name"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>{row.series}</TableCell>
              <TableCell>{row.indexCode}</TableCell>
              <TableCell>{row.stage}</TableCell>
              <TableCell>{row.industry}</TableCell>
              <TableCell>{row.version}</TableCell>
              <TableCell>{row.questions}</TableCell>
              <TableCell>{getStatusBadge(row.status)}</TableCell>
              <TableCell>{renderActions(row)}</TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
    </div>;
}
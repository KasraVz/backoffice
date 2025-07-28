import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const mockCriteria = [
  {
    id: 1,
    promptText: "Based on your expertise in Financial Management for Seed-stage startups, please review the following questions for clarity, relevance, and accuracy.",
    tags: ["FPA", "Seed", "Financial Management"],
    indexCode: "FPA",
    stage: "Seed",
    category: "Financial Management",
    industry: "General"
  },
  {
    id: 2,
    promptText: "As an expert in HR Tech for Series A companies, evaluate these questions for technical accuracy and practical applicability.",
    tags: ["EEA", "Series A", "HR Tech"],
    indexCode: "EEA",
    stage: "Series A",
    category: "Human Resources",
    industry: "HR Tech"
  }
];

const PromptCriteriaLibrary = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<any>(null);
  const [formData, setFormData] = useState({
    promptText: "",
    indexCode: "",
    stage: "",
    category: "",
    industry: ""
  });

  const handleEdit = (criterion: any) => {
    setEditingCriterion(criterion);
    setFormData({
      promptText: criterion.promptText,
      indexCode: criterion.indexCode,
      stage: criterion.stage,
      category: criterion.category,
      industry: criterion.industry
    });
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingCriterion(null);
    setFormData({
      promptText: "",
      indexCode: "",
      stage: "",
      category: "",
      industry: ""
    });
    setIsModalOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Prompt Criteria Library</h1>
          </header>
          <main className="flex-1 p-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Prompt Criteria Library</h2>
                  <p className="text-muted-foreground">
                    Manage review prompts and their association rules
                  </p>
                </div>
                <Button onClick={handleNew} className="gap-2 w-fit">
                  <Plus className="h-4 w-4" />
                  Add New Criterion
                </Button>
              </div>

              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">ID</TableHead>
                        <TableHead className="min-w-[300px]">Prompt Text</TableHead>
                        <TableHead className="min-w-[200px]">Associated Tags</TableHead>
                        <TableHead className="w-40">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCriteria.map((criterion) => (
                        <TableRow key={criterion.id}>
                          <TableCell className="font-medium">#{criterion.id}</TableCell>
                          <TableCell className="max-w-md">
                            <p className="break-words">{criterion.promptText}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {criterion.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-1 w-full sm:w-auto"
                                onClick={() => handleEdit(criterion)}
                              >
                                <Edit className="h-3 w-3" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-1 text-destructive w-full sm:w-auto"
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Add/Edit Modal */}
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCriterion ? "Edit Prompt Criterion" : "Create New Prompt Criterion"}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="promptText">Prompt Text</Label>
                      <Textarea
                        id="promptText"
                        placeholder="Enter the prompt text that will be shown to reviewers..."
                        value={formData.promptText}
                        onChange={(e) => setFormData({...formData, promptText: e.target.value})}
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="indexCode">Index Code</Label>
                        <Select value={formData.indexCode} onValueChange={(value) => setFormData({...formData, indexCode: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select index code" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FPA">FPA</SelectItem>
                            <SelectItem value="EEA">EEA</SelectItem>
                            <SelectItem value="TDA">TDA</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="stage">Stage</Label>
                        <Select value={formData.stage} onValueChange={(value) => setFormData({...formData, stage: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                            <SelectItem value="Seed">Seed</SelectItem>
                            <SelectItem value="Series A">Series A</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Financial Management">Financial Management</SelectItem>
                            <SelectItem value="Human Resources">Human Resources</SelectItem>
                            <SelectItem value="Marketing & Sales">Marketing & Sales</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="HR Tech">HR Tech</SelectItem>
                            <SelectItem value="Healthtech">Healthtech</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button>
                        {editingCriterion ? "Update Criterion" : "Save Criterion"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PromptCriteriaLibrary;
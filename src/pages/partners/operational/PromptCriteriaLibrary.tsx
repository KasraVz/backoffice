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
import { useState, useMemo } from "react";
import { assessmentCategories, industries, stages, getAllCategoriesForAssessment } from "@/data/categories";
const mockCriteria = [{
  id: 1,
  promptText: "Based on your expertise in Financial Management for Seed-stage startups, please review the following questions for clarity, relevance, and accuracy.",
  tags: ["FPA", "Seed", "Financial Management"],
  indexCode: "FPA",
  stage: "Seed",
  category: "Financial Management",
  industry: "General"
}, {
  id: 2,
  promptText: "As an expert in HR Tech for Early Stage companies, evaluate these questions for technical accuracy and practical applicability.",
  tags: ["EEA", "Early Stage", "HR Tech"],
  indexCode: "EEA",
  stage: "Early Stage",
  category: "Human Resources",
  industry: "HR Tech"
}];
const PromptCriteriaLibrary = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<any>(null);
  const [criteria, setCriteria] = useState(mockCriteria);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    promptText: "",
    indexCode: "",
    stage: "",
    category: "",
    industry: ""
  });

  // Get available categories based on selected index code
  const availableCategories = useMemo(() => {
    if (!formData.indexCode) return [];
    return getAllCategoriesForAssessment(formData.indexCode as keyof typeof assessmentCategories);
  }, [formData.indexCode]);

  // Reset category when index code changes
  const handleIndexCodeChange = (value: string) => {
    setFormData({
      ...formData,
      indexCode: value,
      category: "" // Reset category when index code changes
    });
    // Clear category error when index code changes
    if (errors.category) {
      setErrors(prev => ({
        ...prev,
        category: ""
      }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.promptText.trim()) {
      newErrors.promptText = "Prompt text is required";
    }
    
    if (!formData.indexCode) {
      newErrors.indexCode = "Index code is required";
    }
    
    if (!formData.stage) {
      newErrors.stage = "Stage is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.industry) {
      newErrors.industry = "Industry is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save function
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const tags = [formData.indexCode, formData.stage, formData.category].filter(Boolean);
    
    if (editingCriterion) {
      // Update existing criterion
      setCriteria(prev => prev.map(criterion => 
        criterion.id === editingCriterion.id 
          ? { ...formData, id: editingCriterion.id, tags }
          : criterion
      ));
    } else {
      // Add new criterion
      const newId = Math.max(...criteria.map(c => c.id)) + 1;
      setCriteria(prev => [...prev, { ...formData, id: newId, tags }]);
    }
    
    // Reset form and close modal
    setFormData({
      promptText: "",
      indexCode: "",
      stage: "",
      category: "",
      industry: ""
    });
    setErrors({});
    setEditingCriterion(null);
    setIsModalOpen(false);
  };
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
  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Prompt Criteria Library</h1>
          </header>
          <main className="flex-1 p-8 bg-gray-50 mx-[28px]">
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
                      {criteria.map(criterion => <TableRow key={criterion.id}>
                          <TableCell className="font-medium">#{criterion.id}</TableCell>
                          <TableCell className="max-w-md">
                            <p className="break-words">{criterion.promptText}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {criterion.tags.map((tag, index) => <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button variant="outline" size="sm" className="gap-1 w-full sm:w-auto" onClick={() => handleEdit(criterion)}>
                                <Edit className="h-3 w-3" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="gap-1 text-destructive w-full sm:w-auto">
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>)}
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
                      <Label htmlFor="promptText">Prompt Text *</Label>
                      <Textarea 
                        id="promptText" 
                        placeholder="Enter the prompt text that will be shown to reviewers..." 
                        value={formData.promptText} 
                        onChange={e => {
                          setFormData({
                            ...formData,
                            promptText: e.target.value
                          });
                          if (errors.promptText) {
                            setErrors(prev => ({ ...prev, promptText: "" }));
                          }
                        }} 
                        rows={4}
                        className={errors.promptText ? "border-red-500" : ""}
                      />
                      {errors.promptText && <p className="text-sm text-red-500">{errors.promptText}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="indexCode">Index Code *</Label>
                        <Select value={formData.indexCode} onValueChange={handleIndexCodeChange}>
                          <SelectTrigger className={`bg-background ${errors.indexCode ? "border-red-500" : ""}`}>
                            <SelectValue placeholder="Select index code" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-md z-50">
                            <SelectItem value="FPA">FPA - Founder Public Awareness</SelectItem>
                            <SelectItem value="EEA">EEA - Ecosystem Environment Awareness</SelectItem>
                            <SelectItem value="GEB" disabled className="text-muted-foreground">GEB - General Entrepreneurial Behavior (Coming Soon)</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.indexCode && <p className="text-sm text-red-500">{errors.indexCode}</p>}
                      </div>

                      <div>
                        <Label htmlFor="stage">Stage *</Label>
                        <Select value={formData.stage} onValueChange={value => {
                        setFormData({
                        ...formData,
                        stage: value
                      });
                      if (errors.stage) {
                        setErrors(prev => ({ ...prev, stage: "" }));
                      }
                    }}>
                          <SelectTrigger className={`bg-background ${errors.stage ? "border-red-500" : ""}`}>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-md z-50">
                            {stages.map(stage => (
                              <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.stage && <p className="text-sm text-red-500">{errors.stage}</p>}
                      </div>

                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category} 
                          onValueChange={value => {
                            setFormData({
                              ...formData,
                              category: value
                            });
                            if (errors.category) {
                              setErrors(prev => ({ ...prev, category: "" }));
                            }
                          }}
                          disabled={!formData.indexCode}
                        >
                          <SelectTrigger className={`bg-background ${errors.category ? "border-red-500" : ""}`}>
                            <SelectValue placeholder={formData.indexCode ? "Select category" : "Select index code first"} />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-md z-50">
                            {availableCategories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                      </div>

                      <div>
                        <Label htmlFor="industry">Industry *</Label>
                        <Select value={formData.industry} onValueChange={value => {
                        setFormData({
                        ...formData,
                        industry: value
                      });
                      if (errors.industry) {
                        setErrors(prev => ({ ...prev, industry: "" }));
                      }
                    }}>
                          <SelectTrigger className={`bg-background ${errors.industry ? "border-red-500" : ""}`}>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-md z-50">
                            {industries.map(industry => (
                              <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.industry && <p className="text-sm text-red-500">{errors.industry}</p>}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => {
                        setIsModalOpen(false);
                        setErrors({});
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
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
    </SidebarProvider>;
};
export default PromptCriteriaLibrary;
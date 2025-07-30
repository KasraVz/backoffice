import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface AssignReviewSetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignmentComplete: () => void;
}

const mockFacultyMembers = [
  { id: "1", name: "Dr. Sarah Johnson" },
  { id: "2", name: "Prof. Michael Chen" },
  { id: "3", name: "Dr. Emily Rodriguez" },
  { id: "4", name: "Prof. David Kim" },
  { id: "5", name: "Dr. Lisa Anderson" }
];

const filterOptions = {
  indexCode: ["FPA", "EEA", "TDA", "IPA"],
  stage: ["Pre-seed", "Seed", "Early Stage", "Growth Stage"],
  category: [
    "Financial Management & Fundraising",
    "Business Strategy & Market Analysis",
    "Technology & Product Development",
    "Operations & Human Resources",
    "Legal & Compliance"
  ],
  subCategory: [
    "Financial Planning",
    "Fundraising Strategy",
    "Market Research",
    "Competitive Analysis"
  ],
  industry: [
    "FinTech",
    "HealthTech",
    "EdTech",
    "B2B SaaS",
    "E-commerce",
    "AI/ML"
  ]
};

export const AssignReviewSetModal = ({ open, onOpenChange, onAssignmentComplete }: AssignReviewSetModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [filters, setFilters] = useState({
    indexCode: "",
    stage: "",
    category: "",
    subCategory: "",
    industry: ""
  });

  // Calculate matching questions based on filters
  const getMatchingQuestionsCount = () => {
    const hasFilters = Object.values(filters).some(value => value !== "");
    if (!hasFilters) return 0;
    
    // Mock calculation - in real app this would be based on actual filter logic
    let baseCount = 50;
    if (filters.indexCode) baseCount -= 15;
    if (filters.stage) baseCount -= 8;
    if (filters.category) baseCount -= 10;
    if (filters.subCategory) baseCount -= 3;
    if (filters.industry) baseCount -= 2;
    
    return Math.max(baseCount, 5);
  };

  const matchingCount = getMatchingQuestionsCount();

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAssign = () => {
    // In real app, this would make API call to create the assignment
    onAssignmentComplete();
    onOpenChange(false);
    
    // Reset form
    setCurrentStep(1);
    setSelectedReviewer("");
    setFilters({
      indexCode: "",
      stage: "",
      category: "",
      subCategory: "",
      industry: ""
    });
  };

  const getSelectedReviewerName = () => {
    const reviewer = mockFacultyMembers.find(member => member.id === selectedReviewer);
    return reviewer?.name || "";
  };

  const getSetDescription = () => {
    const parts = [];
    if (filters.indexCode) parts.push(filters.indexCode);
    if (filters.category) parts.push(filters.category);
    if (filters.stage) parts.push(filters.stage);
    return parts.join(" - ") || "Custom Review Set";
  };

  const canProceed = selectedReviewer && matchingCount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 1 
              ? "Step 1: Select Reviewer and Filter Questions"
              : "Step 2: Confirm Assignment"
            }
          </DialogTitle>
        </DialogHeader>

        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Select Faculty Member */}
            <div className="space-y-2">
              <Label htmlFor="faculty-select">Assign To</Label>
              <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a faculty member" />
                </SelectTrigger>
                <SelectContent>
                  {mockFacultyMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter Criteria */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Filter Questions for Review</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Index Code</Label>
                  <Select value={filters.indexCode} onValueChange={(value) => handleFilterChange("indexCode", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select index code" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.indexCode.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Stage</Label>
                  <Select value={filters.stage} onValueChange={(value) => handleFilterChange("stage", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.stage.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.category.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sub-Category (Optional)</Label>
                  <Select value={filters.subCategory} onValueChange={(value) => handleFilterChange("subCategory", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub-category" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.subCategory.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Industry (Optional)</Label>
                  <Select value={filters.industry} onValueChange={(value) => handleFilterChange("industry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.industry.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dynamic Feedback */}
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">
                  {matchingCount > 0 
                    ? `${matchingCount} questions match these criteria.`
                    : "Select filters to see matching questions."
                  }
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-end">
              <Button 
                onClick={handleNext} 
                disabled={!canProceed}
                className="gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Summary Details */}
            <Card>
              <CardHeader>
                <CardTitle>Assignment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Assigning To</Label>
                    <p className="font-medium">{getSelectedReviewerName()}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Number of Questions</Label>
                    <p className="font-medium">{matchingCount}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Set Description</Label>
                  <p className="font-medium">{getSetDescription()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Matched Prompt Criterion Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Matched Prompt Criterion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm">
                    <strong>Note to Reviewer:</strong> Please evaluate each question based on clarity, 
                    relevance to the selected criteria, and appropriateness for the {filters.stage || "specified"} stage. 
                    Consider whether the question would effectively help assess {filters.category || "the relevant area"} 
                    for {filters.industry || "the target industry"}.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleAssign} className="gap-2">
                Confirm & Assign Set
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
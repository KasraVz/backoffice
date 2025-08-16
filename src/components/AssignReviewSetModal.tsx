import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Plus } from "lucide-react";
import { CategorySelectionModal } from "./CategorySelectionModal";

interface AssignReviewSetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignmentComplete: (assignmentData: {
    assigneeName: string;
    questionnaireName: string;
    description: string;
    questionCount: number;
    selectedCategories: string[];
  }) => void;
}

// Import faculty data from the FacultyExpertise component
const mockFacultyMembers = [
  { id: "1", name: "Dr. Sarah Johnson", active: true },
  { id: "2", name: "Prof. Michael Chen", active: true },
  { id: "3", name: "Dr. Emily Rodriguez", active: true },
  { id: "4", name: "Prof. David Kim", active: true },
  { id: "5", name: "Dr. Lisa Anderson", active: true }
];

// Mock questionnaire data for validation
const mockQuestionnaires = [
  "FPA-GEN-PRE-1",
  "EEA-FIN-SEE-1", 
  "FPA-GEN-EAR-2",
  "EEA-HEA-SEE-1",
  "FPA-SAA-GRO-3",
  "EEA-GEN-SEE-2"
];


export const AssignReviewSetModal = ({ open, onOpenChange, onAssignmentComplete }: AssignReviewSetModalProps) => {
  const [questionnaireName, setQuestionnaireName] = useState("");
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Validate questionnaire name
  const isValidQuestionnaireName = mockQuestionnaires.includes(questionnaireName);

  const handleCategoriesSelected = (categories: string[], questions: number) => {
    setSelectedCategories(categories);
    setTotalQuestions(questions);
  };

  const handleOpenCategoryModal = () => {
    if (isValidQuestionnaireName) {
      setIsCategoryModalOpen(true);
    }
  };

  const handleAssign = () => {
    // Generate description from selected categories
    const description = `${questionnaireName} - ${selectedCategories.join(", ")}`;
    const assigneeName = getSelectedReviewerName();
    
    // Pass assignment data to parent component including selected categories
    onAssignmentComplete({
      assigneeName,
      questionnaireName,
      description,
      questionCount: totalQuestions,
      selectedCategories
    });
    
    onOpenChange(false);
    
    // Reset form
    setQuestionnaireName("");
    setSelectedReviewer("");
    setSelectedCategories([]);
    setTotalQuestions(0);
  };

  const getSelectedReviewerName = () => {
    const reviewer = mockFacultyMembers.find(member => member.id === selectedReviewer);
    return reviewer?.name || "";
  };

  const canAssign = selectedReviewer && isValidQuestionnaireName && selectedCategories.length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign New Review Set</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Questionnaire Name Input */}
            <div className="space-y-2">
              <Label htmlFor="questionnaire-name">Questionnaire Name</Label>
              <div className="relative">
                <Input
                  id="questionnaire-name"
                  placeholder="Enter Questionnaire Name (e.g., FPA-GEN-PRE-1)"
                  value={questionnaireName}
                  onChange={(e) => setQuestionnaireName(e.target.value)}
                  className="pr-10"
                />
                {isValidQuestionnaireName && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
                )}
              </div>
            </div>

            {/* Select Categories Button */}
            <div className="space-y-2">
              <Label>Categories</Label>
              <Button
                variant="outline"
                onClick={handleOpenCategoryModal}
                disabled={!isValidQuestionnaireName}
                className="w-full justify-start"
              >
                Select Categories
              </Button>
            </div>

            {/* Overview Section */}
            <div className="space-y-2">
              <Label>Overview</Label>
              <Card>
                <CardContent className="pt-4">
                  {selectedCategories.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No categories selected.</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Selected Categories:</p>
                      <ul className="text-sm space-y-1">
                        {selectedCategories.map((category) => (
                          <li key={category} className="text-muted-foreground">• {category}</li>
                        ))}
                      </ul>
                      <p className="text-sm font-medium text-primary">
                        Total Questions: {totalQuestions}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Assignee Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a faculty member" />
                </SelectTrigger>
                <SelectContent>
                  {mockFacultyMembers
                    .filter(member => member.active)
                    .map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAssign}
                disabled={!canAssign}
                className="gap-2"
              >
                Assign Review Set
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Selection Modal */}
      <CategorySelectionModal
        open={isCategoryModalOpen}
        onOpenChange={setIsCategoryModalOpen}
        questionnaireName={questionnaireName}
        onCategoriesSelected={handleCategoriesSelected}
      />
    </>
  );
};
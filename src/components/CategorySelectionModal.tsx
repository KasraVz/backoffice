import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CategorySelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionnaireName: string;
  onCategoriesSelected: (categories: string[], totalQuestions: number) => void;
}

// Mock categories data - in real app this would be fetched based on questionnaireName
const mockCategories = {
  general: [
    "Financial Management & Fundraising",
    "Business Strategy & Market Analysis", 
    "Technology & Product Development",
    "Operations & Human Resources",
    "Legal & Compliance"
  ],
  industrySpecific: [
    "Industry-Specific Regulations",
    "Sector Market Dynamics",
    "Specialized Technology Requirements",
    "Industry Best Practices",
    "Compliance & Standards"
  ]
};

export const CategorySelectionModal = ({ 
  open, 
  onOpenChange, 
  questionnaireName, 
  onCategoriesSelected 
}: CategorySelectionModalProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Calculate total questions (5 questions per category for now)
  const totalQuestions = selectedCategories.length * 5;

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleDone = () => {
    onCategoriesSelected(selectedCategories, totalQuestions);
    onOpenChange(false);
    setSelectedCategories([]); // Reset for next time
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedCategories([]); // Reset selections
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Categories for {questionnaireName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* General Categories */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">General</h3>
            <div className="space-y-2">
              {mockCategories.general.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label htmlFor={category} className="text-sm font-normal cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Industry-Specific Categories */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Industry-Specific</h3>
            <div className="space-y-2">
              {mockCategories.industrySpecific.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label htmlFor={category} className="text-sm font-normal cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Total Questions Display */}
          <div className="p-4 bg-muted rounded-md border">
            <p className="text-sm font-medium">
              Total Questions to be Assigned: <span className="text-primary">{totalQuestions}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleDone}
              disabled={selectedCategories.length === 0}
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
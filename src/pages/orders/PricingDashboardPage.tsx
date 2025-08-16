import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Plus, Edit } from "lucide-react";

interface Assessment {
  id: string;
  name: string;
  price: number;
}

interface AssessmentFormData {
  name: string;
  price: string;
}

const mockAssessments: Assessment[] = [
  {
    id: "ASS-001",
    name: "Founder Public Awareness (FPA)",
    price: 49.99
  },
  {
    id: "ASS-002", 
    name: "Ecosystem Environment Awareness (EEA)",
    price: 39.99
  },
  {
    id: "ASS-003",
    name: "General Entrepreneurial Behavior (GEB)",
    price: 29.99
  }
];

export default function PricingDashboardPage() {
  const [assessments, setAssessments] = useState<Assessment[]>(mockAssessments);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [formData, setFormData] = useState<AssessmentFormData>({ name: "", price: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddService = () => {
    setIsAddMode(true);
    setFormData({ name: "", price: "" });
    setSelectedAssessment(null);
    setIsDialogOpen(true);
  };

  const handleEditService = (assessment: Assessment) => {
    setIsAddMode(false);
    setFormData({ name: assessment.name, price: assessment.price.toString() });
    setSelectedAssessment(assessment);
    setIsDialogOpen(true);
  };

  const handleSaveService = () => {
    const price = parseFloat(formData.price);
    if (!formData.name || isNaN(price) || price < 0) {
      return; // Basic validation
    }

    if (isAddMode) {
      const newAssessment: Assessment = {
        id: `ASS-${String(assessments.length + 1).padStart(3, '0')}`,
        name: formData.name,
        price: price
      };
      setAssessments([...assessments, newAssessment]);
    } else if (selectedAssessment) {
      setAssessments(assessments.map(assessment => 
        assessment.id === selectedAssessment.id 
          ? { ...assessment, name: formData.name, price: price }
          : assessment
      ));
    }

    setIsDialogOpen(false);
    setFormData({ name: "", price: "" });
    setSelectedAssessment(null);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Pricing Dashboard</h1>
          </header>
          <main className="flex-1 p-6 bg-background mx-[27px]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Assessment Pricing</CardTitle>
                    <Button onClick={handleAddService}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assessment Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assessments.map((assessment) => (
                        <TableRow key={assessment.id}>
                          <TableCell className="font-medium">{assessment.name}</TableCell>
                          <TableCell>${assessment.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditService(assessment)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {isAddMode ? "Add New Service" : "Edit Service"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="assessmentName">Assessment Name</Label>
                      <Input
                        id="assessmentName"
                        placeholder="Enter assessment name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveService}>
                        {isAddMode ? "Add Service" : "Save Changes"}
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
}
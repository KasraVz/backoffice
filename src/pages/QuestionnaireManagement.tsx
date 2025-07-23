import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

// Mock data for the table
const mockQuestionnaires = {
  drafts: [
    { id: 1, name: "Q1 2024 Assessment", indexCode: "FPA", stage: "Seed", version: "v1.0", questions: 25, lastModified: "2024-01-15" },
    { id: 2, name: "Market Analysis Survey", indexCode: "GEB", stage: "Pre-seed", version: "v2.1", questions: 18, lastModified: "2024-01-12" },
  ],
  active: [
    { id: 3, name: "Annual Review 2024", indexCode: "FPA", stage: "Series A", version: "v3.0", questions: 32, lastModified: "2024-01-10" },
    { id: 4, name: "Customer Feedback", indexCode: "TEC", stage: "Seed", version: "v1.5", questions: 15, lastModified: "2024-01-08" },
  ],
  archived: [
    { id: 5, name: "Q4 2023 Review", indexCode: "FPA", stage: "Series B", version: "v4.0", questions: 28, lastModified: "2023-12-20" },
    { id: 6, name: "Product Launch Survey", indexCode: "GEB", stage: "Seed", version: "v2.0", questions: 22, lastModified: "2023-12-15" },
  ]
};

export default function QuestionnaireManagement() {
  const [activeTab, setActiveTab] = useState("drafts");
  const [indexFilter, setIndexFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestionnaire, setNewQuestionnaire] = useState({
    name: "",
    indexCode: "",
    stage: ""
  });

  const handleCreateQuestionnaire = () => {
    console.log("Creating questionnaire:", newQuestionnaire);
    setIsModalOpen(false);
    setNewQuestionnaire({ name: "", indexCode: "", stage: "" });
  };

  const renderActionButtons = (row: any, tab: string) => {
    switch (tab) {
      case "drafts":
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Edit Builder</Button>
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
          <DialogContent className="bg-background border border-border">
            <DialogHeader>
              <DialogTitle>Create New Draft Questionnaire</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="questionnaire-name">Questionnaire Name</Label>
                <Input
                  id="questionnaire-name"
                  value={newQuestionnaire.name}
                  onChange={(e) => setNewQuestionnaire({ ...newQuestionnaire, name: e.target.value })}
                  placeholder="Enter questionnaire name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="index-code">Select Index Code</Label>
                <Select value={newQuestionnaire.indexCode} onValueChange={(value) => setNewQuestionnaire({ ...newQuestionnaire, indexCode: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an index code" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    <SelectItem value="FPA">FPA</SelectItem>
                    <SelectItem value="GEB">GEB</SelectItem>
                    <SelectItem value="TEC">TEC</SelectItem>
                    <SelectItem value="MRK">MRK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage">Select Stage</Label>
                <Select value={newQuestionnaire.stage} onValueChange={(value) => setNewQuestionnaire({ ...newQuestionnaire, stage: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a stage" />
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateQuestionnaire}>
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
            <TableHead>Questionnaire Name</TableHead>
            <TableHead>Index Code</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Version</TableHead>
            <TableHead># of Questions</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.indexCode}</TableCell>
              <TableCell>{row.stage}</TableCell>
              <TableCell>{row.version}</TableCell>
              <TableCell>{row.questions}</TableCell>
              <TableCell>{row.lastModified}</TableCell>
              <TableCell>{renderActions(row, tab)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
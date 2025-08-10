import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { questionTaxonomy } from "@/components/CreateQuestionModal";

const OperationalPartnerDirectory = () => {
  const { admins, updateAdminStatus } = useAuth();
  const { toast } = useToast();
  const [editExpertiseModal, setEditExpertiseModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null);
  const [expertiseForm, setExpertiseForm] = useState({
    indexCodes: [] as string[],
    industries: [] as string[],
    categories: [] as string[]
  });

  // Filter to show only partners (Faculty Member, Judge, Ambassador)
  const partners = admins.filter(admin => {
    const roles = Array.isArray(admin.roles) ? admin.roles : [admin.role];
    return roles.some(role => ["Faculty Member", "Judge", "Ambassador"].includes(role));
  });

  const handleToggleStatus = (adminId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    updateAdminStatus(adminId, newStatus);
    toast({
      title: "Status Updated",
      description: `Partner status has been ${newStatus.toLowerCase()}.`,
    });
  };

  const handleEditExpertise = (faculty: any) => {
    setSelectedFaculty(faculty);
    // Load existing expertise (mock data for now)
    setExpertiseForm({
      indexCodes: ["FPA"],
      industries: ["Technology"],
      categories: ["Business Model & Revenue Strategy"]
    });
    setEditExpertiseModal(true);
  };

  const handleSaveExpertise = () => {
    toast({
      title: "Expertise Updated",
      description: `Expertise profile for ${selectedFaculty?.name} has been updated.`,
    });
    setEditExpertiseModal(false);
    setSelectedFaculty(null);
  };

  const handleExpertiseChange = (field: keyof typeof expertiseForm, value: string) => {
    setExpertiseForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const isFacultyMember = (partner: any) => {
    const roles = Array.isArray(partner.roles) ? partner.roles : [partner.role];
    return roles.includes("Faculty Member");
  };

  // Generate the correct expertise options from questionTaxonomy
  const indexCodes = ["FPA", "EEA"];
  const getAllIndustries = () => {
    const industries = new Set<string>();
    Object.values(questionTaxonomy).forEach(indexCode => {
      if (indexCode["Industry-Specific"]) {
        Object.keys(indexCode["Industry-Specific"]).forEach(industry => {
          industries.add(industry);
        });
      }
    });
    return Array.from(industries);
  };

  const getAllCategories = () => {
    const categories = new Set<string>();
    Object.values(questionTaxonomy).forEach(indexCode => {
      Object.values(indexCode).forEach(scope => {
        Object.keys(scope).forEach(category => {
          categories.add(category);
        });
      });
    });
    return Array.from(categories);
  };

  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Operational Partner Directory</h1>
          </header>
          <main className="flex-1 p-8 bg-gray-50 mx-[27px]">
            <div className="max-w-6xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Operational Partner Directory</h2>
                  <p className="text-muted-foreground">
                    View faculty members, judges, and ambassadors. To add new partners, use the Admin Directory.
                  </p>
                </div>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Partner Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners.map(partner => (
                      <TableRow key={partner.id}>
                        <TableCell className="font-medium">{partner.name}</TableCell>
                        <TableCell>{partner.email}</TableCell>
                        <TableCell>{Array.isArray(partner.roles) ? partner.roles.join(", ") : partner.role}</TableCell>
                        <TableCell>
                          <Badge variant={partner.status === "Active" ? "default" : "secondary"}>
                            {partner.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleToggleStatus(partner.id, partner.status)}
                              >
                                {partner.status === "Active" ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              {isFacultyMember(partner) && (
                                <DropdownMenuItem
                                  onClick={() => handleEditExpertise(partner)}
                                >
                                  Edit Expertise
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Edit Expertise Modal */}
      <Dialog open={editExpertiseModal} onOpenChange={setEditExpertiseModal}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              Editing Expertise for {selectedFaculty?.name}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              {/* Index Code Expertise */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Index Code Expertise</Label>
                <div className="flex flex-wrap gap-2">
                  {indexCodes.map(code => (
                    <Button
                      key={code}
                      variant={expertiseForm.indexCodes.includes(code) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleExpertiseChange('indexCodes', code)}
                    >
                      {code}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Industry Expertise */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Industry Expertise</Label>
                <div className="flex flex-wrap gap-2">
                  {getAllIndustries().map(industry => (
                    <Button
                      key={industry}
                      variant={expertiseForm.industries.includes(industry) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleExpertiseChange('industries', industry)}
                    >
                      {industry}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Category Expertise */}
              <div className="space-y-3 md:col-span-2">
                <Label className="text-sm font-medium">Category Expertise</Label>
                <div className="flex flex-wrap gap-2">
                  {getAllCategories().map(category => (
                    <Button
                      key={category}
                      variant={expertiseForm.categories.includes(category) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleExpertiseChange('categories', category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditExpertiseModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveExpertise}>
              Save Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>;
};
export default OperationalPartnerDirectory;
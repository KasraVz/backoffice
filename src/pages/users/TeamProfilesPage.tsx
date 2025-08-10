import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, Edit, Users, Plus, X } from "lucide-react";
import { toast } from "sonner";

// Mock team data
const mockTeams = [
  {
    id: "1",
    startupName: "TechVenture Solutions",
    website: "https://techventure.com",
    primaryIndustry: "Software Technology",
    developmentStage: "Growth Stage",
    teamSize: 8,
    members: [
      { id: "1", name: "John Smith", role: "CEO", email: "john@techventure.com" },
      { id: "2", name: "Sarah Johnson", role: "CTO", email: "sarah@techventure.com" },
    ]
  },
  {
    id: "2",
    startupName: "GreenTech Innovations",
    website: "https://greentech.io",
    primaryIndustry: "Clean Technology",
    developmentStage: "Early Stage",
    teamSize: 5,
    members: [
      { id: "3", name: "Mike Wilson", role: "Founder", email: "mike@greentech.io" },
    ]
  },
  {
    id: "3",
    startupName: "HealthCare Analytics",
    website: "https://healthcareanalytics.com",
    primaryIndustry: "Healthcare",
    developmentStage: "Seed Stage",
    teamSize: 12,
    members: [
      { id: "4", name: "Emma Davis", role: "CEO", email: "emma@healthcareanalytics.com" },
      { id: "5", name: "David Brown", role: "Head of Product", email: "david@healthcareanalytics.com" },
    ]
  },
];

// Mock users for adding to teams
const mockUsers = [
  { id: "6", name: "Alex Chen", email: "alex.chen@example.com" },
  { id: "7", name: "Lisa Wang", email: "lisa.wang@example.com" },
  { id: "8", name: "Tom Rodriguez", email: "tom.rodriguez@example.com" },
];

const TeamProfilesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<typeof mockTeams[0] | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [teams, setTeams] = useState(mockTeams);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchMembers, setSearchMembers] = useState("");
  
  // Editable form fields for team profile
  const [editForm, setEditForm] = useState({
    startupName: "",
    website: "",
    primaryIndustry: "",
    developmentStage: "",
    description: "",
    foundedYear: "",
    location: "",
    fundingStage: "",
    teamSize: 0,
    members: [] as any[]
  });

  const filteredTeams = teams.filter(team => 
    team.startupName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDevelopmentStageVariant = (stage: string) => {
    switch (stage) {
      case "Seed Stage": return "outline";
      case "Early Stage": return "secondary";
      case "Growth Stage": return "default";
      case "Mature": return "destructive";
      default: return "outline";
    }
  };

  const openEditModal = (team: typeof mockTeams[0]) => {
    setSelectedTeam(team);
    setEditForm({
      startupName: team.startupName,
      website: team.website,
      primaryIndustry: team.primaryIndustry,
      developmentStage: team.developmentStage,
      description: "A cutting-edge technology company focused on innovation...", // Mock data
      foundedYear: "2022",
      location: "San Francisco, CA",
      fundingStage: "Series A",
      teamSize: team.teamSize,
      members: [...team.members]
    });
    setHasChanges(false);
    setIsEditModalOpen(true);
  };

  const handleFormChange = (field: string, value: string | number) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    if (selectedTeam) {
      setTeams(prevTeams => 
        prevTeams.map(team => 
          team.id === selectedTeam.id 
            ? { ...team, ...editForm, teamSize: editForm.members.length }
            : team
        )
      );
      toast.success("Team profile updated successfully");
      setHasChanges(false);
    }
  };

  const addMemberToTeam = (user: typeof mockUsers[0]) => {
    const newMember = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: "Team Member" // Default role
    };
    
    setEditForm(prev => ({
      ...prev,
      members: [...prev.members, newMember]
    }));
    setHasChanges(true);
    toast.success(`${user.name} added to team`);
  };

  const removeMemberFromTeam = (memberId: string) => {
    setEditForm(prev => ({
      ...prev,
      members: prev.members.filter(member => member.id !== memberId)
    }));
    setHasChanges(true);
    toast.success("Member removed from team");
  };

  const filteredUsers = mockUsers.filter(user => 
    !editForm.members.some(member => member.id === user.id) &&
    (user.name.toLowerCase().includes(searchMembers.toLowerCase()) || 
     user.email.toLowerCase().includes(searchMembers.toLowerCase()))
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Team Profiles</h1>
          </header>
          <main className="flex-1 p-6 bg-background mx-[27px] space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Startup Teams</CardTitle>
                <p className="text-muted-foreground">
                  Manage startup teams and their members
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Input
                    placeholder="Search by startup name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Startup Name</TableHead>
                      <TableHead>Primary Industry</TableHead>
                      <TableHead>Development Stage</TableHead>
                      <TableHead>Team Size</TableHead>
                      <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">{team.startupName}</TableCell>
                        <TableCell>{team.primaryIndustry}</TableCell>
                        <TableCell>
                          <Badge variant={getDevelopmentStageVariant(team.developmentStage)}>
                            {team.developmentStage}
                          </Badge>
                        </TableCell>
                        <TableCell>{team.teamSize}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditModal(team)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Team
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Edit Team Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Edit Team: {selectedTeam?.startupName}</DialogTitle>
                  <DialogDescription>
                    Manage team profile information and team members
                  </DialogDescription>
                </DialogHeader>
                {selectedTeam && (
                  <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="profile">Team Profile</TabsTrigger>
                      <TabsTrigger value="members">Team Members</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="profile" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startupName" className="text-sm font-medium">Startup Name</Label>
                          <Input
                            id="startupName"
                            value={editForm.startupName}
                            onChange={(e) => handleFormChange("startupName", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                          <Input
                            id="website"
                            value={editForm.website}
                            onChange={(e) => handleFormChange("website", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="primaryIndustry" className="text-sm font-medium">Primary Industry</Label>
                          <Select value={editForm.primaryIndustry} onValueChange={(value) => handleFormChange("primaryIndustry", value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Software Technology">Software Technology</SelectItem>
                              <SelectItem value="Clean Technology">Clean Technology</SelectItem>
                              <SelectItem value="Healthcare">Healthcare</SelectItem>
                              <SelectItem value="FinTech">FinTech</SelectItem>
                              <SelectItem value="E-commerce">E-commerce</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="developmentStage" className="text-sm font-medium">Development Stage</Label>
                          <Select value={editForm.developmentStage} onValueChange={(value) => handleFormChange("developmentStage", value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Seed Stage">Seed Stage</SelectItem>
                              <SelectItem value="Early Stage">Early Stage</SelectItem>
                              <SelectItem value="Growth Stage">Growth Stage</SelectItem>
                              <SelectItem value="Mature">Mature</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="foundedYear" className="text-sm font-medium">Founded Year</Label>
                          <Input
                            id="foundedYear"
                            value={editForm.foundedYear}
                            onChange={(e) => handleFormChange("foundedYear", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                          <Input
                            id="location"
                            value={editForm.location}
                            onChange={(e) => handleFormChange("location", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                          <Input
                            id="description"
                            value={editForm.description}
                            onChange={(e) => handleFormChange("description", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="members" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium">Current Team Members</h4>
                          <span className="text-sm text-muted-foreground">{editForm.members.length} members</span>
                        </div>
                        
                        <div className="space-y-2">
                          {editForm.members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-muted-foreground">{member.email} • {member.role}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMemberFromTeam(member.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium mb-2">Add Team Members</h4>
                          <Input
                            placeholder="Search users..."
                            value={searchMembers}
                            onChange={(e) => setSearchMembers(e.target.value)}
                            className="mb-3"
                          />
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {filteredUsers.map((user) => (
                              <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                                <div>
                                  <p className="font-medium text-sm">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addMemberToTeam(user)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveChanges}
                    disabled={!hasChanges}
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeamProfilesPage;
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Save } from "lucide-react";
import { useState } from "react";

const mockFacultyMembers = [
  { id: 1, name: "Dr. Sarah Johnson", active: true },
  { id: 2, name: "Prof. Michael Chen", active: false },
  { id: 3, name: "Dr. Emily Rodriguez", active: false },
  { id: 4, name: "Dr. James Wilson", active: false },
];

const mockExpertiseData = {
  indexCodes: ["FPA", "EEA", "TDA"],
  stages: ["Pre-seed", "Seed", "Series A"],
  industries: ["Finance", "HR Tech", "Healthtech", "EdTech"],
  categories: ["Financial Management & Fundraising", "Marketing & Sales", "Operations"]
};

const FacultyExpertiseProfiles = () => {
  const [selectedMember, setSelectedMember] = useState(mockFacultyMembers[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expertise, setExpertise] = useState({
    indexCodes: ["FPA", "EEA"],
    stages: ["Seed", "Series A"],
    industries: ["Finance", "HR Tech"],
    categories: ["Financial Management & Fundraising"]
  });

  const filteredMembers = mockFacultyMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpertise = (category: keyof typeof expertise, item: string) => {
    setExpertise(prev => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter(i => i !== item)
        : [...prev[category], item]
    }));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Faculty Expertise Profiles</h1>
          </header>
          <main className="flex-1 p-8 bg-gray-50">
            <div className="max-w-7xl flex gap-6">
              
              {/* Left Panel - Faculty Members */}
              <div className="w-1/4 border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Faculty Members</h3>
                
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search faculty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="space-y-2">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => setSelectedMember(member)}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedMember.id === member.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="font-medium">{member.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Panel - Expertise Profile */}
              <div className="flex-1 border rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">
                    Expertise Profile for {selectedMember.name}
                  </h3>
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Profile
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Index Code Expertise */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Index Code Expertise</Label>
                    <div className="flex flex-wrap gap-2">
                      {mockExpertiseData.indexCodes.map((code) => (
                        <Badge
                          key={code}
                          variant={expertise.indexCodes.includes(code) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleExpertise("indexCodes", code)}
                        >
                          {code}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stage Expertise */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Stage Expertise</Label>
                    <div className="flex flex-wrap gap-2">
                      {mockExpertiseData.stages.map((stage) => (
                        <Badge
                          key={stage}
                          variant={expertise.stages.includes(stage) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleExpertise("stages", stage)}
                        >
                          {stage}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Industry Expertise */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Industry Expertise</Label>
                    <div className="flex flex-wrap gap-2">
                      {mockExpertiseData.industries.map((industry) => (
                        <Badge
                          key={industry}
                          variant={expertise.industries.includes(industry) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleExpertise("industries", industry)}
                        >
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Category Expertise */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Category Expertise</Label>
                    <div className="flex flex-wrap gap-2">
                      {mockExpertiseData.categories.map((category) => (
                        <Badge
                          key={category}
                          variant={expertise.categories.includes(category) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleExpertise("categories", category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default FacultyExpertiseProfiles;
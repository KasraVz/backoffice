import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Copy, Trash2, ArrowLeft } from "lucide-react";

const mockTemplates = [
  {
    id: "cert-1",
    name: "FPA Completion Certificate",
    description: "Standard certificate template for FPA assessment completion",
    preview: "/placeholder.svg",
    lastModified: "2024-03-15",
    status: "Active",
    usageCount: 89
  },
  {
    id: "cert-2", 
    name: "EEA Excellence Award",
    description: "Premium certificate design for high-performing ecosystem assessments",
    preview: "/placeholder.svg",
    lastModified: "2024-03-08",
    status: "Active",
    usageCount: 34
  }
];

export default function CertificateTemplateGallery() {
  const navigate = useNavigate();
  const [templates] = useState(mockTemplates);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <div className="flex-1 space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => navigate('/reports/editor')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Templates
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Certificate Templates</h1>
                  <p className="text-muted-foreground mt-1">Design and manage certificate templates</p>
                </div>
              </div>
              <Button onClick={() => navigate('/reports/editor/certificates/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Template
              </Button>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Create New Template Card */}
              <Card className="border-dashed border-2 hover:border-secondary/50 transition-colors cursor-pointer" 
                    onClick={() => navigate('/reports/editor/certificates/new')}>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-semibold mb-2">Create New Certificate</h3>
                  <p className="text-sm text-muted-foreground">Design a new certificate template from scratch</p>
                </CardContent>
              </Card>

              {/* Existing Templates */}
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                      <img 
                        src={template.preview} 
                        alt={`${template.name} preview`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {template.description}
                        </CardDescription>
                      </div>
                      <Badge variant={template.status === 'Active' ? 'default' : 'secondary'}>
                        {template.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>Modified: {template.lastModified}</span>
                      <span>{template.usageCount} issued</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary"
                        className="flex-1"
                        onClick={() => navigate(`/reports/editor/certificates/${template.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

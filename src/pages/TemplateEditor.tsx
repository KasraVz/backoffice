import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FileText, Award, Plus } from "lucide-react";

export default function TemplateEditor() {
  const navigate = useNavigate();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <div className="flex-1 space-y-6 p-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Template Editor</h1>
              <p className="text-muted-foreground mt-1">Design custom report and certificate templates</p>
            </div>

            {/* Template Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {/* Report Templates Card */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/reports/editor/reports')}>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Manage Report Templates</CardTitle>
                  <CardDescription>
                    Create and edit custom report layouts with drag-and-drop components
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Score summary cards and charts</p>
                    <p>• Detailed analysis blocks</p>
                    <p>• Dynamic data visualization</p>
                    <p>• Custom cover pages</p>
                  </div>
                  <Button className="w-full mt-4" onClick={(e) => {
                    e.stopPropagation();
                    navigate('/reports/editor/reports');
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Open Report Editor
                  </Button>
                </CardContent>
              </Card>

              {/* Certificate Templates Card */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/reports/editor/certificates')}>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Award className="h-8 w-8 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">Manage Certificate Templates</CardTitle>
                  <CardDescription>
                    Design professional certificates with customizable layouts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Background images and borders</p>
                    <p>• Dynamic text placeholders</p>
                    <p>• Logo and seal placement</p>
                    <p>• Professional typography</p>
                  </div>
                  <Button className="w-full mt-4" variant="secondary" onClick={(e) => {
                    e.stopPropagation();
                    navigate('/reports/editor/certificates');
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Open Certificate Editor
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">3</div>
                  <div className="text-sm text-muted-foreground">Report Templates</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">2</div>
                  <div className="text-sm text-muted-foreground">Certificate Templates</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent">12</div>
                  <div className="text-sm text-muted-foreground">Available Components</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-muted-foreground">847</div>
                  <div className="text-sm text-muted-foreground">Reports Generated</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
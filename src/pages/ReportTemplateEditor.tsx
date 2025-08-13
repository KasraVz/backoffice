import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  FileText, 
  BarChart3, 
  PieChart, 
  Gauge, 
  Radar, 
  Image, 
  Table, 
  Type,
  GripVertical,
  Settings,
  Trash2
} from "lucide-react";

interface ReportComponent {
  id: string;
  type: string;
  title: string;
  settings: Record<string, any>;
}

interface ComponentType {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  defaultSettings: Record<string, any>;
}

const componentTypes: ComponentType[] = [
  {
    id: "cover-page",
    name: "Cover Page",
    icon: FileText,
    description: "Title page with branding and assessment info",
    defaultSettings: {
      title: "Assessment Report",
      subtitle: "{{questionnaire_name}}",
      showLogo: true,
      showDate: true
    }
  },
  {
    id: "score-summary",
    name: "Score Summary Card",
    icon: BarChart3,
    description: "Overall score display with visual indicators",
    defaultSettings: {
      title: "Overall Score",
      dataSource: "overall_score",
      showPercentage: true,
      colorTheme: "primary"
    }
  },
  {
    id: "category-bars",
    name: "Category Score Bars",
    icon: BarChart3,
    description: "Horizontal bar chart for category scores",
    defaultSettings: {
      title: "Category Performance",
      showLabels: true,
      showValues: true,
      orientation: "horizontal"
    }
  },
  {
    id: "gauge-chart",
    name: "Gauge Chart",
    icon: Gauge,
    description: "Circular gauge for single metric display",
    defaultSettings: {
      title: "Performance Gauge",
      dataSource: "overall_score",
      minValue: 0,
      maxValue: 100,
      thresholds: [30, 60, 90]
    }
  },
  {
    id: "radar-chart",
    name: "Radar Chart",
    icon: Radar,
    description: "Multi-dimensional performance visualization",
    defaultSettings: {
      title: "Competency Radar",
      categories: ["Strategy", "Operations", "Technology", "Leadership"],
      showGrid: true,
      fillArea: true
    }
  },
  {
    id: "donut-chart",
    name: "Donut Chart",
    icon: PieChart,
    description: "Circular chart for category breakdown",
    defaultSettings: {
      title: "Score Distribution",
      showLegend: true,
      showPercentages: true,
      centerText: "Total Score"
    }
  },
  {
    id: "analysis-block",
    name: "Analysis Block",
    icon: Type,
    description: "Rich text content with dynamic data",
    defaultSettings: {
      title: "Detailed Analysis",
      content: "Your performance analysis will appear here...",
      showBorder: true,
      backgroundColor: "transparent"
    }
  },
  {
    id: "static-image",
    name: "Static Image",
    icon: Image,
    description: "Fixed image or illustration",
    defaultSettings: {
      imageUrl: "/placeholder.svg",
      altText: "Report illustration",
      alignment: "center",
      width: "auto"
    }
  },
  {
    id: "dynamic-table",
    name: "Dynamic Table",
    icon: Table,
    description: "Data table with assessment results",
    defaultSettings: {
      title: "Detailed Scores",
      columns: ["Category", "Score", "Benchmark"],
      showHeader: true,
      showStripes: true
    }
  }
];

const dataSourceOptions = [
  { value: "overall_score", label: "Overall Score" },
  { value: "category_scores", label: "Category Scores" },
  { value: "leadership_score", label: "Leadership Score" },
  { value: "strategy_score", label: "Strategy Score" },
  { value: "operations_score", label: "Operations Score" },
  { value: "technology_score", label: "Technology Score" }
];

export default function ReportTemplateEditor() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState("New Report Template");
  const [components, setComponents] = useState<ReportComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"components" | "settings">("components");

  useEffect(() => {
    if (templateId && templateId !== "new") {
      // Load existing template data
      setTemplateName(`Template ${templateId}`);
      // Load existing components...
    }
  }, [templateId]);

  const addComponent = (componentType: ComponentType) => {
    const newComponent: ReportComponent = {
      id: `component-${Date.now()}`,
      type: componentType.id,
      title: componentType.name,
      settings: { ...componentType.defaultSettings }
    };
    
    setComponents(prev => [...prev, newComponent]);
  };

  const removeComponent = (componentId: string) => {
    setComponents(prev => prev.filter(c => c.id !== componentId));
    if (selectedComponent === componentId) {
      setSelectedComponent(null);
      setViewMode("components");
    }
  };

  const selectComponent = (componentId: string) => {
    setSelectedComponent(componentId);
    setViewMode("settings");
  };

  const updateComponentSettings = (componentId: string, settings: Record<string, any>) => {
    setComponents(prev => prev.map(c => 
      c.id === componentId ? { ...c, settings: { ...c.settings, ...settings } } : c
    ));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setComponents(items);
  };

  const selectedComponentData = selectedComponent 
    ? components.find(c => c.id === selectedComponent)
    : null;

  const selectedComponentType = selectedComponentData
    ? componentTypes.find(t => t.id === selectedComponentData.type)
    : null;

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background mx-[27px]">
          <div className="h-screen flex flex-col">
            {/* Top Header */}
            <div className="border-b bg-background px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={() => navigate('/reports/editor/reports')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Gallery
                  </Button>
                  <div>
                    <Input 
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="text-xl font-bold border-none p-0 h-auto bg-transparent"
                    />
                    <p className="text-sm text-muted-foreground">
                      {components.length} component{components.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save Template
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Editor Layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - Component Library or Settings */}
              <div className="w-80 border-r bg-background flex flex-col">
                <div className="p-6 border-b">
                  <div className="flex gap-2">
                    <Button 
                      variant={viewMode === "components" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("components")}
                      className="flex-1"
                    >
                      Components
                    </Button>
                    <Button 
                      variant={viewMode === "settings" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("settings")}
                      className="flex-1"
                      disabled={!selectedComponent}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  {viewMode === "components" ? (
                    <div className="p-6 space-y-3">
                      <h3 className="font-semibold mb-3">Component Library</h3>
                      {componentTypes.map((componentType) => (
                        <Card 
                          key={componentType.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => addComponent(componentType)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                                <componentType.icon className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm">{componentType.name}</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {componentType.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6">
                      {selectedComponentData && selectedComponentType ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <selectedComponentType.icon className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">{selectedComponentType.name}</h3>
                          </div>
                          
                          <Separator />

                          {/* Title Setting */}
                          <div className="space-y-2">
                            <Label htmlFor="component-title">Title</Label>
                            <Input
                              id="component-title"
                              value={selectedComponentData.settings.title || ""}
                              onChange={(e) => updateComponentSettings(selectedComponent!, { title: e.target.value })}
                            />
                          </div>

                          {/* Data Source (for charts) */}
                          {['gauge-chart', 'score-summary'].includes(selectedComponentData.type) && (
                            <div className="space-y-2">
                              <Label htmlFor="data-source">Data Source</Label>
                              <Select
                                value={selectedComponentData.settings.dataSource || ""}
                                onValueChange={(value) => updateComponentSettings(selectedComponent!, { dataSource: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select data source" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dataSourceOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {/* Content (for analysis blocks) */}
                          {selectedComponentData.type === 'analysis-block' && (
                            <div className="space-y-2">
                              <Label htmlFor="content">Content</Label>
                              <Textarea
                                id="content"
                                value={selectedComponentData.settings.content || ""}
                                onChange={(e) => updateComponentSettings(selectedComponent!, { content: e.target.value })}
                                rows={4}
                              />
                            </div>
                          )}

                          {/* Image URL (for static images) */}
                          {selectedComponentData.type === 'static-image' && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="image-url">Image URL</Label>
                                <Input
                                  id="image-url"
                                  value={selectedComponentData.settings.imageUrl || ""}
                                  onChange={(e) => updateComponentSettings(selectedComponent!, { imageUrl: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="alt-text">Alt Text</Label>
                                <Input
                                  id="alt-text"
                                  value={selectedComponentData.settings.altText || ""}
                                  onChange={(e) => updateComponentSettings(selectedComponent!, { altText: e.target.value })}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          <Settings className="h-8 w-8 mx-auto mb-2" />
                          <p>Select a component to edit its settings</p>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Right Panel - Canvas */}
              <div className="flex-1 bg-muted/30">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    <div className="max-w-4xl mx-auto bg-white shadow-lg min-h-[800px] rounded-lg">
                      <div className="p-8">
                        {components.length === 0 ? (
                          <div className="text-center py-20 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">Start Building Your Template</h3>
                            <p>Drag components from the left panel to begin designing your report</p>
                          </div>
                        ) : (
                          <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="canvas">
                              {(provided) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  className="space-y-4"
                                >
                                  {components.map((component, index) => {
                                    const ComponentType = componentTypes.find(t => t.id === component.type);
                                    return (
                                      <Draggable key={component.id} draggableId={component.id} index={index}>
                                        {(provided) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`group relative border-2 border-dashed border-transparent hover:border-primary/50 rounded-lg transition-colors ${
                                              selectedComponent === component.id ? 'border-primary' : ''
                                            }`}
                                            onClick={() => selectComponent(component.id)}
                                          >
                                            <div className="p-4 bg-muted/20 rounded-lg">
                                              <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                  <div {...provided.dragHandleProps}>
                                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                  </div>
                                                  {ComponentType && <ComponentType.icon className="h-4 w-4" />}
                                                  <span className="font-medium">{component.settings.title || component.title}</span>
                                                </div>
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeComponent(component.id);
                                                  }}
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>
                                              <div className="bg-white border rounded p-4 min-h-[120px] flex items-center justify-center text-muted-foreground">
                                                <div className="text-center">
                                                  {ComponentType && <ComponentType.icon className="h-8 w-8 mx-auto mb-2" />}
                                                  <p className="text-sm">{ComponentType?.description}</p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </Draggable>
                                    );
                                  })}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </DragDropContext>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
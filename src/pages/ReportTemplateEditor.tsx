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
  Trash2,
  Columns,
  Square,
  Plus
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
  category: 'layout' | 'component';
}

interface LayoutSection {
  id: string;
  type: string;
  columns: Column[];
}

interface Column {
  id: string;
  width: string;
  components: ReportComponent[];
}

const layoutTypes: ComponentType[] = [
  {
    id: "single-column",
    name: "Single Column",
    icon: Square,
    description: "Full width single column section",
    category: 'layout',
    defaultSettings: {}
  },
  {
    id: "two-column-equal",
    name: "Two Columns (50/50)",
    icon: Columns,
    description: "Two equal columns side by side",
    category: 'layout',
    defaultSettings: {}
  },
  {
    id: "three-column",
    name: "Three Columns",
    icon: Columns,
    description: "Three equal columns",
    category: 'layout',
    defaultSettings: {}
  },
  {
    id: "two-column-unequal",
    name: "Two Columns (33/67)",
    icon: Columns,
    description: "Narrow left, wide right columns",
    category: 'layout',
    defaultSettings: {}
  }
];

const componentTypes: ComponentType[] = [
  {
    id: "cover-page",
    name: "Cover Page",
    icon: FileText,
    description: "Title page with branding and assessment info",
    category: 'component',
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
    category: 'component',
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
    category: 'component',
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
    category: 'component',
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
    category: 'component',
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
    category: 'component',
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
    category: 'component',
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
    category: 'component',
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
    category: 'component',
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
  const [layoutSections, setLayoutSections] = useState<LayoutSection[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"layout" | "components" | "settings">("layout");

  useEffect(() => {
    if (templateId && templateId !== "new") {
      // Load existing template data
      setTemplateName(`Template ${templateId}`);
      // Load existing layout sections...
    }
  }, [templateId]);

  const addLayoutSection = (layoutType: ComponentType) => {
    const columns: Column[] = [];
    
    switch (layoutType.id) {
      case "single-column":
        columns.push({ id: `col-${Date.now()}`, width: "w-full", components: [] });
        break;
      case "two-column-equal":
        columns.push(
          { id: `col-${Date.now()}-1`, width: "w-1/2", components: [] },
          { id: `col-${Date.now()}-2`, width: "w-1/2", components: [] }
        );
        break;
      case "three-column":
        columns.push(
          { id: `col-${Date.now()}-1`, width: "w-1/3", components: [] },
          { id: `col-${Date.now()}-2`, width: "w-1/3", components: [] },
          { id: `col-${Date.now()}-3`, width: "w-1/3", components: [] }
        );
        break;
      case "two-column-unequal":
        columns.push(
          { id: `col-${Date.now()}-1`, width: "w-1/3", components: [] },
          { id: `col-${Date.now()}-2`, width: "w-2/3", components: [] }
        );
        break;
    }

    const newSection: LayoutSection = {
      id: `section-${Date.now()}`,
      type: layoutType.id,
      columns
    };

    setLayoutSections(prev => [...prev, newSection]);
  };

  const addComponentToColumn = (componentType: ComponentType) => {
    if (!selectedColumn) return;

    const newComponent: ReportComponent = {
      id: `component-${Date.now()}`,
      type: componentType.id,
      title: componentType.name,
      settings: { ...componentType.defaultSettings }
    };

    setLayoutSections(prev => prev.map(section => ({
      ...section,
      columns: section.columns.map(column => 
        column.id === selectedColumn 
          ? { ...column, components: [...column.components, newComponent] }
          : column
      )
    })));
  };

  const removeLayoutSection = (sectionId: string) => {
    setLayoutSections(prev => prev.filter(s => s.id !== sectionId));
  };

  const removeComponent = (componentId: string) => {
    setLayoutSections(prev => prev.map(section => ({
      ...section,
      columns: section.columns.map(column => ({
        ...column,
        components: column.components.filter(c => c.id !== componentId)
      }))
    })));
    
    if (selectedComponent === componentId) {
      setSelectedComponent(null);
      setViewMode("components");
    }
  };

  const selectComponent = (componentId: string) => {
    setSelectedComponent(componentId);
    setViewMode("settings");
  };

  const selectColumn = (columnId: string) => {
    setSelectedColumn(columnId);
    setSelectedComponent(null);
  };

  const updateComponentSettings = (componentId: string, settings: Record<string, any>) => {
    setLayoutSections(prev => prev.map(section => ({
      ...section,
      columns: section.columns.map(column => ({
        ...column,
        components: column.components.map(c => 
          c.id === componentId ? { ...c, settings: { ...c.settings, ...settings } } : c
        )
      }))
    })));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceDroppableId = result.source.droppableId;
    const destinationDroppableId = result.destination.droppableId;

    // Handle component movement between columns
    if (sourceDroppableId.startsWith('column-') && destinationDroppableId.startsWith('column-')) {
      const sourceColumnId = sourceDroppableId.replace('column-', '');
      const destColumnId = destinationDroppableId.replace('column-', '');

      setLayoutSections(prev => {
        const newSections = [...prev];
        let draggedComponent: ReportComponent | null = null;

        // Remove from source
        newSections.forEach(section => {
          section.columns.forEach(column => {
            if (column.id === sourceColumnId) {
              draggedComponent = column.components[result.source.index];
              column.components.splice(result.source.index, 1);
            }
          });
        });

        // Add to destination
        if (draggedComponent) {
          newSections.forEach(section => {
            section.columns.forEach(column => {
              if (column.id === destColumnId) {
                column.components.splice(result.destination.index, 0, draggedComponent!);
              }
            });
          });
        }

        return newSections;
      });
    }
  };

  const getTotalComponentCount = () => {
    return layoutSections.reduce((total, section) => 
      total + section.columns.reduce((colTotal, column) => colTotal + column.components.length, 0), 0
    );
  };

  const getSelectedComponentData = () => {
    if (!selectedComponent) return null;
    
    for (const section of layoutSections) {
      for (const column of section.columns) {
        const component = column.components.find(c => c.id === selectedComponent);
        if (component) return component;
      }
    }
    return null;
  };

  const selectedComponentData = getSelectedComponentData();
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
                      {getTotalComponentCount()} component{getTotalComponentCount() !== 1 ? 's' : ''} in {layoutSections.length} section{layoutSections.length !== 1 ? 's' : ''}
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
                  <div className="flex gap-1">
                    <Button 
                      variant={viewMode === "layout" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("layout")}
                      className="flex-1 text-xs"
                    >
                      Layout
                    </Button>
                    <Button 
                      variant={viewMode === "components" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("components")}
                      className="flex-1 text-xs"
                    >
                      Components
                    </Button>
                    <Button 
                      variant={viewMode === "settings" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("settings")}
                      className="flex-1 text-xs"
                      disabled={!selectedComponent}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Settings
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  {viewMode === "layout" ? (
                    <div className="p-6 space-y-3">
                      <h3 className="font-semibold mb-3">Layout Components</h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        Create your page structure first by adding layout sections
                      </p>
                      {layoutTypes.map((layoutType) => (
                        <Card 
                          key={layoutType.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => addLayoutSection(layoutType)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                                <layoutType.icon className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm">{layoutType.name}</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {layoutType.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : viewMode === "components" ? (
                    <div className="p-6 space-y-3">
                      <h3 className="font-semibold mb-3">Content Components</h3>
                      {selectedColumn ? (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                          <p className="text-sm text-blue-700 font-medium">Column Selected</p>
                          <p className="text-xs text-blue-600">Click a component below to add it to the selected column</p>
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                          <p className="text-sm text-amber-700 font-medium">No Column Selected</p>
                          <p className="text-xs text-amber-600">Select a column on the canvas first, or drag components directly</p>
                        </div>
                      )}
                      {componentTypes.map((componentType) => (
                        <Card 
                          key={componentType.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => selectedColumn && addComponentToColumn(componentType)}
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
                        {layoutSections.length === 0 ? (
                          <div className="text-center py-20 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">Start with Layout</h3>
                            <p>Add layout sections from the left panel to begin structuring your report</p>
                          </div>
                        ) : (
                          <DragDropContext onDragEnd={onDragEnd}>
                            <div className="space-y-6">
                              {layoutSections.map((section) => {
                                const LayoutType = layoutTypes.find(t => t.id === section.type);
                                return (
                                  <div key={section.id} className="group relative border-2 border-dashed border-gray-200 hover:border-primary/50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-2">
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                        {LayoutType && <LayoutType.icon className="h-4 w-4" />}
                                        <span className="font-medium text-sm">{LayoutType?.name}</span>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removeLayoutSection(section.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    
                                    <div className="flex gap-4">
                                      {section.columns.map((column) => (
                                        <div
                                          key={column.id}
                                          className={`${column.width} min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-3 ${
                                            selectedColumn === column.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
                                          }`}
                                          onClick={() => selectColumn(column.id)}
                                        >
                                          <div className="text-xs text-muted-foreground mb-2 flex items-center justify-between">
                                            <span>Column {section.columns.indexOf(column) + 1}</span>
                                            {selectedColumn === column.id && (
                                              <Badge variant="outline" className="text-xs">Selected</Badge>
                                            )}
                                          </div>
                                          
                                          <Droppable droppableId={`column-${column.id}`}>
                                            {(provided, snapshot) => (
                                              <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className={`min-h-[150px] space-y-2 ${snapshot.isDraggingOver ? 'bg-blue-100' : ''}`}
                                              >
                                                {column.components.length === 0 ? (
                                                  <div className="h-full flex items-center justify-center text-muted-foreground">
                                                    <div className="text-center">
                                                      <Plus className="h-8 w-8 mx-auto mb-2" />
                                                      <p className="text-xs">Drop components here</p>
                                                    </div>
                                                  </div>
                                                ) : (
                                                  column.components.map((component, index) => {
                                                    const ComponentType = componentTypes.find(t => t.id === component.type);
                                                    return (
                                                      <Draggable key={component.id} draggableId={component.id} index={index}>
                                                        {(provided) => (
                                                          <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`border rounded-lg p-3 bg-white cursor-pointer transition-colors ${
                                                              selectedComponent === component.id ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              selectComponent(component.id);
                                                            }}
                                                          >
                                                            <div className="flex items-center justify-between mb-2">
                                                              <div className="flex items-center gap-2">
                                                                {ComponentType && <ComponentType.icon className="h-3 w-3" />}
                                                                <span className="text-xs font-medium">{component.settings.title || component.title}</span>
                                                              </div>
                                                              <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-4 w-4 p-0"
                                                                onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  removeComponent(component.id);
                                                                }}
                                                              >
                                                                <Trash2 className="h-3 w-3" />
                                                              </Button>
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                              {ComponentType?.description}
                                                            </div>
                                                          </div>
                                                        )}
                                                      </Draggable>
                                                    );
                                                  })
                                                )}
                                                {provided.placeholder}
                                              </div>
                                            )}
                                          </Droppable>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
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
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Image, 
  Type,
  Settings,
  Trash2,
  Award
} from "lucide-react";

interface CertificateElement {
  id: string;
  type: string;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  settings: Record<string, any>;
}

interface ElementType {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  defaultSettings: Record<string, any>;
}

const elementTypes: ElementType[] = [
  {
    id: "background",
    name: "Background Image",
    icon: Image,
    description: "Set the certificate background or border",
    defaultSettings: {
      imageUrl: "/placeholder.svg",
      opacity: 1,
      fit: "cover"
    }
  },
  {
    id: "text-box",
    name: "Text Box",
    icon: Type,
    description: "Add text with dynamic placeholders",
    defaultSettings: {
      content: "Sample Text",
      fontSize: 24,
      fontWeight: "normal",
      color: "#000000",
      textAlign: "center",
      fontFamily: "serif"
    }
  },
  {
    id: "logo",
    name: "Logo/Seal",
    icon: Award,
    description: "Add logos, seals, or signature images",
    defaultSettings: {
      imageUrl: "/placeholder.svg",
      size: "medium",
      opacity: 1
    }
  }
];

const dynamicPlaceholders = [
  { value: "{{user_name}}", label: "User Name" },
  { value: "{{completion_date}}", label: "Completion Date" },
  { value: "{{certificate_id}}", label: "Certificate ID" },
  { value: "{{assessment_name}}", label: "Assessment Name" },
  { value: "{{overall_score}}", label: "Overall Score" },
  { value: "{{organization_name}}", label: "Organization Name" },
  { value: "{{issuer_name}}", label: "Issuer Name" },
  { value: "{{validity_date}}", label: "Validity Date" }
];

export default function CertificateTemplateEditor() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState("New Certificate Template");
  const [elements, setElements] = useState<CertificateElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"elements" | "settings">("elements");

  useEffect(() => {
    if (templateId && templateId !== "new") {
      // Load existing template data
      setTemplateName(`Certificate Template ${templateId}`);
      // Load existing elements...
    }
  }, [templateId]);

  const addElement = (elementType: ElementType) => {
    const newElement: CertificateElement = {
      id: `element-${Date.now()}`,
      type: elementType.id,
      content: elementType.defaultSettings.content || "",
      position: { x: 100, y: 100 },
      size: { width: 200, height: 50 },
      settings: { ...elementType.defaultSettings }
    };
    
    setElements(prev => [...prev, newElement]);
  };

  const removeElement = (elementId: string) => {
    setElements(prev => prev.filter(e => e.id !== elementId));
    if (selectedElement === elementId) {
      setSelectedElement(null);
      setViewMode("elements");
    }
  };

  const selectElement = (elementId: string) => {
    setSelectedElement(elementId);
    setViewMode("settings");
  };

  const updateElementSettings = (elementId: string, settings: Record<string, any>) => {
    setElements(prev => prev.map(e => 
      e.id === elementId ? { ...e, settings: { ...e.settings, ...settings } } : e
    ));
  };

  const updateElementContent = (elementId: string, content: string) => {
    setElements(prev => prev.map(e => 
      e.id === elementId ? { ...e, content } : e
    ));
  };

  const insertPlaceholder = (placeholder: string) => {
    if (selectedElement) {
      const element = elements.find(e => e.id === selectedElement);
      if (element && element.type === 'text-box') {
        const newContent = element.content + placeholder;
        updateElementContent(selectedElement, newContent);
      }
    }
  };

  const selectedElementData = selectedElement 
    ? elements.find(e => e.id === selectedElement)
    : null;

  const selectedElementType = selectedElementData
    ? elementTypes.find(t => t.id === selectedElementData.type)
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
                  <Button variant="outline" size="sm" onClick={() => navigate('/reports/editor/certificates')}>
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
                      {elements.length} element{elements.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Save className="h-4 w-4 mr-2" />
                    Save Template
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Editor Layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - Elements or Settings */}
              <div className="w-80 border-r bg-background flex flex-col">
                <div className="p-6 border-b">
                  <div className="flex gap-2">
                    <Button 
                      variant={viewMode === "elements" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("elements")}
                      className="flex-1"
                    >
                      Elements
                    </Button>
                    <Button 
                      variant={viewMode === "settings" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("settings")}
                      className="flex-1"
                      disabled={!selectedElement}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  {viewMode === "elements" ? (
                    <div className="p-6 space-y-3">
                      <h3 className="font-semibold mb-3">Certificate Elements</h3>
                      {elementTypes.map((elementType) => (
                        <Card 
                          key={elementType.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => addElement(elementType)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-secondary/10 rounded flex items-center justify-center">
                                <elementType.icon className="h-4 w-4 text-secondary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm">{elementType.name}</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {elementType.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6">
                      {selectedElementData && selectedElementType ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <selectedElementType.icon className="h-5 w-5 text-secondary" />
                            <h3 className="font-semibold">{selectedElementType.name}</h3>
                          </div>
                          
                          <Separator />

                          {/* Text Content (for text boxes) */}
                          {selectedElementData.type === 'text-box' && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="text-content">Text Content</Label>
                                <Textarea
                                  id="text-content"
                                  value={selectedElementData.content}
                                  onChange={(e) => updateElementContent(selectedElement!, e.target.value)}
                                  rows={3}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Insert Dynamic Placeholder</Label>
                                <Select onValueChange={insertPlaceholder}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose placeholder..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {dynamicPlaceholders.map((placeholder) => (
                                      <SelectItem key={placeholder.value} value={placeholder.value}>
                                        {placeholder.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="font-size">Font Size</Label>
                                <Input
                                  id="font-size"
                                  type="number"
                                  value={selectedElementData.settings.fontSize || 24}
                                  onChange={(e) => updateElementSettings(selectedElement!, { fontSize: parseInt(e.target.value) })}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="font-weight">Font Weight</Label>
                                <Select
                                  value={selectedElementData.settings.fontWeight || "normal"}
                                  onValueChange={(value) => updateElementSettings(selectedElement!, { fontWeight: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="bold">Bold</SelectItem>
                                    <SelectItem value="lighter">Light</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="text-color">Text Color</Label>
                                <Input
                                  id="text-color"
                                  type="color"
                                  value={selectedElementData.settings.color || "#000000"}
                                  onChange={(e) => updateElementSettings(selectedElement!, { color: e.target.value })}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="text-align">Text Alignment</Label>
                                <Select
                                  value={selectedElementData.settings.textAlign || "center"}
                                  onValueChange={(value) => updateElementSettings(selectedElement!, { textAlign: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="left">Left</SelectItem>
                                    <SelectItem value="center">Center</SelectItem>
                                    <SelectItem value="right">Right</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}

                          {/* Image URL (for background and logos) */}
                          {['background', 'logo'].includes(selectedElementData.type) && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="image-url">Image URL</Label>
                                <Input
                                  id="image-url"
                                  value={selectedElementData.settings.imageUrl || ""}
                                  onChange={(e) => updateElementSettings(selectedElement!, { imageUrl: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="opacity">Opacity</Label>
                                <Input
                                  id="opacity"
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.1"
                                  value={selectedElementData.settings.opacity || 1}
                                  onChange={(e) => updateElementSettings(selectedElement!, { opacity: parseFloat(e.target.value) })}
                                />
                                <div className="text-sm text-muted-foreground text-center">
                                  {Math.round((selectedElementData.settings.opacity || 1) * 100)}%
                                </div>
                              </div>
                            </>
                          )}

                          <Separator />

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeElement(selectedElement!)}
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Element
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          <Settings className="h-8 w-8 mx-auto mb-2" />
                          <p>Select an element to edit its settings</p>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Right Panel - Certificate Canvas */}
              <div className="flex-1 bg-muted/30">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    <div className="max-w-4xl mx-auto bg-white shadow-lg aspect-[8.5/11] rounded-lg relative overflow-hidden">
                      {elements.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <Award className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">Design Your Certificate</h3>
                            <p>Add elements from the left panel to start designing</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Background elements first */}
                          {elements.filter(e => e.type === 'background').map((element) => (
                            <div
                              key={element.id}
                              className="absolute inset-0"
                              onClick={() => selectElement(element.id)}
                            >
                              <img
                                src={element.settings.imageUrl}
                                alt="Certificate background"
                                className="w-full h-full object-cover"
                                style={{ opacity: element.settings.opacity }}
                              />
                            </div>
                          ))}

                          {/* Other elements */}
                          {elements.filter(e => e.type !== 'background').map((element) => (
                            <div
                              key={element.id}
                              className={`absolute cursor-pointer border-2 border-dashed border-transparent hover:border-secondary/50 ${
                                selectedElement === element.id ? 'border-secondary' : ''
                              }`}
                              style={{
                                left: element.position.x,
                                top: element.position.y,
                                width: element.size.width,
                                height: element.size.height
                              }}
                              onClick={() => selectElement(element.id)}
                            >
                              {element.type === 'text-box' ? (
                                <div
                                  className="w-full h-full flex items-center justify-center"
                                  style={{
                                    fontSize: element.settings.fontSize,
                                    fontWeight: element.settings.fontWeight,
                                    color: element.settings.color,
                                    textAlign: element.settings.textAlign as any,
                                    fontFamily: element.settings.fontFamily
                                  }}
                                >
                                  {element.content || "Sample Text"}
                                </div>
                              ) : element.type === 'logo' ? (
                                <img
                                  src={element.settings.imageUrl}
                                  alt="Logo"
                                  className="w-full h-full object-contain"
                                  style={{ opacity: element.settings.opacity }}
                                />
                              ) : null}
                            </div>
                          ))}
                        </>
                      )}
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

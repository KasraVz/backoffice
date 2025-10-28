import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { leaderboardService } from "@/services/leaderboardService";
import { LeaderboardConfiguration, LeaderboardEntry, LeaderboardCriteria, AssessmentType, LeaderboardTimeframe } from "@/types/leaderboard";
import { getTimeframeLabel, getAssessmentTypeColor } from "@/lib/leaderboardUtils";
import { formatDateTime } from "@/lib/utils";
import { Trophy, TrendingUp, Users, Calendar, RefreshCw, Eye, Edit, Plus, Trash2 } from "lucide-react";

const LeaderboardConfigPage = () => {
  const [configurations, setConfigurations] = useState<LeaderboardConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<LeaderboardConfiguration | null>(null);
  const [previewEntries, setPreviewEntries] = useState<LeaderboardEntry[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formAssessmentType, setFormAssessmentType] = useState<AssessmentType>('FPA');
  const [formTimeframe, setFormTimeframe] = useState<LeaderboardTimeframe>('monthly');
  const [formCriteria, setFormCriteria] = useState<LeaderboardCriteria[]>([]);
  const [formMinAssessments, setFormMinAssessments] = useState(1);
  const [formShowTop, setFormShowTop] = useState(100);
  const [formEnableTies, setFormEnableTies] = useState(true);

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    try {
      setLoading(true);
      const data = await leaderboardService.getAllConfigurations();
      setConfigurations(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load leaderboard configurations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (config: LeaderboardConfiguration) => {
    try {
      const newStatus = config.status === 'Active' ? 'Inactive' : 'Active';
      await leaderboardService.updateConfiguration(config.id, { status: newStatus });
      toast({
        title: "Success",
        description: `Leaderboard ${newStatus.toLowerCase()}`
      });
      loadConfigurations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handlePreview = async (config: LeaderboardConfiguration) => {
    try {
      const entries = await leaderboardService.getLeaderboardEntries(config.assessmentType, config.timeframe);
      setPreviewEntries(entries);
      setSelectedConfig(config);
      setPreviewOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load leaderboard preview",
        variant: "destructive"
      });
    }
  };

  const handleRecalculate = async (configId: string) => {
    try {
      await leaderboardService.recalculateLeaderboard(configId);
      toast({
        title: "Success",
        description: "Leaderboard recalculated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to recalculate leaderboard",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (config: LeaderboardConfiguration) => {
    setIsEditMode(true);
    setSelectedConfig(config);
    setFormAssessmentType(config.assessmentType);
    setFormTimeframe(config.timeframe);
    setFormCriteria(config.criteria);
    setFormMinAssessments(config.minimumAssessments);
    setFormShowTop(config.showTop);
    setFormEnableTies(config.enableTies);
    setEditorOpen(true);
  };

  const handleCreateNew = () => {
    setIsEditMode(false);
    setSelectedConfig(null);
    setFormAssessmentType('FPA');
    setFormTimeframe('monthly');
    setFormCriteria([]);
    setFormMinAssessments(1);
    setFormShowTop(100);
    setFormEnableTies(true);
    setEditorOpen(true);
  };

  const handleAddCriterion = () => {
    const newCriterion: LeaderboardCriteria = {
      id: `C${Date.now()}`,
      name: 'New Criterion',
      weight: 10,
      enabled: true,
      description: '',
      calculationType: 'score'
    };
    setFormCriteria([...formCriteria, newCriterion]);
  };

  const handleUpdateCriterion = (index: number, updates: Partial<LeaderboardCriteria>) => {
    const updated = [...formCriteria];
    updated[index] = { ...updated[index], ...updates };
    setFormCriteria(updated);
  };

  const handleRemoveCriterion = (index: number) => {
    setFormCriteria(formCriteria.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    // Validate total weight = 100
    const totalWeight = formCriteria.reduce((sum, c) => sum + c.weight, 0);
    if (totalWeight !== 100) {
      toast({
        title: "Validation Error",
        description: "Criteria weights must sum to 100%",
        variant: "destructive"
      });
      return;
    }

    try {
      const configData: Partial<LeaderboardConfiguration> = {
        assessmentType: formAssessmentType,
        timeframe: formTimeframe,
        criteria: formCriteria,
        minimumAssessments: formMinAssessments,
        showTop: formShowTop,
        enableTies: formEnableTies,
        status: 'Active'
      };

      if (isEditMode && selectedConfig) {
        await leaderboardService.updateConfiguration(selectedConfig.id, configData);
        toast({
          title: "Success",
          description: "Leaderboard configuration updated"
        });
      } else {
        toast({
          title: "Success",
          description: "Leaderboard configuration created"
        });
      }
      
      setEditorOpen(false);
      loadConfigurations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive"
      });
    }
  };

  const activeCount = configurations.filter(c => c.status === 'Active').length;
  const totalCriteria = configurations.reduce((sum, c) => sum + c.criteria.length, 0);
  const avgCriteria = configurations.length > 0 ? (totalCriteria / configurations.length).toFixed(1) : 0;

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen w-full">
        <header className="h-14 flex items-center border-b px-6 bg-background">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-lg font-semibold">Leaderboard Configuration</h1>
        </header>

        <main className="flex-1 p-8 bg-muted/30">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">Leaderboard Management</h2>
                <p className="text-muted-foreground mt-1">
                  Configure and manage leaderboards for different assessment types
                </p>
              </div>
              <Button onClick={handleCreateNew}>
                <Plus className="mr-2 h-4 w-4" />
                Create Configuration
              </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Active Leaderboards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Total Configurations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{configurations.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Avg Criteria per Board
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgCriteria}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Total Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCriteria}</div>
                </CardContent>
              </Card>
            </div>

            {/* Configurations Grid */}
            {loading ? (
              <div className="text-center py-12">Loading configurations...</div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {configurations.map((config) => (
                  <Card key={config.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-2">
                          <Badge style={{ backgroundColor: getAssessmentTypeColor(config.assessmentType) }}>
                            {config.assessmentType}
                          </Badge>
                          <Badge variant="outline">{getTimeframeLabel(config.timeframe)}</Badge>
                        </div>
                        <Switch
                          checked={config.status === 'Active'}
                          onCheckedChange={() => handleToggleStatus(config)}
                        />
                      </div>
                      <CardTitle className="text-xl">{config.assessmentType} - {getTimeframeLabel(config.timeframe)}</CardTitle>
                      <CardDescription>
                        Updated {formatDateTime(config.updatedAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Criteria:</span>
                          <span className="font-medium">{config.criteria.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Top Displayed:</span>
                          <span className="font-medium">{config.showTop}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Min Assessments:</span>
                          <span className="font-medium">{config.minimumAssessments}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ties Enabled:</span>
                          <span className="font-medium">{config.enableTies ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(config)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handlePreview(config)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleRecalculate(config.id)}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Recalculate
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Leaderboard Preview: {selectedConfig?.assessmentType} - {selectedConfig && getTimeframeLabel(selectedConfig.timeframe)}
            </DialogTitle>
            <DialogDescription>
              Current standings based on configured criteria
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Test Taker</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Completed</TableHead>
                  <TableHead className="text-right">Avg Score</TableHead>
                  <TableHead className="text-right">Certifications</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewEntries.map((entry) => (
                  <TableRow key={entry.userId}>
                    <TableCell className="font-bold">#{entry.rank}</TableCell>
                    <TableCell className="font-medium">{entry.userName}</TableCell>
                    <TableCell className="text-right">{entry.score.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{entry.assessmentsCompleted}</TableCell>
                    <TableCell className="text-right">{entry.averageScore.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">{entry.certificationsEarned}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Configuration Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Configuration' : 'Create Configuration'}</DialogTitle>
            <DialogDescription>
              Configure leaderboard criteria and display settings
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="criteria">Criteria</TabsTrigger>
              <TabsTrigger value="display">Display Options</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Assessment Type</Label>
                  <Select value={formAssessmentType} onValueChange={(v: AssessmentType) => setFormAssessmentType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FPA">FPA</SelectItem>
                      <SelectItem value="EEA">EEA</SelectItem>
                      <SelectItem value="GEB">GEB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Timeframe</Label>
                  <Select value={formTimeframe} onValueChange={(v: LeaderboardTimeframe) => setFormTimeframe(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="all-time">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="criteria" className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Award Criteria (Total weight must equal 100%)</Label>
                <Button size="sm" onClick={handleAddCriterion}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Criterion
                </Button>
              </div>
              
              <div className="space-y-3">
                {formCriteria.map((criterion, idx) => (
                  <Card key={criterion.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={criterion.enabled}
                          onCheckedChange={(checked) => handleUpdateCriterion(idx, { enabled: checked })}
                        />
                        <Input
                          value={criterion.name}
                          onChange={(e) => handleUpdateCriterion(idx, { name: e.target.value })}
                          placeholder="Criterion name"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveCriterion(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={criterion.calculationType}
                            onValueChange={(v: any) => handleUpdateCriterion(idx, { calculationType: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="score">Assessment Score</SelectItem>
                              <SelectItem value="completion_time">Completion Time</SelectItem>
                              <SelectItem value="certification_count">Certification Count</SelectItem>
                              <SelectItem value="perfect_scores">Perfect Scores</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Weight (%): {criterion.weight}</Label>
                          <Slider
                            value={[criterion.weight]}
                            onValueChange={(v) => handleUpdateCriterion(idx, { weight: v[0] })}
                            max={100}
                            step={5}
                          />
                        </div>
                      </div>
                      <Input
                        value={criterion.description}
                        onChange={(e) => handleUpdateCriterion(idx, { description: e.target.value })}
                        placeholder="Description"
                      />
                    </div>
                  </Card>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Total weight: {formCriteria.reduce((sum, c) => sum + c.weight, 0)}% (must be 100%)
              </div>
            </TabsContent>

            <TabsContent value="display" className="space-y-4">
              <div>
                <Label>Show Top N Entries: {formShowTop}</Label>
                <Slider
                  value={[formShowTop]}
                  onValueChange={(v) => setFormShowTop(v[0])}
                  min={10}
                  max={500}
                  step={10}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Minimum Assessments Required: {formMinAssessments}</Label>
                <Slider
                  value={[formMinAssessments]}
                  onValueChange={(v) => setFormMinAssessments(v[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formEnableTies}
                  onCheckedChange={setFormEnableTies}
                />
                <Label>Enable Tie Handling</Label>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{isEditMode ? 'Update' : 'Create'} Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default LeaderboardConfigPage;

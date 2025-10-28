import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { badgeService } from "@/services/badgeService";
import { Badge, BadgeAward, BadgeCriteria, BadgeCategory, BadgeStatus, BadgeTrigger } from "@/types/badge";
import { getBadgeRarityVariant, getBadgeStatusVariant, getRarityColor, getCriteriaTypeLabel } from "@/lib/badgeUtils";
import { formatDateTime } from "@/lib/utils";
import { Trophy, Award, Star, CheckCircle, Plus, Edit, MoreHorizontal, Trash2, History, Gift, Zap, Flame, Rocket } from "lucide-react";

const iconMap = {
  Trophy, Award, Star, Zap, Flame, Rocket
};

export default function BadgeManagementPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [awardOpen, setAwardOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [awards, setAwards] = useState<BadgeAward[]>([]);
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [triggerFilter, setTriggerFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<BadgeCategory>('Assessment');
  const [formRarity, setFormRarity] = useState<'Common' | 'Rare' | 'Epic' | 'Legendary'>('Common');
  const [formIconName, setFormIconName] = useState('Trophy');
  const [formColor, setFormColor] = useState('#FFD700');
  const [formPoints, setFormPoints] = useState(10);
  const [formTrigger, setFormTrigger] = useState<BadgeTrigger>('automatic');
  const [formStatus, setFormStatus] = useState<BadgeStatus>('Active');
  const [formCriteria, setFormCriteria] = useState<BadgeCriteria[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      setLoading(true);
      const data = await badgeService.getAllBadges();
      setBadges(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load badges",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBadges = badges.filter(badge => {
    if (categoryFilter !== 'all' && badge.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && badge.status !== statusFilter) return false;
    if (rarityFilter !== 'all' && badge.rarity !== rarityFilter) return false;
    if (triggerFilter !== 'all' && badge.trigger !== triggerFilter) return false;
    if (searchQuery && !badge.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !badge.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleEdit = (badge: Badge) => {
    setIsEditMode(true);
    setSelectedBadge(badge);
    setFormName(badge.name);
    setFormDescription(badge.description);
    setFormCategory(badge.category);
    setFormRarity(badge.rarity);
    setFormIconName(badge.iconName || 'Trophy');
    setFormColor(badge.color || '#FFD700');
    setFormPoints(badge.points);
    setFormTrigger(badge.trigger);
    setFormStatus(badge.status);
    setFormCriteria(badge.criteria);
    setEditorOpen(true);
  };

  const handleCreateNew = () => {
    setIsEditMode(false);
    setSelectedBadge(null);
    setFormName('');
    setFormDescription('');
    setFormCategory('Assessment');
    setFormRarity('Common');
    setFormIconName('Trophy');
    setFormColor('#FFD700');
    setFormPoints(10);
    setFormTrigger('automatic');
    setFormStatus('Active');
    setFormCriteria([]);
    setEditorOpen(true);
  };

  const handleAddCriterion = () => {
    const newCriterion: BadgeCriteria = {
      type: 'assessment_completion',
      value: 1,
      operator: '>=',
      description: ''
    };
    setFormCriteria([...formCriteria, newCriterion]);
  };

  const handleUpdateCriterion = (index: number, updates: Partial<BadgeCriteria>) => {
    const updated = [...formCriteria];
    updated[index] = { ...updated[index], ...updates };
    setFormCriteria(updated);
  };

  const handleRemoveCriterion = (index: number) => {
    setFormCriteria(formCriteria.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      toast({
        title: "Validation Error",
        description: "Badge name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const badgeData = {
        name: formName,
        description: formDescription,
        category: formCategory,
        rarity: formRarity,
        iconName: formIconName,
        color: formColor,
        points: formPoints,
        trigger: formTrigger,
        status: formStatus,
        criteria: formCriteria
      };

      if (isEditMode && selectedBadge) {
        await badgeService.updateBadge(selectedBadge.id, badgeData);
        toast({
          title: "Success",
          description: "Badge updated successfully"
        });
      } else {
        await badgeService.createBadge(badgeData);
        toast({
          title: "Success",
          description: "Badge created successfully"
        });
      }
      
      setEditorOpen(false);
      loadBadges();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save badge",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (badge: Badge) => {
    try {
      const newStatus: BadgeStatus = badge.status === 'Active' ? 'Inactive' : 'Active';
      await badgeService.updateBadge(badge.id, { status: newStatus });
      toast({
        title: "Success",
        description: `Badge ${newStatus.toLowerCase()}`
      });
      loadBadges();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleViewHistory = async (badge: Badge) => {
    try {
      const data = await badgeService.getBadgeAwards(badge.id);
      setAwards(data);
      setSelectedBadge(badge);
      setHistoryOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load award history",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (badge: Badge) => {
    if (!confirm(`Are you sure you want to delete "${badge.name}"?`)) return;
    
    try {
      await badgeService.deleteBadge(badge.id);
      toast({
        title: "Success",
        description: "Badge deleted successfully"
      });
      loadBadges();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete badge",
        variant: "destructive"
      });
    }
  };

  const handleAwardManually = (badge: Badge) => {
    setSelectedBadge(badge);
    setAwardOpen(true);
  };

  const clearFilters = () => {
    setCategoryFilter('all');
    setStatusFilter('all');
    setRarityFilter('all');
    setTriggerFilter('all');
    setSearchQuery('');
  };

  const totalBadges = badges.length;
  const activeBadges = badges.filter(b => b.status === 'Active').length;
  const totalAwards = badges.reduce((sum, b) => sum + b.awardedCount, 0);
  const mostAwarded = badges.reduce((max, b) => b.awardedCount > max.awardedCount ? b : max, badges[0] || { name: 'N/A', awardedCount: 0 });

  const hasActiveFilters = categoryFilter !== 'all' || statusFilter !== 'all' || rarityFilter !== 'all' || triggerFilter !== 'all' || searchQuery;

  const IconComponent = iconMap[formIconName as keyof typeof iconMap] || Trophy;

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen w-full">
        <header className="h-14 flex items-center border-b px-6 bg-background">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-lg font-semibold">Badge Management</h1>
        </header>

        <main className="flex-1 p-8 bg-muted/30">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">Badges & Achievements</h2>
                <p className="text-muted-foreground mt-1">
                  Create and manage achievement badges for test takers
                </p>
              </div>
              <Button onClick={handleCreateNew}>
                <Plus className="mr-2 h-4 w-4" />
                Create Badge
              </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Total Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalBadges}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Active Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{activeBadges}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Total Awards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAwards}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Most Awarded
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-bold truncate">{mostAwarded.name}</div>
                  <div className="text-xs text-muted-foreground">{mostAwarded.awardedCount} awards</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Assessment">Assessment</SelectItem>
                  <SelectItem value="Score">Score</SelectItem>
                  <SelectItem value="Streak">Streak</SelectItem>
                  <SelectItem value="Special">Special</SelectItem>
                  <SelectItem value="Milestone">Milestone</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              <Select value={rarityFilter} onValueChange={setRarityFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Rarities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rarities</SelectItem>
                  <SelectItem value="Common">Common</SelectItem>
                  <SelectItem value="Rare">Rare</SelectItem>
                  <SelectItem value="Epic">Epic</SelectItem>
                  <SelectItem value="Legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>

              <Select value={triggerFilter} onValueChange={setTriggerFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Triggers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Triggers</SelectItem>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Search badges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[300px]"
              />

              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Badge Grid */}
            {loading ? (
              <div className="text-center py-12">Loading badges...</div>
            ) : (
              <div className="grid grid-cols-4 gap-6">
                {filteredBadges.map((badge) => {
                  const BadgeIcon = iconMap[badge.iconName as keyof typeof iconMap] || Trophy;
                  return (
                    <Card key={badge.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-3">
                          <div className="p-3 rounded-lg" style={{ backgroundColor: `${badge.color}20` }}>
                            <BadgeIcon size={32} style={{ color: badge.color }} />
                          </div>
                          <BadgeUI variant={getBadgeRarityVariant(badge.rarity)}>
                            {badge.rarity}
                          </BadgeUI>
                        </div>
                        <CardTitle className="text-lg">{badge.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{badge.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Category:</span>
                            <BadgeUI variant="outline">{badge.category}</BadgeUI>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <BadgeUI variant={getBadgeStatusVariant(badge.status)}>
                              {badge.status}
                            </BadgeUI>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Awards:</span>
                            <span className="font-medium">{badge.awardedCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Points:</span>
                            <span className="font-medium">{badge.points}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Trigger:</span>
                            <BadgeUI variant="secondary">{badge.trigger}</BadgeUI>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(badge)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleViewHistory(badge)}>
                          <History className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleToggleStatus(badge)}>
                              {badge.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            {badge.trigger === 'manual' && (
                              <DropdownMenuItem onClick={() => handleAwardManually(badge)}>
                                <Gift className="mr-2 h-4 w-4" />
                                Award Manually
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDelete(badge)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Badge Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Badge' : 'Create New Badge'}</DialogTitle>
            <DialogDescription>
              Configure badge details, visual appearance, and award criteria
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="visual">Visual</TabsTrigger>
              <TabsTrigger value="criteria">Criteria</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div>
                <Label>Badge Name</Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., First Assessment"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe what this badge represents..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={formCategory} onValueChange={(v: BadgeCategory) => setFormCategory(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Assessment">Assessment</SelectItem>
                      <SelectItem value="Score">Score</SelectItem>
                      <SelectItem value="Streak">Streak</SelectItem>
                      <SelectItem value="Special">Special</SelectItem>
                      <SelectItem value="Milestone">Milestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Rarity</Label>
                  <Select value={formRarity} onValueChange={(v: any) => setFormRarity(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Common">Common</SelectItem>
                      <SelectItem value="Rare">Rare</SelectItem>
                      <SelectItem value="Epic">Epic</SelectItem>
                      <SelectItem value="Legendary">Legendary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="visual" className="space-y-4">
              <div>
                <Label>Icon</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {Object.keys(iconMap).map((iconName) => {
                    const Icon = iconMap[iconName as keyof typeof iconMap];
                    return (
                      <Button
                        key={iconName}
                        type="button"
                        variant={formIconName === iconName ? 'default' : 'outline'}
                        className="h-12 w-12 p-0"
                        onClick={() => setFormIconName(iconName)}
                      >
                        <Icon className="h-6 w-6" />
                      </Button>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex gap-4 items-center">
                  <Input
                    type="color"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-24 h-10"
                  />
                  <Input
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    placeholder="#FFD700"
                  />
                </div>
              </div>
              <div>
                <Label>Preview</Label>
                <Card className="p-6 flex items-center justify-center">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: `${formColor}20` }}>
                    <IconComponent size={64} style={{ color: formColor }} />
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="criteria" className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Award Criteria</Label>
                <Button size="sm" type="button" onClick={handleAddCriterion}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Criterion
                </Button>
              </div>
              
              <div className="space-y-3">
                {formCriteria.map((criterion, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={criterion.type}
                            onValueChange={(v: any) => handleUpdateCriterion(idx, { type: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="assessment_completion">Complete Assessment</SelectItem>
                              <SelectItem value="score_threshold">Score Threshold</SelectItem>
                              <SelectItem value="perfect_score">Perfect Score</SelectItem>
                              <SelectItem value="certification_earned">Certification Earned</SelectItem>
                              <SelectItem value="speed_completion">Speed Completion</SelectItem>
                              <SelectItem value="consecutive_assessments">Consecutive Assessments</SelectItem>
                              <SelectItem value="profile_completion">Profile Completion</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Operator</Label>
                          <Select
                            value={criterion.operator}
                            onValueChange={(v: any) => handleUpdateCriterion(idx, { operator: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value=">=">Greater or Equal (≥)</SelectItem>
                              <SelectItem value=">">Greater Than (&gt;)</SelectItem>
                              <SelectItem value="=">Equal To (=)</SelectItem>
                              <SelectItem value="<">Less Than (&lt;)</SelectItem>
                              <SelectItem value="<=">Less or Equal (≤)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Value</Label>
                          <Input
                            type="number"
                            value={criterion.value}
                            onChange={(e) => handleUpdateCriterion(idx, { value: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={criterion.description}
                          onChange={(e) => handleUpdateCriterion(idx, { description: e.target.value })}
                          placeholder="Describe this criterion..."
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        type="button"
                        onClick={() => handleRemoveCriterion(idx)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div>
                <Label>Points Value</Label>
                <Input
                  type="number"
                  value={formPoints}
                  onChange={(e) => setFormPoints(Number(e.target.value))}
                  min="0"
                />
              </div>
              <div>
                <Label>Trigger Type</Label>
                <Select value={formTrigger} onValueChange={(v: BadgeTrigger) => setFormTrigger(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatic badges are awarded when criteria are met. Manual badges must be awarded by admins.
                </p>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={formStatus} onValueChange={(v: BadgeStatus) => setFormStatus(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{isEditMode ? 'Update' : 'Create'} Badge</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Award History Dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Award History: {selectedBadge?.name}</DialogTitle>
            <DialogDescription>
              List of test takers who have received this badge
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Awarded At</TableHead>
                  <TableHead>Awarded By</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {awards.length > 0 ? (
                  awards.map((award) => (
                    <TableRow key={award.id}>
                      <TableCell className="font-medium">{award.userName}</TableCell>
                      <TableCell>{formatDateTime(award.awardedAt)}</TableCell>
                      <TableCell>{award.awardedBy || 'Automatic'}</TableCell>
                      <TableCell>{award.reason || '-'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No awards yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Award Dialog */}
      <Dialog open={awardOpen} onOpenChange={setAwardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Award Badge Manually</DialogTitle>
            <DialogDescription>
              Award "{selectedBadge?.name}" to a test taker
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Test Taker</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a test taker..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="U001">Sarah Johnson</SelectItem>
                  <SelectItem value="U002">Michael Chen</SelectItem>
                  <SelectItem value="U003">Emma Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reason (Optional)</Label>
              <Textarea placeholder="Why is this badge being awarded?" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAwardOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              toast({ title: "Success", description: "Badge awarded successfully" });
              setAwardOpen(false);
            }}>
              Award Badge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

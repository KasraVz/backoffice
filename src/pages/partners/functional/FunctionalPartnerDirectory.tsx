import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PartnerTypeBadge } from '@/components/partners/PartnerTypeBadge';
import { functionalPartnerService } from '@/services/functionalPartnerService';
import { FunctionalPartner, FunctionalPartnerType, PartnerStatus } from '@/types/functionalPartner';
import { getPartnerStatusVariant } from '@/lib/partnerStatusUtils';
import { formatDate } from '@/lib/utils';
import { Users, Building2, TrendingUp, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function FunctionalPartnerDirectory() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<FunctionalPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setLoading(true);
      const data = await functionalPartnerService.getAllPartners();
      setPartners(data);
    } catch (error) {
      console.error('Failed to load partners:', error);
      toast.error('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = partners.filter(partner => {
    const matchesType = typeFilter === 'all' || partner.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || partner.status === statusFilter;
    const matchesSearch = 
      partner.primaryContactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.primaryContactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (partner.organizationName?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleToggleStatus = async (partner: FunctionalPartner, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus: PartnerStatus = partner.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await functionalPartnerService.updatePartnerStatus(partner.id, newStatus);
      toast.success(`Partner ${newStatus === 'Active' ? 'activated' : 'deactivated'}`);
      loadPartners();
    } catch (error) {
      toast.error('Failed to update partner status');
    }
  };

  const totalPartners = partners.length;
  const activeIndividual = partners.filter(p => p.type === 'Individual' && p.status === 'Active').length;
  const activeOrganizational = partners.filter(p => p.type === 'Organizational' && p.status === 'Active').length;
  const totalActiveReferrals = partners.reduce((sum, p) => sum + p.activeReferrals, 0);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center border-b px-6 bg-background">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-lg font-semibold">Functional Partner Directory</h1>
        </header>

        <main className="flex-1 p-8 bg-muted/30 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Partners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPartners}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Active Individual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{activeIndividual}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Active Organizational
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{activeOrganizational}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Active Referrals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{totalActiveReferrals}</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Partner Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Organizational">Organizational</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs bg-background"
              />

              {(typeFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setTypeFilter('all');
                    setStatusFilter('all');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Partners Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Active Codes</TableHead>
                    <TableHead>Total Referrals</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Loading partners...
                      </TableCell>
                    </TableRow>
                  ) : filteredPartners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No partners found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPartners.map((partner) => (
                      <TableRow 
                        key={partner.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/partners/functional/profile/${partner.id}`)}
                      >
                        <TableCell className="font-medium">
                          {partner.organizationName || partner.primaryContactName}
                        </TableCell>
                        <TableCell>
                          <PartnerTypeBadge type={partner.type} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {partner.primaryContactEmail}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPartnerStatusVariant(partner.status)}>
                            {partner.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {partner.affiliationCodes.filter(c => c.isActive).length}
                        </TableCell>
                        <TableCell>{partner.totalReferrals}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(partner.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => handleToggleStatus(partner, e)}
                            >
                              {partner.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PartnerTypeBadge } from '@/components/partners/PartnerTypeBadge';
import { functionalPartnerService } from '@/services/functionalPartnerService';
import { FunctionalPartner, AffiliationCode, Candidate, PartnerClaim } from '@/types/functionalPartner';
import { getPartnerStatusVariant, getClaimStatusVariant } from '@/lib/partnerStatusUtils';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ArrowLeft, Mail, Phone, Building, Globe, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function FunctionalPartnerProfilePage() {
  const { partnerId } = useParams<{ partnerId: string }>();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<FunctionalPartner | null>(null);
  const [affiliationCodes, setAffiliationCodes] = useState<AffiliationCode[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [claims, setClaims] = useState<PartnerClaim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (partnerId) {
      loadPartnerData(partnerId);
    }
  }, [partnerId]);

  const loadPartnerData = async (id: string) => {
    try {
      setLoading(true);
      const [partnerData, codesData, candidatesData, claimsData] = await Promise.all([
        functionalPartnerService.getPartnerById(id),
        functionalPartnerService.getAffiliationCodes(id),
        functionalPartnerService.getCandidates(id),
        functionalPartnerService.getClaims(id)
      ]);
      
      setPartner(partnerData);
      setAffiliationCodes(codesData);
      setCandidates(candidatesData);
      setClaims(claimsData);
    } catch (error) {
      console.error('Failed to load partner data:', error);
      toast.error('Failed to load partner data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!partner || !partnerId) return;
    const newStatus = partner.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await functionalPartnerService.updatePartnerStatus(partnerId, newStatus);
      toast.success(`Partner ${newStatus === 'Active' ? 'activated' : 'deactivated'}`);
      loadPartnerData(partnerId);
    } catch (error) {
      toast.error('Failed to update partner status');
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading partner data...</div>
        </div>
      </SidebarProvider>
    );
  }

  if (!partner) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Partner Not Found</h2>
            <Button onClick={() => navigate('/partners/functional/directory')}>
              Back to Directory
            </Button>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center border-b px-6 bg-background">
          <SidebarTrigger className="mr-4" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/partners/functional/directory')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-semibold">Partner Profile</h1>
        </header>

        <main className="flex-1 p-8 bg-muted/30 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">
                  {partner.organizationName || partner.primaryContactName}
                </h2>
                <div className="flex gap-2">
                  <PartnerTypeBadge type={partner.type} />
                  <Badge variant={getPartnerStatusVariant(partner.status)}>
                    {partner.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleToggleStatus}>
                  {partner.status === 'Active' ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="codes">Affiliation Codes</TabsTrigger>
                <TabsTrigger value="candidates">Candidates</TabsTrigger>
                {partner.type === 'Individual' && (
                  <TabsTrigger value="earnings">Earnings</TabsTrigger>
                )}
                {partner.type === 'Organizational' && (
                  <TabsTrigger value="team">Team</TabsTrigger>
                )}
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Email</div>
                          <div className="font-medium">{partner.primaryContactEmail}</div>
                        </div>
                      </div>
                      {partner.primaryContactPhone && (
                        <div className="flex items-start gap-3">
                          <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Phone</div>
                            <div className="font-medium">{partner.primaryContactPhone}</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Organization Details */}
                  {partner.type === 'Organizational' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Organization Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Building className="h-4 w-4 mt-1 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Organization Type</div>
                            <div className="font-medium">{partner.organizationType}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 mt-1 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Active Scholarships</div>
                            <div className="font-medium">{partner.activeScholarships || 0}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Performance Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Referrals</span>
                        <span className="text-2xl font-bold">{partner.totalReferrals}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Active Referrals</span>
                        <span className="text-2xl font-bold text-primary">{partner.activeReferrals}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Completion Rate</span>
                        <span className="text-2xl font-bold">{partner.completionRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Active Codes</span>
                        <span className="text-2xl font-bold">{affiliationCodes.filter(c => c.isActive).length}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Earnings (Individual only) */}
                  {partner.type === 'Individual' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Earnings Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Total Earnings</span>
                          <span className="text-2xl font-bold text-primary">
                            {formatCurrency(partner.totalEarnings || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Pending Claims</span>
                          <span className="text-2xl font-bold">{partner.pendingClaims || 0}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Affiliation Codes Tab */}
              <TabsContent value="codes">
                <Card>
                  <CardHeader>
                    <CardTitle>Affiliation Codes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Uses</TableHead>
                          <TableHead>Candidates</TableHead>
                          <TableHead>Completion %</TableHead>
                          <TableHead>Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {affiliationCodes.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                              No affiliation codes yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          affiliationCodes.map((code) => (
                            <TableRow key={code.id}>
                              <TableCell className="font-mono font-medium">{code.code}</TableCell>
                              <TableCell>
                                <Badge variant={code.isActive ? 'default' : 'secondary'}>
                                  {code.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {formatDate(code.createdAt)}
                              </TableCell>
                              <TableCell>{code.totalUses}</TableCell>
                              <TableCell>{code.candidatesReferred}</TableCell>
                              <TableCell>{code.completionRate}%</TableCell>
                              <TableCell className="font-medium">
                                {formatCurrency(code.revenue)}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Candidates Tab */}
              <TabsContent value="candidates">
                <Card>
                  <CardHeader>
                    <CardTitle>Referred Candidates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Code Used</TableHead>
                          <TableHead>Ordered</TableHead>
                          <TableHead>Completed</TableHead>
                          <TableHead>Pending</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Registered</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {candidates.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              No candidates yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          candidates.map((candidate) => (
                            <TableRow key={candidate.id}>
                              <TableCell className="font-medium">{candidate.name}</TableCell>
                              <TableCell className="text-muted-foreground">{candidate.email}</TableCell>
                              <TableCell className="font-mono text-sm">{candidate.affiliationCode}</TableCell>
                              <TableCell>{candidate.assessmentsOrdered}</TableCell>
                              <TableCell>{candidate.assessmentsCompleted}</TableCell>
                              <TableCell>{candidate.assessmentsPending}</TableCell>
                              <TableCell>
                                <Badge variant={candidate.status === 'Completed' ? 'default' : 'secondary'}>
                                  {candidate.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {formatDate(candidate.registeredAt)}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Earnings Tab (Individual only) */}
              {partner.type === 'Individual' && (
                <TabsContent value="earnings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Claims History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Period</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Processed</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {claims.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                No claims yet
                              </TableCell>
                            </TableRow>
                          ) : (
                            claims.map((claim) => (
                              <TableRow key={claim.id}>
                                <TableCell className="font-medium">{claim.period}</TableCell>
                                <TableCell className="font-bold">{formatCurrency(claim.amount)}</TableCell>
                                <TableCell>
                                  <Badge variant={getClaimStatusVariant(claim.status)}>
                                    {claim.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {formatDate(claim.submittedAt)}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {claim.processedAt ? formatDate(claim.processedAt) : '-'}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Team Tab (Organizational only) */}
              {partner.type === 'Organizational' && (
                <TabsContent value="team">
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Added</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {!partner.teamMembers || partner.teamMembers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                No team members yet
                              </TableCell>
                            </TableRow>
                          ) : (
                            partner.teamMembers.map((member) => (
                              <TableRow key={member.id}>
                                <TableCell className="font-medium">{member.name}</TableCell>
                                <TableCell className="text-muted-foreground">{member.email}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{member.role}</Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {formatDate(member.addedAt)}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

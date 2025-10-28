import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { functionalPartnerService } from '@/services/functionalPartnerService';
import { FunctionalPartner } from '@/types/functionalPartner';
import { TrendingUp, Users, DollarSign, Award } from 'lucide-react';

export default function ReferralDashboard() {
  const [partners, setPartners] = useState<FunctionalPartner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await functionalPartnerService.getAllPartners();
      setPartners(data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalReferralsThisMonth = partners.reduce((sum, p) => sum + p.activeReferrals, 0);
  const avgCompletionRate = partners.length > 0 
    ? Math.round(partners.reduce((sum, p) => sum + p.completionRate, 0) / partners.length)
    : 0;
  const topPartner = partners.reduce((top, p) => 
    p.totalReferrals > (top?.totalReferrals || 0) ? p : top
  , partners[0]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center border-b px-6 bg-background">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-lg font-semibold">Referral Dashboard</h1>
        </header>

        <main className="flex-1 p-8 bg-muted/30 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Referral Performance</h2>
              <p className="text-muted-foreground">System-wide referral metrics and analytics</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Active Referrals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalReferralsThisMonth}</div>
                  <p className="text-xs text-muted-foreground mt-1">Currently active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Avg Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgCompletionRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Across all partners</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Partners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{partners.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active and inactive</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Top Partner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold truncate">
                    {topPartner?.organizationName || topPartner?.primaryContactName || '-'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {topPartner?.totalReferrals || 0} referrals
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Top Partners */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partners
                    .sort((a, b) => b.totalReferrals - a.totalReferrals)
                    .slice(0, 10)
                    .map((partner, index) => (
                      <div key={partner.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">
                              {partner.organizationName || partner.primaryContactName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {partner.type} Partner
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{partner.totalReferrals}</div>
                          <div className="text-sm text-muted-foreground">referrals</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

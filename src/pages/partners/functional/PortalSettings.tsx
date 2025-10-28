import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function PortalSettings() {
  const [settings, setSettings] = useState({
    allowSelfRegistration: true,
    autoApproval: false,
    defaultCommissionRate: 15,
    maxDiscountPercent: 25,
    defaultCodeExpiration: 365,
    notifyOnRegistration: true,
    notifyOnCodeUsage: true,
    notifyOnClaims: true
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
    console.log('Saved settings:', settings);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center border-b px-6 bg-background">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-lg font-semibold">Portal Settings</h1>
        </header>

        <main className="flex-1 p-8 bg-muted/30 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Functional Partner Portal Settings</h2>
              <p className="text-muted-foreground">Configure global settings for the partner portal</p>
            </div>

            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Control partner registration and approval workflows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Partner Self-Registration</Label>
                    <div className="text-sm text-muted-foreground">
                      Allow new partners to register without admin intervention
                    </div>
                  </div>
                  <Switch
                    checked={settings.allowSelfRegistration}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, allowSelfRegistration: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Approve New Partners</Label>
                    <div className="text-sm text-muted-foreground">
                      Automatically approve new partner applications
                    </div>
                  </div>
                  <Switch
                    checked={settings.autoApproval}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, autoApproval: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Default Commission Rate for Individuals (%)</Label>
                  <Input
                    type="number"
                    value={settings.defaultCommissionRate}
                    onChange={(e) => 
                      setSettings({ ...settings, defaultCommissionRate: Number(e.target.value) })
                    }
                    className="max-w-xs"
                  />
                  <div className="text-sm text-muted-foreground">
                    Percentage of revenue shared with individual partners
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Affiliation Code Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Affiliation Code Settings</CardTitle>
                <CardDescription>Configure affiliation code parameters and limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Maximum Discount Percentage (%)</Label>
                  <Input
                    type="number"
                    value={settings.maxDiscountPercent}
                    onChange={(e) => 
                      setSettings({ ...settings, maxDiscountPercent: Number(e.target.value) })
                    }
                    className="max-w-xs"
                  />
                  <div className="text-sm text-muted-foreground">
                    Maximum discount partners can offer through codes
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Default Code Expiration (days)</Label>
                  <Input
                    type="number"
                    value={settings.defaultCodeExpiration}
                    onChange={(e) => 
                      setSettings({ ...settings, defaultCodeExpiration: Number(e.target.value) })
                    }
                    className="max-w-xs"
                  />
                  <div className="text-sm text-muted-foreground">
                    Default number of days before codes expire (0 = no expiration)
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Configure automated email notifications for admins</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Partner Registration</Label>
                    <div className="text-sm text-muted-foreground">
                      Notify when a new partner registers
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifyOnRegistration}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, notifyOnRegistration: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Affiliation Code Usage</Label>
                    <div className="text-sm text-muted-foreground">
                      Notify when a code is used by a new candidate
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifyOnCodeUsage}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, notifyOnCodeUsage: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Claims Submitted</Label>
                    <div className="text-sm text-muted-foreground">
                      Notify when partners submit earnings claims
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifyOnClaims}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, notifyOnClaims: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} size="lg">
                Save Settings
              </Button>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

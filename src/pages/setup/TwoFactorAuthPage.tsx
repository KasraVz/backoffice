import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const TwoFactorAuthPage = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [hasAcceptedBackupCodes, setHasAcceptedBackupCodes] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const mockSecretKey = "JBSWY3DPEHPK3PXP";
  const mockBackupCodes = [
    "f1b2c3d4-a5e6f7g8",
    "h9i0j1k2-l3m4n5o6",
    "p7q8r9s0-t1u2v3w4",
    "x5y6z7a8-b9c0d1e2",
    "f3g4h5i6-j7k8l9m0",
    "n1o2p3q4-r5s6t7u8",
    "v9w0x1y2-z3a4b5c6",
    "d7e8f9g0-h1i2j3k4"
  ];

  const handleCodeChange = (value: string) => {
    // Only allow numbers and limit to 6 characters
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(numericValue);
  };

  const handleVerify = () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a 6-digit code",
        variant: "destructive"
      });
      return;
    }

    // Mock verification - accept any 6-digit code
    setIsVerified(true);
    toast({
      title: "Success",
      description: "2FA setup verified successfully!",
    });
  };

  const handleCompleteSetup = async () => {
    if (!hasAcceptedBackupCodes) {
      toast({
        title: "Error",
        description: "Please confirm you have saved the backup codes",
        variant: "destructive"
      });
      return;
    }

    // Complete authentication
    await signIn('superadmin@example.com', 'newPassword');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set Up Two-Factor Authentication</CardTitle>
          <CardDescription>
            Secure your Super Admin account with 2FA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isVerified ? (
            <>
              <div className="text-center space-y-4">
                <div>
                  <Label className="text-sm font-medium">
                    Scan this QR code with your authenticator app:
                  </Label>
                  <div className="mt-2 flex justify-center">
                    <img 
                      src="/placeholder.svg" 
                      alt="QR Code for 2FA setup" 
                      className="w-48 h-48 border rounded"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">
                    Or enter this secret key manually:
                  </Label>
                  <div className="mt-1 p-2 bg-muted rounded text-center font-mono text-sm">
                    {mockSecretKey}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verificationCode">
                  Enter 6-digit code from your authenticator app
                </Label>
                <Input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-lg font-mono"
                />
              </div>

              <Button 
                onClick={handleVerify}
                className="w-full"
                disabled={verificationCode.length !== 6}
              >
                Verify & Complete Setup
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm mb-2">
                  Save these backup codes in a secure location:
                </h3>
                <div className="bg-muted p-3 rounded space-y-1">
                  {mockBackupCodes.map((code, index) => (
                    <div key={index} className="font-mono text-sm">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="backupCodes"
                  checked={hasAcceptedBackupCodes}
                  onCheckedChange={(checked) => setHasAcceptedBackupCodes(!!checked)}
                />
                <Label htmlFor="backupCodes" className="text-sm">
                  I have saved these backup codes in a secure location
                </Label>
              </div>

              {hasAcceptedBackupCodes && (
                <Button 
                  onClick={handleCompleteSetup}
                  className="w-full"
                >
                  Complete Setup & Sign In
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorAuthPage;
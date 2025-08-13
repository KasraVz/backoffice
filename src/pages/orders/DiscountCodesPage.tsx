import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  value: number;
  usageCount: number;
  usageLimit?: number;
  expirationDate?: Date;
  isActive: boolean;
}

const mockCoupons: Coupon[] = [
  {
    id: "1",
    code: "WELCOME20",
    discountType: "percentage",
    value: 20,
    usageCount: 45,
    usageLimit: 100,
    expirationDate: new Date("2024-12-31"),
    isActive: true
  },
  {
    id: "2",
    code: "SAVE10",
    discountType: "fixed",
    value: 10,
    usageCount: 23,
    usageLimit: 50,
    isActive: true
  },
  {
    id: "3",
    code: "NEWUSER",
    discountType: "percentage",
    value: 15,
    usageCount: 12,
    expirationDate: new Date("2024-09-30"),
    isActive: false
  }
];

export default function DiscountCodesPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    value: 0,
    usageLimit: undefined as number | undefined,
    expirationDate: undefined as Date | undefined
  });

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCoupon(prev => ({ ...prev, code: result }));
  };

  const handleToggleActive = (couponId: string) => {
    setCoupons(prev => prev.map(coupon => 
      coupon.id === couponId 
        ? { ...coupon, isActive: !coupon.isActive }
        : coupon
    ));
  };

  const handleCreateCoupon = () => {
    if (!newCoupon.code || !newCoupon.value) return;

    const coupon: Coupon = {
      id: Date.now().toString(),
      code: newCoupon.code,
      discountType: newCoupon.discountType,
      value: newCoupon.value,
      usageCount: 0,
      usageLimit: newCoupon.usageLimit,
      expirationDate: newCoupon.expirationDate,
      isActive: true
    };

    setCoupons(prev => [coupon, ...prev]);
    setNewCoupon({
      code: "",
      discountType: "percentage",
      value: 0,
      usageLimit: undefined,
      expirationDate: undefined
    });
    setIsCreateModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Discount & Coupon Codes</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage promotional discount codes
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="Enter coupon code"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateRandomCode}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Discount Type</Label>
                <RadioGroup
                  value={newCoupon.discountType}
                  onValueChange={(value: "percentage" | "fixed") => 
                    setNewCoupon(prev => ({ ...prev, discountType: value }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <Label htmlFor="percentage">Percentage (%)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed">Fixed Amount ($)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">
                  {newCoupon.discountType === "percentage" ? "Percentage" : "Amount ($)"}
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={newCoupon.value || ""}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, value: Number(e.target.value) }))}
                  placeholder={newCoupon.discountType === "percentage" ? "20" : "10.00"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={newCoupon.usageLimit || ""}
                  onChange={(e) => setNewCoupon(prev => ({ 
                    ...prev, 
                    usageLimit: e.target.value ? Number(e.target.value) : undefined 
                  }))}
                  placeholder="Unlimited"
                />
              </div>

              <div className="space-y-2">
                <Label>Expiration Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newCoupon.expirationDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newCoupon.expirationDate ? (
                        format(newCoupon.expirationDate, "PPP")
                      ) : (
                        <span>No expiration</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newCoupon.expirationDate}
                      onSelect={(date) => setNewCoupon(prev => ({ ...prev, expirationDate: date }))}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button onClick={handleCreateCoupon} className="w-full">
                Create Coupon
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coupon Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coupon Code</TableHead>
                <TableHead>Discount Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium">{coupon.code}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {coupon.discountType === "percentage" ? "%" : "Fixed Amount"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {coupon.discountType === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}
                  </TableCell>
                  <TableCell>
                    {coupon.usageCount}
                    {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                  </TableCell>
                  <TableCell>
                    {coupon.expirationDate 
                      ? format(coupon.expirationDate, "MMM dd, yyyy")
                      : "No expiration"
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={coupon.isActive}
                        onCheckedChange={() => handleToggleActive(coupon.id)}
                      />
                      <span className="text-sm">
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {coupons.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No coupon codes created yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
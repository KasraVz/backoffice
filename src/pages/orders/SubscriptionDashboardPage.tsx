import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, DollarSign, TrendingDown, Settings } from "lucide-react";

interface Subscriber {
  id: string;
  customerName: string;
  plan: string;
  status: "Active" | "Canceled" | "Past Due";
  nextBilling: string;
  mrr: number;
  paymentHistory: PaymentRecord[];
}

interface PaymentRecord {
  date: string;
  amount: number;
  status: "Paid" | "Failed";
}

const mockSubscribers: Subscriber[] = [
  {
    id: "SUB-001",
    customerName: "Alice Cooper",
    plan: "Premium Monthly",
    status: "Active",
    nextBilling: "2024-09-10",
    mrr: 29.99,
    paymentHistory: [
      { date: "2024-08-10", amount: 29.99, status: "Paid" },
      { date: "2024-07-10", amount: 29.99, status: "Paid" }
    ]
  },
  {
    id: "SUB-002",
    customerName: "Bob Martinez",
    plan: "Enterprise Annual",
    status: "Active",
    nextBilling: "2025-01-15",
    mrr: 83.33,
    paymentHistory: [
      { date: "2024-01-15", amount: 999.99, status: "Paid" }
    ]
  },
  {
    id: "SUB-003",
    customerName: "Carol White",
    plan: "Basic Monthly",
    status: "Past Due",
    nextBilling: "2024-08-05",
    mrr: 19.99,
    paymentHistory: [
      { date: "2024-07-05", amount: 19.99, status: "Failed" },
      { date: "2024-06-05", amount: 19.99, status: "Paid" }
    ]
  },
  {
    id: "SUB-004",
    customerName: "David Kim",
    plan: "Premium Monthly",
    status: "Canceled",
    nextBilling: "-",
    mrr: 0,
    paymentHistory: [
      { date: "2024-07-10", amount: 29.99, status: "Paid" },
      { date: "2024-06-10", amount: 29.99, status: "Paid" }
    ]
  }
];

const getStatusVariant = (status: Subscriber['status']) => {
  switch (status) {
    case "Active":
      return "default";
    case "Canceled":
      return "secondary";
    case "Past Due":
      return "destructive";
    default:
      return "secondary";
  }
};

export default function SubscriptionDashboardPage() {
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);

  const totalMRR = mockSubscribers.reduce((sum, sub) => sum + sub.mrr, 0);
  const activeSubscriptions = mockSubscribers.filter(sub => sub.status === "Active").length;
  const churnRate = 8.5; // Example churn rate

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Subscription Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor recurring subscriptions and revenue metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMRR.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              +3 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{churnRate}%</div>
            <p className="text-xs text-muted-foreground">
              -2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Subscription Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Billing Date</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSubscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">{subscriber.customerName}</TableCell>
                  <TableCell>{subscriber.plan}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(subscriber.status)}>
                      {subscriber.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {subscriber.nextBilling === "-" ? "-" : new Date(subscriber.nextBilling).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${subscriber.mrr.toFixed(2)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSubscriber(subscriber)}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Manage Subscription
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Manage Subscription - {subscriber.customerName}</DialogTitle>
                        </DialogHeader>
                        {selectedSubscriber && (
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <h3 className="text-lg font-medium">Subscription Details</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Plan</label>
                                  <p className="text-foreground">{selectedSubscriber.plan}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                                  <div className="mt-1">
                                    <Badge variant={getStatusVariant(selectedSubscriber.status)}>
                                      {selectedSubscriber.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Next Billing</label>
                                  <p className="text-foreground">
                                    {selectedSubscriber.nextBilling === "-" ? "N/A" : new Date(selectedSubscriber.nextBilling).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">MRR</label>
                                  <p className="text-foreground font-semibold">${selectedSubscriber.mrr.toFixed(2)}</p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h3 className="text-lg font-medium">Payment History</h3>
                              <div className="space-y-2">
                                {selectedSubscriber.paymentHistory.map((payment, index) => (
                                  <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                    <div>
                                      <p className="font-medium">{new Date(payment.date).toLocaleDateString()}</p>
                                      <p className="text-sm text-muted-foreground">${payment.amount.toFixed(2)}</p>
                                    </div>
                                    <Badge variant={payment.status === "Paid" ? "default" : "destructive"}>
                                      {payment.status}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button variant="destructive" size="sm">
                                Cancel Subscription
                              </Button>
                              <Button variant="outline" size="sm">
                                Update Plan
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
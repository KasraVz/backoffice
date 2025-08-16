import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DateRange } from "react-day-picker";
import { Search, Eye, Calendar, X } from "lucide-react";

interface Order {
  id: string;
  date: string;
  customerName: string;
  itemsPurchased: string;
  stages: {
    booking: {
      status: "Confirmed" | "Canceled";
      bookedDate: string;
    };
    payment: {
      status: "Paid" | "Not Paid";
      amountDue: number;
      amountPaid: number;
    };
    assessment: {
      status: "Taken" | "Not Taken";
    };
    kyc: {
      status: "Approved" | "Not Approved" | "Pending" | "Rejected";
      rejectionReason: string | null;
    };
  };
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    date: "2024-08-10",
    customerName: "John Smith",
    itemsPurchased: "1x Founder Public Awareness (FPA)",
    stages: {
      booking: {
        status: "Confirmed",
        bookedDate: "2024-08-15T14:00:00Z"
      },
      payment: {
        status: "Paid",
        amountDue: 0.00,
        amountPaid: 49.99
      },
      assessment: {
        status: "Taken"
      },
      kyc: {
        status: "Approved",
        rejectionReason: null
      }
    }
  },
  {
    id: "ORD-002",
    date: "2024-08-09",
    customerName: "Sarah Johnson",
    itemsPurchased: "1x Ecosystem Environment Awareness (EEA)",
    stages: {
      booking: {
        status: "Confirmed",
        bookedDate: "2024-08-20T10:30:00Z"
      },
      payment: {
        status: "Paid",
        amountDue: 0.00,
        amountPaid: 29.99
      },
      assessment: {
        status: "Taken"
      },
      kyc: {
        status: "Approved",
        rejectionReason: null
      }
    }
  },
  {
    id: "ORD-003",
    date: "2024-08-08",
    customerName: "Mike Wilson",
    itemsPurchased: "1x Founder Public Awareness (FPA)",
    stages: {
      booking: {
        status: "Canceled",
        bookedDate: "2024-08-12T16:00:00Z"
      },
      payment: {
        status: "Paid",
        amountDue: 0.00,
        amountPaid: 49.99
      },
      assessment: {
        status: "Not Taken"
      },
      kyc: {
        status: "Rejected",
        rejectionReason: "Invalid identification documents provided"
      }
    }
  },
  {
    id: "ORD-004",
    date: "2024-08-07",
    customerName: "Emma Davis",
    itemsPurchased: "1x General Entrepreneurial Behavior (GEB)",
    stages: {
      booking: {
        status: "Confirmed",
        bookedDate: "2024-08-25T11:00:00Z"
      },
      payment: {
        status: "Not Paid",
        amountDue: 29.99,
        amountPaid: 0.00
      },
      assessment: {
        status: "Not Taken"
      },
      kyc: {
        status: "Pending",
        rejectionReason: null
      }
    }
  },
  {
    id: "ORD-005",
    date: "2024-08-06",
    customerName: "Robert Chen",
    itemsPurchased: "1x Founder Public Awareness (FPA)",
    stages: {
      booking: {
        status: "Confirmed",
        bookedDate: "2024-09-01T13:30:00Z"
      },
      payment: {
        status: "Paid",
        amountDue: 0.00,
        amountPaid: 49.99
      },
      assessment: {
        status: "Not Taken"
      },
      kyc: {
        status: "Pending",
        rejectionReason: null
      }
    }
  }
];

const getOverallStatus = (order: Order) => {
  const { booking, payment, assessment, kyc } = order.stages;
  
  // If booking is canceled or KYC is rejected, show Canceled
  if (booking.status === "Canceled" || kyc.status === "Rejected") {
    return "Canceled";
  }
  
  // If all stages are complete, show Completed
  if (booking.status === "Confirmed" && payment.status === "Paid" && assessment.status === "Taken" && kyc.status === "Approved") {
    return "Completed";
  }
  
  // Otherwise, show In Progress
  return "In Progress";
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Completed":
      return "default";
    case "Canceled":
      return "destructive";
    case "In Progress":
      return "secondary";
    default:
      return "secondary";
  }
};

export default function OrderHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const handleCancelBooking = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
              ...order,
              stages: {
                ...order.stages,
                booking: { ...order.stages.booking, status: "Canceled" as const }
              }
            }
          : order
      )
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!dateRange?.from) return matchesSearch;
    
    const orderDate = new Date(order.date);
    const fromDate = dateRange.from;
    const toDate = dateRange.to || fromDate;
    
    return matchesSearch && orderDate >= fromDate && orderDate <= toDate;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Order History</h1>
          </header>
          <main className="flex-1 p-6 bg-background mx-[27px]">
            <div className="space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Order ID or Customer Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DatePickerWithRange
              date={dateRange}
              setDate={setDateRange}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Items Purchased</TableHead>
                <TableHead>Overall Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.itemsPurchased}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(getOverallStatus(order))}>
                      {getOverallStatus(order)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - {order.id}</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Order Summary */}
                            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Customer</label>
                                <p className="text-foreground font-medium">{selectedOrder.customerName}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Date</label>
                                <p className="text-foreground">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                                <p className="text-foreground font-semibold">${selectedOrder.stages.payment.amountPaid.toFixed(2)}</p>
                              </div>
                            </div>

                             {/* Stage Status Cards */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold">Order Stages</h3>
                              
                              {/* Booking Status Card */}
                              <Card>
                                <CardHeader className="pb-3">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">Booking</CardTitle>
                                    <Badge variant={selectedOrder.stages.booking.status === "Confirmed" ? "default" : "destructive"}>
                                      {selectedOrder.stages.booking.status}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-4">
                                  <div className="text-sm">
                                    <span className="text-muted-foreground">Booked Session Date:</span>
                                    <p className="font-medium mt-1 flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      {new Date(selectedOrder.stages.booking.bookedDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true
                                      })}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                      Reschedule
                                    </Button>
                                    {selectedOrder.stages.booking.status === "Confirmed" && (
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="destructive" size="sm">
                                            <X className="h-4 w-4 mr-1" />
                                            Cancel Booking
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to cancel this booking? This action will also cancel the entire order and cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>No, Keep Booking</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleCancelBooking(selectedOrder.id)}
                                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                              Yes, Cancel Booking
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                              
                              {/* Payment Status Card */}
                              <Card>
                                <CardHeader className="pb-3">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">Payment</CardTitle>
                                    <Badge variant={selectedOrder.stages.payment.status === "Paid" ? "default" : "destructive"}>
                                      {selectedOrder.stages.payment.status}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">Amount Due:</span>
                                      <p className="font-medium">${selectedOrder.stages.payment.amountDue.toFixed(2)}</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Amount Paid:</span>
                                      <p className="font-medium">${selectedOrder.stages.payment.amountPaid.toFixed(2)}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Assessment Status Card */}
                              <Card>
                                <CardHeader className="pb-3">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">Assessment</CardTitle>
                                    <Badge variant={selectedOrder.stages.assessment.status === "Taken" ? "default" : "secondary"}>
                                      {selectedOrder.stages.assessment.status}
                                    </Badge>
                                  </div>
                                </CardHeader>
                              </Card>

                              {/* KYC Status Card */}
                              <Card>
                                <CardHeader className="pb-3">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">KYC Verification</CardTitle>
                                    <Badge variant={
                                      selectedOrder.stages.kyc.status === "Approved" ? "default" :
                                      selectedOrder.stages.kyc.status === "Rejected" ? "destructive" : "secondary"
                                    }>
                                      {selectedOrder.stages.kyc.status}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                {selectedOrder.stages.kyc.status === "Rejected" && selectedOrder.stages.kyc.rejectionReason && (
                                  <CardContent className="pt-0">
                                    <div className="text-sm">
                                      <span className="text-muted-foreground">Reason for Rejection:</span>
                                      <p className="mt-1 text-destructive">{selectedOrder.stages.kyc.rejectionReason}</p>
                                    </div>
                                  </CardContent>
                                )}
                              </Card>
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
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No orders found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </main>
</div>
</div>
</SidebarProvider>
);
}
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { DateRange } from "react-day-picker";
import { Search, Eye } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

interface Order {
  id: string;
  date: string;
  customerName: string;
  items: string;
  amount: number;
  status: "Completed" | "Refunded" | "Pending" | "Failed";
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    date: "2024-08-10",
    customerName: "John Smith",
    items: "FPA Assessment Premium",
    amount: 49.99,
    status: "Completed"
  },
  {
    id: "ORD-002",
    date: "2024-08-09",
    customerName: "Sarah Johnson",
    items: "FPA Assessment Basic",
    amount: 29.99,
    status: "Completed"
  },
  {
    id: "ORD-003",
    date: "2024-08-08",
    customerName: "Mike Wilson",
    items: "FPA Assessment Premium",
    amount: 49.99,
    status: "Refunded"
  },
  {
    id: "ORD-004",
    date: "2024-08-07",
    customerName: "Emma Davis",
    items: "FPA Assessment Basic",
    amount: 29.99,
    status: "Pending"
  }
];

const getStatusVariant = (status: Order['status']) => {
  switch (status) {
    case "Completed":
      return "default";
    case "Refunded":
      return "destructive";
    case "Pending":
      return "secondary";
    case "Failed":
      return "destructive";
    default:
      return "secondary";
  }
};

export default function OrderHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!dateRange?.from) return matchesSearch;
    
    const orderDate = new Date(order.date);
    const fromDate = dateRange.from;
    const toDate = dateRange.to || fromDate;
    
    return matchesSearch && orderDate >= fromDate && orderDate <= toDate;
  });

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Order History"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Orders" }
        ]}
      />
      <p className="text-muted-foreground mb-6">
        View and manage all one-time purchase transactions
      </p>

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
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>${order.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
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
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Order Details - {order.id}</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Customer</label>
                              <p className="text-foreground">{selectedOrder.customerName}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Date</label>
                              <p className="text-foreground">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Items</label>
                              <p className="text-foreground">{selectedOrder.items}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Amount</label>
                              <p className="text-foreground font-semibold">${selectedOrder.amount.toFixed(2)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Status</label>
                              <div className="mt-1">
                                <Badge variant={getStatusVariant(selectedOrder.status)}>
                                  {selectedOrder.status}
                                </Badge>
                              </div>
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
  );
}
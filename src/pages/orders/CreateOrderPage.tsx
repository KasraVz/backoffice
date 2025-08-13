import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, FileText, Mail, CheckCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";

interface LineItem {
  id: string;
  product: string;
  quantity: number;
  price: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

const mockCustomers: Customer[] = [
  { id: "1", name: "John Smith", email: "john@example.com" },
  { id: "2", name: "Sarah Johnson", email: "sarah@example.com" },
  { id: "3", name: "Mike Wilson", email: "mike@example.com" },
  { id: "4", name: "Emma Davis", email: "emma@example.com" }
];

const availableProducts = [
  { name: "FPA Assessment Basic", price: 29.99 },
  { name: "FPA Assessment Premium", price: 49.99 },
  { name: "FPA Assessment Enterprise", price: 99.99 },
  { name: "Consultation Session", price: 150.00 }
];

export default function CreateOrderPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null);

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const addLineItem = (product: string, price: number) => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      product,
      quantity: 1,
      price
    };
    setLineItems(prev => [...prev, newItem]);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeLineItem(id);
      return;
    }
    setLineItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeLineItem = (id: string) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  const applyDiscount = () => {
    if (discountCode === "WELCOME20") {
      setAppliedDiscount({ code: discountCode, amount: 20 });
    } else if (discountCode === "SAVE10") {
      setAppliedDiscount({ code: discountCode, amount: 10 });
    } else {
      alert("Invalid discount code");
    }
  };

  const subtotal = lineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = appliedDiscount 
    ? appliedDiscount.code.includes("20") 
      ? subtotal * 0.20 
      : appliedDiscount.amount
    : 0;
  const total = subtotal - discountAmount;

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Create New Order / Invoice"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Orders" }
        ]}
      />
      <p className="text-muted-foreground mb-6">
        Generate custom orders and invoices for clients
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Search Customer</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {customerSearch && (
                <div className="border rounded-lg max-h-40 overflow-y-auto">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setCustomerSearch("");
                      }}
                    >
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedCustomer && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedCustomer.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCustomer(null)}
                    className="mt-2"
                  >
                    Change Customer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Available Products */}
              <div className="space-y-2">
                <Label>Add Products</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availableProducts.map((product) => (
                    <Button
                      key={product.name}
                      variant="outline"
                      onClick={() => addLineItem(product.name, product.price)}
                      className="justify-start"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {product.name} - ${product.price}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Current Line Items */}
              {lineItems.length > 0 && (
                <div className="space-y-3">
                  <Separator />
                  <Label>Order Items</Label>
                  {lineItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.product}</p>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLineItem(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discount */}
          <Card>
            <CardHeader>
              <CardTitle>Discount Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter discount code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                <Button onClick={applyDiscount} variant="outline">
                  Apply
                </Button>
              </div>
              {appliedDiscount && (
                <div className="mt-2">
                  <Badge variant="default">
                    {appliedDiscount.code} applied - ${discountAmount.toFixed(2)} off
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Actions */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedDiscount.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                disabled={!selectedCustomer || lineItems.length === 0}
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Invoice PDF
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                disabled={!selectedCustomer || lineItems.length === 0}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Invoice via Email
              </Button>
              <Button 
                variant="secondary" 
                className="w-full"
                disabled={!selectedCustomer || lineItems.length === 0}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Paid
              </Button>
            </CardContent>
          </Card>

          {/* Order Details */}
          {selectedCustomer && (
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Order Date:</span>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Customer:</span>
                  <p>{selectedCustomer.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Items:</span>
                  <p>{lineItems.length} item(s)</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
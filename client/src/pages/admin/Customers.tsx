import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/lib/trpc";
import { getErrorMessage } from "@/lib/utils";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Plus, Edit, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

// Rough length of the resolved link (domain + /account?token= + 20-char
// token) once {link} is substituted — used to estimate real SMS length
// before sending, since the placeholder text itself is much shorter.
const ESTIMATED_LINK_LENGTH = 63;

function estimateSmsParts(message: string): { length: number; parts: number } {
  const resolved = message.includes("{link}")
    ? message.replace(/\{link\}/g, "x".repeat(ESTIMATED_LINK_LENGTH))
    : `${message} ${"x".repeat(ESTIMATED_LINK_LENGTH)}`;
  const length = resolved.length;
  const parts = length <= 160 ? 1 : Math.ceil(length / 153);
  return { length, parts };
}

type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  isActive: boolean;
  outstandingPence: number;
  formattedOutstanding: string;
  unpaidCount: number;
  lastLinkSentAt: string | Date | null;
};

function formatPounds(amountPence: number): string {
  return `£${(amountPence / 100).toFixed(2)}`;
}

// issueDate is stored as a plain "YYYY-MM-DD" string — format it directly
// rather than via `new Date(...)`, which can shift a day depending on the
// viewer's timezone.
function formatUkDate(value: string | null): string {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export default function Customers() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", notes: "" });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: customers = [], refetch } = trpc.admin.getCustomers.useQuery();
  const createCustomer = trpc.admin.createCustomer.useMutation();
  const updateCustomer = trpc.admin.updateCustomer.useMutation();
  const deleteCustomer = trpc.admin.deleteCustomer.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCustomer) {
        await updateCustomer.mutateAsync({
          id: editingCustomer.id,
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          notes: formData.notes || null,
        });
      } else {
        await createCustomer.mutateAsync({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          notes: formData.notes || undefined,
        });
      }

      setDialogOpen(false);
      setEditingCustomer(null);
      setFormData({ name: "", phone: "", email: "", notes: "" });
      refetch();
    } catch (error: any) {
      alert(getErrorMessage(error, "Failed to save customer"));
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || "",
      notes: customer.notes || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (customer: Customer) => {
    if (
      !window.confirm(
        `Permanently delete "${customer.name}" and all their invoices?\n\nThis cannot be undone.`
      )
    )
      return;

    try {
      await deleteCustomer.mutateAsync({ id: customer.id });
      refetch();
    } catch (error: any) {
      alert(getErrorMessage(error, "Failed to delete customer"));
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingCustomer(null);
    setFormData({ name: "", phone: "", email: "", notes: "" });
  };

  const totalOutstandingPence = customers.reduce(
    (sum, c) => sum + c.outstandingPence,
    0
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-muted-foreground">
              Manage customer invoices and send account links by text
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCustomer(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCustomer ? "Edit Customer" : "Add Customer"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Claire Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Mobile number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="07123 456789"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createCustomer.isPending || updateCustomer.isPending}
                  >
                    {createCustomer.isPending || updateCustomer.isPending
                      ? "Saving..."
                      : "Save"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {customers.length > 0 && (
          <Card className="p-4 flex items-center justify-between">
            <span className="text-muted-foreground">
              Total outstanding across {customers.length}{" "}
              {customers.length === 1 ? "customer" : "customers"}
            </span>
            <span className="text-lg font-semibold">
              {formatPounds(totalOutstandingPence)}
            </span>
          </Card>
        )}

        <div className="space-y-3">
          {customers.map((customer: Customer) => (
            <Card key={customer.id} className="overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <button
                  className="flex flex-1 items-center gap-4 text-left"
                  onClick={() =>
                    setExpandedId(expandedId === customer.id ? null : customer.id)
                  }
                >
                  {expandedId === customer.id ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{customer.name}</span>
                      {customer.outstandingPence > 0 ? (
                        <Badge variant="destructive">
                          {customer.formattedOutstanding} outstanding
                        </Badge>
                      ) : (
                        <Badge variant="secondary">No balance</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {customer.phone}
                      {customer.email ? ` · ${customer.email}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {customer.lastLinkSentAt
                        ? `Link sent ${formatDistanceToNow(new Date(customer.lastLinkSentAt), { addSuffix: true })}`
                        : "Link never sent"}
                    </p>
                  </div>
                </button>
                <div className="flex shrink-0 gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(customer)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(customer)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              {expandedId === customer.id && (
                <CustomerInvoicesPanel customer={customer} onChanged={refetch} />
              )}
            </Card>
          ))}
          {customers.length === 0 && (
            <Card className="p-12 text-center text-muted-foreground">
              No customers yet. Click "Add Customer" to get started.
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

type Invoice = {
  id: number;
  invoiceNumber: string;
  amountPence: number;
  formattedAmount: string;
  issueDate: string | null;
  status: "unpaid" | "paid";
};

function CustomerInvoicesPanel({
  customer,
  onChanged,
}: {
  customer: Customer;
  onChanged: () => void;
}) {
  const [newInvoiceNumber, setNewInvoiceNumber] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newIssueDate, setNewIssueDate] = useState("");
  const [sendOpen, setSendOpen] = useState(false);
  const [sendMessage, setSendMessage] = useState("");
  const [sendResult, setSendResult] = useState<string | null>(null);

  const invoicesQuery = trpc.admin.getCustomerInvoices.useQuery({
    customerId: customer.id,
  });
  const createInvoice = trpc.admin.createInvoice.useMutation();
  const updateInvoiceStatus = trpc.admin.updateInvoiceStatus.useMutation();
  const deleteInvoice = trpc.admin.deleteInvoice.useMutation();
  const sendLink = trpc.admin.sendCustomerAccountLink.useMutation();
  const sendPaymentReceivedText = trpc.admin.sendPaymentReceivedText.useMutation();

  const invoices: Invoice[] = invoicesQuery.data ?? [];

  async function handleAddInvoice(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(newAmount);
    if (!newInvoiceNumber.trim() || !Number.isFinite(amount) || amount <= 0) {
      alert("Enter a valid invoice number and amount");
      return;
    }

    try {
      await createInvoice.mutateAsync({
        customerId: customer.id,
        invoiceNumber: newInvoiceNumber.trim(),
        amount,
        issueDate: newIssueDate || undefined,
      });
      setNewInvoiceNumber("");
      setNewAmount("");
      setNewIssueDate("");
      invoicesQuery.refetch();
      onChanged();
    } catch (error: any) {
      alert(getErrorMessage(error, "Failed to add invoice"));
    }
  }

  async function handleToggleStatus(invoice: Invoice) {
    const markingPaid = invoice.status === "unpaid";

    try {
      await updateInvoiceStatus.mutateAsync({
        id: invoice.id,
        status: markingPaid ? "paid" : "unpaid",
      });
      invoicesQuery.refetch();
      onChanged();
    } catch (error: any) {
      alert(getErrorMessage(error, "Failed to update invoice"));
      return;
    }

    if (
      markingPaid &&
      customer.phone &&
      window.confirm(
        `Text ${customer.name} to confirm you've received payment for invoice ${invoice.invoiceNumber}?`
      )
    ) {
      try {
        await sendPaymentReceivedText.mutateAsync({ invoiceId: invoice.id });
      } catch (error: any) {
        alert(getErrorMessage(error, "Failed to send payment confirmation text"));
      }
    }
  }

  async function handleDeleteInvoice(invoice: Invoice) {
    if (!window.confirm(`Delete invoice ${invoice.invoiceNumber}?`)) return;
    try {
      await deleteInvoice.mutateAsync({ id: invoice.id });
      invoicesQuery.refetch();
      onChanged();
    } catch (error: any) {
      alert(getErrorMessage(error, "Failed to delete invoice"));
    }
  }

  function openSendDialog() {
    setSendResult(null);
    setSendMessage(
      `Hi ${customer.name}, your Cloud Cars balance is ${customer.formattedOutstanding}. View invoices & pay: {link}`
    );
    setSendOpen(true);
  }

  async function handleSend() {
    try {
      const res = await sendLink.mutateAsync({
        customerId: customer.id,
        message: sendMessage,
      });
      setSendResult(res.link);
      onChanged();
    } catch (error: any) {
      alert(getErrorMessage(error, "Failed to send text message"));
    }
  }

  return (
    <div className="border-t bg-muted/30 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Invoices</h4>
        <Button size="sm" onClick={openSendDialog} disabled={!customer.phone}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Send account link via SMS
        </Button>
      </div>

      {invoices.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.formattedAmount}</TableCell>
                <TableCell>{formatUkDate(invoice.issueDate)}</TableCell>
                <TableCell>
                  <Badge variant={invoice.status === "paid" ? "secondary" : "destructive"}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(invoice)}
                  >
                    Mark {invoice.status === "unpaid" ? "paid" : "unpaid"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteInvoice(invoice)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <form onSubmit={handleAddInvoice} className="flex flex-wrap items-end gap-3">
        <div>
          <Label htmlFor={`inv-num-${customer.id}`}>Invoice #</Label>
          <Input
            id={`inv-num-${customer.id}`}
            value={newInvoiceNumber}
            onChange={(e) => setNewInvoiceNumber(e.target.value)}
            placeholder="3058"
            className="w-32"
          />
        </div>
        <div>
          <Label htmlFor={`inv-amount-${customer.id}`}>Amount (£)</Label>
          <Input
            id={`inv-amount-${customer.id}`}
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            placeholder="302.17"
            inputMode="decimal"
            className="w-32"
          />
        </div>
        <div>
          <Label htmlFor={`inv-date-${customer.id}`}>Date</Label>
          <Input
            id={`inv-date-${customer.id}`}
            type="date"
            value={newIssueDate}
            onChange={(e) => setNewIssueDate(e.target.value)}
            className="w-40"
          />
        </div>
        <Button type="submit" disabled={createInvoice.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          Add invoice
        </Button>
      </form>

      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send account link to {customer.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Sends one text to {customer.phone} with a link to a page showing all
              unpaid invoices, the total owed, and our BACS details.
            </p>
            <div>
              <Label htmlFor="send-message">Message</Label>
              <Textarea
                id="send-message"
                value={sendMessage}
                onChange={(e) => setSendMessage(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {"{link}"} is replaced with the customer's secure link when sent. If
                you remove it, the link is added to the end of the message instead.
              </p>
              {(() => {
                const { length, parts } = estimateSmsParts(sendMessage);
                return (
                  <p
                    className={`text-xs mt-1 ${
                      parts > 1 ? "text-destructive" : "text-muted-foreground"
                    }`}
                  >
                    ~{length} characters —{" "}
                    {parts > 1
                      ? `will send as ${parts} texts`
                      : "fits in one text"}
                  </p>
                );
              })()}
            </div>
            {sendResult && (
              <div className="rounded-md border p-3 text-sm space-y-1">
                <p className="font-medium">Sent! Link:</p>
                <p className="break-all text-muted-foreground">{sendResult}</p>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSendOpen(false)}>
                Close
              </Button>
              <Button onClick={handleSend} disabled={sendLink.isPending}>
                {sendLink.isPending ? "Sending..." : "Send text"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

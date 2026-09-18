import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation, useRoute } from "wouter";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function getTokenFromWindow(): string {
  if (typeof window === "undefined") return "";
  const sp = new URLSearchParams(window.location.search);
  return sp.get("token") || "";
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

export default function CustomerAccountPage() {
  const [location] = useLocation();
  const [, params] = useRoute("/account/:token");

  const token = useMemo(() => {
    const fromQuery = getTokenFromWindow();
    if (fromQuery) return fromQuery;

    const fromParam = (params as any)?.token;
    if (typeof fromParam === "string" && fromParam.length >= 10) return fromParam;

    const hasQ = location.includes("?");
    if (hasQ) {
      const sp = new URLSearchParams(location.split("?")[1]);
      return sp.get("token") || "";
    }

    return "";
  }, [location, params]);

  const accountQuery = trpc.customerAccount.getByToken.useQuery(
    { token },
    { enabled: !!token }
  );

  if (!token) {
    return (
      <PageShell>
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-2">Cloud Cars Account</h1>
          <p className="text-muted-foreground">
            This link is missing a token. Please use the link that was texted to you.
          </p>
        </Card>
      </PageShell>
    );
  }

  if (accountQuery.isLoading) {
    return (
      <PageShell>
        <Card className="p-6">
          <p>Loading your account…</p>
        </Card>
      </PageShell>
    );
  }

  if (accountQuery.error || !accountQuery.data) {
    return (
      <PageShell>
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-2">Cloud Cars Account</h1>
          <p className="text-destructive mb-4">
            {accountQuery.error?.message ||
              "This link has expired or is no longer valid."}
          </p>
          <p className="text-sm text-muted-foreground">
            Please call us on{" "}
            <a href="tel:+441158244244" className="underline">
              0115 8 244 244
            </a>{" "}
            and we'll send you a new link.
          </p>
        </Card>
      </PageShell>
    );
  }

  const { customerName, invoices, formattedOutstanding, bacs } = accountQuery.data;

  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Hi {customerName}</h1>
          <p className="text-muted-foreground">Here's a summary of your account.</p>
        </div>

        <Card className="p-4 flex items-center justify-between">
          <span className="font-medium">Total outstanding</span>
          <Badge variant={invoices.length > 0 ? "destructive" : "secondary"}>
            {formattedOutstanding}
          </Badge>
        </Card>

        {invoices.length > 0 ? (
          <Card className="p-4">
            <h2 className="font-semibold mb-3">Unpaid invoices</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{formatUkDate(invoice.issueDate)}</TableCell>
                    <TableCell className="text-right">
                      {invoice.formattedAmount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <Card className="p-6 text-center text-muted-foreground">
            You have no unpaid invoices. Thank you!
          </Card>
        )}

        {invoices.length > 0 && (
          <Card className="p-4 space-y-2">
            <h2 className="font-semibold">How to pay — BACS transfer</h2>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Account name:</span>{" "}
                {bacs.accountName || "Cloud Cars"}
              </p>
              <p>
                <span className="text-muted-foreground">Sort code:</span>{" "}
                {bacs.sortCode || "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Account number:</span>{" "}
                {bacs.accountNumber || "—"}
              </p>
            </div>
            <p className="text-sm text-muted-foreground pt-2">
              Please let us know once payment has been made so we can update and
              reactivate your account.
            </p>
          </Card>
        )}
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-2xl p-6">{children}</div>;
}

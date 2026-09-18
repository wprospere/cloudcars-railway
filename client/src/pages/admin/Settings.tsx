import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export default function Settings() {
  const { user } = useAuth();

  return (
    <AdminLayout title="Settings">
      <div className="space-y-4">
        <Card className="p-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Admin Profile</h2>

            <div className="text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-foreground">
                  {(user as any)?.email || "Not set"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium text-foreground">
                  {(user as any)?.role || "Not set"}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <BacsDetailsCard />

        <Card className="p-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">System</h2>
            <p className="text-sm text-muted-foreground">
              More settings will appear here as we expand admin features.
            </p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

function BacsDetailsCard() {
  const bacsQuery = trpc.admin.getBacsDetails.useQuery();
  const updateBacs = trpc.admin.updateBacsDetails.useMutation();

  const [form, setForm] = useState({
    accountName: "",
    sortCode: "",
    accountNumber: "",
  });

  useEffect(() => {
    if (bacsQuery.data) setForm(bacsQuery.data);
  }, [bacsQuery.data]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateBacs.mutateAsync(form);
      alert("BACS details saved");
      bacsQuery.refetch();
    } catch (error: any) {
      alert(error?.message || "Failed to save BACS details");
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">BACS payment details</h2>
          <p className="text-sm text-muted-foreground">
            Shown to customers on their account link page under Customers.
          </p>
        </div>
        <form onSubmit={handleSave} className="space-y-3 max-w-sm">
          <div>
            <Label htmlFor="bacs-name">Account name</Label>
            <Input
              id="bacs-name"
              value={form.accountName}
              onChange={(e) => setForm({ ...form, accountName: e.target.value })}
              placeholder="Cloud Cars"
            />
          </div>
          <div>
            <Label htmlFor="bacs-sort">Sort code</Label>
            <Input
              id="bacs-sort"
              value={form.sortCode}
              onChange={(e) => setForm({ ...form, sortCode: e.target.value })}
              placeholder="20-63-28"
            />
          </div>
          <div>
            <Label htmlFor="bacs-account">Account number</Label>
            <Input
              id="bacs-account"
              value={form.accountNumber}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
              placeholder="03201090"
            />
          </div>
          <Button type="submit" disabled={updateBacs.isPending}>
            {updateBacs.isPending ? "Saving..." : "Save BACS details"}
          </Button>
        </form>
      </div>
    </Card>
  );
}

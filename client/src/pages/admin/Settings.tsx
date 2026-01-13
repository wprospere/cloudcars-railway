import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";

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

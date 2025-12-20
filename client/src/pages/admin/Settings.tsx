import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";

export default function AdminSettings() {
  const { user } = useAuth();

  return (
    <AdminLayout
      title="Settings"
      description="Manage your account and website settings"
    >
      <div className="space-y-6 max-w-2xl">
        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your admin account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium text-foreground">{user?.name || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{user?.email || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium text-foreground capitalize">{user?.role || "User"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Sign In</p>
                <p className="font-medium text-foreground">
                  {user?.lastSignedIn 
                    ? new Date(user.lastSignedIn).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Unknown"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Website Info */}
        <Card>
          <CardHeader>
            <CardTitle>Website Information</CardTitle>
            <CardDescription>Details about your Cloud Cars website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Website Name</p>
                <p className="font-medium text-foreground">Cloud Cars</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium text-foreground">Nottingham, UK</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">0118 8 244 244</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">info@cloudcarsltd.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Resources and support options</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If you need assistance with your website or have questions about 
              the content management system, please contact your website administrator 
              or development team.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

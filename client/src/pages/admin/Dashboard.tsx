import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Image, Eye, Settings } from "lucide-react";
import { Link } from "wouter";

const quickActions = [
  {
    title: "Edit Content",
    description: "Update text, headings, and descriptions across your website",
    icon: FileText,
    href: "/admin/content",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Manage Images",
    description: "Upload and manage images used on your website",
    icon: Image,
    href: "/admin/images",
    color: "bg-green-500/10 text-green-500",
  },
  {
    title: "View Website",
    description: "See how your changes look on the live website",
    icon: Eye,
    href: "/",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "Settings",
    description: "Configure website settings and preferences",
    icon: Settings,
    href: "/admin/settings",
    color: "bg-orange-500/10 text-orange-500",
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayout
      title="Dashboard"
      description="Welcome to the Cloud Cars content management system"
    >
      <div className="space-y-8">
        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <div
                      className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-2`}
                    >
                      <action.icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <CardDescription>{action.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Help Section */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>How to Use This Dashboard</CardTitle>
              <CardDescription>
                A quick guide to managing your website content
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Editing Text Content
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Go to "Edit Content" to update headings, descriptions, and
                    other text on your website. Changes are saved automatically
                    and appear on your website immediately.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Managing Images
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Use "Manage Images" to upload new images or replace existing
                    ones. Supported formats include PNG, JPG, and WebP. Images
                    are automatically optimised for fast loading.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AdminLayout>
  );
}

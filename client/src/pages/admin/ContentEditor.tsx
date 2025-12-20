import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2, Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// Define editable sections
const sections = [
  {
    key: "hero",
    label: "Hero Section",
    description: "The main banner at the top of your homepage",
    fields: ["title", "subtitle", "description", "buttonText"],
  },
  {
    key: "services",
    label: "Services Section",
    description: "Your service offerings and pricing",
    fields: ["title", "subtitle", "description"],
  },
  {
    key: "trust",
    label: "Trust Indicators",
    description: "Statistics and trust-building content",
    fields: ["title", "subtitle", "description"],
  },
  {
    key: "corporate",
    label: "Corporate Section",
    description: "Business accounts and corporate services",
    fields: ["title", "subtitle", "description", "buttonText"],
  },
  {
    key: "drivers",
    label: "Driver Recruitment",
    description: "Content for attracting new drivers",
    fields: ["title", "subtitle", "description", "buttonText"],
  },
  {
    key: "about",
    label: "About Section",
    description: "Your company story and values",
    fields: ["title", "subtitle", "description"],
  },
  {
    key: "contact",
    label: "Contact Section",
    description: "Contact information and form",
    fields: ["title", "subtitle", "description"],
  },
];

interface ContentFormData {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

function SectionEditor({ sectionKey, label, description, fields }: {
  sectionKey: string;
  label: string;
  description: string;
  fields: string[];
}) {
  const [formData, setFormData] = useState<ContentFormData>({
    title: "",
    subtitle: "",
    description: "",
    buttonText: "",
    buttonLink: "",
  });
  const [saved, setSaved] = useState(false);

  const { data: content, isLoading } = trpc.cms.getContent.useQuery({ sectionKey });
  const updateMutation = trpc.cms.updateContent.useMutation({
    onSuccess: () => {
      setSaved(true);
      toast.success("Content saved successfully!");
      setTimeout(() => setSaved(false), 2000);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save content");
    },
  });

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || "",
        subtitle: content.subtitle || "",
        description: content.description || "",
        buttonText: content.buttonText || "",
        buttonLink: content.buttonLink || "",
      });
    }
  }, [content]);

  const handleSave = () => {
    updateMutation.mutate({
      sectionKey,
      ...formData,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.includes("title") && (
          <div className="space-y-2">
            <Label htmlFor={`${sectionKey}-title`}>Title</Label>
            <Input
              id={`${sectionKey}-title`}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter section title"
            />
          </div>
        )}

        {fields.includes("subtitle") && (
          <div className="space-y-2">
            <Label htmlFor={`${sectionKey}-subtitle`}>Subtitle</Label>
            <Input
              id={`${sectionKey}-subtitle`}
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Enter subtitle or tagline"
            />
          </div>
        )}

        {fields.includes("description") && (
          <div className="space-y-2">
            <Label htmlFor={`${sectionKey}-description`}>Description</Label>
            <Textarea
              id={`${sectionKey}-description`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter section description"
              rows={4}
            />
          </div>
        )}

        {fields.includes("buttonText") && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${sectionKey}-buttonText`}>Button Text</Label>
              <Input
                id={`${sectionKey}-buttonText`}
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="e.g., Book Now"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${sectionKey}-buttonLink`}>Button Link</Label>
              <Input
                id={`${sectionKey}-buttonLink`}
                value={formData.buttonLink}
                onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                placeholder="e.g., #booking"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ContentEditor() {
  return (
    <AdminLayout
      title="Edit Content"
      description="Update text and descriptions across your website"
    >
      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-2">
          {sections.map((section) => (
            <TabsTrigger key={section.key} value={section.key}>
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.key} value={section.key}>
            <SectionEditor
              sectionKey={section.key}
              label={section.label}
              description={section.description}
              fields={section.fields}
            />
          </TabsContent>
        ))}
      </Tabs>
    </AdminLayout>
  );
}

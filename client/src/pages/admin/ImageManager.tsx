import { useState, useRef, useMemo } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, Loader2, Image as ImageIcon, Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * ✅ Main site images (used in homepage/services/about)
 */
const mainImageSlots = [
  {
    key: "hero-background",
    label: "Hero Background",
    description: "Main banner background image",
    kind: "cover" as const,
  },
  {
    key: "about-image",
    label: "About Section Image",
    description: "Image for the about section",
    kind: "cover" as const,
  },
  {
    key: "services-standard",
    label: "Standard Service",
    description: "Image for standard taxi service",
    kind: "cover" as const,
  },
  {
    key: "services-executive",
    label: "Executive Service",
    description: "Image for executive car service",
    kind: "cover" as const,
  },
  {
    key: "services-corporate",
    label: "Corporate Service",
    description: "Image for corporate accounts",
    kind: "cover" as const,
  },
];

/**
 * ✅ Trusted Partners / Logos
 */
const partnerLogoSlots = [
  {
    key: "partner-logo-1",
    label: "Partner Logo 1",
    description: "Trusted partner logo (transparent PNG recommended)",
    kind: "logo" as const,
  },
  {
    key: "partner-logo-2",
    label: "Partner Logo 2",
    description: "Trusted partner logo (transparent PNG recommended)",
    kind: "logo" as const,
  },
  {
    key: "partner-logo-3",
    label: "Partner Logo 3",
    description: "Trusted partner logo (transparent PNG recommended)",
    kind: "logo" as const,
  },
  {
    key: "partner-logo-4",
    label: "Partner Logo 4",
    description: "Trusted partner logo (transparent PNG recommended)",
    kind: "logo" as const,
  },
];

type SlotKind = "cover" | "logo";

type CmsImageRow = {
  imageKey: string;
  url: string | null;
  altText?: string | null;
  caption?: string | null;
};

// ✅ Unwrap helper (because your API returns { json: [...] } on Railway)
function unwrapImages(data: any): CmsImageRow[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as CmsImageRow[];
  if (Array.isArray(data?.json)) return data.json as CmsImageRow[];
  if (Array.isArray(data?.data)) return data.data as CmsImageRow[];
  if (Array.isArray(data?.items)) return data.items as CmsImageRow[];
  if (Array.isArray(data?.rows)) return data.rows as CmsImageRow[];
  return [];
}

function ImageUploader({
  imageKey,
  label,
  description,
  currentUrl,
  onUploadSuccess,
  kind = "cover",
}: {
  imageKey: string;
  label: string;
  description: string;
  currentUrl?: string;
  onUploadSuccess: () => void;
  kind?: SlotKind;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.cms.uploadImage.useMutation({
    onSuccess: () => {
      toast.success("Image uploaded successfully!");
      setIsOpen(false);
      setPreview(null);
      setAltText("");
      // reset file input so re-selecting same file works
      if (fileInputRef.current) fileInputRef.current.value = "";
      onUploadSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload image");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!preview) return;

    const commaIndex = preview.indexOf(",");
    if (commaIndex === -1) {
      toast.error("Invalid image data");
      return;
    }

    const meta = preview.slice(0, commaIndex); // data:image/png;base64
    const base64Data = preview.slice(commaIndex + 1);
    const mimeType = meta.split(";")[0].split(":")[1] || "image/png";

    uploadMutation.mutate({
      imageKey,
      base64Data,
      mimeType,
      altText: altText || label,
    });
  };

  const previewBoxClass = kind === "logo" ? "aspect-square" : "aspect-video";
  const imgFitClass = kind === "logo" ? "object-contain p-4" : "object-cover";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{label}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Current Image Preview */}
          <div
            className={`${previewBoxClass} rounded-lg border border-border bg-secondary/30 overflow-hidden flex items-center justify-center`}
          >
            {currentUrl ? (
              <img
                src={currentUrl}
                alt={label}
                className={`w-full h-full ${imgFitClass}`}
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No image uploaded</p>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                {currentUrl ? "Replace Image" : "Upload Image"}
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload {label}</DialogTitle>
                <DialogDescription>
                  {kind === "logo"
                    ? "Choose a logo to upload. Recommended: transparent PNG, or WebP."
                    : "Choose an image to upload. Recommended size: 1920x1080 for backgrounds."}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* File Input */}
                <div className="space-y-2">
                  <Label>Select Image</Label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="cursor-pointer"
                  />
                </div>

                {/* Preview */}
                {preview && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div
                      className={`${previewBoxClass} rounded-lg border border-border overflow-hidden`}
                    >
                      <img
                        src={preview}
                        alt="Preview"
                        className={`w-full h-full ${imgFitClass}`}
                      />
                    </div>
                  </div>
                )}

                {/* Alt Text */}
                <div className="space-y-2">
                  <Label htmlFor="altText">Alt Text (for accessibility)</Label>
                  <Input
                    id="altText"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder={`Describe the ${label.toLowerCase()}`}
                  />
                </div>

                {/* Upload Button */}
                <Button
                  onClick={handleUpload}
                  disabled={!preview || uploadMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Upload Image
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ImageManager() {
  const imagesQuery = trpc.cms.getAllImages.useQuery();

  // ✅ this is the fix: unwrap { json: [...] } into a real array
  const images = useMemo(
    () => unwrapImages(imagesQuery.data),
    [imagesQuery.data]
  );

  const getImageUrl = (imageKey: string) => {
    const image = images.find((img) => img.imageKey === imageKey);
    return image?.url ?? undefined;
  };

  return (
    <AdminLayout
      title="Manage Images"
      description="Upload and manage images used across your website"
    >
      <div className="space-y-10">
        {/* ✅ Main Website Images */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">Main Website Images</h2>
            <p className="text-sm text-muted-foreground">
              Hero, About, and Services images shown across the site.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainImageSlots.map((slot) => (
              <ImageUploader
                key={slot.key}
                imageKey={slot.key}
                label={slot.label}
                description={slot.description}
                currentUrl={getImageUrl(slot.key)}
                onUploadSuccess={() => imagesQuery.refetch()}
                kind={slot.kind}
              />
            ))}
          </div>
        </div>

        {/* ✅ Partners Logos */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">Trusted Partners Logos</h2>
            <p className="text-sm text-muted-foreground">
              Upload logos shown in the “Trusted partners” section on the website.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerLogoSlots.map((slot) => (
              <ImageUploader
                key={slot.key}
                imageKey={slot.key}
                label={slot.label}
                description={slot.description}
                currentUrl={getImageUrl(slot.key)}
                onUploadSuccess={() => imagesQuery.refetch()}
                kind={slot.kind}
              />
            ))}
          </div>
        </div>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Image Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use high-quality images for the best appearance</li>
              <li>• Recommended formats: PNG, JPG, or WebP</li>
              <li>• Maximum file size: 5MB per image</li>
              <li>• Hero backgrounds work best at 1920x1080 pixels or larger</li>
              <li>• Logos look best as transparent PNG (or WebP)</li>
              <li>• Always add alt text for better accessibility</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

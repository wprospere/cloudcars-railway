import { useState, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, Loader2, Trash2, Image as ImageIcon, Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// Predefined image slots that can be customised
const imageSlots = [
  { key: "hero-background", label: "Hero Background", description: "Main banner background image" },
  { key: "about-image", label: "About Section Image", description: "Image for the about section" },
  { key: "services-standard", label: "Standard Service", description: "Image for standard taxi service" },
  { key: "services-executive", label: "Executive Service", description: "Image for executive car service" },
  { key: "services-corporate", label: "Corporate Service", description: "Image for corporate accounts" },
];

function ImageUploader({ imageKey, label, description, currentUrl, onUploadSuccess }: {
  imageKey: string;
  label: string;
  description: string;
  currentUrl?: string;
  onUploadSuccess: () => void;
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
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!preview) return;

    // Extract base64 data (remove data:image/...;base64, prefix)
    const base64Data = preview.split(",")[1];
    const mimeType = preview.split(";")[0].split(":")[1];

    uploadMutation.mutate({
      imageKey,
      base64Data,
      mimeType,
      altText: altText || label,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{label}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Image Preview */}
          <div className="aspect-video rounded-lg border border-border bg-secondary/30 overflow-hidden flex items-center justify-center">
            {currentUrl ? (
              <img
                src={currentUrl}
                alt={label}
                className="w-full h-full object-cover"
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
                  Choose an image to upload. Recommended size: 1920x1080 pixels.
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
                    <div className="aspect-video rounded-lg border border-border overflow-hidden">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
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
  const { data: images, refetch } = trpc.cms.getAllImages.useQuery();

  const getImageUrl = (imageKey: string) => {
    const image = images?.find((img) => img.imageKey === imageKey);
    return image?.url;
  };

  return (
    <AdminLayout
      title="Manage Images"
      description="Upload and manage images used across your website"
    >
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {imageSlots.map((slot) => (
            <ImageUploader
              key={slot.key}
              imageKey={slot.key}
              label={slot.label}
              description={slot.description}
              currentUrl={getImageUrl(slot.key)}
              onUploadSuccess={() => refetch()}
            />
          ))}
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
              <li>• Always add alt text for better accessibility</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

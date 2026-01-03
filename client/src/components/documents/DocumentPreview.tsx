import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  ExternalLink,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

type DocStatus = "PENDING" | "APPROVED" | "REJECTED";

export type DriverDocument = {
  id: number | string;
  label: string;
  url: string;
  filename?: string;
  mimeType?: string;
  status?: DocStatus;
  uploadedAt?: string;
};

function getExt(url: string) {
  return url.split("?")[0]?.split(".").pop()?.toLowerCase();
}

function isPdf(doc: DriverDocument) {
  if (doc.mimeType) return doc.mimeType.toLowerCase().includes("pdf");
  return getExt(doc.url) === "pdf";
}

function isImage(doc: DriverDocument) {
  if (doc.mimeType) return doc.mimeType.toLowerCase().startsWith("image/");
  return ["jpg", "jpeg", "png", "webp", "gif"].includes(getExt(doc.url) ?? "");
}

function StatusBadge({ status }: { status?: DocStatus }) {
  if (!status) return null;

  const variant =
    status === "APPROVED"
      ? "default"
      : status === "REJECTED"
      ? "destructive"
      : "secondary";

  return <Badge variant={variant}>{status}</Badge>;
}

export function DocumentPreviewGrid({
  documents,
}: {
  documents: DriverDocument[];
}) {
  if (!documents?.length) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          No documents uploaded yet.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {documents.map((doc) => (
        <DocumentCard key={String(doc.id)} doc={doc} />
      ))}
    </div>
  );
}

function DocumentCard({ doc }: { doc: DriverDocument }) {
  const pdf = isPdf(doc);
  const img = isImage(doc);
  const name =
    doc.filename ?? doc.url.split("?")[0]?.split("/").pop() ?? "document";

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <h4 className="font-medium truncate">{doc.label}</h4>
          <p className="text-xs text-muted-foreground truncate">{name}</p>
        </div>
        <StatusBadge status={doc.status} />
      </div>

      <div className="mt-3">
        {img ? (
          <a href={doc.url} target="_blank" rel="noreferrer" className="block">
            <div className="border rounded-lg overflow-hidden bg-muted">
              <img
                src={doc.url}
                alt={doc.label}
                className="w-full max-h-[320px] object-contain"
                loading="lazy"
              />
            </div>
          </a>
        ) : pdf ? (
          <div className="flex items-center gap-3 border rounded-lg p-3 bg-muted/30">
            <FileText className="w-5 h-5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">PDF document</p>
              <p className="text-xs text-muted-foreground truncate">{name}</p>
            </div>
            <Button size="sm" variant="secondary" asChild>
              <a href={doc.url} target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                Open
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={doc.url} download>
                <Download className="w-4 h-4 mr-1" />
                Download
              </a>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 border rounded-lg p-3 bg-muted/30">
            <ImageIcon className="w-5 h-5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">File</p>
              <p className="text-xs text-muted-foreground truncate">{name}</p>
            </div>
            <Button size="sm" variant="outline" asChild>
              <a href={doc.url} target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                Open
              </a>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}


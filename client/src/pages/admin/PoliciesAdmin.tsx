import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Slug = "terms" | "privacy" | "cookies";

function defaultTitle(slug: Slug) {
  if (slug === "terms") return "Terms & Conditions";
  if (slug === "privacy") return "Privacy Notice";
  return "Cookie Policy";
}

function publicPath(slug: Slug) {
  if (slug === "terms") return "/terms";
  if (slug === "privacy") return "/privacy";
  return "/cookies";
}

export default function PoliciesAdmin() {
  const [slug, setSlug] = useState<Slug>("terms");
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const policyQuery = trpc.cms.getPolicyDoc.useQuery({ slug });
  const upsert = trpc.cms.upsertPolicyDoc.useMutation();

  const isSaving = upsert.isPending;
  const previewUrl = useMemo(() => publicPath(slug), [slug]);

  function hydrateFromServer() {
    const d = policyQuery.data;

    if (!d) {
      setTitle(defaultTitle(slug));
      setMarkdown("");
      setLastUpdated(new Date().toISOString());
      return;
    }

    setTitle(d.title ?? defaultTitle(slug));
    setMarkdown(d.markdown ?? "");
    setLastUpdated(d.lastUpdated ?? new Date().toISOString());
  }

  useEffect(() => {
    hydrateFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, policyQuery.data]);

  async function onSave() {
    try {
      await upsert.mutateAsync({
        slug,
        title: title.trim() || defaultTitle(slug),
        markdown: markdown ?? "",
        lastUpdated: (lastUpdated || new Date().toISOString()).trim(),
      });

      toast.success("Saved", { description: `Updated ${slug} policy.` });
      await policyQuery.refetch();
    } catch (e: any) {
      toast.error("Save failed", {
        description: e?.message ?? "Could not save policy doc",
      });
    }
  }

  return (
    <AdminLayout title="Policies">
      <div className="space-y-6">
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="w-full sm:w-56">
                <Select value={slug} onValueChange={(v) => setSlug(v as Slug)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="terms">Terms</SelectItem>
                    <SelectItem value="privacy">Privacy</SelectItem>
                    <SelectItem value="cookies">Cookies</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => window.open(previewUrl, "_blank")}
                >
                  Preview
                </Button>

                <Button
                  variant="outline"
                  onClick={() => policyQuery.refetch().then(hydrateFromServer)}
                  disabled={policyQuery.isLoading}
                >
                  Reset
                </Button>

                {policyQuery.isLoading ? (
                  <div className="text-sm text-muted-foreground flex items-center">
                    Loading…
                  </div>
                ) : null}

                {policyQuery.error ? (
                  <div className="text-sm text-destructive flex items-center">
                    Failed to load policy.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setLastUpdated(new Date().toISOString())}
                disabled={isSaving}
              >
                Set updated = now
              </Button>

              <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Terms & Conditions"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Last updated (ISO)
            </label>
            <Input
              value={lastUpdated}
              onChange={(e) => setLastUpdated(e.target.value)}
              placeholder="2026-01-26T00:00:00.000Z"
            />
            <p className="text-xs text-muted-foreground">
              This is what shows on the public page.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Markdown</label>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Paste your policy text in Markdown…"
              className="min-h-[520px]"
            />
            <p className="text-xs text-muted-foreground">
              Tip: Use headings like <code>##</code> and bullet points.
            </p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

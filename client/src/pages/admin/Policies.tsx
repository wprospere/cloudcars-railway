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
import { useToast } from "@/components/ui/use-toast";

type Slug = "terms" | "privacy" | "cookies";

export default function PoliciesAdmin() {
  const { toast } = useToast();

  const [slug, setSlug] = useState<Slug>("terms");
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const policyQuery = trpc.cms.getPolicyDoc.useQuery({ slug });
  const upsert = trpc.cms.upsertPolicyDoc.useMutation();

  useEffect(() => {
    const d = policyQuery.data;
    if (!d) {
      // default starter content for new docs
      setTitle(slug === "terms" ? "Terms & Conditions" : slug === "privacy" ? "Privacy Policy" : "Cookies Policy");
      setMarkdown("");
      setLastUpdated(new Date().toISOString());
      return;
    }

    setTitle(d.title ?? "");
    setMarkdown(d.markdown ?? "");
    setLastUpdated(d.lastUpdated ?? new Date().toISOString());
  }, [slug, policyQuery.data]);

  const isSaving = upsert.isPending;

  async function onSave() {
    try {
      await upsert.mutateAsync({
        slug,
        title: title.trim() || (slug === "terms" ? "Terms & Conditions" : slug === "privacy" ? "Privacy Policy" : "Cookies Policy"),
        markdown: markdown ?? "",
        lastUpdated: lastUpdated || new Date().toISOString(),
      });

      toast({ title: "Saved", description: `Updated ${slug} policy.` });
      policyQuery.refetch();
    } catch (e: any) {
      toast({
        title: "Save failed",
        description: e?.message ?? "Could not save policy doc",
        variant: "destructive",
      });
    }
  }

  return (
    <AdminLayout title="Policies">
      <div className="space-y-6">
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex gap-3 items-center">
              <div className="w-56">
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

              {policyQuery.isLoading ? (
                <div className="text-sm text-muted-foreground">Loading…</div>
              ) : null}
            </div>

            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Terms & Conditions" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Last updated (ISO)</label>
            <Input value={lastUpdated} onChange={(e) => setLastUpdated(e.target.value)} />
            <p className="text-xs text-muted-foreground">
              Tip: leave as-is; it updates what shows on the public page.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Markdown</label>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Paste your policy text in Markdown…"
              className="min-h-[420px]"
            />
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

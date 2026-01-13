import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ActivityRow = {
  id: number;
  entityType: string;
  entityId: number;
  action: string;
  adminEmail?: string | null;
  createdAt: string | Date;
  meta?: any;
};

function fmtDate(dt: string | Date) {
  const d = typeof dt === "string" ? new Date(dt) : dt;
  if (Number.isNaN(d.getTime())) return String(dt);
  return d.toLocaleString();
}

function prettyAction(a: string) {
  return a.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

function actionVariant(action: string): "default" | "secondary" | "destructive" | "outline" {
  if (action === "DOC_REVIEWED") return "default";
  if (action === "REMINDER_SENT") return "secondary";
  if (action === "STATUS_CHANGED") return "outline";
  if (action === "NOTE_ADDED") return "secondary";
  if (action === "ASSIGNED") return "outline";
  if (action === "LINK_SENT") return "default";
  return "secondary";
}

export function AdminActivityTimeline({
  title = "Activity",
  rows,
  emptyText = "No activity yet.",
}: {
  title?: string;
  rows: ActivityRow[] | undefined;
  emptyText?: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">
          {rows?.length ? `${rows.length} events` : ""}
        </div>
      </div>

      {!rows || rows.length === 0 ? (
        <div className="text-sm text-muted-foreground">{emptyText}</div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="border rounded-md p-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={actionVariant(r.action)}>{prettyAction(r.action)}</Badge>
                <div className="text-xs text-muted-foreground">{fmtDate(r.createdAt)}</div>
                {r.adminEmail ? (
                  <div className="text-xs text-muted-foreground">by {r.adminEmail}</div>
                ) : null}
              </div>

              {r.meta ? (
                <pre className="mt-2 text-xs whitespace-pre-wrap break-words bg-muted/40 rounded p-2">
                  {JSON.stringify(r.meta, null, 2)}
                </pre>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

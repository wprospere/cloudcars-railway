import React, { useMemo, useState } from "react";
import { useCmsContent } from "@/hooks/useCmsContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Users,
  CreditCard,
  BarChart3,
  Headphones,
  FileText,
  CheckCircle2,
  Loader2,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";

const benefits = [
  {
    icon: CreditCard,
    title: "Clear Pricing",
    description: "No surprises. Fixed rates agreed upfront so you can budget properly.",
  },
  {
    icon: FileText,
    title: "One Monthly Bill",
    description: "All your trips on one invoice with full breakdown. Makes expenses easy.",
  },
  {
    icon: Users,
    title: "Team Booking",
    description: "Your staff book directly. You set the rules, we handle the rest.",
  },
  {
    icon: BarChart3,
    title: "See Everything",
    description: "Full reports on who's travelling where and what it's costing.",
  },
  {
    icon: Headphones,
    title: "Direct Line",
    description: "Your own account manager who actually picks up the phone.",
  },
  {
    icon: Building2,
    title: "Nottingham Based",
    description: "We're here, we know the area, and we're not going anywhere.",
  },
];

type Partner = { name: string; logo: string };

// ✅ Fallback partners (used if CMS not set / invalid)
const FALLBACK_PARTNERS: Partner[] = [
  { name: "Boots UK", logo: "/partners/boots.png" },
  { name: "Speedo", logo: "/partners/speedo.png" },
  { name: "Nottinghamshire Healthcare Trust", logo: "/partners/nhs-nottinghamshire.png" },
];

function safeParseJson(input: unknown): any | null {
  if (typeof input !== "string") return null;
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function sanitizePartners(raw: any): Partner[] {
  const arr = raw?.partners;
  if (!Array.isArray(arr)) return [];
  const cleaned: Partner[] = [];

  for (const item of arr) {
    const name = item?.name;
    const logo = item?.logo;
    if (!isNonEmptyString(name) || !isNonEmptyString(logo)) continue;
    cleaned.push({ name: name.trim(), logo: logo.trim() });
  }

  // Deduplicate by name
  const seen = new Set<string>();
  return cleaned.filter((p) => {
    const key = p.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function Corporate() {
  const content = useCmsContent("corporate");

  // ✅ CMS controlled partners (logos only)
  // Create this CMS section in admin: sectionKey = "corporate_partners"
  // Store JSON in extraData: { "partners": [ { "name": "...", "logo": "..." } ] }
  const partnersContent = useCmsContent("corporate_partners");

  const partners = useMemo(() => {
    const parsed = safeParseJson(partnersContent?.extraData);
    const fromCms = sanitizePartners(parsed);
    return fromCms.length > 0 ? fromCms : FALLBACK_PARTNERS;
  }, [partnersContent?.extraData]);

  // ✅ Track which partner logos failed to load so we can show the name instead
  const [logoFailed, setLogoFailed] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    estimatedMonthlyTrips: "",
    requirements: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);
    try {
      const res = await fetch("/api/corporate-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
      toast.success("Thanks! We'll give you a call within 24 hours.");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]()

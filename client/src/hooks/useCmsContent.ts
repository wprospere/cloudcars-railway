import { trpc } from "@/lib/trpc";

// Default content for each section (used as fallback)
const defaultContent: Record<string, {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}> = {
  hero: {
    title: "Getting You There,",
    subtitle: "Every Time",
    description: "Cloud Cars has been moving Nottingham for over 15 years. From quick city trips to airport runs, our local drivers know the best routes to get you where you need to be.",
    buttonText: "Book Your Ride",
    buttonLink: "#booking",
  },
  services: {
    title: "Our Services",
    subtitle: "Choose Your Ride",
    description: "Whether you need a quick trip across town or a premium executive car, we've got you covered.",
  },
  trust: {
    title: "Why Nottingham Chooses",
    subtitle: "Cloud Cars",
    description: "We're not just another taxi company. We're your neighbours, and we take pride in getting you where you need to be.",
  },
  corporate: {
    title: "Business Travel,",
    subtitle: "Sorted",
    description: "Running a business in Nottingham? Let us handle the transport. From staff commutes to client pickups, we make business travel simple.",
    buttonText: "Get in Touch",
    buttonLink: "#contact",
  },
  drivers: {
    title: "Join the",
    subtitle: "Cloud Cars Team",
    description: "Good drivers deserve a good company. If you know Nottingham and take pride in your work, we'd love to hear from you.",
    buttonText: "Apply Now",
  },
  about: {
    title: "Nottingham Born,",
    subtitle: "Nottingham Proud",
    description: "Cloud Cars started in 2009 with a simple idea: Nottingham deserves a taxi company that actually cares. We know the city because we live here. We know the shortcuts, the school run times, the match day traffic.",
  },
  contact: {
    title: "Talk to",
    subtitle: "Cloud Cars",
    description: "Got a question? Need to book? Just want to say hello? We're here and happy to help however we can.",
  },
};

export function useCmsContent(sectionKey: string) {
  const { data: content, isLoading } = trpc.cms.getContent.useQuery(
    { sectionKey },
    { staleTime: 1000 * 60 * 5 } // Cache for 5 minutes
  );

  const defaults = defaultContent[sectionKey] || {};

  return {
    isLoading,
    title: content?.title || defaults.title || "",
    subtitle: content?.subtitle || defaults.subtitle || "",
    description: content?.description || defaults.description || "",
    buttonText: content?.buttonText || defaults.buttonText || "",
    buttonLink: content?.buttonLink || defaults.buttonLink || "",
    extraData: content?.extraData ? JSON.parse(content.extraData) : null,
  };
}

export function useCmsImage(imageKey: string, fallbackUrl?: string) {
  const { data: image, isLoading } = trpc.cms.getImage.useQuery(
    { imageKey },
    { staleTime: 1000 * 60 * 5 }
  );

  return {
    isLoading,
    url: image?.url || fallbackUrl || "",
    altText: image?.altText || "",
    caption: image?.caption || "",
  };
}

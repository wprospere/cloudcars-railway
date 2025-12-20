/**
 * Format a timestamp to show how long ago it was
 * Returns strings like "2 hours ago", "3 days ago", etc.
 */
export function timeAgo(date: Date | string | number): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  }

  const months = Math.floor(days / 30);
  return `${months} month${months !== 1 ? "s" : ""} ago`;
}

/**
 * Get urgency level based on how old the inquiry is
 * Returns "high" (>48h), "medium" (>24h), or "low" (<24h)
 */
export function getUrgency(date: Date | string | number): "high" | "medium" | "low" {
  const now = new Date();
  const then = new Date(date);
  const hours = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60));

  if (hours > 48) return "high";
  if (hours > 24) return "medium";
  return "low";
}

/**
 * Get color class for urgency badge
 */
export function getUrgencyColor(urgency: "high" | "medium" | "low"): string {
  switch (urgency) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
  }
}

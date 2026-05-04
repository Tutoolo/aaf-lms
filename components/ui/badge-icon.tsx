"use client";

import * as Icons from "lucide-react";
import { type LucideIcon } from "lucide-react";

/**
 * Renders a lucide-react icon by name (string).
 * Used for Badge records where the icon is stored as a string.
 */
export function BadgeIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Award;
  return <Icon className={className} />;
}

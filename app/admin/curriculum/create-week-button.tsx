"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function CreateWeekButton({
  courseId,
  nextWeekNumber,
}: {
  courseId: string;
  nextWeekNumber: number;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    const res = await fetch("/api/admin/weeks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        courseId,
        weekNumber: nextWeekNumber,
        title: `Week ${nextWeekNumber} — Untitled`,
        tagline: "Add a one-line tagline here.",
        actNumber: nextWeekNumber <= 4 ? 1 : nextWeekNumber <= 7 ? 2 : 3,
        isPublished: false,
      }),
    });
    setBusy(false);
    if (res.ok) {
      const j = await res.json();
      router.push(`/admin/curriculum/${j.week.id}`);
    } else {
      alert("Could not create week.");
    }
  }

  return (
    <Button onClick={onClick} disabled={busy}>
      <Plus className="h-4 w-4" /> {busy ? "Adding…" : "Add week"}
    </Button>
  );
}

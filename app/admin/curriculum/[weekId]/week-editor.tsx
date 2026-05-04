"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ChevronRight, GripVertical, Check, AlertCircle, UserCircle } from "lucide-react";
import { formatDate, formatDuration } from "@/lib/utils";
import type { Week, Lesson, Role } from "@prisma/client";

type Creator = { id: string; name: string; role: Role } | null;
type LessonWithCreator = Lesson & { createdBy: Creator };

const LESSON_TYPES = [
  { value: "VIDEO", label: "Video" },
  { value: "LIVE", label: "Live session" },
  { value: "ASYNC_WORKSHOP", label: "Async workshop" },
  { value: "SANDBOX", label: "Sandbox" },
  { value: "READING", label: "Reading" },
] as const;

type Flash = { kind: "success" | "error"; message: string } | null;

export function WeekEditor({
  week,
  lessons,
  weekCreator,
}: {
  week: Week;
  lessons: LessonWithCreator[];
  weekCreator: Creator;
}) {
  const router = useRouter();

  const [title, setTitle] = useState(week.title);
  const [tagline, setTagline] = useState(week.tagline);
  const [actNumber, setActNumber] = useState<number>(week.actNumber);
  const [weekNumber, setWeekNumber] = useState<number>(week.weekNumber);
  const [isPublished, setIsPublished] = useState(week.isPublished);
  const [flash, setFlash] = useState<Flash>(null);
  const [savingMeta, setSavingMeta] = useState(false);

  async function saveMeta() {
    setSavingMeta(true);
    setFlash(null);
    const res = await fetch(`/api/admin/weeks/${week.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, tagline, actNumber, weekNumber, isPublished }),
    });
    setSavingMeta(false);
    if (res.ok) {
      setFlash({ kind: "success", message: "Week saved." });
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setFlash({ kind: "error", message: j.error ?? "Could not save week." });
    }
  }

  async function deleteWeek() {
    if (!confirm(`Delete Week ${week.weekNumber}? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/weeks/${week.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/curriculum");
    } else {
      alert("Could not delete week.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Week metadata */}
      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <Badge variant={`act${actNumber}` as any}>Act {actNumber}</Badge>
            <CardTitle className="mt-2">Week {weekNumber}</CardTitle>
            {weekCreator && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted">
                <UserCircle className="h-3.5 w-3.5" />
                Uploaded by{" "}
                <span className="font-medium text-brown-deep">{weekCreator.name}</span>
                <span className="text-muted">· {weekCreator.role.toLowerCase().replace(/_/g, " ")}</span>
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={deleteWeek} className="text-terra hover:text-terra hover:bg-terra/10">
            <Trash2 className="h-4 w-4" /> Delete week
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="weekNumber">Week number</Label>
              <Input
                id="weekNumber"
                type="number"
                min={1}
                value={weekNumber}
                onChange={(e) => setWeekNumber(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actNumber">Act</Label>
              <select
                id="actNumber"
                value={actNumber}
                onChange={(e) => setActNumber(parseInt(e.target.value))}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value={1}>Act I — Foundation</option>
                <option value={2}>Act II — Build</option>
                <option value={3}>Act III — Launch</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-white px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 accent-gold"
                />
                Published (visible to students)
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Textarea
              id="tagline"
              rows={2}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>

          {flash && <FlashLine flash={flash} />}

          <div className="flex justify-end">
            <Button onClick={saveMeta} disabled={savingMeta}>
              {savingMeta ? "Saving…" : "Save week"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lessons */}
      <LessonsManager weekId={week.id} initialLessons={lessons} />
    </div>
  );
}

function FlashLine({ flash }: { flash: { kind: "success" | "error"; message: string } }) {
  const Icon = flash.kind === "success" ? Check : AlertCircle;
  const cls =
    flash.kind === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-terra/40 bg-terra/10 text-terra";
  return (
    <div className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${cls}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{flash.message}</span>
    </div>
  );
}

/* ─── Lessons within the week ──────────────────────── */

function LessonsManager({
  weekId,
  initialLessons,
}: {
  weekId: string;
  initialLessons: LessonWithCreator[];
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<(typeof LESSON_TYPES)[number]["value"]>("VIDEO");
  const [busy, setBusy] = useState(false);

  async function addLesson() {
    if (!newTitle.trim()) return;
    setBusy(true);
    const res = await fetch("/api/admin/lessons", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        weekId,
        title: newTitle.trim(),
        type: newType,
        dayLabel: `Day ${initialLessons.length + 1}`,
        duration: 0,
      }),
    });
    setBusy(false);
    if (res.ok) {
      setNewTitle("");
      setNewType("VIDEO");
      setCreating(false);
      router.refresh();
    } else {
      alert("Could not add lesson.");
    }
  }

  async function deleteLesson(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/admin/lessons/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Could not delete lesson.");
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Lessons ({initialLessons.length})</CardTitle>
        {!creating && (
          <Button size="sm" variant="outline" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" /> Add lesson
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {initialLessons.length === 0 && !creating && (
          <p className="rounded-md border border-dashed border-cream-mid p-6 text-center text-sm text-muted">
            No lessons yet. Click <span className="font-medium text-brown-deep">Add lesson</span> to start.
          </p>
        )}

        {initialLessons.map((l) => (
          <div
            key={l.id}
            className="flex items-center gap-3 rounded-md border border-cream-mid bg-cream-mid/20 p-3"
          >
            <GripVertical className="h-4 w-4 text-muted" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">
                  {l.type.replace("_", " ")}
                </Badge>
                {l.isPublished ? (
                  <Badge variant="success" className="text-[10px]">Published</Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px]">Draft</Badge>
                )}
                {l.duration > 0 && (
                  <span className="text-xs text-muted">{formatDuration(l.duration)}</span>
                )}
              </div>
              <div className="mt-1 truncate font-medium text-brown-deep">{l.title}</div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
                <span>{l.dayLabel}</span>
                {l.createdBy && (
                  <span className="inline-flex items-center gap-1">
                    <UserCircle className="h-3 w-3" />
                    {l.createdBy.name}
                  </span>
                )}
                <span>· uploaded {formatDate(l.createdAt)}</span>
              </div>
            </div>
            <Link
              href={`/admin/curriculum/${weekId}/lessons/${l.id}`}
              className="inline-flex items-center gap-1 text-sm text-gold hover:underline"
            >
              Edit <ChevronRight className="h-3 w-3" />
            </Link>
            <button
              onClick={() => deleteLesson(l.id, l.title)}
              className="rounded p-1 text-muted hover:bg-terra/10 hover:text-terra"
              aria-label="Delete lesson"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {creating && (
          <div className="space-y-3 rounded-md border-2 border-dashed border-gold/40 bg-gold-pale/40 p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_180px]">
              <div className="space-y-2">
                <Label htmlFor="newTitle">Lesson title</Label>
                <Input
                  id="newTitle"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Introduction to Tool Use"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newType">Type</Label>
                <select
                  id="newType"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                >
                  {LESSON_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setCreating(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={addLesson} disabled={busy || !newTitle.trim()}>
                {busy ? "Adding…" : "Add lesson"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, Upload, PlayCircle, Trash2, Film, UserCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Lesson, Role } from "@prisma/client";

const LESSON_TYPES = [
  { value: "VIDEO", label: "Video" },
  { value: "LIVE", label: "Live session" },
  { value: "ASYNC_WORKSHOP", label: "Async workshop" },
  { value: "SANDBOX", label: "Sandbox" },
  { value: "READING", label: "Reading" },
] as const;

type Flash = { kind: "success" | "error"; message: string } | null;

export function LessonEditor({
  lesson,
  weekTitle,
  creator,
  createdAt,
}: {
  lesson: Lesson;
  weekTitle: string;
  creator: { name: string; role: Role } | null;
  createdAt: Date;
}) {
  const router = useRouter();

  const [title, setTitle] = useState(lesson.title);
  const [type, setType] = useState<(typeof LESSON_TYPES)[number]["value"]>(lesson.type as any);
  const [dayLabel, setDayLabel] = useState(lesson.dayLabel);
  const [duration, setDuration] = useState<number>(lesson.duration);
  const [isPublished, setIsPublished] = useState(lesson.isPublished);
  const [transcript, setTranscript] = useState(lesson.transcript ?? "");
  const [body, setBody] = useState(lesson.body ?? "");
  const [muxAssetId, setMuxAssetId] = useState(lesson.muxAssetId ?? "");
  const [muxPlaybackId, setMuxPlaybackId] = useState(lesson.muxPlaybackId ?? "");
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<Flash>(null);

  const isVideoLike = type === "VIDEO" || type === "LIVE";
  const isReading = type === "READING";

  async function save() {
    setSaving(true);
    setFlash(null);
    const res = await fetch(`/api/admin/lessons/${lesson.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title,
        type,
        dayLabel,
        duration,
        isPublished,
        transcript: transcript || null,
        body: body || null,
        muxAssetId: muxAssetId || null,
        muxPlaybackId: muxPlaybackId || null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setFlash({ kind: "success", message: "Lesson saved." });
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setFlash({ kind: "error", message: j.error ?? "Could not save lesson." });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs uppercase tracking-wider text-muted">{weekTitle}</span>
        <h1 className="mt-1 font-display text-3xl font-semibold text-brown-deep">
          Edit lesson
        </h1>
        {creator && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
            <UserCircle className="h-4 w-4" />
            Uploaded by{" "}
            <span className="font-medium text-brown-deep">{creator.name}</span>
            <span>· {creator.role.toLowerCase().replace(/_/g, " ")}</span>
            <span>· {formatDate(createdAt)}</span>
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
              >
                {LESSON_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dayLabel">Day label</Label>
              <Input
                id="dayLabel"
                value={dayLabel}
                onChange={(e) => setDayLabel(e.target.value)}
                placeholder="e.g. Day 3 — Wed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min={0}
                value={Math.round(duration / 60)}
                onChange={(e) => setDuration(parseInt(e.target.value || "0") * 60)}
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-white px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            Published (visible to students)
          </label>
        </CardContent>
      </Card>

      {/* Video upload (only for VIDEO / LIVE types) */}
      {isVideoLike && (
        <VideoUploadCard
          muxPlaybackId={muxPlaybackId}
          onUploaded={(assetId, playbackId) => {
            setMuxAssetId(assetId);
            setMuxPlaybackId(playbackId);
            setFlash({ kind: "success", message: "Video uploaded — don't forget to save." });
          }}
          onClear={() => {
            setMuxAssetId("");
            setMuxPlaybackId("");
          }}
        />
      )}

      {/* Reading body */}
      {isReading && (
        <Card>
          <CardHeader>
            <CardTitle>Reading content</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="## Why this matters&#10;&#10;Markdown supported."
            />
          </CardContent>
        </Card>
      )}

      {/* Transcript (for video lessons) */}
      {isVideoLike && (
        <Card>
          <CardHeader>
            <CardTitle>Transcript (optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={8}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste the transcript here so students can search it."
            />
          </CardContent>
        </Card>
      )}

      {flash && <FlashLine flash={flash} />}

      <div className="flex justify-end gap-3">
        <Button onClick={save} disabled={saving} size="lg">
          {saving ? "Saving…" : "Save lesson"}
        </Button>
      </div>
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

/* ─── Video upload card ────────────────────────────── */

function VideoUploadCard({
  muxPlaybackId,
  onUploaded,
  onClear,
}: {
  muxPlaybackId: string;
  onUploaded: (assetId: string, playbackId: string) => void;
  onClear: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      // Step 1: get a direct-upload URL from our backend (which calls Mux)
      const resp = await fetch("/api/admin/mux/upload-url", { method: "POST" });
      if (!resp.ok) throw new Error("Could not get upload URL.");
      const { uploadId, url, mock } = await resp.json();

      if (mock) {
        // In mock mode we don't actually upload — we just simulate progress
        // and pretend Mux returned a playbackId. The real flow PUTs the file
        // and then polls for asset.status === "ready".
        for (let i = 10; i <= 100; i += 10) {
          await new Promise((r) => setTimeout(r, 80));
          setProgress(i);
        }
        const fakePlaybackId = `mock-${uploadId}`;
        onUploaded(uploadId, fakePlaybackId);
      } else {
        // Real Mux upload (when keys are set):
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = (ev) => {
            if (ev.lengthComputable) {
              setProgress(Math.round((ev.loaded / ev.total) * 100));
            }
          };
          xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error("Upload failed")));
          xhr.onerror = () => reject(new Error("Upload failed"));
          xhr.open("PUT", url);
          xhr.send(file);
        });
        // TODO: poll /api/admin/mux/asset/[uploadId] until ready, then call onUploaded
        onUploaded(uploadId, `pending-${uploadId}`);
      }
    } catch (err: any) {
      setError(err.message ?? "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Film className="h-5 w-5 text-gold" /> Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {muxPlaybackId ? (
          <div className="space-y-3">
            <div className="flex aspect-video items-center justify-center rounded-md bg-brown-deep text-cream">
              <div className="text-center">
                <PlayCircle className="mx-auto h-12 w-12 text-gold" />
                <p className="mt-2 text-sm text-cream/70">
                  Playback ID: <code className="text-cream">{muxPlaybackId}</code>
                </p>
                {muxPlaybackId.startsWith("mock-") && (
                  <p className="mt-1 text-xs text-cream/50">
                    Mock mode — set MUX_TOKEN_ID / MUX_TOKEN_SECRET in .env.local for real playback.
                  </p>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onClear}>
              <Trash2 className="h-4 w-4" /> Replace video
            </Button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-gold/40 bg-gold-pale/30 px-6 py-12 text-center transition-colors hover:bg-gold-pale/60">
            <Upload className="h-8 w-8 text-gold" />
            <div>
              <p className="text-sm font-medium text-brown-deep">
                {uploading ? `Uploading… ${progress}%` : "Click to upload a video"}
              </p>
              <p className="mt-1 text-xs text-muted">
                MP4, MOV, or WebM. We'll transcode and prepare adaptive streams via Mux.
              </p>
            </div>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            {uploading && (
              <div className="h-2 w-full overflow-hidden rounded-full bg-cream-mid">
                <div
                  className="h-full bg-gold transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            {error && (
              <p className="rounded-md bg-terra/10 px-3 py-1.5 text-xs text-terra">
                {error}
              </p>
            )}
          </label>
        )}
      </CardContent>
    </Card>
  );
}

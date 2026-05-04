"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, Save, Send, AlertTriangle } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { SubmissionType } from "@prisma/client";

type Initial = {
  content: string;
  fileUrl: string;
  isDraft: boolean;
  grade: number | null;
  feedback: string | null;
  needsRevision: boolean;
  submittedAt: Date;
  gradedAt: Date | null;
};

type Flash = { kind: "success" | "error"; message: string } | null;

export function SubmissionForm({
  assignmentId,
  submissionType,
  initial,
}: {
  assignmentId: string;
  submissionType: SubmissionType;
  initial: Initial | null;
}) {
  const router = useRouter();
  const [content, setContent] = useState(initial?.content ?? "");
  const [fileUrl, setFileUrl] = useState(initial?.fileUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<Flash>(null);

  const isGraded = initial?.grade !== undefined && initial?.grade !== null;
  const isSubmittedFinal = initial && !initial.isDraft;
  const isLocked = isGraded && !initial?.needsRevision;

  async function save(asDraft: boolean) {
    setBusy(true);
    setFlash(null);
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ assignmentId, content, fileUrl, isDraft: asDraft }),
    });
    setBusy(false);
    if (res.ok) {
      setFlash({
        kind: "success",
        message: asDraft ? "Draft saved." : "Submitted! Your instructor will review it.",
      });
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setFlash({ kind: "error", message: j.error ?? "Could not save." });
    }
  }

  return (
    <div className="space-y-4">
      {/* Status banner */}
      {initial && (
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center gap-3">
              {initial.isDraft ? (
                <Badge variant="outline">Draft</Badge>
              ) : isGraded ? (
                initial.needsRevision ? (
                  <Badge variant="warning" className="gap-1">
                    <AlertTriangle className="h-3 w-3" /> Needs revision
                  </Badge>
                ) : (
                  <Badge variant="success" className="gap-1">
                    <Check className="h-3 w-3" /> Graded
                  </Badge>
                )
              ) : (
                <Badge variant="secondary">Submitted — awaiting grade</Badge>
              )}
              {initial.submittedAt && !initial.isDraft && (
                <span className="text-xs text-muted">
                  Submitted {formatDateTime(initial.submittedAt)}
                </span>
              )}
              {isGraded && (
                <span className="text-xs text-muted">
                  Graded {formatDateTime(initial.gradedAt!)}
                </span>
              )}
            </div>

            {isGraded && (
              <div className="mt-4 rounded-md border border-cream-mid bg-cream-mid/30 p-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-semibold text-brown-deep">
                    {initial.grade}
                  </span>
                  <span className="text-sm text-muted">/ 100</span>
                </div>
                {initial.feedback && (
                  <div className="mt-3 whitespace-pre-wrap text-sm text-foreground">
                    {initial.feedback}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* The form (or a read-only view if locked) */}
      {isLocked ? (
        <Card>
          <CardHeader>
            <CardTitle>Your submission</CardTitle>
            <CardDescription>This submission has been graded and is locked.</CardDescription>
          </CardHeader>
          <CardContent>
            <ReadOnlyContent content={content} fileUrl={fileUrl} type={submissionType} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {initial?.needsRevision ? "Revise your submission" : "Your submission"}
            </CardTitle>
            <CardDescription>
              {initial?.needsRevision
                ? "Your instructor asked for changes. Update and re-submit."
                : "Save a draft anytime, then click submit when you're ready."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(submissionType === "TEXT" || submissionType === "CODE") && (
              <Textarea
                rows={submissionType === "CODE" ? 18 : 10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  submissionType === "CODE"
                    ? "Paste your code here. Use a fenced ``` block for clean formatting."
                    : "Write your response here."
                }
                className={submissionType === "CODE" ? "font-mono text-xs" : undefined}
              />
            )}
            {submissionType === "URL" && (
              <Input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://github.com/your-username/your-project"
              />
            )}
            {submissionType === "FILE" && (
              <Input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="Paste a public file URL (Drive, Dropbox, S3) for now"
              />
            )}

            {flash && <FlashLine flash={flash} />}

            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => save(true)}
                disabled={busy}
              >
                <Save className="h-4 w-4" /> Save draft
              </Button>
              <Button onClick={() => save(false)} disabled={busy}>
                <Send className="h-4 w-4" /> {busy ? "Submitting…" : "Submit"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
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

function ReadOnlyContent({
  content,
  fileUrl,
  type,
}: {
  content: string;
  fileUrl: string;
  type: SubmissionType;
}) {
  if (type === "URL" || type === "FILE") {
    return fileUrl ? (
      <a
        href={fileUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-md border border-cream-mid bg-cream-mid/30 px-3 py-2 text-sm text-gold hover:bg-cream-mid/50"
      >
        {fileUrl} ↗
      </a>
    ) : (
      <p className="text-sm text-muted">Nothing submitted.</p>
    );
  }
  return (
    <pre
      className={`whitespace-pre-wrap rounded-md border border-cream-mid bg-cream-mid/30 p-4 text-sm ${type === "CODE" ? "font-mono text-xs" : "font-sans"}`}
    >
      {content || "Nothing submitted."}
    </pre>
  );
}

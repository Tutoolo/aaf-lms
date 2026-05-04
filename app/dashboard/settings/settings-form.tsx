"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle } from "lucide-react";

type InitialUser = {
  name: string;
  email: string;
  bio: string;
  linkedIn: string;
  avatar: string;
  role: string;
  hasPassword: boolean;
};

type FlashState = { kind: "success" | "error"; message: string } | null;

function Flash({ flash }: { flash: FlashState }) {
  if (!flash) return null;
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

export function SettingsForm({
  initialUser,
  cohortName,
}: {
  initialUser: InitialUser;
  cohortName: string | null;
}) {
  return (
    <div className="space-y-6">
      <ProfileCard initialUser={initialUser} />
      <AccountCard user={initialUser} cohortName={cohortName} />
      {initialUser.hasPassword && <PasswordCard />}
      <NotificationsCard />
    </div>
  );
}

/* ─── Profile ──────────────────────────────────────── */

function ProfileCard({ initialUser }: { initialUser: InitialUser }) {
  const router = useRouter();
  const [name, setName] = useState(initialUser.name);
  const [bio, setBio] = useState(initialUser.bio);
  const [linkedIn, setLinkedIn] = useState(initialUser.linkedIn);
  const [avatar, setAvatar] = useState(initialUser.avatar);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<FlashState>(null);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFlash(null);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, bio, linkedIn, avatar }),
    });
    setSaving(false);
    if (res.ok) {
      setFlash({ kind: "success", message: "Profile updated." });
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setFlash({ kind: "error", message: j.error ?? "Could not save." });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          How you appear to your cohort, instructors, and on your certificate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatar || undefined} alt={name} />
              <AvatarFallback className="text-base">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://…"
              />
              <p className="text-xs text-muted">
                Paste a URL to any image. File upload is coming in a later session.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A few sentences about who you are and what you're building."
            />
            <p className="text-xs text-muted">{bio.length}/500</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedIn">LinkedIn URL</Label>
            <Input
              id="linkedIn"
              type="url"
              value={linkedIn}
              onChange={(e) => setLinkedIn(e.target.value)}
              placeholder="https://linkedin.com/in/…"
            />
          </div>

          <Flash flash={flash} />

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ─── Account info (read-only) ─────────────────────── */

function AccountCard({
  user,
  cohortName,
}: {
  user: InitialUser;
  cohortName: string | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Read-only — contact support to change.</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted">Email</dt>
            <dd className="font-medium text-brown-deep">{user.email}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Role</dt>
            <dd>
              <Badge variant="secondary">{user.role}</Badge>
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Cohort</dt>
            <dd className="font-medium text-brown-deep">{cohortName ?? "—"}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

/* ─── Password ─────────────────────────────────────── */

function PasswordCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<FlashState>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFlash(null);
    if (next !== confirm) {
      setFlash({ kind: "error", message: "New passwords don't match." });
      return;
    }
    if (next.length < 8) {
      setFlash({ kind: "error", message: "New password must be at least 8 characters." });
      return;
    }
    setSaving(true);
    const res = await fetch("/api/user/password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    setSaving(false);
    if (res.ok) {
      setFlash({ kind: "success", message: "Password updated." });
      setCurrent("");
      setNext("");
      setConfirm("");
    } else {
      const j = await res.json().catch(() => ({}));
      setFlash({ kind: "error", message: j.error ?? "Could not update password." });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Use a unique password you don't reuse elsewhere.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current">Current password</Label>
            <Input
              id="current"
              type="password"
              required
              autoComplete="current-password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="next">New password</Label>
              <Input
                id="next"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm new password</Label>
              <Input
                id="confirm"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          </div>

          <Flash flash={flash} />

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} variant="deep">
              {saving ? "Updating…" : "Update password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ─── Notifications (UI only — wired up in a later session) ───────── */

function NotificationsCard() {
  const [prefs, setPrefs] = useState(() => {
    if (typeof window === "undefined") return defaultPrefs();
    try {
      const raw = window.localStorage.getItem("notif-prefs");
      return raw ? { ...defaultPrefs(), ...JSON.parse(raw) } : defaultPrefs();
    } catch {
      return defaultPrefs();
    }
  });
  const [flash, setFlash] = useState<FlashState>(null);

  function toggle(key: keyof ReturnType<typeof defaultPrefs>) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  function save() {
    window.localStorage.setItem("notif-prefs", JSON.stringify(prefs));
    setFlash({ kind: "success", message: "Preferences saved locally." });
    setTimeout(() => setFlash(null), 3000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose what we email you about. In-app notifications stay on. (Saved locally for now —
          server sync ships when email integration goes live.)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <NotifRow
          checked={prefs.live}
          onChange={() => toggle("live")}
          title="Live session reminders"
          sub="Email 30 minutes before each cohort session."
        />
        <NotifRow
          checked={prefs.grades}
          onChange={() => toggle("grades")}
          title="Assignment grades"
          sub="Email when an instructor publishes feedback on your work."
        />
        <NotifRow
          checked={prefs.announcements}
          onChange={() => toggle("announcements")}
          title="Cohort announcements"
          sub="Email when an instructor posts a cohort-wide announcement."
        />
        <NotifRow
          checked={prefs.forumReplies}
          onChange={() => toggle("forumReplies")}
          title="Forum replies"
          sub="Email when someone replies to your thread."
        />
        <NotifRow
          checked={prefs.weeklyDigest}
          onChange={() => toggle("weeklyDigest")}
          title="Weekly cohort digest"
          sub="Friday recap of the week's lessons, assignments, and shipped projects."
        />

        <Flash flash={flash} />

        <div className="flex justify-end pt-2">
          <Button onClick={save} variant="outline">
            Save preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function defaultPrefs() {
  return {
    live: true,
    grades: true,
    announcements: true,
    forumReplies: false,
    weeklyDigest: true,
  };
}

function NotifRow({
  checked,
  onChange,
  title,
  sub,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  sub: string;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-md border border-cream-mid bg-cream-mid/20 p-3 hover:bg-cream-mid/40">
      <div className="flex-1">
        <div className="text-sm font-medium text-brown-deep">{title}</div>
        <div className="text-xs text-muted">{sub}</div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 shrink-0 accent-gold"
      />
    </label>
  );
}

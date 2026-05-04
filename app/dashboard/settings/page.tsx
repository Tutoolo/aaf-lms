import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { cohort: true },
  });
  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Settings</span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">
          Your profile & preferences
        </h1>
        <p className="mt-1 text-muted">
          Manage how you appear in the cohort and how the platform reaches you.
        </p>
      </div>

      <SettingsForm
        initialUser={{
          name: user.name,
          email: user.email,
          bio: user.bio ?? "",
          linkedIn: user.linkedIn ?? "",
          avatar: user.avatar ?? "",
          role: user.role,
          hasPassword: !!user.password,
        }}
        cohortName={user.cohort?.name ?? null}
      />
    </div>
  );
}

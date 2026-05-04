import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { StudentSidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { StudentMobileTabs } from "@/components/layout/student-mobile-tabs";
import { STUDENT_NAV } from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session) redirect("/login?callbackUrl=/dashboard");

  return (
    <div className="flex min-h-screen bg-cream">
      <StudentSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          mobileMenu={<MobileMenu items={STUDENT_NAV} brand="The Fellowship" />}
        >
          Dashboard
        </TopBar>
        <main className="flex-1 p-4 pb-24 md:p-10 md:pb-10">{children}</main>
        <StudentMobileTabs />
      </div>
    </div>
  );
}

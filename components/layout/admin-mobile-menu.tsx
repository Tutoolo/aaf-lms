"use client";

import { useSession } from "next-auth/react";
import { ADMIN_NAV } from "./admin-sidebar";
import { MobileMenu } from "./mobile-menu";
import { ROLE_LABEL } from "@/lib/permissions";

/** Mobile drawer for the admin console — filters items by the user's role. */
export function AdminMobileMenu() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  const visibleNav = ADMIN_NAV.filter(
    (item) => !item.allowedRoles || (role && item.allowedRoles.includes(role)),
  );

  return (
    <MobileMenu
      items={visibleNav}
      brand="Fellowship"
      brandSub="Admin"
      footer={role ? `${ROLE_LABEL[role]} view` : undefined}
    />
  );
}

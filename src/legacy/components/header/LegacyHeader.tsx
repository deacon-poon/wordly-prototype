"use client";

/**
 * LegacyHeader — 1:1 port of the deployed Angular portal header (desktop).
 *
 *   wordly_portal@origin/main:
 *     src/app/components/header/header.component.html / .scss / .ts
 *
 * Desktop anatomy: a 70px bar with a left-aligned Wordly logo and a right-aligned
 * cluster of notifications + a user menu (avatar initial + name → Profile / Logout).
 *
 * Rebrand (per Deacon): the bar is now WHITE with a bottom border (page-background
 * in legacy-shell.module.css) and the logo sits on the LEFT in brand blue — per the
 * Organizations/Workspaces Figma. This intentionally departs from the exact 1:1
 * Angular port (which was a solid #017cff bar with a viewport-centered white logo).
 *
 * Angular DI (keycloak, i18next, route-name service, PrimeNG p-menu) is dropped:
 * the user is mock data and the menu uses the shared DropdownMenu atom.
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import styles from "./legacy-header.module.css";

/** Mock WordlyUser (Angular: lStore.userChanged). */
const MOCK_USER = { name: "Alex Morgan" };

export function LegacyHeader() {
  const router = useRouter();
  const initial = MOCK_USER.name?.[0] ?? "";

  return (
    <div className={styles["header-main"]}>
      <div className={styles["wordly-header"]}>
        <img
          src="/logo/wordly-logo-rebrand-blue.svg"
          alt="Wordly Logo"
          onClick={() => router.push("/dashboard")}
        />
      </div>

      <div className={styles["right-note"]}>
        <div className={styles.notifications} aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className={styles["menu-button"]}>
              <span className={styles["btn-username"]}>{MOCK_USER.name}</span>
              <span className={styles.profile}>{initial}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard")}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default LegacyHeader;

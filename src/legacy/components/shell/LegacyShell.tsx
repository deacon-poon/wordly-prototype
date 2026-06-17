"use client";

/**
 * LegacyShell — 1:1 port of the deployed Angular portal app shell.
 *
 *   wordly_portal@origin/main: src/app/app.component.html (.base-application)
 *
 * Layout: a 210px navigator column (LegacyNav) + a main-content column whose top
 * 70px is the colored header bar (.page-background) with LegacyHeader over it, and
 * the routed page below in .route-content. This is the separate legacy layout —
 * fully self-contained, independent of the rebrand AppShell.
 */

import * as React from "react";

import { LegacyNav } from "@/legacy/components/navigator/LegacyNav";
import { LegacyHeader } from "@/legacy/components/header/LegacyHeader";
import { NavContextProvider } from "@/legacy/services/nav-context";
import styles from "./legacy-shell.module.css";

export function LegacyShell({ children }: { children: React.ReactNode }) {
  return (
    <NavContextProvider>
      <div className={styles["base-application"]}>
        <div className={styles.navigator}>
          <LegacyNav />
        </div>
        <div className={styles["main-content"]}>
          <div className={styles["page-background"]} />
          <LegacyHeader />
          <div className={styles["route-content"]}>{children}</div>
        </div>
      </div>
    </NavContextProvider>
  );
}

export default LegacyShell;

"use client";

import type { ConnStatus } from "../types";
import styles from "../styles.module.css";

const STYLES: Record<ConnStatus, { wrap: string; dot: string }> = {
  connecting: {
    wrap: "bg-[#fff8e6] text-[#9a6200] border-[#ffe0a0]",
    dot: `bg-[#f59e0b] ${styles.pulseDot}`,
  },
  live: {
    wrap: "bg-[#e6f6ec] text-[#0a7b3f] border-[#c5e8d2] cursor-pointer",
    dot: "bg-[#0a7b3f]",
  },
  demo: {
    wrap: "bg-[#eef0f2] text-[#646e78] border-[#e3e6e8]",
    dot: "bg-[#9ba3ab]",
  },
  error: {
    wrap: "bg-[#fcebea] text-[#b8221a] border-[#f9cfcc] cursor-pointer",
    dot: "bg-[#b8221a]",
  },
};

export function ConnStatusPill({
  status,
  label,
  onClick,
}: {
  status: ConnStatus;
  label: string;
  onClick?: () => void;
}) {
  const s = STYLES[status];
  return (
    <span
      onClick={onClick}
      className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[11px] font-semibold ${s.wrap}`}
    >
      <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${s.dot}`} />
      {label}
    </span>
  );
}

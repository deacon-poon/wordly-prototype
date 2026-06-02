"use client";

import { useEffect, useRef } from "react";
import { HL_CHART_DATA } from "../data/mock";

/**
 * Canvas line chart of highlights over time. Ported 1:1 from the prototype's
 * drawChartOn(). Redraws on mount and on container resize.
 */
export function HighlightsChart({ height = 90 }: { height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const W = parent.clientWidth;
      const H = height;
      if (W === 0) return;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      const data = HL_CHART_DATA;
      const max = Math.max(...data);
      const pad = { top: 8, right: 4, bottom: 4, left: 28 };
      const iW = W - pad.left - pad.right;
      const iH = H - pad.top - pad.bottom;
      const step = iW / (data.length - 1);

      ctx.lineWidth = 1;
      ctx.font = "9px Roboto,sans-serif";
      ctx.textAlign = "right";
      [0, 0.5, 1].forEach((t) => {
        const y = pad.top + iH * (1 - t);
        ctx.strokeStyle = "#e3e6e8";
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(pad.left + iW, y);
        ctx.stroke();
        ctx.fillStyle = "#9ba3ab";
        ctx.fillText(String(Math.round(max * t)), pad.left - 4, y + 3);
      });

      const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + iH);
      grad.addColorStop(0, "rgba(0,99,204,0.15)");
      grad.addColorStop(1, "rgba(0,99,204,0.01)");
      ctx.beginPath();
      data.forEach((v, i) => {
        const x = pad.left + i * step;
        const y = pad.top + iH * (1 - v / max);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.lineTo(pad.left + (data.length - 1) * step, pad.top + iH);
      ctx.lineTo(pad.left, pad.top + iH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = "#0063cc";
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      data.forEach((v, i) => {
        const x = pad.left + i * step;
        const y = pad.top + iH * (1 - v / max);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    // Defer to next frame so the parent has laid out its width.
    const raf = requestAnimationFrame(draw);
    window.addEventListener("resize", draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", draw);
    };
  }, [height]);

  return <canvas ref={canvasRef} height={height} className="block w-full" />;
}

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { MeshGradient } from '@paper-design/shaders-react';

// Original control points from wordly-ribbon.svg path
// M -128.475 730.771
// C -128.475 730.771  111.292 507.499  299.891 470.136
// C  556.965 419.209  768.426 554.050 1020.410 600.594
// C 1231.560 639.594 1438.820 488.481 1578.810  19.339

const BASE_POINTS = [
  // [x, y] — all Y-axis control points that we'll wave
  { x: -128.475, y: 730.771 },  // M start
  { x: -128.475, y: 730.771 },  // C1 cp1
  { x: 111.292,  y: 507.499 },  // C1 cp2
  { x: 299.891,  y: 470.136 },  // C1 end
  { x: 556.965,  y: 419.209 },  // C2 cp1
  { x: 768.426,  y: 554.050 },  // C2 cp2
  { x: 1020.41,  y: 600.594 },  // C2 end
  { x: 1231.56,  y: 639.594 },  // C3 cp1
  { x: 1438.82,  y: 488.481 },  // C3 cp2
  { x: 1578.81,  y: 19.339 },   // C3 end
];

function buildPath(points: { x: number; y: number }[]): string {
  const p = points;
  return `M${p[0].x} ${p[0].y}C${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y}C${p[4].x} ${p[4].y} ${p[5].x} ${p[5].y} ${p[6].x} ${p[6].y}C${p[7].x} ${p[7].y} ${p[8].x} ${p[8].y} ${p[9].x} ${p[9].y}`;
}

export function FluidRibbon() {
  const svgRef = useRef<SVGSVGElement>(null);
  const frameRef = useRef<number>(0);
  const timeRef = useRef(0);

  const animate = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;

    timeRef.current += 0.003;
    const t = timeRef.current;
    const frame = Math.round(t * 333); // ~frame counter

    const mainPath = svg.getElementById('ribbon-main') as SVGPathElement;
    const glowPath = svg.getElementById('ribbon-glow-path') as SVGPathElement;

    // --- 1. Wave-deform path — throttled to every 3rd frame for perf ---
    if (mainPath && frame % 3 === 0) {
      const waved = BASE_POINTS.map((pt, i) => {
        const phase = i * 0.7;
        const waveY = Math.sin(t * 1.2 + phase) * 12 + Math.sin(t * 0.8 + phase * 1.3) * 6;
        const waveX = Math.cos(t * 0.9 + phase * 0.8) * 4;
        return { x: pt.x + waveX, y: pt.y + waveY };
      });
      const d = buildPath(waved);
      mainPath.setAttribute('d', d);
      if (glowPath) glowPath.setAttribute('d', d);
    }

    // --- 2. Gradient flow — every frame (cheap) ---
    const grad = svg.getElementById('ribbon-grad') as SVGLinearGradientElement;
    const stops = grad?.querySelectorAll('stop');

    if (stops && stops.length >= 3) {
      const s0 = Math.sin(t * 0.8) * 0.18;
      const s1 = 0.51 + Math.sin(t * 0.6 + 1.0) * 0.18;
      const s2 = 1.0 + Math.cos(t * 0.7) * 0.12;

      stops[0].setAttribute('offset', `${Math.max(0, s0)}`);
      stops[1].setAttribute('offset', `${Math.min(1, Math.max(0.1, s1))}`);
      stops[2].setAttribute('offset', `${Math.min(1, s2)}`);

      const dx = Math.sin(t * 0.5) * 200;
      const dy = Math.cos(t * 0.4) * 140;
      grad.setAttribute('x1', `${-125.642 + dx}`);
      grad.setAttribute('y1', `${758.596 + dy}`);
      grad.setAttribute('x2', `${1612.25 - dx}`);
      grad.setAttribute('y2', `${323.974 - dy}`);
    }

    // --- 3. Glow pulse — throttled ---
    if (glowPath && frame % 3 === 0) {
      const opacity = 0.14 + Math.sin(t * 1.2) * 0.06;
      glowPath.setAttribute('stroke-opacity', `${opacity}`);
    }

    frameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [animate]);

  const INITIAL_PATH = buildPath(BASE_POINTS);

  return (
    <div className="absolute inset-0 bg-white">
      {/* Ambient mesh shader — very subtle background atmosphere */}
      <MeshGradient
        className="absolute inset-0 h-full w-full opacity-[0.07]"
        colors={['#ffffff', '#c2f0c8', '#b8e4f8', '#a8cff0', '#ffffff']}
        speed={0.4}
        backgroundcolor="#ffffff"
      />

      {/* SVG ribbon with per-point wave animation */}
      <svg
        ref={svgRef}
        viewBox="0 0 1500 750"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient
            id="ribbon-grad"
            x1="-125.642"
            y1="758.596"
            x2="1612.25"
            y2="323.974"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#3CFF52" />
            <stop offset="0.51" stopColor="#00D0FF" />
            <stop offset="1" stopColor="#017CFF" />
          </linearGradient>

          <filter id="ribbon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
          </filter>
        </defs>

        {/* Soft glow */}
        <path
          id="ribbon-glow-path"
          d={INITIAL_PATH}
          stroke="url(#ribbon-grad)"
          strokeWidth="180"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeOpacity="0.14"
          fill="none"
          filter="url(#ribbon-glow)"
        />

        {/* Main ribbon */}
        <path
          id="ribbon-main"
          d={INITIAL_PATH}
          stroke="url(#ribbon-grad)"
          strokeWidth="140"
          strokeMiterlimit="10"
          fill="none"
        />
      </svg>
    </div>
  );
}

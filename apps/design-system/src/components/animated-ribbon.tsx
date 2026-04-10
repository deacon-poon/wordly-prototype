'use client';

import { useEffect, useRef } from 'react';

export function AnimatedRibbon() {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const stops = svg.querySelectorAll('.ribbon-stop') as NodeListOf<SVGStopElement>;
    const glowStops = svg.querySelectorAll('.glow-stop') as NodeListOf<SVGStopElement>;

    const animate = () => {
      timeRef.current += 0.003;
      const t = timeRef.current;

      // Flow the main gradient along the ribbon
      const offset0 = ((Math.sin(t * 1.2) + 1) / 2) * 0.3 - 0.15;
      const offset1 = 0.5 + Math.sin(t * 0.8 + 1) * 0.15;
      const offset2 = 1.0 + ((Math.cos(t * 1.0) + 1) / 2) * 0.15;

      if (stops.length >= 3) {
        stops[0].setAttribute('offset', `${Math.max(0, offset0)}`);
        stops[1].setAttribute('offset', `${Math.min(1, Math.max(0, offset1))}`);
        stops[2].setAttribute('offset', `${Math.min(1, offset2)}`);
      }

      // Animate glow opacity pulse
      const glowOpacity = 0.15 + Math.sin(t * 2) * 0.08;
      const glowPath = svg.querySelector('.ribbon-glow') as SVGPathElement;
      if (glowPath) {
        glowPath.setAttribute('stroke-opacity', `${glowOpacity}`);
      }

      // Shimmer: animate a highlight traveling along the ribbon
      if (glowStops.length >= 3) {
        const shimmerPos = ((t * 0.4) % 1.6) - 0.3;
        glowStops[0].setAttribute('offset', `${Math.max(0, shimmerPos - 0.15)}`);
        glowStops[1].setAttribute('offset', `${Math.max(0, Math.min(1, shimmerPos))}`);
        glowStops[2].setAttribute('offset', `${Math.min(1, shimmerPos + 0.15)}`);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const ribbonPath =
    'M-128.475 730.771C-128.475 730.771 111.292 507.499 299.891 470.136C556.965 419.209 768.426 554.05 1020.41 600.594C1231.56 639.594 1438.82 488.481 1578.81 19.3393';

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1500 683"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Main gradient — animated stops */}
        <linearGradient
          id="ribbon-gradient"
          x1="-125.642"
          y1="758.596"
          x2="1612.25"
          y2="323.974"
          gradientUnits="userSpaceOnUse"
        >
          <stop className="ribbon-stop" offset="0" stopColor="#3CFF52" />
          <stop className="ribbon-stop" offset="0.51" stopColor="#00D0FF" />
          <stop className="ribbon-stop" offset="1" stopColor="#017CFF" />
        </linearGradient>

        {/* Shimmer gradient — a bright spot that travels along the path */}
        <linearGradient
          id="shimmer-gradient"
          x1="-125.642"
          y1="758.596"
          x2="1612.25"
          y2="323.974"
          gradientUnits="userSpaceOnUse"
        >
          <stop className="glow-stop" offset="0" stopColor="white" stopOpacity="0" />
          <stop className="glow-stop" offset="0.5" stopColor="white" stopOpacity="0.6" />
          <stop className="glow-stop" offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="ribbon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft glow layer behind */}
      <path
        className="ribbon-glow"
        d={ribbonPath}
        stroke="url(#ribbon-gradient)"
        strokeWidth="200"
        strokeMiterlimit="10"
        strokeOpacity="0.15"
        fill="none"
        filter="url(#ribbon-glow)"
      />

      {/* Main ribbon */}
      <path
        d={ribbonPath}
        stroke="url(#ribbon-gradient)"
        strokeWidth="140"
        strokeMiterlimit="10"
        fill="none"
      />

      {/* Shimmer highlight layer */}
      <path
        d={ribbonPath}
        stroke="url(#shimmer-gradient)"
        strokeWidth="100"
        strokeMiterlimit="10"
        fill="none"
      />
    </svg>
  );
}

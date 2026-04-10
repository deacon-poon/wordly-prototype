'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function WebGLShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.OrthographicCamera | null;
    renderer: THREE.WebGLRenderer | null;
    mesh: THREE.Mesh | null;
    uniforms: Record<string, { value: unknown }> | null;
    animationId: number | null;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const { current: refs } = sceneRef;

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Wordly brand gradient: green #3CFF52 → teal #00D0FF → blue #017CFF
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

        // Wordly brand colors (normalized 0-1)
        vec3 green = vec3(0.235, 1.0, 0.322);   // #3CFF52
        vec3 teal  = vec3(0.0, 0.816, 1.0);     // #00D0FF
        vec3 blue  = vec3(0.004, 0.486, 1.0);   // #017CFF

        // Flowing wave distortion
        float wave1 = sin(p.x * 2.0 + time * 0.6) * 0.4;
        float wave2 = sin(p.x * 1.5 - time * 0.4 + 1.5) * 0.3;
        float wave3 = sin(p.x * 3.0 + time * 0.8 + 3.0) * 0.15;

        // Ribbon-like glow bands
        float d1 = 0.04 / abs(p.y - wave1 - 0.1);
        float d2 = 0.03 / abs(p.y - wave2 + 0.2);
        float d3 = 0.02 / abs(p.y - wave3 - 0.3);

        // Color mixing based on position + time
        float t = uv.x + sin(time * 0.3) * 0.2;
        vec3 col1 = mix(green, teal, smoothstep(0.0, 0.5, t));
        vec3 col2 = mix(teal, blue, smoothstep(0.4, 1.0, t));
        vec3 gradientColor = mix(col1, col2, smoothstep(0.3, 0.7, t));

        // Compose with white background
        vec3 glow = gradientColor * d1 + gradientColor * d2 * 0.8 + blue * d3 * 0.6;
        vec3 bg = vec3(1.0);
        vec3 color = bg - glow * 0.35;

        // Subtle vignette
        float vignette = 1.0 - length(p) * 0.25;
        color *= vignette;

        color = clamp(color, 0.0, 1.0);
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const initScene = () => {
      refs.scene = new THREE.Scene();
      refs.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.setClearColor(new THREE.Color(0xffffff));

      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

      refs.uniforms = {
        resolution: { value: [canvas.clientWidth, canvas.clientHeight] },
        time: { value: 0.0 },
      };

      const positions = new THREE.BufferAttribute(
        new Float32Array([
          -1, -1, 0, 1, -1, 0, -1, 1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0,
        ]),
        3,
      );
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', positions);

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: THREE.DoubleSide,
      });

      refs.mesh = new THREE.Mesh(geometry, material);
      refs.scene.add(refs.mesh);

      handleResize();
    };

    const animate = () => {
      if (refs.uniforms) {
        (refs.uniforms.time as { value: number }).value += 0.005;
      }
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera);
      }
      refs.animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms || !canvas.parentElement) return;
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;
      refs.renderer.setSize(width, height, false);
      (refs.uniforms.resolution as { value: number[] }).value = [width, height];
    };

    initScene();
    animate();
    window.addEventListener('resize', handleResize);

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener('resize', handleResize);
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh);
        refs.mesh.geometry.dispose();
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose();
        }
      }
      refs.renderer?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
    />
  );
}

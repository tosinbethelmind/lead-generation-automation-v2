'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ScrollWorldProps {
  theme?: 'bethelmind' | 'solar' | 'luxury' | 'healthcare' | 'automotive';
  particleCount?: number;
  className?: string;
  enableGeometry?: boolean;
}

const THEME_COLORS = {
  bethelmind: {
    primary: 0x00F5A0,   // Emerald
    secondary: 0x00D9F5, // Cyan
    accent: 0x6366F1,    // Indigo
    ambient: 0x070A14,   // Deep Obsidian
  },
  solar: {
    primary: 0xFFBF00,   // Gold
    secondary: 0xFF7300, // Solar Orange
    accent: 0x1AD973,    // Energy Green
    ambient: 0x0D0B05,
  },
  luxury: {
    primary: 0xD9B359,   // Champagne Gold
    secondary: 0xB88733, // Bronze
    accent: 0x9333EA,    // Royal Purple
    ambient: 0x0C0814,
  },
  healthcare: {
    primary: 0x00D9F2,   // Pure Cyan
    secondary: 0x1A99FA, // Azure
    accent: 0x26E6B3,    // Healing Mint
    ambient: 0x050C14,
  },
  automotive: {
    primary: 0xFF3333,   // Racing Red
    secondary: 0xFF8C00, // Turbo Orange
    accent: 0x38BDF8,    // Sky Blue
    ambient: 0x0C0A0A,
  },
};

export default function ScrollWorld({
  theme = 'bethelmind',
  particleCount = 1200,
  className = '',
  enableGeometry = true,
}: ScrollWorldProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Conserve battery, CPU, and cellular data on mobile devices (<768px) or reduced-motion environments
    if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setHasWebGL(false);
      return;
    }

    // Check WebGL availability
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setHasWebGL(false);
      return;
    }

    const colors = THEME_COLORS[theme] || THEME_COLORS.bethelmind;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(colors.ambient, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000,
    );
    camera.position.set(0, 0, 400);

    // 2. WebGL Renderer with performance caps
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent canvas

    container.appendChild(renderer.domElement);

    // 3. Stardust Particle Galaxy
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const cPrimary = new THREE.Color(colors.primary);
    const cSecondary = new THREE.Color(colors.secondary);
    const cAccent = new THREE.Color(colors.accent);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Cylinder distribution along scroll depth
      const radius = 100 + Math.random() * 450;
      const theta = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 1600;

      positions[i3] = Math.cos(theta) * radius;
      positions[i3 + 1] = Math.sin(theta) * radius * 0.7;
      positions[i3 + 2] = z;

      // Color distribution
      const pick = Math.random();
      const col = pick < 0.45 ? cPrimary : pick < 0.8 ? cSecondary : cAccent;
      particleColors[i3] = col.r;
      particleColors[i3 + 1] = col.g;
      particleColors[i3 + 2] = col.b;

      scales[i] = 1.5 + Math.random() * 3.5;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Particle Shader Material for soft luminous points
    const particleMaterial = new THREE.PointsMaterial({
      size: 4.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 4. Floating 3D Geometric Polyhedra
    const floatingMeshes: THREE.Mesh[] = [];

    if (enableGeometry) {
      const geometries = [
        new THREE.IcosahedronGeometry(35, 0),
        new THREE.OctahedronGeometry(28, 0),
        new THREE.TorusGeometry(32, 8, 16, 50),
        new THREE.IcosahedronGeometry(22, 1),
      ];

      const meshCoords = [
        { x: -180, y: 80, z: 100, rotSpeed: 0.006 },
        { x: 220, y: -60, z: -150, rotSpeed: -0.005 },
        { x: -140, y: -120, z: -400, rotSpeed: 0.007 },
        { x: 190, y: 140, z: -650, rotSpeed: -0.008 },
      ];

      meshCoords.forEach((coord, idx) => {
        const geom = geometries[idx % geometries.length];
        const mat = new THREE.MeshBasicMaterial({
          color: idx % 2 === 0 ? colors.primary : colors.secondary,
          wireframe: true,
          transparent: true,
          opacity: 0.35,
        });

        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(coord.x, coord.y, coord.z);
        scene.add(mesh);
        floatingMeshes.push(mesh);
      });
    }

    // 5. Scroll & Mouse Tracking
    let targetScrollProgress = 0;
    let currentScrollProgress = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        targetScrollProgress = Math.min(1.0, Math.max(0, window.scrollY / docHeight));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    handleScroll();

    // 6. Animation Loop with Idle Throttling
    let animId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);

      // Skip render if tab is hidden
      if (document.hidden) return;

      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      // Smooth lerp for scroll and mouse
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.05;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // 3D Camera Fly-through trajectory tied to Scroll Progress
      // Camera travels from Z = 400 down to Z = -500, with dynamic pitch and yaw
      const travelZ = 400 - currentScrollProgress * 950;
      const travelY = -currentScrollProgress * 120;
      camera.position.z = travelZ;
      camera.position.y = travelY + mouseY * -15;
      camera.position.x = mouseX * 25;

      camera.rotation.x = mouseY * -0.04 - currentScrollProgress * 0.2;
      camera.rotation.y = mouseX * -0.06;
      camera.rotation.z = Math.sin(currentScrollProgress * Math.PI) * 0.08;

      // Gentle galaxy particle rotation
      particles.rotation.y += 0.0008;
      particles.rotation.z = currentScrollProgress * 0.3;

      // Rotate floating geometric polyhedra
      floatingMeshes.forEach((mesh, i) => {
        mesh.rotation.x += 0.005 * (i % 2 === 0 ? 1 : -1);
        mesh.rotation.y += 0.008;
        // Subtle floating pulse
        mesh.position.y += Math.sin(time * 0.0015 + i) * 0.15;
      });

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      floatingMeshes.forEach((m) => {
        m.geometry.dispose();
        if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
        else m.material.dispose();
      });
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme, particleCount, enableGeometry]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {!hasWebGL && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 50% 20%, rgba(6,182,212,0.12) 0%, rgba(3,7,18,0) 70%)',
          }}
        />
      )}
    </div>
  );
}

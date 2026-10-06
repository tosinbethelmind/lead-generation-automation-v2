'use client';

import React, { useState, useRef, useId } from 'react';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // e.g. '#00F5A0' or '#06B6D4'
  borderRadius?: number;
  padding?: string | number;
  interactive?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function LiquidGlassCard({
  children,
  className = '',
  glowColor = '#06B6D4',
  borderRadius = 24,
  padding = '24px',
  interactive = true,
  style = {},
  onClick,
}: LiquidGlassCardProps) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 50, y: 50 });
      }}
      onClick={onClick}
      className={`relative overflow-hidden transition-all duration-300 ${className}`}
      style={{
        borderRadius,
        padding,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.015) 100%)',
        backdropFilter: 'blur(20px) saturate(190%)',
        WebkitBackdropFilter: 'blur(20px) saturate(190%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: isHovered
          ? `0 20px 45px -12px rgba(0, 0, 0, 0.7), 0 0 35px -8px ${glowColor}40, inset 0 1px 1px rgba(255, 255, 255, 0.35)`
          : '0 12px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.18)',
        transform: isHovered && interactive ? 'translateY(-2px)' : 'none',
        ...style,
      }}
    >
      {/* Liquid Glass Refraction Specular Light Wave */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0.4,
          transition: 'opacity 0.4s ease',
          background: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 40%, transparent 80%)`,
        }}
      />

      {/* Chromatic Dispersion Prismatic Rim Effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          borderRadius,
          border: '1px solid transparent',
          background: `radial-gradient(circle 350px at ${mousePos.x}% ${mousePos.y}%, ${glowColor}60 0%, rgba(99, 102, 241, 0.2) 50%, transparent 100%) border-box`,
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: isHovered ? 0.9 : 0.3,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Subtle Fluid Glass Noise Shimmer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `radial-gradient(ellipse at ${100 - mousePos.x}% ${100 - mousePos.y}%, ${glowColor}10 0%, transparent 60%)`,
          mixBlendMode: 'screen',
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface LiquidGlassNavProps {
  children: React.ReactNode;
  scrolled: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function LiquidGlassNav({
  children,
  scrolled,
  className = '',
  style = {},
}: LiquidGlassNavProps) {
  const [mouseX, setMouseX] = useState(50);
  const navRef = useRef<HTMLElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setMouseX(x);
  };

  return (
    <header
      ref={navRef}
      role="banner"
      onMouseMove={handleMouseMove}
      className={`relative transition-all duration-300 ${className}`}
      style={{
        background: scrolled
          ? 'rgba(7, 10, 20, 0.85)'
          : 'rgba(10, 15, 29, 0.70)',
        backdropFilter: 'blur(28px) saturate(210%)',
        WebkitBackdropFilter: 'blur(28px) saturate(210%)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        boxShadow: scrolled
          ? '0 20px 45px -10px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.35), 0 0 20px rgba(6, 182, 212, 0.15)'
          : '0 12px 32px -10px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
        ...style,
      }}
    >
      {/* Dynamic Specular Fluid Sweep */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          background: `radial-gradient(circle 300px at ${mouseX}% 0%, rgba(255, 255, 255, 0.18) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 80%)`,
        }}
      />
      <div className="relative z-10 w-full flex items-center justify-between">
        {children}
      </div>
    </header>
  );
}

interface LiquidGlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  accentColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function LiquidGlassButton({
  children,
  onClick,
  accentColor = '#00F5A0',
  className = '',
  style = {},
}: LiquidGlassButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [coords, setCoords] = useState({ x: 50, y: 50 });

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCoords({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
      className={`relative inline-flex items-center justify-center font-bold overflow-hidden transition-all duration-200 cursor-pointer ${className}`}
      style={{
        borderRadius: 14,
        padding: '12px 24px',
        background: hovered
          ? `linear-gradient(135deg, ${accentColor}25 0%, rgba(255, 255, 255, 0.08) 100%)`
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        border: hovered
          ? `1px solid ${accentColor}80`
          : '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: hovered
          ? `0 10px 25px -5px ${accentColor}40, inset 0 1px 1px rgba(255, 255, 255, 0.4)`
          : '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(circle 100px at ${coords.x}% ${coords.y}%, rgba(255, 255, 255, 0.25) 0%, transparent 80%)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}

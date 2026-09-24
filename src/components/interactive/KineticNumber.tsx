'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface KineticNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  decimals?: number;
  className?: string;
}

export function KineticNumber({
  value,
  prefix = '',
  suffix = '',
  durationMs = 600,
  decimals = 0,
  className = '',
}: KineticNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const startVal = prevValueRef.current;
    const targetVal = value;
    prevValueRef.current = value;

    if (startVal === targetVal) return;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Quartic ease-out curve for mechanical/odometer spring feel
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = startVal + (targetVal - startVal) * easeOutQuart;

      setDisplayValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetVal);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, durationMs]);

  const formattedNumber = displayValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={`inline-flex items-baseline font-mono tracking-tight transition-colors ${className}`}>
      {prefix && <span className="opacity-80 select-none mr-0.5">{prefix}</span>}
      <span>{formattedNumber}</span>
      {suffix && <span className="opacity-80 select-none ml-1 text-[0.8em]">{suffix}</span>}
    </span>
  );
}

export default KineticNumber;

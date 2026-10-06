'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ShaderGradientLiquidLogoProps {
  size?: number;
  initials?: string;
  palette?: 'bethelmind' | 'solar' | 'luxury' | 'healthcare' | 'automotive' | 'custom';
  customColors?: [string, string, string, string]; // 4 hex colors
  className?: string;
  interactive?: boolean;
}

const PALETTES = {
  bethelmind: [
    [0.0, 0.96, 0.63], // Emerald #00F5A0
    [0.0, 0.85, 0.96], // Electric Cyan #00D9F5
    [0.39, 0.40, 0.95], // Royal Indigo #6366F1
    [0.93, 0.28, 0.60], // Neon Magenta #EC4899
  ],
  solar: [
    [1.0, 0.75, 0.0],  // Sun Gold #FFBF00
    [1.0, 0.45, 0.0],  // Solar Orange #FF7300
    [0.1, 0.85, 0.45], // Clean Energy Green #1AD973
    [0.05, 0.35, 0.8], // Sky Blue #0D59CC
  ],
  luxury: [
    [0.85, 0.70, 0.35], // Champagne Gold #D9B359
    [0.72, 0.53, 0.20], // Deep Bronze #B88733
    [0.12, 0.08, 0.22], // Royal Obsidian Purple #1F1438
    [0.98, 0.90, 0.75], // Platinum Glow #FAE6BF
  ],
  healthcare: [
    [0.0, 0.85, 0.95], // Pure Cyan #00D9F2
    [0.1, 0.6, 0.98],  // Clinical Azure #1A99FA
    [0.15, 0.9, 0.7],  // Healing Mint #26E6B3
    [0.05, 0.2, 0.5],  // Medical Deep Blue #0D3380
  ],
  automotive: [
    [1.0, 0.2, 0.2],   // Racing Crimson #FF3333
    [1.0, 0.55, 0.0],  // Turbo Orange #FF8C00
    [0.2, 0.25, 0.35], // Titanium Slate #334059
    [0.8, 0.85, 0.95], // Chrome Silver #CCD9F2
  ],
};

const VERTEX_SHADER = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = (position + 1.0) * 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 vUv;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  uniform vec3 u_c1;
  uniform vec3 u_c2;
  uniform vec3 u_c3;
  uniform vec3 u_c4;

  // Simplex-inspired 2D noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
          + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5);
    float dist = distance(uv, center);

    // Mouse fluid push ripple
    vec2 mouseDiff = uv - u_mouse;
    float mouseDist = length(mouseDiff);
    float mouseWave = sin(mouseDist * 18.0 - u_time * 3.5) * exp(-mouseDist * 4.0) * 0.08;
    uv += normalize(mouseDiff + 0.0001) * mouseWave;

    // Fluid distortion layers
    float t = u_time * 0.45;
    float n1 = snoise(uv * 2.2 + vec2(t * 0.6, -t * 0.4));
    float n2 = snoise(uv * 3.4 - vec2(-t * 0.5, t * 0.7) + vec2(n1 * 0.5));
    float n3 = snoise(uv * 5.0 + vec2(n2 * 0.6, t * 0.3));

    // Liquid flow displacement
    vec2 flowUv = uv + vec2(n1 * 0.25, n2 * 0.25);

    // Dynamic 4-color fluid blend
    float f1 = smoothstep(-0.6, 0.8, n1);
    float f2 = smoothstep(-0.5, 0.9, n2);
    float f3 = smoothstep(-0.4, 0.7, n3);

    vec3 colA = mix(u_c1, u_c2, f1);
    vec3 colB = mix(u_c3, u_c4, f2);
    vec3 finalColor = mix(colA, colB, f3);

    // Iridescent chromatic specular highlight
    float rim = 1.0 - smoothstep(0.35, 0.5, dist);
    float specular = pow(max(0.0, n3), 4.0) * 0.45;
    finalColor += vec3(specular) * u_c1;

    // Glass depth vignette
    finalColor *= (1.05 - dist * 0.65);

    // Circular liquid droplet mask with anti-aliased edge
    float alpha = smoothstep(0.495, 0.47, dist);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export default function ShaderGradientLiquidLogo({
  size = 40,
  initials = 'BM',
  palette = 'bethelmind',
  customColors,
  className = '',
  interactive = true,
}: ShaderGradientLiquidLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const animFrameRef = useRef<number | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) {
      setHasWebGL(false);
      return;
    }

    // Helper: compile shader
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('Shader compile failed', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) {
      setHasWebGL(false);
      return;
    }

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setHasWebGL(false);
      return;
    }

    gl.useProgram(prog);

    // Full screen quad buffer
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const posAttr = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uC1 = gl.getUniformLocation(prog, 'u_c1');
    const uC2 = gl.getUniformLocation(prog, 'u_c2');
    const uC3 = gl.getUniformLocation(prog, 'u_c3');
    const uC4 = gl.getUniformLocation(prog, 'u_c4');

    // Color palette selection
    const colors = (palette === 'custom' && customColors)
      ? PALETTES.bethelmind
      : (PALETTES[palette] || PALETTES.bethelmind);

    gl.uniform3fv(uC1, colors[0]);
    gl.uniform3fv(uC2, colors[1]);
    gl.uniform3fv(uC3, colors[2]);
    gl.uniform3fv(uC4, colors[3]);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let startTime = performance.now();
    let currentX = 0.5;
    let currentY = 0.5;

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001;

      // Mouse smooth lerp
      currentX += (mouseRef.current.x - currentX) * 0.08;
      currentY += (mouseRef.current.y - currentY) * 0.08;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, currentX, currentY);
      gl.uniform2f(uRes, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [palette, customColors]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height; // WebGL inverted Y
    mouseRef.current = { x, y };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: 0.5, y: 0.5 };
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer group ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        perspective: 800,
      }}
    >
      {/* 3D Liquid Canvas */}
      {hasWebGL ? (
        <canvas
          ref={canvasRef}
          width={size * 2}
          height={size * 2}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            display: 'block',
            filter: 'drop-shadow(0 4px 14px rgba(0, 245, 160, 0.35))',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          className="group-hover:scale-105"
        />
      ) : (
        /* Fallback rich CSS gradient if WebGL is disabled */
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: 'conic-gradient(from 180deg at 50% 50%, #00F5A0, #00D9F5, #6366F1, #EC4899, #00F5A0)',
            filter: 'blur(0.5px) drop-shadow(0 4px 14px rgba(0, 245, 160, 0.35))',
            animation: 'spin 12s linear infinite',
          }}
        />
      )}

      {/* Convex Glass Lens Overlay (Physical Glass Bubble Effect) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.15) 30%, rgba(255, 255, 255, 0.0) 60%, rgba(0, 0, 0, 0.35) 100%)',
          boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.6), inset 0 -2px 4px rgba(0, 0, 0, 0.4), 0 0 12px rgba(0, 217, 245, 0.25)',
          pointerEvents: 'none',
        }}
      />

      {/* Embossed Brand Typography / Monogram */}
      <span
        style={{
          position: 'absolute',
          zIndex: 2,
          fontFamily: "var(--font-inter), 'Inter', sans-serif",
          fontWeight: 900,
          fontSize: Math.max(10, Math.floor(size * 0.34)),
          letterSpacing: '-0.04em',
          color: '#ffffff',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.8), 0 0 10px rgba(255, 255, 255, 0.6)',
          pointerEvents: 'none',
          userSelect: 'none',
          textTransform: 'uppercase',
        }}
      >
        {initials}
      </span>
    </div>
  );
}

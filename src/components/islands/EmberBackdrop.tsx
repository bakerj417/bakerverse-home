import { useEffect, useRef } from 'react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.trim().replace('#', '');
  if (clean.length === 6) {
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  return null;
}

/**
 * EmberBackdrop — pure canvas 2D background with gently rising
 * embers that inherit their color from --gold-400 (theme-aware).
 * Cheap on battery (no WebGL), obeys prefers-reduced-motion,
 * cleans up on route change.
 */
export default function EmberBackdrop({
  density = 45,
  opacity = 0.35,
}: {
  density?: number;
  opacity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // --- theme-aware accent color ---
    let accent = { r: 240, g: 185, b: 11 }; // diablo gold fallback

    const readAccent = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue('--gold-400')
        .trim();
      const parsed = hexToRgb(raw);
      if (parsed) accent = parsed;
    };

    readAccent();

    // Theme engine updates <style id="bakerverse-theme"> on every switch
    const themeEl = document.getElementById('bakerverse-theme');
    let observer: MutationObserver | null = null;
    if (themeEl) {
      observer = new MutationObserver(readAccent);
      observer.observe(themeEl, { characterData: true, childList: true, subtree: true });
    }

    // --- ember state ---
    type Ember = {
      x: number;
      y: number;
      vy: number;
      vx: number;
      r: number;
      life: number;
      maxLife: number;
    };

    const embers: Ember[] = [];

    const spawn = (): Ember => {
      const maxLife = 300 + Math.random() * 300;
      return {
        x: Math.random() * width,
        y: height + 10,
        vy: -(0.15 + Math.random() * 0.35),
        vx: (Math.random() - 0.5) * 0.1,
        r: 0.6 + Math.random() * 1.6,
        life: 0,
        maxLife,
      };
    };

    for (let i = 0; i < density; i++) {
      const e = spawn();
      e.y = Math.random() * height;
      e.life = Math.random() * e.maxLife;
      embers.push(e);
    }

    let rafId = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      // Read live each frame so theme changes take effect immediately
      const { r, g, b } = accent;
      // Lightened version for the bright core dot
      const lr = Math.min(255, Math.round(r + (255 - r) * 0.45));
      const lg = Math.min(255, Math.round(g + (255 - g) * 0.45));
      const lb = Math.min(255, Math.round(b + (255 - b) * 0.45));

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.x += e.vx;
        e.y += e.vy;
        e.life += 1;

        if (e.y < -10 || e.life > e.maxLife) {
          embers[i] = spawn();
          continue;
        }

        const lifeRatio = e.life / e.maxLife;
        const fade =
          lifeRatio < 0.15
            ? lifeRatio / 0.15
            : lifeRatio > 0.75
              ? 1 - (lifeRatio - 0.75) / 0.25
              : 1;

        const alpha = fade * opacity;

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 4);
        gradient.addColorStop(0, `rgba(${lr}, ${lg}, ${lb}, ${alpha})`);
        gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(e.x, e.y, e.r * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(${lr}, ${lg}, ${lb}, ${alpha})`;
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      observer?.disconnect();
    };
  }, [density, opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}

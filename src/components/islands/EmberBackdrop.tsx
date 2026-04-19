import { useEffect, useRef } from 'react';

/**
 * EmberBackdrop — pure canvas 2D background with gently rising
 * gold embers. Cheap on battery (no WebGL), obeys
 * prefers-reduced-motion, cleans up on route change.
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
        gradient.addColorStop(0, `rgba(255, 217, 104, ${alpha})`);
        gradient.addColorStop(0.4, `rgba(240, 185, 11, ${alpha * 0.6})`);
        gradient.addColorStop(1, 'rgba(240, 185, 11, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(e.x, e.y, e.r * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 237, 176, ${alpha})`;
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
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

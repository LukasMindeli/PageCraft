import { useEffect, useRef } from "react";

/**
 * Canvas background: slow drifting planets / mini solar systems.
 * - No images, just drawing.
 * - HiDPI safe.
 * - Reduced motion support.
 */
export default function SpaceBackground() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const rand = (a, b) => a + Math.random() * (b - a);

    const makeSystems = () => {
      const area = Math.max(1, w * h);
      // density tuned to look good on mobile too
      const count = Math.max(10, Math.min(30, Math.floor(area / 70000)));

      const systems = [];
      for (let i = 0; i < count; i++) {
        const x = rand(0, w);
        const y = rand(0, h);

        const baseR = rand(12, 46); // planet radius
        const hasRing = Math.random() < 0.45;
        const ringTilt = rand(-0.9, 0.9);
        const ringW = baseR * rand(1.25, 1.9);

        const moonCount = Math.floor(rand(0, 4)); // 0..3
        const moons = Array.from({ length: moonCount }).map(() => ({
          a: rand(0, Math.PI * 2),
          r: rand(2.5, Math.max(3, baseR * 0.22)),
          dist: baseR * rand(1.6, 3.0),
          speed: rand(-0.008, 0.008),
        }));

        const vx = rand(-0.06, 0.06);
        const vy = rand(-0.05, 0.05);

        // visual params
        const glow = rand(0.10, 0.22);
        const shade = rand(0.15, 0.28);

        systems.push({
          x,
          y,
          r: baseR,
          vx,
          vy,
          hasRing,
          ringTilt,
          ringW,
          moons,
          glow,
          shade,
        });
      }
      return systems;
    };

    let systems = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      w = Math.floor(rect.width);
      h = Math.floor(rect.height);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      systems = makeSystems();
    };

    const drawSoftGlow = (x, y, r, alpha) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.6);
      g.addColorStop(0, `rgba(140, 110, 255, ${alpha})`);
      g.addColorStop(0.45, `rgba(0, 255, 200, ${alpha * 0.55})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 2.6, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawPlanet = (s) => {
      // glow behind
      drawSoftGlow(s.x, s.y, s.r, s.glow);

      // planet body with subtle shading
      const grad = ctx.createRadialGradient(
        s.x - s.r * 0.35,
        s.y - s.r * 0.35,
        s.r * 0.3,
        s.x,
        s.y,
        s.r
      );
      grad.addColorStop(0, "rgba(255,255,255,0.18)");
      grad.addColorStop(0.35, "rgba(120,90,255,0.18)");
      grad.addColorStop(0.7, `rgba(20, 18, 40, ${s.shade})`);
      grad.addColorStop(1, "rgba(0,0,0,0.22)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      // rim
      ctx.strokeStyle = "rgba(255,255,255,0.10)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.stroke();

      // ring
      if (s.hasRing) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.ringTilt);
        ctx.scale(1, 0.55);

        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, s.ringW, s.r * 0.9, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(0,255,200,0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, s.ringW * 0.86, s.r * 0.78, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // moon orbits + moons
      for (const m of s.moons) {
        // orbit
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, m.dist, 0, Math.PI * 2);
        ctx.stroke();

        // moon position
        const mx = s.x + Math.cos(m.a) * m.dist;
        const my = s.y + Math.sin(m.a) * m.dist;

        ctx.fillStyle = "rgba(255,255,255,0.16)";
        ctx.beginPath();
        ctx.arc(mx, my, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      // super subtle star dust
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      for (let i = 0; i < 80; i++) {
        const x = (i * 97) % Math.max(1, w);
        const y = (i * 131) % Math.max(1, h);
        ctx.fillRect(x, y, 1, 1);
      }

      for (const s of systems) {
        // drift
        s.x += s.vx;
        s.y += s.vy;

        // wrap around edges
        if (s.x < -120) s.x = w + 120;
        if (s.x > w + 120) s.x = -120;
        if (s.y < -120) s.y = h + 120;
        if (s.y > h + 120) s.y = -120;

        // animate moons
        for (const m of s.moons) m.a += m.speed;

        drawPlanet(s);
      }

      if (!prefersReduced) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const onResize = () => resize();

    resize();
    tick();

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="spaceBg"
      aria-hidden="true"
    />
  );
}
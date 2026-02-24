// webapp/src/PlanetsBackground.jsx
import { useEffect, useMemo, useRef } from "react";
import "./PlanetsBackground.css";

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

export default function PlanetsBackground() {
  const layerRef = useRef(null);

  const planets = useMemo(() => {
    const files = ["planet1.png", "planet2.png", "planet3.png", "planet4.png", "planet5.png"];

    const items = [];

    // 10 средних + 18 мелких
    for (let i = 0; i < 28; i++) {
      const f = files[i % files.length];

      const isMid = i < 10;

      // ВАЖНО: вот тут уменьшили размеры
      const size = isMid
        ? 70 + (i % 5) * 14   // 70..126
        : 26 + (i % 8) * 6;   // 26..68

      items.push({
        id: `p-${i}`,
        src: new URL(`./assets/planets/${f}`, import.meta.url).href,
        size,
        x: (i * 11 + 7) % 100,
        y: (i * 17 + 13) % 100,
        dur: isMid ? 26 + (i % 6) * 6 : 20 + (i % 8) * 4,
        op: isMid ? 0.22 : 0.12, // приглушили
      });
    }

    return items;
  }, []);

  useEffect(() => {
    let raf = 0;

    const apply = (dx, dy) => {
      const el = layerRef.current;
      if (!el) return;

      const tx = clamp(dx * 10, -14, 14);
      const ty = clamp(dy * 10, -14, 14);

      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    };

    const onOrientation = (e) => {
      const gamma = (e.gamma ?? 0) / 30;
      const beta = (e.beta ?? 0) / 30;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => apply(gamma, beta));
    };

    const onMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => apply(dx, dy));
    };

    window.addEventListener("deviceorientation", onOrientation, true);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("deviceorientation", onOrientation, true);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="planetsRoot" aria-hidden="true">
      <div ref={layerRef} className="planetsLayer">
        <div className="stars" />
        <div className="stars stars2" />

        {planets.map((p) => (
          <img
            key={p.id}
            className="planet"
            src={p.src}
            alt=""
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: p.op,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
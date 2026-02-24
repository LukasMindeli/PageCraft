// webapp/src/PlanetsBackground.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import "./PlanetsBackground.css";

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

export default function PlanetsBackground() {
  const layerRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  // PNG планет (пример: подставь свои реальные имена)
  const planets = useMemo(() => {
    // IMPORTANT: замени на свои файлы в webapp/src/assets/planets/...
    const files = [
      "planet1.png",
      "planet2.png",
      "planet3.png",
      "planet4.png",
      "planet5.png",
    ];

    // делаем “много планет”: большие + мелкие копии
    const items = [];
    for (let i = 0; i < 18; i++) {
      const f = files[i % files.length];
      const size = i < 8 ? 120 + (i % 5) * 30 : 40 + (i % 6) * 16; // большие и мелкие
      items.push({
        id: `p-${i}`,
        src: new URL(`./assets/planets/${f}`, import.meta.url).href,
        size,
        x: (i * 13) % 100,
        y: (i * 17) % 100,
        dur: 22 + (i % 8) * 6,
        drift: 18 + (i % 6) * 10,
        op: i < 8 ? 0.38 : 0.22,
      });
    }
    return items;
  }, []);

  useEffect(() => {
    let raf = 0;

    const apply = (dx, dy) => {
      const el = layerRef.current;
      if (!el) return;

      // смещения в пикселях — мягко
      const tx = clamp(dx * 14, -18, 18);
      const ty = clamp(dy * 14, -18, 18);

      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    };

    const onOrientation = (e) => {
      // gamma: left/right (-90..90), beta: front/back (-180..180)
      const gamma = (e.gamma ?? 0) / 30; // нормализация
      const beta = (e.beta ?? 0) / 30;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => apply(gamma, beta));
    };

    // Desktop fallback: мышь
    const onMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx; // -1..1
      const dy = (e.clientY - cy) / cy;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => apply(dx, dy));
    };

    // Пробуем включить без permission (Android)
    window.addEventListener("deviceorientation", onOrientation, true);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // если не прилетает ориентация — всё равно пусть будет мышь
    setEnabled(true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("deviceorientation", onOrientation, true);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // iOS permission (если понадобится) — добавим кнопку-активацию по клику
  // Но пока — не ломаем UX.

  return (
    <div className="planetsRoot" aria-hidden="true">
      <div ref={layerRef} className="planetsLayer">
        {/* мерцающее звёздное небо */}
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
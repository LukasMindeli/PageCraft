// webapp/src/PlanetsBackground.jsx
import React, { useMemo } from "react";
import "./PlanetsBackground.css";

function planetUrl(file) {
  return new URL(`./assets/planets/${file}`, import.meta.url).href;
}

export default function PlanetsBackground() {
  // Файлы планет (подстрой под свои реальные имена)
  const files = useMemo(
    () => ["planet1.png", "planet2.png", "planet3.png", "planet4.png"],
    []
  );

  const items = useMemo(() => {
    const out = [];
    const rand = (a, b) => a + Math.random() * (b - a);
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Сколько больших и сколько маленьких
    const bigCount = 7;      // крупные
    const smallCount = 14;   // маленькие повторы (главное — больше)

    const makeOne = (kind, idx) => {
      const file = pick(files);

      // размеры
      const size =
        kind === "big" ? rand(34, 64) : rand(12, 28);

      // позиции (в %)
      const x = rand(4, 96);
      const y = rand(6, 90);

      // скорость (секунды) — маленькие пусть двигаются чуть быстрее
      const dur =
        kind === "big" ? rand(55, 95) : rand(38, 75);

      // задержка чтобы стартовали несинхронно
      const delay = -rand(0, dur);

      // амплитуды движения
      const drift =
        kind === "big" ? rand(35, 70) : rand(20, 48);
      const float =
        kind === "big" ? rand(14, 28) : rand(10, 22);

      // вращение
      const rot =
        kind === "big" ? rand(120, 320) : rand(180, 520);

      // прозрачность
      const opacity =
        kind === "big" ? rand(0.20, 0.34) : rand(0.10, 0.22);

      // немного размыть часть маленьких, чтобы была глубина
      const blur =
        kind === "small" && Math.random() < 0.35 ? rand(0.6, 1.4) : 0;

      return {
        key: `${kind}-${file}-${idx}-${Math.random().toString(16).slice(2)}`,
        src: planetUrl(file),
        size,
        x,
        y,
        dur,
        delay,
        drift,
        float,
        rot,
        opacity,
        blur,
      };
    };

    for (let i = 0; i < bigCount; i++) out.push(makeOne("big", i));
    for (let i = 0; i < smallCount; i++) out.push(makeOne("small", i));

    return out;
  }, [files]);

  return (
    <div className="planetsLayer" aria-hidden="true">
      {items.map((p) => (
        <img
          key={p.key}
          className="planet"
          src={p.src}
          alt=""
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            filter: p.blur ? `blur(${p.blur}px)` : undefined,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            "--drift": `${p.drift}px`,
            "--float": `${p.float}px`,
            "--rot": `${p.rot}deg`,
          }}
        />
      ))}
    </div>
  );
}
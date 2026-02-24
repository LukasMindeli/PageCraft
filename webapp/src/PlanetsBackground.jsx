// webapp/src/PlanetsBackground.jsx
import React, { useMemo } from "react";
import "./PlanetsBackground.css";

// Vite: импортируем PNG как URL
function planetUrl(file) {
  return new URL(`./assets/planets/${file}`, import.meta.url).href;
}

export default function PlanetsBackground() {
  // Список файлов — поменяешь под свои PNG
  const files = useMemo(
    () => ["planet1.png", "planet2.png", "planet3.png", "planet4.png"],
    []
  );

  // Генерим “частицы” с разными траекториями/скоростями
  const items = useMemo(() => {
    return files.map((file, i) => {
      // размеры: маленькие (можешь менять)
      const size = 26 + (i % 4) * 10; // 26..56
      // стартовые позиции в %
      const x = 10 + (i * 17) % 80; // 10..90
      const y = 12 + (i * 23) % 75; // 12..87
      // длительность анимации
      const dur = 38 + (i % 5) * 12; // 38..86 сек
      // задержка чтобы не стартовали синхронно
      const delay = -(i * 7);

      return {
        key: `${file}-${i}`,
        src: planetUrl(file),
        size,
        x,
        y,
        dur,
        delay,
        drift: 40 + (i % 4) * 18, // насколько “плывёт” по X
        float: 18 + (i % 3) * 10, // насколько “плавает” по Y
        rot: 160 + (i % 4) * 120, // сколько градусов за цикл
        opacity: 0.22 + (i % 4) * 0.06, // 0.22..0.40
        blur: i % 3 === 0 ? 0.6 : 0, // чуть мягче некоторые
      };
    });
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
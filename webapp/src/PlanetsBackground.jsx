// webapp/src/PlanetsBackground.jsx
import { useMemo } from "react";
import "./PlanetsBackground.css";

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function PlanetsBackground() {
  // Подставь сюда названия твоих png планет (лежит в src/assets/planets/)
  // Если у тебя другая папка — поменяй путь в getPlanetHref()
  const planetFiles = useMemo(
    () => [
      "planet1.png",
      "planet2.png",
      "planet3.png",
      "planet4.png",
      "planet5.png",
      "planet6.png",
    ],
    []
  );

  function getPlanetHref(file) {
    return new URL(`./assets/planets/${file}`, import.meta.url).href;
  }

  // Генерируем планеты 1 раз на загрузку страницы — позиции рандомные
  const planets = useMemo(() => {
    const count = 10; // меньше/строже, но достаточно “живого”
    const items = [];

    for (let i = 0; i < count; i++) {
      const file = pick(planetFiles);

      // размеры: часть маленьких, часть средних, несколько побольше
      const size =
        i < 2
          ? rand(90, 140)   // 2 крупнее
          : i < 6
          ? rand(55, 95)    // средние
          : rand(32, 60);   // мелкие

      const x = rand(-5, 95);
      const y = rand(-5, 95);

      // отдельные скорости и направление — ПЛАВНО, БЕЗ РЫВКОВ
      const dx = rand(-16, 16);
      const dy = rand(-14, 14);

      const duration = rand(18, 34); // медленно
      const delay = rand(-10, 0);    // чтобы часть уже “летала” сразу

      items.push({
        id: `p_${i}_${Math.random().toString(16).slice(2)}`,
        src: getPlanetHref(file),
        size,
        x,
        y,
        dx,
        dy,
        duration,
        delay,
        blur: i < 2 ? 0.8 : i < 6 ? 1.2 : 1.6, // лёгкий blur для “глубины”
        opacity: i < 2 ? 0.28 : i < 6 ? 0.22 : 0.18, // строго, не кричит
      });
    }

    return items;
  }, [planetFiles]);

  return (
    <div className="bgRoot" aria-hidden="true">
      {/* 1) stars */}
      <div className="starsLayer" />

      {/* 2) planets */}
      <div className="planetsLayer">
        {planets.map((p) => (
          <span
            key={p.id}
            className="planet"
            style={{
              left: `${p.x}vw`,
              top: `${p.y}vh`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundImage: `url(${p.src})`,
              opacity: p.opacity,
              filter: `blur(${p.blur}px)`,
              // animation params via CSS variables
              "--dx": `${p.dx}vw`,
              "--dy": `${p.dy}vh`,
              "--dur": `${p.duration}s`,
              "--delay": `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* 3) dark vignette to keep it strict */}
      <div className="vignetteLayer" />
    </div>
  );
}
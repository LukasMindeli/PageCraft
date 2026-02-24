// webapp/src/PlanetsBackground.jsx
import { useMemo } from "react";
import "./PlanetsBackground.css";

function pick(arr, i) {
  return arr[i % arr.length];
}

export default function PlanetsBackground() {
  const planets = useMemo(() => {
    const files = [
      "planet1.png",
      "planet2.png",
      "planet3.png",
      "planet4.png",
      "planet5.png",
    ];

    const items = [];
    const total = 34; // планет больше на экране

    for (let i = 0; i < total; i++) {
      const isBig = i < 10;

      // ЕЩЁ ЧУТЬ МЕНЬШЕ (чем было)
      const size = isBig
        ? 52 + (i % 5) * 10 // 52..92
        : 18 + (i % 9) * 4; // 18..50

      // рандомоподобные позиции (детерминированно, но выглядит рандомно)
      const x = (i * 13 + 11) % 100;
      const y = (i * 19 + 7) % 100;

      // индивидуальные параметры плавания
      const dx = (i % 2 === 0 ? 1 : -1) * (8 + (i % 7) * 2.0); // 8..20px
      const dy = (i % 3 === 0 ? 1 : -1) * (6 + (i % 6) * 1.8); // 6..15px
      const rot = (i % 2 === 0 ? 1 : -1) * (1.0 + (i % 6) * 0.35); // 1..2.75deg
      const dur = isBig ? 16 + (i % 8) * 2.4 : 12 + (i % 10) * 1.9; // медленно

      // разный старт по времени, чтобы не синхронно
      const delay = -((i % 12) * 0.9);

      items.push({
        id: `p-${i}`,
        src: new URL(`./assets/planets/${pick(files, i)}`, import.meta.url).href,
        size,
        x,
        y,
        op: isBig ? 0.22 : 0.13,
        dx,
        dy,
        rot,
        dur,
        delay,
      });
    }

    return items;
  }, []);

  return (
    <div className="bgRoot" aria-hidden="true">
      {/* 1) ЗВЁЗДЫ */}
      <div className="starsLayer" />

      {/* 2) ПЛАНЕТЫ */}
      <div className="planetsLayer">
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
              animationDelay: `${p.delay}s`,
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              "--rot": `${p.rot}deg`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
import { useMemo } from "react";
import "./PlanetsBackground.css";

function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function PlanetsBackground() {
  // ✅ ЯВНО: пути к планетам (поменяй папку/имена если у тебя иначе)
  const planetSrc = useMemo(
    () => [
      new URL("./assets/planets/planet1.png", import.meta.url).href,
      new URL("./assets/planets/planet2.png", import.meta.url).href,
      new URL("./assets/planets/planet3.png", import.meta.url).href,
      new URL("./assets/planets/planet4.png", import.meta.url).href,
      new URL("./assets/planets/planet5.png", import.meta.url).href,
    ],
    []
  );

  // ✅ ВАЖНО: items создаются ОДИН РАЗ (useMemo [])
  const items = useMemo(() => {
    const count = 18; // больше планет на экране (подстрой)
    const res = [];

    for (let i = 0; i < count; i++) {
      const size = rand(18, 58); // еще чуть меньше
      const x = rand(2, 98);     // %
      const y = rand(6, 96);     // %

      // разные “траектории”: выбираем разные keyframes
      const driftClass = pick(["driftA", "driftB", "driftC", "driftD"]);

      // длительность и задержка — чтобы всё было не синхронно
      const dur = rand(18, 46);   // секунды
      const delay = -rand(0, dur); // отрицательная = как будто уже летит

      // амплитуда (на сколько пикселей гуляет)
      const ampX = rand(18, 90);
      const ampY = rand(14, 70);

      // чуть разная прозрачность
      const opacity = rand(0.25, 0.85);

      res.push({
        id: `p_${i}`,
        src: pick(planetSrc),
        size,
        x,
        y,
        driftClass,
        dur,
        delay,
        ampX,
        ampY,
        opacity,
      });
    }

    return res;
  }, [planetSrc]);

  return (
    <div className="planetsLayer" aria-hidden="true">
      {/* ⭐️ звезды (слой ниже планет) */}
      <div className="starsLayer" />

      {/* 🪐 планеты */}
      {items.map((p) => (
        <img
          key={p.id}
          className={`planet ${p.driftClass}`}
          src={p.src}
          alt=""
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,

            // управляем анимацией через CSS-переменные
            "--dur": `${p.dur}s`,
            "--delay": `${p.delay}s`,
            "--ax": `${p.ampX}px`,
            "--ay": `${p.ampY}px`,
          }}
          onError={(e) => {
            // если вдруг битая картинка — спрячем, чтобы не было серых квадратов
            e.currentTarget.style.display = "none";
          }}
          draggable="false"
        />
      ))}
    </div>
  );
}
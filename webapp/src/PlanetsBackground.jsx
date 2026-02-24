// webapp/src/PlanetsBackground.jsx
import { useMemo } from "react";
import "./PlanetsBackground.css";

function rand(min, max) {
  return min + Math.random() * (max - min);
}
function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}
function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

export default function PlanetsBackground() {
  const planets = useMemo(() => {
    // ВАЖНО: useMemo без зависимостей выполнится один раз на монтирование
    // => при refresh будет НОВЫЙ набор (как ты хочешь)

    const files = [
      "planet1.png",
      "planet2.png",
      "planet3.png",
      "planet4.png",
      "planet5.png",
      "planet6.png",
      "planet7.png",
    ];

    const total = 34; // больше планет
    const items = [];

    for (let i = 0; i < total; i++) {
      const isBig = i < 9; // несколько “главных”

      // ЕЩЁ ЧУТЬ МЕНЬШЕ (ты просил) — но не микроскопические
      const size = isBig ? rand(54, 92) : rand(18, 46);

      // РЕАЛЬНЫЙ рандом позиции (чтобы каждый раз по-новому)
      // Чтобы не лезли прям в край — небольшой “паддинг”
      const x = rand(6, 94);
      const y = rand(6, 94);

      // Разные направления/амплитуды
      const dx = rand(-22, 22);      // горизонтальный дрейф
      const dy = rand(-18, 18);      // вертикальный дрейф
      const bob = rand(6, 14);       // лёгкое покачивание
      const rot = rand(-4, 4);       // микро-поворот

      // Длительности разные, чтобы не “танцевали строем”
      const driftDur = rand(16, 28); // медленно
      const bobDur = rand(6, 11);    // покачивание

      // Старт “в разном месте анимации”
      const delay1 = -rand(0, driftDur);
      const delay2 = -rand(0, bobDur);

      items.push({
        id: `p-${i}-${Math.random().toString(16).slice(2)}`,
        src: new URL(`./assets/planets/${pick(files)}`, import.meta.url).href,
        size,
        x,
        y,
        op: isBig ? rand(0.20, 0.30) : rand(0.10, 0.18),
        dx,
        dy,
        bob,
        rot,
        driftDur,
        bobDur,
        delay1,
        delay2,
      });
    }

    return items;
  }, []);

  return (
    <div className="bgRoot" aria-hidden="true">
      {/* звёзды */}
      <div className="starsLayer" />

      {/* планеты */}
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

              // параметры для анимации через CSS variables
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              "--bob": `${p.bob}px`,
              "--rot": `${p.rot}deg`,

              // две анимации одновременно
              animationDuration: `${p.driftDur}s, ${p.bobDur}s`,
              animationDelay: `${p.delay1}s, ${p.delay2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
// webapp/src/PlanetsBackground.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import "./PlanetsBackground.css";

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function pick(arr, i) {
  return arr[i % arr.length];
}

export default function PlanetsBackground() {
  const layerRef = useRef(null);
  const [motionReady, setMotionReady] = useState(false);

  const planets = useMemo(() => {
    const files = ["planet1.png", "planet2.png", "planet3.png", "planet4.png", "planet5.png"];

    const items = [];

    // 10 средних + 20 маленьких (можешь увеличить если хочешь)
    const total = 30;

    for (let i = 0; i < total; i++) {
      const isMid = i < 10;

      // ЕЩЁ ЧУТЬ МЕНЬШЕ
      const size = isMid
        ? 58 + (i % 5) * 12   // 58..106
        : 20 + (i % 8) * 5;   // 20..55

      // индивидуальные параметры парения
      const dx = (i % 2 === 0 ? 1 : -1) * (6 + (i % 7) * 1.6); // 6..17px
      const dy = (i % 3 === 0 ? 1 : -1) * (5 + (i % 6) * 1.4); // 5..13px
      const rot = (i % 2 === 0 ? 1 : -1) * (1.2 + (i % 5) * 0.35); // 1.2..2.6deg
      const floatDur = isMid ? 10 + (i % 6) * 2.2 : 8 + (i % 8) * 1.6; // разная скорость
      const delay = -((i % 9) * 0.9); // чтобы они не синхронно стартовали

      items.push({
        id: `p-${i}`,
        src: new URL(`./assets/planets/${pick(files, i)}`, import.meta.url).href,
        size,
        x: (i * 11 + 7) % 100,
        y: (i * 17 + 13) % 100,
        op: isMid ? 0.22 : 0.12,
        dx,
        dy,
        rot,
        floatDur,
        delay,
      });
    }

    return items;
  }, []);

  useEffect(() => {
    let raf = 0;

    const applyLayerShift = (dx, dy) => {
      const el = layerRef.current;
      if (!el) return;

      // общий сдвиг слоя (не слишком сильный)
      const tx = clamp(dx * 14, -18, 18);
      const ty = clamp(dy * 14, -18, 18);

      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    };

    const onOrientation = (e) => {
      // gamma: влево/вправо, beta: вперед/назад
      const gamma = (e.gamma ?? 0) / 30; // нормализуем
      const beta = (e.beta ?? 0) / 30;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => applyLayerShift(gamma, beta));
    };

    const onMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => applyLayerShift(dx, dy));
    };

    window.addEventListener("deviceorientation", onOrientation, true);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("deviceorientation", onOrientation, true);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // iOS: нужно разрешение на motion. Мы просим ОДИН РАЗ по клику в любом месте.
  useEffect(() => {
    const ask = async () => {
      try {
        const D = window.DeviceOrientationEvent;
        if (!D || typeof D.requestPermission !== "function") {
          setMotionReady(true);
          return;
        }
        // iOS требует user gesture — ждём первый клик
        const res = await D.requestPermission();
        setMotionReady(res === "granted");
      } catch {
        setMotionReady(false);
      }
    };

    const onFirstTap = () => {
      // пробуем попросить доступ, если нужно
      ask();
      window.removeEventListener("click", onFirstTap);
      window.removeEventListener("touchstart", onFirstTap);
    };

    window.addEventListener("click", onFirstTap, { once: true });
    window.addEventListener("touchstart", onFirstTap, { once: true });

    return () => {
      window.removeEventListener("click", onFirstTap);
      window.removeEventListener("touchstart", onFirstTap);
    };
  }, []);

  return (
    <div className="planetsRoot" aria-hidden="true">
      <div ref={layerRef} className="planetsLayer">
        {/* звёзды (если хочешь — можно позже сделать CSS-генерацию точек без картинок) */}
        <div
          className="stars"
          style={{
            backgroundImage:
              "radial-gradient(#fff 1px, transparent 1px), radial-gradient(#fff 1px, transparent 1px)",
            backgroundPosition: "0 0, 110px 160px",
          }}
        />
        <div
          className="stars2"
          style={{
            backgroundImage:
              "radial-gradient(#fff 1px, transparent 1px), radial-gradient(#fff 1px, transparent 1px)",
            backgroundPosition: "40px 20px, 180px 120px",
          }}
        />

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

              // индивидуальная анимация "парения"
              animationDuration: `${p.floatDur}s`,
              animationDelay: `${p.delay}s`,
              // индивидуальные параметры парения
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              "--rot": `${p.rot}deg`,
            }}
          />
        ))}
      </div>

      {/* можно убрать, просто оставил чтобы ты понимал: на iOS нужно "первое касание" */}
      {!motionReady && (
        <div style={{ display: "none" }}>
          {/* hidden */}
        </div>
      )}
    </div>
  );
}
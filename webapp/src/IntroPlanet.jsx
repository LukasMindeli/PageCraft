import { useEffect, useMemo, useRef, useState } from "react";
import "./IntroPlanet.css";

export default function IntroPlanet({ onEnter }) {
  const [leaving, setLeaving] = useState(false);
  const audioRef = useRef(null);

  const planetSrc = useMemo(
    () => new URL("./assets/intro/planet.png", import.meta.url).href,
    []
  );
  const musicSrc = useMemo(
    () => new URL("./assets/intro/intro.mp3", import.meta.url).href,
    []
  );

  useEffect(() => {
    // на всякий — подготовим аудио заранее (но играть начнём только по клику)
    if (audioRef.current) {
      audioRef.current.volume = 0.55;
      audioRef.current.loop = true;
    }
  }, []);

  const handleClick = async () => {
    if (leaving) return;
    setLeaving(true);

    // Запуск музыки (работает, потому что это user gesture)
    try {
      if (audioRef.current) {
        await audioRef.current.play();
      }
    } catch (e) {
      // если браузер всё равно блочит (редко, но бывает) — просто продолжим без звука
      console.warn("Audio play blocked:", e);
    }

    // Дать время на fade-out, потом открыть сайт
    setTimeout(() => {
      onEnter?.();
    }, 520);
  };

  return (
    <div className={`introOverlay ${leaving ? "leaving" : ""}`}>
      <audio ref={audioRef} src={musicSrc} preload="auto" />

      <div className="introCenter">
        <button className="planetButton" onClick={handleClick} type="button">
          <img className="introPlanet" src={planetSrc} alt="Enter" />
          <div className="introHint">Нажми на планету</div>
        </button>
      </div>

      <div className="introVignette" />
    </div>
  );
}
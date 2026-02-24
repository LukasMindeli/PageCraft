// webapp/src/IntroPlanet.jsx
import { useMemo, useState } from "react";
import "./IntroPlanet.css";

export default function IntroPlanet({ onEnter }) {
  const [leaving, setLeaving] = useState(false);

  const planetSrc = useMemo(
    () => new URL("./assets/intro/planet.png", import.meta.url).href,
    []
  );

  const handleClick = () => {
    if (leaving) return;
    setLeaving(true);

    // даём fade-out, потом говорим App "войти"
    setTimeout(() => {
      onEnter?.();
    }, 520);
  };

  return (
    <div className={`introOverlay ${leaving ? "leaving" : ""}`}>
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
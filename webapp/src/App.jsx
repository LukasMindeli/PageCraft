import "./App.css";
import { PORTFOLIO } from "./PortfolioData";

function getImageHref(file) {
  return new URL(`./assets/Portfolio/${file}`, import.meta.url).href;
}

export default function App() {
  const item = PORTFOLIO[0];
  const img = getImageHref(item.image);

  return (
    <div className="container">
      <header className="topbar">
        <div className="brand">
          <h1>PageCraft</h1>
          <p>Портфолио сайтов • Vite + React</p>
        </div>

        <button className="iconBtn" aria-label="Меню">
          ☰
        </button>
      </header>

      <main style={{ marginTop: 18 }}>
        <h2 style={{ margin: "10px 0 14px" }}>Portfolio test</h2>

        <div
          style={{
            padding: 16,
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 18,
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(10px)",
            maxWidth: 520,
          }}
        >
          <img
            src={img}
            alt={item.title}
            style={{ width: "100%", borderRadius: 14, display: "block" }}
          />
          <h3 style={{ marginTop: 12, marginBottom: 6 }}>{item.title}</h3>
          <p style={{ marginTop: 0, opacity: 0.8 }}>{item.description}</p>
          <a href={item.url} target="_blank" rel="noreferrer">
            Открыть сайт
          </a>
        </div>
      </main>
    </div>
  );
}
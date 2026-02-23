import { useState } from "react";
import "./App.css";
import { PORTFOLIO } from "./PortfolioData";

function getImageHref(file) {
  return new URL(`./assets/Portfolio/${file}`, import.meta.url).href;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("portfolio");

  return (
    <div className="container">
      <header className="topbar">
        <div className="brand">
          <h1>PageCraft</h1>
          <p>Портфолио сайтов • Vite + React</p>
        </div>

        <button
          className="iconBtn"
          aria-label="Меню"
          onClick={() => setMenuOpen((v) => !v)}
        >
          ☰
        </button>

        {menuOpen && (
          <div className="dropdown">
            <button
              onClick={() => {
                setActiveTab("services");
                setMenuOpen(false);
              }}
            >
              Услуги
            </button>

            <button
              onClick={() => {
                setActiveTab("portfolio");
                setMenuOpen(false);
              }}
            >
              Портфолио
            </button>

            <button
              onClick={() => {
                setActiveTab("prices");
                setMenuOpen(false);
              }}
            >
              Цены
            </button>

            <button
              onClick={() => {
                setActiveTab("contacts");
                setMenuOpen(false);
              }}
            >
              Контакты
            </button>
          </div>
        )}
      </header>

      <main style={{ marginTop: 18 }}>
        <h2 style={{ margin: "10px 0 10px" }}>Portfolio test</h2>
        <p style={{ opacity: 0.7, marginTop: 0 }}>Active tab: {activeTab}</p>

        <div style={{ display: "grid", gap: 14 }}>
          {PORTFOLIO.map((item) => {
            const img = getImageHref(item.image);

            return (
              <div className="cardRow" key={item.id}>
                <div className="cardThumb">
                  <img src={img} alt={item.title} />
                </div>

                <div className="cardBody">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a
                    className="cardLink"
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Открыть сайт
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
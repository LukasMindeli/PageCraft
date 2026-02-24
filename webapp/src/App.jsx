import { useMemo, useState } from "react";
import SpaceBackground from "./SpaceBackground";
import "./App.css";
import { PORTFOLIO } from "./PortfolioData";

function getImageHref(file) {
  return new URL(`./assets/Portfolio/${file}`, import.meta.url).href;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    // если поиск НЕ пустой — ищем по всем карточкам (игнорируем таб)
    if (q) {
      return PORTFOLIO.filter((x) => {
        const hay = [
          x.title,
          x.description,
          x.url,
          (x.tags || []).join(" "),
          x.tab,
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    // если поиск пустой — фильтруем по активному табу
    return PORTFOLIO.filter((x) => x.tab === activeTab);
  }, [query, activeTab]);

  return (
    <div className="container">
      <SpaceBackground />

      <header className="topbar">
        <div className="brand">
          <h1>PageCraft</h1>
          <p>Портфолио сайтов • Vite + React</p>
        </div>

        <div className="searchWrap">
          <input
            className="searchInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по портфолио…"
            aria-label="Поиск"
          />
          {query.trim() !== "" && (
            <button
              className="clearBtn"
              onClick={() => setQuery("")}
              aria-label="Очистить"
            >
              ✕
            </button>
          )}
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

      <main className="main">
        <h2 className="pageTitle">
          {query.trim() ? "Результаты поиска" : "Портфолио"}
        </h2>

        <p className="pageSub">
          {query.trim()
            ? `Найдено: ${visible.length}`
            : `Активная категория: ${activeTab}`}
        </p>

        <div className="list">
          {visible.map((item) => {
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
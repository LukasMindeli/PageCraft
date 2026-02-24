// webapp/src/App.jsx
import { useMemo, useState } from "react";
import "./App.css";

import PlanetsBackground from "./PlanetsBackground";
import { PORTFOLIO } from "./PortfolioData";
import { SERVICES, PRICES, CONTACTS } from "./ContentData";

function getImageHref(file) {
  return new URL(`./assets/Portfolio/${file}`, import.meta.url).href;
}

const PAGE_META = {
  home: {
    title: "PageCraft",
    desc:
      "Ми займаємося розробкою веб-сторінок і міні веб-додатків: меню для закладів, портфоліо, лендінги та Telegram WebApp.",
  },
  services: {
    title: "Послуги",
    desc:
      "Розробка сайтів і webapp: швидкі лендінги, меню, портфоліо, адаптив під телефон, деплой на Vercel.",
  },
  portfolio: {
    title: "Портфоліо",
    desc:
      "Добірка наших проєктів. Натискай «Відкрити сайт», щоб подивитися живі сторінки.",
  },
  prices: {
    title: "Ціни",
    desc: "Пакети та вартість розробки. Підберемо варіант під задачу й бюджет.",
  },
  contacts: {
    title: "Контакти",
    desc: "Зв’язок для замовлення розробки та питань: Telegram / Email.",
  },
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const meta = PAGE_META[activeTab] || PAGE_META.home;

  const visible = useMemo(() => {
    if (activeTab === "portfolio") {
      return PORTFOLIO.filter((x) => x.tab === "portfolio");
    }
    return [];
  }, [activeTab]);

  return (
    <div className="container">
      <PlanetsBackground />

      <header className="topbar">
        {/* Заголовок вкладки СВЕРХУ вместо поиска */}
        <div className="topTitle">{meta.title}</div>

        <button
          className={`iconBtn ${menuOpen ? "active" : ""}`}
          aria-label="Меню"
          onClick={() => setMenuOpen((v) => !v)}
          type="button"
        >
          ☰
        </button>

        {menuOpen && (
          <div className="dropdown">
            <button
              type="button"
              onClick={() => {
                setActiveTab("home");
                setMenuOpen(false);
              }}
            >
              Головна
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("services");
                setMenuOpen(false);
              }}
            >
              Послуги
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("portfolio");
                setMenuOpen(false);
              }}
            >
              Портфоліо
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("prices");
                setMenuOpen(false);
              }}
            >
              Ціни
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("contacts");
                setMenuOpen(false);
              }}
            >
              Контакти
            </button>
          </div>
        )}
      </header>

      <main className="main">
        {/* Внизу остаётся описание вкладки */}
        <p className="pageSub">{meta.desc}</p>

        {activeTab === "home" && (
          <div style={{ opacity: 0.85, lineHeight: 1.45, marginBottom: 14 }}>
            Відкрий «Портфоліо», щоб побачити проєкти. У «Послуги/Ціни/Контакти» —
            інформація про розробку.
          </div>
        )}

        {activeTab === "services" && (
          <div className="sectionGrid">
            {SERVICES.map((s) => (
              <div className="miniCard" key={s.id}>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "prices" && (
          <div className="sectionGrid">
            {PRICES.map((p) => (
              <div className="miniCard" key={p.id}>
                <h3
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <span>{p.title}</span>
                  <span style={{ opacity: 0.9 }}>{p.price}</span>
                </h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="sectionGrid">
            {CONTACTS.map((c) => (
              <a
                className="miniLinkCard"
                key={c.id}
                href={c.href}
                target="_blank"
                rel="noreferrer"
              >
                <div style={{ opacity: 0.7, fontSize: 12 }}>{c.label}</div>
                <div style={{ fontSize: 15 }}>{c.value}</div>
              </a>
            ))}
          </div>
        )}

        {activeTab === "portfolio" && (
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
                      Відкрити сайт
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
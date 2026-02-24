import { useMemo, useState } from "react";
import SpaceBackground from "./SpaceBackground";
import "./App.css";
import { PORTFOLIO } from "./PortfolioData";
import { SERVICES, PRICES, CONTACTS } from "./ContentData";

function getImageHref(file) {
  return new URL(`./assets/Portfolio/${file}`, import.meta.url).href;
}

const PAGE_META = {
  home: {
    title: "PageCraft",
    desc: "Мы занимаемся разработкой веб-страниц и мини-веб-приложений: меню для заведений, портфолио, лендинги и Telegram-webapp.",
  },
  services: {
    title: "Услуги",
    desc: "Разработка сайтов и webapp: быстрые лендинги, меню, портфолио, адаптив под телефон, деплой на Vercel, подключение Telegram-бота.",
  },
  portfolio: {
    title: "Портфолио",
    desc: "Подборка наших проектов. Нажимай «Открыть сайт», чтобы посмотреть живые страницы.",
  },
  prices: {
    title: "Цены",
    desc: "Пакеты и стоимость разработки. Подберём вариант под задачу и бюджет.",
  },
  contacts: {
    title: "Контакты",
    desc: "Связь для заказа разработки и вопросов: Telegram / почта / ссылки.",
  },
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home"); // главная по умолчанию
  const [query, setQuery] = useState("");

  const isSearching = query.trim() !== "";
  const meta = PAGE_META[activeTab] || PAGE_META.home;

  // visible: список карточек портфолио
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    // если поиск НЕ пустой — ищем по всем (игнорируем таб)
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

    // если поиск пустой — портфолио показываем только на вкладке portfolio
    if (activeTab === "portfolio") {
      return PORTFOLIO.filter((x) => x.tab === "portfolio");
    }

    return [];
  }, [query, activeTab]);

  const pageTitle = isSearching ? "Результаты поиска" : meta.title;
  const pageDesc = isSearching ? `Найдено: ${visible.length}` : meta.desc;

  return (
    <div className="container">
      <SpaceBackground />

      <header className="topbar">
        <div className="brand">
          <h1>PageCraft</h1>
          <p>Веб-разработка • Vite + React • Telegram WebApp</p>
        </div>

        <div className="searchWrap">
          <input
            className="searchInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по проектам…"
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
                setActiveTab("home");
                setMenuOpen(false);
              }}
            >
              Главная
            </button>

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
        <h2 className="pageTitle">{pageTitle}</h2>
        <p className="pageSub">{pageDesc}</p>

        {/* Home */}
        {!isSearching && activeTab === "home" && (
          <div style={{ opacity: 0.85, lineHeight: 1.45, marginBottom: 14 }}>
            Открой «Портфолио», чтобы увидеть проекты. В «Услуги/Цены/Контакты» —
            информация о разработке. Поиск сверху ищет по всем проектам.
          </div>
        )}

        {/* Services */}
        {!isSearching && activeTab === "services" && (
          <div className="sectionGrid">
            {SERVICES.map((s) => (
              <div className="miniCard" key={s.id}>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Prices */}
        {!isSearching && activeTab === "prices" && (
          <div className="sectionGrid">
            {PRICES.map((p) => (
              <div className="miniCard" key={p.id}>
                <h3 style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <span>{p.title}</span>
                  <span style={{ opacity: 0.9 }}>{p.price}</span>
                </h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Contacts */}
        {!isSearching && activeTab === "contacts" && (
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

        {/* Portfolio cards (search OR portfolio tab) */}
        {(isSearching || activeTab === "portfolio") && (
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
        )}
      </main>
    </div>
  );
}
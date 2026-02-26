// webapp/src/App.jsx
import { useMemo, useState } from "react";
import "./App.css";

import PlanetsBackground from "./PlanetsBackground";
import { PORTFOLIO } from "./PortfolioData";
import { SERVICES, PRICES, CONTACTS, FAQ, PROCESS } from "./ContentData";

function getImageHref(file) {
  return new URL(`./assets/Portfolio/${file}`, import.meta.url).href;
}

const PAGE_META = {
  home: {
    title: "PageCraft",
    desc:
      "Створюємо веб-сторінки та міні web-додатки: меню для закладів, портфоліо, лендінги. Строгий дизайн, адаптив під телефон, чистий деплой на Vercel.",
  },
  services: {
    title: "Послуги",
    desc:
      "Розробка сайтів і webapp: лендінги, меню, портфоліо. Адаптив, базова структура під пошук, швидкий запуск.",
  },
  portfolio: {
    title: "Портфоліо",
    desc:
      "Добірка наших проєктів. Натискай «Відкрити сайт», щоб подивитися живі сторінки.",
  },
  prices: {
    title: "Ціни",
    desc:
      "Пакети для різних задач. Вартість залежить від обсягу та складності — підкажемо оптимальний варіант.",
  },
  contacts: {
    title: "Контакти",
    desc:
      "Напиши нам у Telegram — швидко уточнимо задачу та запропонуємо формат реалізації.",
  },
};

function Section({ title, desc, children }) {
  return (
    <section className="panel section">
      <div className="sectionHead">
        <h2 className="h2">{title}</h2>
        {desc ? <p className="muted">{desc}</p> : null}
      </div>
      {children}
    </section>
  );
}

function PrimaryCTA() {
  const tg = CONTACTS.find((x) => x.id === "telegram");
  return (
    <a className="btn btnPrimary" href={tg?.href} target="_blank" rel="noreferrer">
      Написати в Telegram
    </a>
  );
}

function SecondaryCTA() {
  return (
    <button className="btn btnGhost" type="button">
      Подивитися портфоліо ↓
    </button>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faqItem ${open ? "open" : ""}`}>
      <button className="faqQ" type="button" onClick={() => setOpen((v) => !v)}>
        <span>{q}</span>
        <span className="faqIcon">{open ? "–" : "+"}</span>
      </button>
      <div className="faqA">{a}</div>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const meta = PAGE_META[activeTab] || PAGE_META.home;

  const visiblePortfolio = useMemo(() => {
    if (activeTab === "portfolio") {
      return PORTFOLIO.filter((x) => x.tab === "portfolio");
    }
    return [];
  }, [activeTab]);

  const topTitle = meta.title;

  return (
    <div className="appRoot">
      {/* BACKGROUND LAYERS: black -> stars -> planets */}
      <PlanetsBackground />

      {/* CONTENT */}
      <div className="container">
        <header className="topbar">
          {/* Title moved to topbar (where search used to be) */}
          <div className="topTitle" title={topTitle}>
            {topTitle}
          </div>

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

        {/* HERO */}
        {activeTab === "home" && (
          <>
            <section className="panel hero">
              <h1 className="h1">
                Строгі web-сторінки <span className="accent">в космічній айдентиці</span>
              </h1>

              <p className="heroText">
                Робимо лендінги, меню для закладів, портфоліо та міні web-додатки.
                Фокус — охайний інтерфейс, адаптив під телефон та швидкий запуск.
              </p>

              <div className="heroActions">
                <PrimaryCTA />
                <a className="btn btnGhost" href="#portfolioTeaser">
                  Переглянути приклади
                </a>
              </div>

              <div className="heroMeta muted">
                {PAGE_META.home.desc}
              </div>
            </section>

            {/* SERVICES PREVIEW */}
            <Section title="Послуги" desc="Коротко — що саме можемо зробити для вашої задачі.">
              <div className="grid3">
                {SERVICES.map((s) => (
                  <div className="cardMini" key={s.id}>
                    <div className="cardMiniTitle">{s.title}</div>
                    <div className="muted">{s.desc}</div>
                  </div>
                ))}
              </div>
            </Section>

            {/* PROCESS */}
            <Section title="Як ми працюємо" desc="Простий і прозорий процес без зайвого шуму.">
              <div className="grid4">
                {PROCESS.map((p) => (
                  <div className="cardStep" key={p.id}>
                    <div className="stepNum">{p.step}</div>
                    <div className="cardMiniTitle">{p.title}</div>
                    <div className="muted">{p.desc}</div>
                  </div>
                ))}
              </div>
            </Section>

            {/* PRICES */}
            <Section title="Ціни" desc="Всі ціни в гривнях. Деталі уточнюємо після короткого брифу.">
              <div className="grid3">
                {PRICES.map((p) => (
                  <div className={`cardPrice ${p.featured ? "featured" : ""}`} key={p.id}>
                    <div className="priceTop">
                      <div className="cardMiniTitle">{p.title}</div>
                      <div className="price">{p.price}</div>
                    </div>

                    <ul className="listBullets">
                      {p.items.map((it, idx) => (
                        <li key={idx}>{it}</li>
                      ))}
                    </ul>

                    <a className="btn btnGhost" href={CONTACTS.find((x) => x.id === "telegram")?.href} target="_blank" rel="noreferrer">
                      Замовити
                    </a>
                  </div>
                ))}
              </div>
            </Section>

            {/* PORTFOLIO TEASER */}
            <Section
              title="Портфоліо"
              desc="Кілька прикладів. Повний список — у вкладці «Портфоліо»."
            >
              <div id="portfolioTeaser" className="list">
                {PORTFOLIO.filter((x) => x.tab === "portfolio")
                  .slice(0, 4)
                  .map((item) => {
                    const img = getImageHref(item.image);
                    return (
                      <div className="cardRow" key={item.id}>
                        <div className="cardThumb">
                          <img src={img} alt={item.title} loading="lazy" />
                        </div>
                        <div className="cardBody">
                          <h3 className="h3">{item.title}</h3>
                          <p className="muted">{item.description}</p>
                          <a className="btn btnGhost" href={item.url} target="_blank" rel="noreferrer">
                            Відкрити сайт
                          </a>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div style={{ marginTop: 14 }}>
                <button
                  className="btn btnPrimary"
                  type="button"
                  onClick={() => setActiveTab("portfolio")}
                >
                  Відкрити все портфоліо
                </button>
              </div>
            </Section>

            {/* FAQ */}
            <Section title="FAQ" desc="Відповіді на часті запитання.">
              <div className="faq">
                {FAQ.map((f) => (
                  <FAQItem key={f.id} q={f.q} a={f.a} />
                ))}
              </div>
            </Section>

            {/* CONTACTS */}
            <Section title="Контакти" desc="Найшвидше — Telegram. Email теж працює.">
              <div className="contactsRow">
                <PrimaryCTA />
                <div className="contactsMini">
                  {CONTACTS.map((c) => (
                    <a
                      className="contactChip"
                      key={c.id}
                      href={c.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="muted contactLabel">{c.label}</div>
                      <div className="contactValue">{c.value}</div>
                    </a>
                  ))}
                </div>
              </div>
            </Section>
          </>
        )}

        {/* SERVICES TAB */}
        {activeTab === "services" && (
          <>
            <section className="panel heroSmall">
              <h1 className="h1">{meta.title}</h1>
              <p className="muted">{meta.desc}</p>
            </section>

            <Section title="Що ми робимо" desc="Коротко і по суті.">
              <div className="grid3">
                {SERVICES.map((s) => (
                  <div className="cardMini" key={s.id}>
                    <div className="cardMiniTitle">{s.title}</div>
                    <div className="muted">{s.desc}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Як почати" desc="Напиши в Telegram — уточнимо задачу і запропонуємо формат.">
              <PrimaryCTA />
            </Section>
          </>
        )}

        {/* PRICES TAB */}
        {activeTab === "prices" && (
          <>
            <section className="panel heroSmall">
              <h1 className="h1">{meta.title}</h1>
              <p className="muted">{meta.desc}</p>
            </section>

            <Section title="Пакети" desc="Вартість у гривнях. Остаточно — після короткого брифу.">
              <div className="grid3">
                {PRICES.map((p) => (
                  <div className={`cardPrice ${p.featured ? "featured" : ""}`} key={p.id}>
                    <div className="priceTop">
                      <div className="cardMiniTitle">{p.title}</div>
                      <div className="price">{p.price}</div>
                    </div>
                    <ul className="listBullets">
                      {p.items.map((it, idx) => (
                        <li key={idx}>{it}</li>
                      ))}
                    </ul>
                    <PrimaryCTA />
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* CONTACTS TAB */}
        {activeTab === "contacts" && (
          <>
            <section className="panel heroSmall">
              <h1 className="h1">{meta.title}</h1>
              <p className="muted">{meta.desc}</p>
            </section>

            <Section title="Зв’язок" desc="Натискай — відкриється відповідний канал.">
              <div className="contactsGrid">
                {CONTACTS.map((c) => (
                  <a
                    className="contactCard"
                    key={c.id}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="muted">{c.label}</div>
                    <div className="contactCardValue">{c.value}</div>
                  </a>
                ))}
              </div>

              <div style={{ marginTop: 14 }}>
                <PrimaryCTA />
              </div>
            </Section>

            <Section title="FAQ" desc="Щоб не витрачати час на зайві уточнення.">
              <div className="faq">
                {FAQ.map((f) => (
                  <FAQItem key={f.id} q={f.q} a={f.a} />
                ))}
              </div>
            </Section>
          </>
        )}

        {/* PORTFOLIO TAB */}
        {activeTab === "portfolio" && (
          <>
            <section className="panel heroSmall">
              <h1 className="h1">{meta.title}</h1>
              <p className="muted">{meta.desc}</p>
            </section>

            <Section title="Проєкти" desc="Відкривай і дивись живі сторінки.">
              <div className="list">
                {visiblePortfolio.map((item) => {
                  const img = getImageHref(item.image);
                  return (
                    <div className="cardRow" key={item.id}>
                      <div className="cardThumb">
                        <img src={img} alt={item.title} loading="lazy" />
                      </div>
                      <div className="cardBody">
                        <h3 className="h3">{item.title}</h3>
                        <p className="muted">{item.description}</p>
                        <a className="btn btnGhost" href={item.url} target="_blank" rel="noreferrer">
                          Відкрити сайт
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  );
}
import "./App.css";
import { PORTFOLIO } from "./PortfolioData";

function getImageHref(file) {
  return new URL(`./assets/Portfolio/${file}`, import.meta.url).href;
}

export default function App() {
  const item = PORTFOLIO[0];
  const img = getImageHref(item.image);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Portfolio test</h1>

      <div
        style={{
          marginTop: 16,
          padding: 16,
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 12,
          maxWidth: 520,
        }}
      >
        <img
          src={img}
          alt={item.title}
          style={{ width: "100%", borderRadius: 12, display: "block" }}
        />
        <h2 style={{ marginTop: 12 }}>{item.title}</h2>
        <p style={{ opacity: 0.8 }}>{item.description}</p>
        <a href={item.url} target="_blank" rel="noreferrer">
          Открыть сайт
        </a>
      </div>
    </div>
  );
}
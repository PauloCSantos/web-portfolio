import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App";
import { initI18n } from "./app/providers/i18n/i18n";

try {
  await initI18n();
} catch (error) {
  console.error("[i18n] Failed to initialize", error);
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element #root not found");
}

createRoot(root).render(<App />);

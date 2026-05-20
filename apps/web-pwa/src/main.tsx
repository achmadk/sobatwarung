import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import { initAuth } from "./services/auth.js";
import { setupAutoSync } from "./services/sync.js";

async function init() {
  await initAuth();
  setupAutoSync();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

init();

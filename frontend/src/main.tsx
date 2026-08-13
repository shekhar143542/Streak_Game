import { createRoot } from "react-dom/client";

import { App } from "./App";
import "./style.css";

const appElement = document.querySelector<HTMLDivElement>("#app");

if (!appElement) {
	throw new Error("App container is missing.");
}

createRoot(appElement).render(<App />);

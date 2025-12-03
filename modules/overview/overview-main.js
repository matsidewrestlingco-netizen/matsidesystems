
import { initSocketClient } from "../core/socket.js";
import { initOverviewView, updateOverviewView } from "./overview-render.js";

const serverDot = document.getElementById("serverDot");
const serverStatusText = document.getElementById("serverStatusText");
const serverMeta = document.getElementById("serverMeta");

function setServerStatus(ok) {
  if (!serverDot || !serverStatusText) return;
  serverDot.style.background = ok ? "#4caf50" : "#d32f2f";
  serverStatusText.textContent = ok ? "Connected" : "Disconnected";
}

function setLastUpdate() {
  if (!serverMeta) return;
  const t = new Date().toLocaleTimeString();
  serverMeta.textContent = `Last update: ${t}`;
}

const view = initOverviewView();
const connEl = document.getElementById("ov-conn");

function handleStateUpdate(state) {
  if (!state || !state.mats || !view) return;
  if (connEl) connEl.textContent = "connected";
  updateOverviewView(view, state.mats);
}

initSocketClient({
  role: "overview",
  mat: null,
  onState: (state) => {
    setServerStatus(true);
    setLastUpdate();
    if (connEl) connEl.textContent = "connected";
    handleStateUpdate(state);
  }
}).on("disconnect", () => {
  setServerStatus(false);
});

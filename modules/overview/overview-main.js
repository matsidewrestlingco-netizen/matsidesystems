// ================================================
// FILE: modules/overview/overview-main.js
// Socket wiring for 4-mat overview
// ================================================
import { initSocketClient } from "../core/socket.js";
import { initOverviewView, updateOverviewView } from "./overview-render.js";

const view = initOverviewView();
const connEl = document.getElementById("ov-conn");

function handleStateUpdate(state) {
  if (connEl) connEl.textContent = "connected";
  if (!state || !state.mats || !view) return;
  updateOverviewView(view, state.mats);
}

initSocketClient({
  role: "overview",
  mat: null,
  onState: handleStateUpdate
});

// ============================================================
// FILE: modules/ui/skins.js
// Global theming system for Control Panel, Scoreboard, Overview
// ============================================================

// ----------------------------------------
// 1. Available Skins
// ----------------------------------------
export const SKINS = {
  "black-glass": {
    name: "Black Glass",
    cssUrl: "/css/skins/black-glass.css"
  },
  "blue-glass": {
    name: "Blue Glass",
    cssUrl: "/css/skins/blue-glass.css"
  },
  "classic": {
    name: "Classic",
    cssUrl: "/css/skins/classic.css"
  },
  "dark-pro": {
    name: "Dark Pro",
    cssUrl: "/css/skins/dark-pro.css"
  }
};

// ----------------------------------------
// 2. Load a skin stylesheet
// ----------------------------------------
function applySkin(skinKey) {
  const skin = SKINS[skinKey];
  if (!skin) return;

  let link = document.getElementById("skinStylesheet");
  if (!link) {
    link = document.createElement("link");
    link.id = "skinStylesheet";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }

  link.href = skin.cssUrl;

  // Save locally
  localStorage.setItem("matside-skin", skinKey);
}

// ----------------------------------------
// 3. Initialize skin system on Scoreboard / Overview / Control
// ----------------------------------------
export function initSkinClient(socket) {
  // Step 1: Load local skin immediately
  const local = localStorage.getItem("matside-skin");
  if (local && SKINS[local]) {
    applySkin(local);
  }

  // Step 2: Wait for hub broadcast
  if (socket && socket.on) {
    socket.on("globalSkin", (skinKey) => {
      if (SKINS[skinKey]) {
        applySkin(skinKey);
      }
    });
  }
}

// ----------------------------------------
// 4. Hub skin controller (used only in hub.html)
// ----------------------------------------
export function initSkinHub(serverUrl) {
  const socket = io(serverUrl);

  let initialSkin = localStorage.getItem("matside-hub-skin") || "black-glass";

  function setGlobalSkin(key) {
    if (!SKINS[key]) return;

    localStorage.setItem("matside-hub-skin", key);
    socket.emit("setGlobalSkin", key);
  }

  return {
    initialSkin,
    setGlobalSkin,
    socket
  };
}

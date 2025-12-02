// ============================================================
// FILE: modules/ui/skins.js
// Global theming system for all front-end pages
// ============================================================

// IMPORTANT: Use RELATIVE PATHS for GitHub Pages
export const SKINS = {
  "black-glass": {
    name: "Black Glass",
    cssUrl: "./css/skins/black-glass.css"
  },
  "blue-glass": {
    name: "Blue Glass",
    cssUrl: "./css/skins/blue-glass.css"
  },
  "classic": {
    name: "Classic",
    cssUrl: "./css/skins/classic.css"
  },
  "dark-pro": {
    name: "Dark Pro",
    cssUrl: "./css/skins/dark-pro.css"
  }
};

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

  localStorage.setItem("matside-skin", skinKey);
}

// ----------------------------------------
export function initSkinClient(socket) {
  const local = localStorage.getItem("matside-skin");
  if (local && SKINS[local]) applySkin(local);

  if (socket && socket.on) {
    socket.on("globalSkin", key => {
      if (SKINS[key]) applySkin(key);
    });
  }
}

// ----------------------------------------
export function initSkinHub(serverUrl) {
  const socket = io(serverUrl);
  const initialSkin = localStorage.getItem("matside-hub-skin") || "black-glass";

  function setGlobalSkin(key) {
    if (!SKINS[key]) return;
    localStorage.setItem("matside-hub-skin", key);
    socket.emit("setGlobalSkin", key);
  }

  return { initialSkin, setGlobalSkin, socket };
}

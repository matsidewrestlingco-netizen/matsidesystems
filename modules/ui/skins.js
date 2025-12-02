// =========================================================
// FILE: modules/ui/skins.js
// Global theme system for ALL Matside clients
// =========================================================

// Available skins
export const SKINS = {
  "black-glass": {
    name: "Black Glass",
    cssUrl: "./css/skins/black-glass.css"
  },
  "dark-pro": {
    name: "Dark Pro",
    cssUrl: "./css/skins/dark-pro.css"
  },
  "classic": {
    name: "Classic",
    cssUrl: "./css/skins/classic.css"
  },
  "blue-glass": {
    name: "Blue Glass",
    cssUrl: "./css/skins/blue-glass.css"
  }
};

// ---------------------------------------------------------
// Apply a skin to the DOM immediately
// ---------------------------------------------------------
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

  // persist setting for reload
  localStorage.setItem("matside-skin", skinKey);
}

// ---------------------------------------------------------
// Client-side skin system (Scoreboard / Overview / Control)
// ---------------------------------------------------------
export function initSkinClient(socket) {
  // 1️⃣ Always apply saved skin immediately
  const local = localStorage.getItem("matside-skin");
  if (local && SKINS[local]) {
    applySkin(local);
  } else {
    // fallback default
    applySkin("black-glass");
  }

  // 2️⃣ If a socket is available, listen for remote skin changes
  if (socket && socket.on) {
    socket.on("globalSkin", (key) => {
      if (SKINS[key]) applySkin(key);
    });
  }
}

// ---------------------------------------------------------
// Hub-only skin controller (lets admin change the theme)
// ---------------------------------------------------------
export function initSkinHub(serverUrl) {
  const socket = io(serverUrl);

  let initialSkin =
    localStorage.getItem("matside-hub-skin") || "black-glass";

  function setGlobalSkin(key) {
    if (!SKINS[key]) return;

    localStorage.setItem("matside-hub-skin", key);
    socket.emit("setGlobalSkin", key);
  }

  return {
    initialSkin,
    setGlobalSkin
  };
}

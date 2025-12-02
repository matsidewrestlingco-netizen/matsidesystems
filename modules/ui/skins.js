// modules/ui/skins.js
// -------------------------------------------------------
// Global theming system for all clients
// -------------------------------------------------------

export const SKINS = {
  "dark-pro": {
    name: "Dark Pro",
    cssUrl: "/skins/dark-pro.css"
  },
  "classic": {
    name: "Classic",
    cssUrl: "/skins/classic.css"
  },
  "blueglass": {
    name: "Blue Glass",
    cssUrl: "/skins/blue-glass.css"
  }
};

// Loads the stylesheet dynamically
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

export function initSkinClient(socket) {
  const local = localStorage.getItem("matside-skin");
  if (local) applySkin(local);

  socket.on("globalSkin", (skinKey) => {
    applySkin(skinKey);
  });
}

export function initSkinHub(serverUrl) {
  const socket = io(serverUrl);

  let initialSkin = localStorage.getItem("matside-hub-skin") || "dark-pro";

  function setGlobalSkin(key) {
    localStorage.setItem("matside-hub-skin", key);
    socket.emit("setGlobalSkin", key);
  }

  return { setGlobalSkin, initialSkin };
}

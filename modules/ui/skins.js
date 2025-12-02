// -------------------------------------------------------
// SKINS — Global theme registry
// -------------------------------------------------------
export const SKINS = {
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
  },
  "black-glass": {
    name: "Black Glass",
    cssUrl: "./css/skins/black-glass.css"
  }
};

// -------------------------------------------------------
// Apply theme stylesheet
// -------------------------------------------------------
export function applySkin(skinKey) {
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

// -------------------------------------------------------
// Client-side skin loader (scoreboard, overview, control)
// -------------------------------------------------------
export function initSkinClient(socket) {
  const local = localStorage.getItem("matside-skin");
  if (local) applySkin(local);

  // Listen for admin-applied global theme
  if (socket) {
    socket.on("globalSkin", (skinKey) => {
      applySkin(skinKey);
    });
  }
}

// -------------------------------------------------------
// Hub (admin) theme controller
// -------------------------------------------------------
export function initSkinHub(serverUrl) {
  const socket = io(serverUrl);

  let initialSkin = localStorage.getItem("matside-hub-skin") || "dark-pro";

  function setGlobalSkin(key) {
    localStorage.setItem("matside-hub-skin", key);
    socket.emit("setGlobalSkin", key);
  }

  return { setGlobalSkin, initialSkin, socket };
}

// modules/ui/skins.js
// Central skin system for all Matside clients (hub, control, scoreboard, overview)

// --- SKIN DEFINITIONS ---
// All skins are just sets of CSS variables.
export const SKINS = {
  blackGlass: {
    name: "Black Glass (Default)",
    vars: {
      "--ms-bg": "#050608",
      "--ms-surface": "#111218",
      "--ms-surface-strong": "#0b0d11",
      "--ms-accent": "#1e88e5",
      "--ms-red": "#e53935",
      "--ms-green": "#43a047",
      "--ms-gold": "#fbc02d",
      "--ms-muted": "#9aa0a6",
      "--ms-border-subtle": "rgba(255,255,255,0.08)"
    }
  },
  classicDark: {
    name: "Classic Dark",
    vars: {
      "--ms-bg": "#000000",
      "--ms-surface": "#151515",
      "--ms-surface-strong": "#101010",
      "--ms-accent": "#2979ff",
      "--ms-red": "#ff5252",
      "--ms-green": "#69f0ae",
      "--ms-gold": "#ffd600",
      "--ms-muted": "#b0bec5",
      "--ms-border-subtle": "rgba(255,255,255,0.12)"
    }
  },
  brightTournament: {
    name: "Tournament Bright",
    vars: {
      "--ms-bg": "#f5f5f5",
      "--ms-surface": "#ffffff",
      "--ms-surface-strong": "#fafafa",
      "--ms-accent": "#1e88e5",
      "--ms-red": "#d32f2f",
      "--ms-green": "#2e7d32",
      "--ms-gold": "#fbc02d",
      "--ms-muted": "#5f6368",
      "--ms-border-subtle": "rgba(0,0,0,0.12)"
    }
  },
  highContrast: {
    name: "High Contrast",
    vars: {
      "--ms-bg": "#000000",
      "--ms-surface": "#000000",
      "--ms-surface-strong": "#000000",
      "--ms-accent": "#ffffff",
      "--ms-red": "#ff0000",
      "--ms-green": "#00ff00",
      "--ms-gold": "#ffff00",
      "--ms-muted": "#ffffff",
      "--ms-border-subtle": "rgba(255,255,255,0.8)"
    }
  }
};

const DEFAULT_SKIN = "blackGlass";
const STORAGE_KEY = "matside-skin";

function applyVars(vars) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => {
    root.style.setProperty(k, v);
  });
}

function resolveSkinName(name) {
  if (name && SKINS[name]) return name;
  return DEFAULT_SKIN;
}

// Local-only application (no socket)
export function applySkinLocal(skinName) {
  const name = resolveSkinName(skinName);
  const skin = SKINS[name];
  if (!skin) return;
  applyVars(skin.vars);
  try {
    localStorage.setItem(STORAGE_KEY, name);
  } catch (e) {
    // ignore
  }
  return name;
}

// Client mode: listens for themeUpdate from server and applies it
export function initSkinClient(serverUrl = "https://scoreboard-server-er33.onrender.com") {
  // 1) Apply last saved locally (may change once server pushes)
  let saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
  applySkinLocal(saved || DEFAULT_SKIN);

  // 2) Connect socket JUST for theme updates
  const socket = io(serverUrl, { transports:["websocket","polling"] });

  socket.on("themeUpdate", (skinName) => {
    applySkinLocal(skinName);
  });

  return socket;
}

// Hub mode: acts as MASTER and broadcasts changes
export function initSkinHub(serverUrl = "https://scoreboard-server-er33.onrender.com") {
  const socket = io(serverUrl, { transports:["websocket","polling"] });

  // Apply last local selection immediately
  let saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
  const initial = applySkinLocal(saved || DEFAULT_SKIN);

  // When connecting, server will usually broadcast currentSkin back as themeUpdate.
  // We don't need to do anything special here.

  function setGlobalSkin(skinName) {
    const appliedName = applySkinLocal(skinName);
    socket.emit("themeUpdate", appliedName);
  }

  return { socket, setGlobalSkin, initialSkin: initial };
}

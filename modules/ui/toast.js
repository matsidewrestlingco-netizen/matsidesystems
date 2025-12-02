/* ============================================================
   Toast System v2.0 (Skin-Aware, Modular, Cross-App)
   ------------------------------------------------------------
   Works with: control.html, hub.html, overview.html,
               scoreboard.html, admin-events.html
   Uses global skin system via <html data-skin="">
   ============================================================ */

let toastContainer = null;

/* ------------------------------------------------------------
   Create container if missing
------------------------------------------------------------ */
function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    document.body.appendChild(toastContainer);
  }
}

/* ------------------------------------------------------------
   Main Toast API
------------------------------------------------------------ */
export function showToast(message, type = "info", duration = 3000) {
  ensureContainer();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  toast.innerHTML = `
    <div class="toast-msg">${message}</div>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => toast.classList.add("show"));

  // Auto-remove
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ------------------------------------------------------------
   Inject CSS with full skin support
------------------------------------------------------------ */
const toastCSS = `
#toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 5000;
  pointer-events: none;
}

/* Base toast */
.toast {
  min-width: 260px;
  max-width: 360px;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.25s ease, transform 0.25s ease;
  pointer-events: auto;
  backdrop-filter: blur(8px);
}

/* Visible state */
.toast.show {
  opacity: 1;
  transform: translateY(0);
}

/* ------------------------------
   Skin-aware coloring
   Using CSS variables controlled
   by skins.js via [data-skin="x"]
   ------------------------------ */

/* Info */
.toast-info {
  background: var(--toast-info-bg);
  color: var(--toast-info-text);
}

/* Success */
.toast-success {
  background: var(--toast-success-bg);
  color: var(--toast-success-text);
}

/* Warning */
.toast-warning {
  background: var(--toast-warning-bg);
  color: var(--toast-warning-text);
}

/* Error */
.toast-error {
  background: var(--toast-error-bg);
  color: var(--toast-error-text);
}
`;

/* Inject styles */
const style = document.createElement("style");
style.textContent = toastCSS;
document.head.appendChild(style);

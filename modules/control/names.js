// =======================================================
// File: /modules/control/names.js
// Handles Red / Green wrestler names (client-side only).
// =======================================================

export function initNames(ctx) {
  const { getCurrentMat } = ctx;

  const redInput = document.getElementById("redNameInput");
  const greenInput = document.getElementById("greenNameInput");

  // Local-only map: mat → { redName, greenName }
  const localNames = {};

  function currentNames() {
    const mat = getCurrentMat();
    if (!localNames[mat]) {
      localNames[mat] = { redName: "", greenName: "" };
    }
    return localNames[mat];
  }

  function syncInputs() {
    const { redName, greenName } = currentNames();
    if (redInput) redInput.value = redName;
    if (greenInput) greenInput.value = greenName;
  }

  redInput?.addEventListener("input", () => {
    currentNames().redName = redInput.value;
  });

  greenInput?.addEventListener("input", () => {
    currentNames().greenName = greenInput.value;
  });

  // If mat changes, sync inputs to that mat's stored names
  const matSelect = document.getElementById("matSelect");
  matSelect?.addEventListener("change", () => {
    syncInputs();
  });

  // Initial sync
  syncInputs();

  return { getNamesForMat: mat => localNames[mat] || { redName: "", greenName: "" } };
}


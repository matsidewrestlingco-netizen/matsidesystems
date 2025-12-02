// =======================================================
// File: /modules/scoreboard/scoreboard-render.js
// Uses universal segmentLabel()
// =======================================================

import { segmentLabel } from "../core/period-name.js";

export function renderScoreboard(state) {
  const matEl = document.getElementById("sbMat");
  const periodEl = document.getElementById("sbPeriod");
  const timeEl = document.getElementById("sbTime");
  const redNameEl = document.getElementById("sbRedName");
  const greenNameEl = document.getElementById("sbGreenName");
  const redScoreEl = document.getElementById("sbRedScore");
  const greenScoreEl = document.getElementById("sbGreenScore");

  if (!state) return;

  matEl.textContent = state.mat;
  periodEl.textContent = segmentLabel(state.segmentId, state.period);
  timeEl.textContent = state.timeFormatted;

  redNameEl.textContent = state.redName || "Red";
  greenNameEl.textContent = state.greenName || "Green";

  redScoreEl.textContent = state.red;
  greenScoreEl.textContent = state.green;
}

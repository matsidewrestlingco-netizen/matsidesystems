// ================================================
// FILE: modules/scoreboard/scoreboard-render.js
// Renders the full-screen Scoreboard 3.2 UI
// ================================================

function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds ?? 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

/**
 * Build the scoreboard DOM and return references
 * used for updates.
 */
export function initScoreboardView() {
  const root = document.getElementById("scoreboard-root");
  if (!root) {
    console.error("[scoreboard-render] #scoreboard-root not found");
    return null;
  }

  root.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "sb-wrapper";

  // Top row: MAT | TITLE | PERIOD
  const topRow = document.createElement("div");
  topRow.className = "sb-top-row";

  const matBox = document.createElement("div");
  matBox.className = "sb-mat-box";
  const matLabel = document.createElement("div");
  matLabel.className = "sb-mat-label";
  matLabel.textContent = "MAT";
  const matValue = document.createElement("div");
  matValue.className = "sb-mat-value";
  matValue.textContent = "1";
  matBox.appendChild(matLabel);
  matBox.appendChild(matValue);

  const titleBox = document.createElement("div");
  titleBox.className = "sb-title-box";
  titleBox.textContent = "MATSIDE SCOREBOARD";

  const periodBox = document.createElement("div");
  periodBox.className = "sb-period-box";
  const periodLabel = document.createElement("div");
  periodLabel.className = "sb-period-label";
  periodLabel.textContent = "PERIOD";
  const periodValue = document.createElement("div");
  periodValue.className = "sb-period-value";
  periodValue.textContent = "1";
  periodBox.appendChild(periodLabel);
  periodBox.appendChild(periodValue);

  topRow.appendChild(matBox);
  topRow.appendChild(titleBox);
  topRow.appendChild(periodBox);

  // Middle row: TIME label + timer
  const midRow = document.createElement("div");
  midRow.className = "sb-mid-row";

  const timeLabel = document.createElement("div");
  timeLabel.className = "sb-time-label";
  timeLabel.textContent = "TIME";

  const timeValue = document.createElement("div");
  timeValue.className = "sb-timer";
  timeValue.textContent = "01:00";

  midRow.appendChild(timeLabel);
  midRow.appendChild(timeValue);

  // Bottom row: RED & GREEN
  const bottomRow = document.createElement("div");
  bottomRow.className = "sb-bottom-row";

  const redBox = document.createElement("div");
  redBox.className = "sb-score-box sb-red";

  const redName = document.createElement("div");
  redName.className = "sb-name sb-name-red";
  redName.textContent = "RED WRESTLER";

  const redScore = document.createElement("div");
  redScore.className = "sb-score sb-score-red";
  redScore.textContent = "0";

  redBox.appendChild(redName);
  redBox.appendChild(redScore);

  const greenBox = document.createElement("div");
  greenBox.className = "sb-score-box sb-green";

  const greenName = document.createElement("div");
  greenName.className = "sb-name sb-name-green";
  greenName.textContent = "GREEN WRESTLER";

  const greenScore = document.createElement("div");
  greenScore.className = "sb-score sb-score-green";
  greenScore.textContent = "0";

  greenBox.appendChild(greenName);
  greenBox.appendChild(greenScore);

  bottomRow.appendChild(redBox);
  bottomRow.appendChild(greenBox);

  wrapper.appendChild(topRow);
  wrapper.appendChild(midRow);
  wrapper.appendChild(bottomRow);
  root.appendChild(wrapper);

  return {
    root,
    matEl: matValue,
    periodEl: periodValue,
    timeEl: timeValue,
    redScoreEl: redScore,
    greenScoreEl: greenScore,
    redNameEl: redName,
    greenNameEl: greenName
  };
}

/**
 * Update the scoreboard for a single mat.
 */
export function updateScoreboardView(view, matState, meta = {}) {
  if (!view || !matState) return;

  const {
    matEl,
    periodEl,
    timeEl,
    redScoreEl,
    greenScoreEl,
    redNameEl,
    greenNameEl
  } = view;

  const mat = meta.mat ?? 1;
  const period = matState.segmentLabel || matState.segmentId || matState.period || 1;
  const time = matState.time ?? 0;

  const redScore = matState.red ?? 0;
  const greenScore = matState.green ?? 0;
  const redName = matState.redName || "RED WRESTLER";
  const greenName = matState.greenName || "GREEN WRESTLER";

  if (matEl) matEl.textContent = mat;
  if (periodEl) periodEl.textContent = period;
  if (timeEl) timeEl.textContent = formatTime(time);

  if (redScoreEl) redScoreEl.textContent = redScore;
  if (greenScoreEl) greenScoreEl.textContent = greenScore;

  if (redNameEl) redNameEl.textContent = redName;
  if (greenNameEl) greenNameEl.textContent = greenName;
}


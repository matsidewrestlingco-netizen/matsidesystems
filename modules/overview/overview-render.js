// ============================================================
// FILE: modules/overview/overview-render.js
// Overview 3.2-A — scoreboard-matching UI
// ============================================================

/** Pretty segment formatter */
function prettySegment(seg) {
  if (!seg) return "";
  if (seg.startsWith("REG")) return seg.replace("REG", "");
  if (seg.startsWith("OT")) return "OT";
  if (seg.startsWith("TB")) return seg.toUpperCase();
  if (seg.startsWith("UT")) return "UT";
  return seg;
}

/** Time formatter */
function fmt(sec) {
  sec = Math.max(0, Math.floor(sec));
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/** Build initial UI */
export function initOverviewView() {
  const root = document.getElementById("overview-root");
  root.innerHTML = ""; // clear

  const cards = {};

  for (let m = 1; m <= 4; m++) {
    const card = document.createElement("div");
    card.className = "ov-card";
    card.innerHTML = `
      <div class="ov-top-row">
        <div class="ov-mat-box">
          <div class="ov-mat-label">MAT</div>
          <div class="ov-mat-value mat-${m}">${m}</div>
        </div>
        <div class="ov-title-box">MATSIDE</div>
        <div class="ov-period-box">
          <div class="ov-period-label">PERIOD</div>
          <div class="ov-period-value" id="p-${m}">1</div>
        </div>
      </div>

      <div class="ov-mid-row">
        <div class="ov-time-label">TIME</div>
        <div class="ov-timer" id="t-${m}">00:00</div>
      </div>

      <div class="ov-bottom-row">
        <div class="ov-score-box ov-red">
          <div class="ov-name" id="rn-${m}">RED</div>
          <div class="ov-score" id="rs-${m}">0</div>
        </div>
        <div class="ov-score-box ov-green">
          <div class="ov-name" id="gn-${m}">GREEN</div>
          <div class="ov-score" id="gs-${m}">0</div>
        </div>
      </div>
    `;
    root.appendChild(card);

    cards[m] = {
      period:  card.querySelector(`#p-${m}`),
      time:    card.querySelector(`#t-${m}`),
      rName:   card.querySelector(`#rn-${m}`),
      rScore:  card.querySelector(`#rs-${m}`),
      gName:   card.querySelector(`#gn-${m}`),
      gScore:  card.querySelector(`#gs-${m}`)
    };
  }

  return cards;
}

/** Update cards from state */
export function updateOverviewView(view, mats) {
  for (let m = 1; m <= 4; m++) {
    const state = mats[m];
    if (!state) continue;

    const v = view[m];
    v.period.textContent = prettySegment(state.segmentId);
    v.time.textContent = fmt(state.time);

    v.rName.textContent = state.redName || "RED";
    v.gName.textContent = state.greenName || "GREEN";

    v.rScore.textContent = state.red;
    v.gScore.textContent = state.green;
  }
}

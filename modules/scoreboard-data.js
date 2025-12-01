// modules/scoreboard-data.js
// Responsible for: socket connection + mapping server state → view model

const SERVER = "https://scoreboard-server-er33.onrender.com";

function getMatFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const m = Number(params.get("mat"));
  if (!Number.isFinite(m) || m < 1 || m > 4) return 1;
  return m;
}

function fmt(sec) {
  sec = Number(sec) || 0;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}

function mapSegmentToLabel(m) {
  if (m.segmentId) {
    switch (m.segmentId) {
      case "REG1": return "1";
      case "REG2": return "2";
      case "REG3": return "3";
      case "OT":   return "OT";
      case "TB1":  return "TB1";
      case "TB2":  return "TB2";
      case "UT":   return "UT";
    }
  }
  return m.period || 1;
}

function computeWinner(m, redScore, greenScore, time) {
  const diff = Math.abs(redScore - greenScore);
  const segId = m.segmentId || "REG1";
  const lateSegIds = ["REG3","OT","TB1","TB2","UT"];

  // Tech fall-like view
  if (lateSegIds.includes(segId) && diff >= 15) {
    return redScore > greenScore ? "red" : "green";
  }
  // Any segment that hits 0 and is non-tie
  if (time === 0 && diff > 0) {
    return redScore > greenScore ? "red" : "green";
  }
  return null;
}

export function initScoreboard(renderFn) {
  const mat = getMatFromQuery();

  // initial view model
  renderFn({
    mat,
    periodLabel: "1",
    timeLabel: "00:00",
    redName: "RED WRESTLER",
    greenName: "GREEN WRESTLER",
    redScore: 0,
    greenScore: 0,
    running: false,
    winner: null
  });

  const socket = io(SERVER, { transports: ["websocket","polling"] });

  socket.on("stateUpdate", (state) => {
    if (!state || !state.mats) return;
    const m = state.mats[mat];
    if (!m) return;

    const time = (typeof m.timeRemaining === "number") ? m.timeRemaining : (m.time ?? 0);
    const redScore = (m.player1 ?? m.red ?? 0);
    const greenScore = (m.player2 ?? m.green ?? 0);

    const vm = {
      mat,
      periodLabel: mapSegmentToLabel(m),
      timeLabel: fmt(time),
      redName: m.redName || "RED WRESTLER",
      greenName: m.greenName || "GREEN WRESTLER",
      redScore,
      greenScore,
      running: !!m.running,
      winner: computeWinner(m, redScore, greenScore, time),
      rawTime: time
    };

    renderFn(vm);
  });
}

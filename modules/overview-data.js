// modules/overview-data.js
// Socket connection + mapping mats[] → overview view model

const SERVER = "https://scoreboard-server-er33.onrender.com";

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

  if (lateSegIds.includes(segId) && diff >= 15) {
    return redScore > greenScore ? "red" : "green";
  }
  if (time === 0 && diff > 0) {
    return redScore > greenScore ? "red" : "green";
  }
  return null;
}

export function initOverview(renderFn) {
  const socket = io(SERVER, { transports: ["websocket","polling"] });

  // initial empty VM
  const initial = {};
  for (let mat = 1; mat <= 4; mat += 1) {
    initial[mat] = {
      mat,
      periodLabel: "1",
      timeLabel: "00:00",
      redScore: 0,
      greenScore: 0,
      running: false,
      winner: null,
      offline: true
    };
  }
  renderFn({ connection: "connecting", mats: initial });

  socket.on("connect", () => {
    renderFn((prev) => ({
      connection: "connected",
      mats: prev.mats
    }));
  });

  socket.on("disconnect", () => {
    renderFn((prev) => ({
      connection: "disconnected",
      mats: prev.mats
    }));
  });

  socket.on("stateUpdate", (state) => {
    if (!state || !state.mats) return;

    const matsVm = {};
    for (let mat = 1; mat <= 4; mat += 1) {
      const m = state.mats[mat];
      if (!m) {
        matsVm[mat] = {
          mat,
          periodLabel: "–",
          timeLabel: "--:--",
          redScore: 0,
          greenScore: 0,
          running: false,
          winner: null,
          offline: true
        };
        continue;
      }

      const time = (typeof m.timeRemaining === "number") ? m.timeRemaining : (m.time ?? 0);
      const redScore = (m.player1 ?? m.red ?? 0);
      const greenScore = (m.player2 ?? m.green ?? 0);

      matsVm[mat] = {
        mat,
        periodLabel: mapSegmentToLabel(m),
        timeLabel: fmt(time),
        redScore,
        greenScore,
        running: !!m.running,
        winner: computeWinner(m, redScore, greenScore, time),
        offline: false
      };
    }

    renderFn({ connection: "connected", mats: matsVm });
  });
}

// modules/state/state-sync.js
// -------------------------------------------------------
// Handles socket connection + emits + receiving state
// -------------------------------------------------------

export function initStateSync(serverUrl, onState) {
  const socket = io(serverUrl, { transports:["websocket"] });

  socket.on("connect", () => console.log("[state-sync] connected"));
  socket.on("disconnect", () => console.log("[state-sync] disconnected"));

  socket.on("stateUpdate", (payload) => {
    if (onState) onState(payload);
  });

  return {
    socket,
    update(mat, updates) {
      socket.emit("updateState", { mat, updates });
    },
    addPoints(mat, color, pts) {
      socket.emit("addPoints", { mat, color, pts });
    },
    subPoint(mat, color) {
      socket.emit("subPoint", { mat, color });
    },
    sendHeartbeat(type, mat) {
      socket.emit("heartbeat", { type, mat, ts: Date.now() });
    },
    sendDiagnostics(type, mat, data) {
      socket.emit("clientDiagnostics", { type, mat, ...data });
    },
    endMatch(data) {
      socket.emit("matchEnded", data);
    }
  };
}

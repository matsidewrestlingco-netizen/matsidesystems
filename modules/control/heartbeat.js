// =======================================================
// File: /modules/control/heartbeat.js
// Sends heartbeat packets so hub.html can monitor devices.
// =======================================================

export function initHeartbeat(ctx) {
  const { socket, getCurrentMat } = ctx;

  function sendHeartbeat() {
    socket.emit("heartbeat", {
      type: "control",
      mat: getCurrentMat(),
      ts: Date.now()
    });
  }

  // Start interval
  const id = setInterval(sendHeartbeat, 5000);
  sendHeartbeat();

  return () => clearInterval(id);
}

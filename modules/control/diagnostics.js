// =======================================================
// File: /modules/control/diagnostics.js
// Sends lightweight diagnostics for hub to show health status.
// =======================================================

export function initDiagnostics(ctx) {
  const { socket, getCurrentMat } = ctx;
  const startTime = performance.now();
  let frameCount = 0;

  function tick() {
    frameCount += 1;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  function sendDiagnostics() {
    const now = performance.now();
    const uptimeMs = now - startTime;
    const fps = frameCount / (uptimeMs / 1000 || 1);

    frameCount = 0;

    socket.emit("clientDiagnostics", {
      type: "control",
      mat: getCurrentMat(),
      uptimeMs,
      fps: Math.round(fps),
      ts: Date.now()
    });
  }

  const id = setInterval(sendDiagnostics, 10000);
  sendDiagnostics();

  return () => clearInterval(id);
}
					

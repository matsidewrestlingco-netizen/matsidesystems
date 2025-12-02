// =======================================================
// File: /modules/control/match-end.js
// End-match flow: winner + method selection + emit + toast.
// Requires control.html to provide modal + buttons.
// =======================================================

export function initMatchEnd(ctx) {
  const { socket, getCurrentMat, getMatState } = ctx;

  const endBtn = document.getElementById("endMatchBtn");
  const modal = document.getElementById("matchModal");
  const closeBtn = document.getElementById("closeMatchModal");
  const toast = document.getElementById("lastMatchToast");

  const winnerRedBtn = document.getElementById("endRed");
  const winnerGreenBtn = document.getElementById("endGreen");
  const methodButtons = document.querySelectorAll("[data-victory]");

  let selectedWinner = null;
  let selectedMethod = null;

  function openModal() {
    selectedWinner = null;
    selectedMethod = null;
    if (modal) modal.classList.add("active");
  }
  function closeModal() {
    if (modal) modal.classList.remove("active");
  }

  function suggestWinner() {
    const m = getMatState();
    if (!m) return null;
    if (m.red > m.green) return "red";
    if (m.green > m.red) return "green";
    return null;
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 3000);
  }

  winnerRedBtn?.addEventListener("click", () => {
    selectedWinner = "red";
  });
  winnerGreenBtn?.addEventListener("click", () => {
    selectedWinner = "green";
  });

  methodButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      selectedMethod = btn.getAttribute("data-victory");
      submitEnd();
    });
  });

  function submitEnd() {
    const mat = getCurrentMat();
    const m = getMatState();
    if (!m) return;

    let winner = selectedWinner || suggestWinner();
    if (!winner) {
      showToast("Select a winner or ensure scores differ.");
      return;
    }

    const method = selectedMethod || "decision";
    const payload = {
      mat,
      winner,
      method,
      redScore: m.red ?? 0,
      greenScore: m.green ?? 0,
      segmentId: m.segmentId ?? `P${m.period || 1}`,
      timestamp: new Date().toISOString()
    };

    socket.emit("matchEnded", payload);

    showToast(
      `Submitted: Mat ${mat} — ${winner.toUpperCase()} via ${method}, ${m.red}-${m.green}`
    );

    closeModal();
  }

  endBtn?.addEventListener("click", openModal);
  closeBtn?.addEventListener("click", closeModal);
}



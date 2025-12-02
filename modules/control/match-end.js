// modules/control/match-end.js
// ---------------------------------------------------------
// Match-End Modal + Submission Module (v2.1)
// Fully integrated with:
//   - toast system (ui/toast.js)
//   - timeline system (timeline/timeline.js)
//   - reset-mat module (control/reset-mat.js)
//   - unified socket/state routing
// ---------------------------------------------------------

import { showToast } from "../ui/toast.js";

/**
 * Initializes the match-end modal system.
 * @param {Object} ctx - The control-main context object.
 */
export function initMatchEnd(ctx) {
  const {
    socket,
    getCurrentMat,
    getMatState,
    appendTimeline,
    resetMat
  } = ctx;

  // Modal elements
  const modal = document.getElementById("matchEndModal");
  const backdrop = document.getElementById("matchEndBackdrop");

  const winnerBtns = document.querySelectorAll("[data-winner]");
  const methodBtns = document.querySelectorAll("[data-method]");

  const winnerLabel = document.getElementById("winnerChoice");
  const methodLabel = document.getElementById("methodChoice");

  const submitBtn = document.getElementById("submitMatchEnd");
  const cancelBtn = document.getElementById("cancelMatchEnd");

  const debugBox = document.getElementById("matchEndDebug");

  let selectedWinner = null;  // "red" | "green"
  let selectedMethod = null;  // "decision" | "tech" | "pin" | "ff"

  // ---------------------------------------------------------
  // Modal open/close
  // ---------------------------------------------------------

  function openModal() {
    selectedWinner = null;
    selectedMethod = null;

    winnerLabel.textContent = "--";
    methodLabel.textContent = "--";

    modal.classList.add("open");
    backdrop.classList.add("open");
  }

  function closeModal() {
    modal.classList.remove("open");
    backdrop.classList.remove("open");
  }

  document.getElementById("endMatchBtn")?.addEventListener("click", openModal);

  cancelBtn?.addEventListener("click", () => {
    closeModal();
  });

  backdrop?.addEventListener("click", closeModal);

  // ---------------------------------------------------------
  // Winner selection
  // ---------------------------------------------------------
  winnerBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      selectedWinner = btn.dataset.winner;

      winnerBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      winnerLabel.textContent =
        selectedWinner === "red" ? "Red Wrestler" : "Green Wrestler";
    });
  });

  // ---------------------------------------------------------
  // Method selection
  // ---------------------------------------------------------
  methodBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      selectedMethod = btn.dataset.method;

      methodBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      methodLabel.textContent = btn.textContent;
    });
  });

  // ---------------------------------------------------------
  // Submission Handler
  // ---------------------------------------------------------
  submitBtn?.addEventListener("click", () => {
    if (!selectedWinner || !selectedMethod) {
      showToast("Please choose winner + method", "error");
      return;
    }

    const mat = getCurrentMat();
    const state = getMatState(mat);

    if (!state) {
      showToast("Error: state missing", "error");
      return;
    }

    const resultPayload = {
      mat,
      winner: selectedWinner,
      method: selectedMethod,
      redScore: state.red,
      greenScore: state.green,
      period: state.period,
      segment: state.segment,
      timeRemaining: state.time,
      timestamp: Date.now()
    };

    // Send to server
    socket.emit("matchEnded", resultPayload);

    // Timeline logging
    if (appendTimeline) {
      appendTimeline(
        `Match Ended — ${selectedWinner.toUpperCase()} via ${selectedMethod}
         (${state.red}-${state.green})`
      );
    }

    // Toast feedback
    showToast(
      `Submitted: ${selectedWinner.toUpperCase()} via ${selectedMethod}`,
      "success"
    );

    // Reset mat fully
    resetMat?.();

    // Close modal
    closeModal();

    // Debug
    if (debugBox) {
      debugBox.textContent =
        JSON.stringify(resultPayload, null, 2);
    }
  });
}

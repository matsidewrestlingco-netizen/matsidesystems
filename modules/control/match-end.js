// ======================================================================
// modules/control/match-end.js
// Handles the "End Match" modal, winner selection, and server submission.
// Exports: initMatchEnd(ctx)
// ======================================================================

export function initMatchEnd(ctx) {
  const { socket, getCurrentMat, getMatState } = ctx;

  // ---- Elements ----
  const openBtn = document.getElementById("endMatchBtn");
  const modal = document.getElementById("matchEndModal");
  const backdrop = document.getElementById("matchEndBackdrop");

  const redBtn = document.getElementById("winnerRed");
  const greenBtn = document.getElementById("winnerGreen");

  const decBtn = document.getElementById("resultDec");
  const tfBtn = document.getElementById("resultTF");
  const pinBtn = document.getElementById("resultPin");
  const ffBtn = document.getElementById("resultFF");

  const submitBtn = document.getElementById("submitMatchEnd");
  const cancelBtn = document.getElementById("cancelMatchEnd");

  // ---- Internal state ----
  let selectedWinner = null;
  let selectedResult = null;

  function openModal() {
    const m = getMatState();
    if (!m) return;

    // Reset selections
    selectedWinner = null;
    selectedResult = null;

    redBtn.classList.remove("sel");
    greenBtn.classList.remove("sel");
    decBtn.classList.remove("sel");
    tfBtn.classList.remove("sel");
    pinBtn.classList.remove("sel");
    ffBtn.classList.remove("sel");

    backdrop.classList.add("open");
    modal.classList.add("open");
  }

  function closeModal() {
    backdrop.classList.remove("open");
    modal.classList.remove("open");
  }

  // ---- Winner selection ----
  redBtn?.addEventListener("click", () => {
    selectedWinner = "red";
    redBtn.classList.add("sel");
    greenBtn.classList.remove("sel");
  });

  greenBtn?.addEventListener("click", () => {
    selectedWinner = "green";
    greenBtn.classList.add("sel");
    redBtn.classList.remove("sel");
  });

  // ---- Result type selection ----
  function selectResult(type, btn, all) {
    selectedResult = type;
    all.forEach(b => b.classList.remove("sel"));
    btn.classList.add("sel");
  }

  const resultButtons = [decBtn, tfBtn, pinBtn, ffBtn];

  decBtn?.addEventListener("click", () =>
    selectResult("decision", decBtn, resultButtons)
  );
  tfBtn?.addEventListener("click", () =>
    selectResult("tech-fall", tfBtn, resultButtons)
  );
  pinBtn?.addEventListener("click", () =>
    selectResult("pin", pinBtn, resultButtons)
  );
  ffBtn?.addEventListener("click", () =>
    selectResult("forfeit", ffBtn, resultButtons)
  );

  // ---- Submit ----
  submitBtn?.addEventListener("click", () => {
    if (!selectedWinner || !selectedResult) {
      alert("Select a winner and match result.");
      return;
    }

    const mat = getCurrentMat();
    const state = getMatState(mat);

    const payload = {
      mat,
      winner: selectedWinner,
      result: selectedResult,
      red: state.red,
      green: state.green,
      period: state.period,
      segmentId: state.segmentId,
      timestamp: Date.now()
    };

    socket.emit("matchEnded", payload);

    closeModal();

    // toast (if module present)
    if (window.showToast) {
      const name =
        selectedWinner === "red" ? state.redName || "Red" : state.greenName || "Green";

      showToast(`${name} wins by ${selectedResult}`, 4000);
    }
  });

  // ---- Cancel ----
  cancelBtn?.addEventListener("click", closeModal);

  // ---- Open button ----
  openBtn?.addEventListener("click", openModal);

  return { openModal, closeModal };
}

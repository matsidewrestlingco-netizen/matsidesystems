// modules/overview-render.js
// Builds and updates 4-mat overview UI

export function createOverviewRenderer(root) {
  root.innerHTML = `
    <div class="ov-header">
      <div>
        <div class="ov-title-main">Matside Overview</div>
        <div class="ov-title-sub">Live view of all mats</div>
      </div>
      <div class="ov-conn" id="ov-conn">connecting…</div>
    </div>

    <div class="ov-grid">
      <div class="ov-card" data-mat="1"></div>
      <div class="ov-card" data-mat="2"></div>
      <div class="ov-card" data-mat="3"></div>
      <div class="ov-card" data-mat="4"></div>
    </div>
  `;

  const connEl = root.querySelector("#ov-conn");
  const cards = Array.from(root.querySelectorAll(".ov-card[data-mat]"));

  function renderMatCard(card, vm) {
    if (!vm) {
      card.innerHTML = `<div class="ov-card-top"><div class="ov-mat-label">Mat ?</div><div class="ov-meta"><span>Offline</span></div></div>`;
      return;
    }

    const winnerClass =
      vm.winner === "red" ? "ov-winner-red" :
      vm.winner === "green" ? "ov-winner-green" :
      "";

    const winnerText =
      vm.winner === "red" ? "RED" :
      vm.winner === "green" ? "GREEN" :
      "–";

    card.innerHTML = `
      <div class="ov-card-top">
        <div class="ov-mat-label">Mat ${vm.mat}</div>
        <div class="ov-meta">
          <span>Period ${vm.periodLabel}</span>
          <span>${vm.timeLabel}</span>
        </div>
      </div>
      <div class="ov-main">
        <div class="ov-side ov-red">
          <div class="ov-side-header">
            <div class="ov-name">RED</div>
            <div class="ov-tag">Home</div>
          </div>
          <div class="ov-score">${vm.redScore}</div>
        </div>
        <div class="ov-side ov-green">
          <div class="ov-side-header">
            <div class="ov-name">GREEN</div>
            <div class="ov-tag">Visitor</div>
          </div>
          <div class="ov-score">${vm.greenScore}</div>
        </div>
      </div>
      <div class="ov-bottom">
        <div>Running: ${vm.offline ? "Offline" : (vm.running ? "Yes" : "No")}</div>
        <div>Winner: <span class="ov-winner-label ${winnerClass}">${winnerText}</span></div>
      </div>
    `;
  }

  // renderFn accepts either VM object OR updater(prev) => next
  return function render(vmOrUpdater) {
    // Support functional updates (like React-style)
    if (typeof vmOrUpdater === "function") {
      const prev = {
        connection: connEl?.textContent || "connecting",
        mats: {} // we don't persist mats here, but that's fine for now
      };
      // we only really use connection from this path
      const updated = vmOrUpdater(prev);
      if (connEl && updated.connection) connEl.textContent = updated.connection;
      return;
    }

    const vm = vmOrUpdater;
    if (!vm) return;

    if (connEl && vm.connection) {
      connEl.textContent = vm.connection;
    }

    const matsVm = vm.mats || {};
    cards.forEach((card) => {
      const mat = Number(card.getAttribute("data-mat"));
      renderMatCard(card, matsVm[mat]);
    });
  };
}

// modules/timeline/timeline.js
// -------------------------------------------------------
// Handles timeline UI and incoming events from server
// -------------------------------------------------------

export function initTimeline(containerId) {
  const list = document.getElementById(containerId);

  function render(timeline) {
    if (!list) return;
    list.innerHTML = timeline
      .map(e => `<div class="tl-item">${e}</div>`)
      .join("");
  }

  return { render };
}

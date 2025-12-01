// modules/timeline.js

let timelineList;

export function initTimeline() {
  timelineList = document.getElementById("timelineList");
}

export function addTimelineEntry(entry) {
  if (!timelineList) return;
  const li = document.createElement("div");
  li.className = "timeline-item";

  const ts = new Date();
  const timeStr = ts.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const header = document.createElement("div");
  header.className = "timeline-item-header";
  header.innerHTML = `<span>${entry.type || "event"}</span><span>${timeStr}</span>`;

  const body = document.createElement("div");
  body.className = "timeline-item-body";

  let text = entry.label || "";
  if (entry.color) text = entry.color.toUpperCase() + " · " + text;
  if (!text) text = JSON.stringify(entry);

  body.textContent = text;

  li.appendChild(header);
  li.appendChild(body);

  timelineList.prepend(li);
}


export function clearTimeline() {
  if (!timelineList) return;
  timelineList.innerHTML = "";
}

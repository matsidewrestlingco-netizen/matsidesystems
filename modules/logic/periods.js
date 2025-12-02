// modules/logic/periods.js
// -------------------------------------------------------
// Handles period progression and auto-advance
// -------------------------------------------------------

import { nextSegment, SEGMENTS } from "./ot-engine.js";

export function handlePeriodEnd(stateApi, mat, state) {
  const seg = SEGMENTS[state.segmentId];
  if (!seg) return;

  const next = nextSegment(state.segmentId);

  if (!next) {
    // Match fully ended — no auto action
    return;
  }

  // advance
  stateApi.update(mat, {
    running: false,
    segmentId: next,
    time: SEGMENTS[next].time
  });
}

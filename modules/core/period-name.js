// =========================================================
// FILE: modules/core/period-name.js
// Thin wrapper for converting segmentId → label text
// =========================================================
import { PERIODS } from "../logic/periods.js";

export function displayPeriodName(segmentId) {
  const seg = PERIODS[segmentId];
  if (!seg) return "?";

  // REG1 → Period 1
  if (seg.type === "reg") return seg.number.toString();

  // OT → OT
  if (seg.type === "ot") return "OT";

  // TB1, TB2 → TB1, TB2
  if (seg.type === "tb") return `TB${seg.number}`;

  // UT → Ultimate
  if (seg.type === "ut") return "UT";

  return "?";
}

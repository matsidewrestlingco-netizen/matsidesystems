// =========================================================
// FILE: modules/core/segment-engine.js
// Shared segment / OT logic for all views
// =========================================================

// Regulation + OT chain, in order.
const SEGMENTS = [
  { id: "REG1", label: "1" },
  { id: "REG2", label: "2" },
  { id: "REG3", label: "3" },
  { id: "OT", label: "OT" },
  { id: "TB1", label: "TB1" },
  { id: "TB2", label: "TB2" },
  { id: "UT", label: "UT" }
];

export function mapSegmentLabel(segmentId) {
  const seg = SEGMENTS.find((s) => s.id === segmentId);
  if (!seg) return "1";
  return seg.label;
}

export function isLateSegment(segmentId) {
  return (
    segmentId === "REG3" ||
    segmentId === "OT" ||
    segmentId === "TB1" ||
    segmentId === "TB2" ||
    segmentId === "UT"
  );
}

// Viewer-friendly winner computation.
// This does NOT end the match; it only infers who appears to be winning/has won.
export function computeWinnerForView(matState) {
  if (!matState) return null;

  const segId = matState.segmentId || "REG1";
  const time = matState.time ?? 0;
  const red = matState.red ?? 0;
  const green = matState.green ?? 0;
  const diff = Math.abs(red - green);

  // Tech fall: 15-point differential in late segments.
  if (isLateSegment(segId) && diff >= 15) {
    return red > green ? "red" : "green";
  }

  // End of regulation (3rd period) with non-tie
  if (segId === "REG3" && time === 0 && diff > 0) {
    return red > green ? "red" : "green";
  }

  // OT / TB / UT at time 0, non-tie: someone just won.
  if (
    (segId === "OT" ||
      segId === "TB1" ||
      segId === "TB2" ||
      segId === "UT") &&
    time === 0 &&
    diff > 0
  ) {
    return red > green ? "red" : "green";
  }

  return null;
}

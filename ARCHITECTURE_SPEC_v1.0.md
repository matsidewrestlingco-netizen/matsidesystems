ARCHITECTURE_SPEC_v1.0.md

Matside Modular UI + Server Architecture

Published: v1.0
Status: Locked-in Contract (No Breaking Changes Allowed)

⸻

1. Purpose

This document defines the guaranteed structure, APIs, module boundaries, socket events, and DOM contracts used by the Matside scoreboard ecosystem.

Every future feature, UI update, bug fix, and redesign must obey this specification to avoid regressions and lost features.

⸻

2. Project Directory Structure — REQUIRED
   /public
  control.html
  scoreboard.html
  overview.html
  hub.html

  /modules
    /core
      socket.js
      state.js
      time.js

    /control
      control-main.js
      scoring.js
      timer.js
      ot-engine.js
      drawers.js
      names.js
      timeline.js
      match-end.js
      reset-mat.js
      heartbeat.js
      diagnostics.js

    /scoreboard
      scoreboard-data.js
      scoreboard-render.js

    /overview
      overview-data.js
      overview-render.js

    /ui
      skins.js
Rule:
We never place logic inside HTML except the small bootstrap script.

⸻

3. MatState Contract (Server → All Clients)

   interface MatState {
  period: number;                  // 1, 2, 3, TB1, etc
  segmentId: string;               // "P1" | "P2" | "P3" | "OT" | "TB1" | "TB2" | "UT"
  time: number;                    // seconds remaining
  running: boolean;
  red: number;
  green: number;

  redName?: string;
  greenName?: string;

  winner?: "red" | "green" | null;
  resultMethod?: string | null;

  timeline: Array<{
    label: string;
    ts: string;
  }>;
}

4. Approved Socket Events

Server → Clients
	•	"stateUpdate" — Primary data sync
  { mats: { [matId]: MatState } }

	•	"themeUpdate"
  skinName: string

  Clients → Server
	•	"updateState"
	•	"addPoints"
	•	"subPoint"
	•	"matchEnded"
	•	"heartbeat"
	•	"clientDiagnostics"
	•	"themeUpdate" (hub → server)

Rule:
No new events without updating this spec.

⸻

5. Required DOM IDs for control.html

To prevent regressions, the following IDs are REQUIRED:

Top + Summary
  matSelect
  conn
  sumMat
  sumPeriod
  sumTime
  sumRed
  sumGreen
Timer
  startBtn
  stopBtn
  resetTimerBtn
  endMatchBtn
Scoring
  subRed
  subGreen
  resetScores
  [data-color="red|green"]
  [data-pts="1|2|3|4"]
Left Drawer
  openDrawerLeft
  closeDrawerLeft
  drawerLeft
  backdropLeft
  preset-btn (class)
  customTimeInput
  applyCustomTime
Right Drawer
  openDrawerRight
  closeDrawerRight
  drawerRight
  backdropRight
  redNameInput
  greenNameInput
  resetMatBtn
  timelineList
End Match Modal
  endMatchModal
  winnerRedBtn
  winnerGreenBtn
  method-btn (class)
  cancelEndMatch
  confirmEndMatch
Misc
  toast
  lastMatchCard
  lastMatchWinner
  lastMatchScore
  lastMatchMeta
  version-tag
  
6. Module API Contract

Every module must export initX() and accept dependencies injected externally.

Example: scoring.js
export function initScoring({ socket, getCurrentMat, pushTimeline });

Example: timer.js
export function initTimer({ socket, getCurrentMat, formatTime, onStateUpdate });

Example: ot-engine.js
export function initOTEngine({ socket, getCurrentMat, getState, setState });

Example: drawers.js
export function initDrawers();

Example: skins.js
export function initSkinClient(serverUrl);
export function initSkinHub(serverUrl);
export const SKINS;

Rule:
Modules must never query the DOM except for the IDs assigned to them.

⸻

7. Bootstrap Script Pattern (All Pages)

Every page must follow this minimal format:
import { createClientSocket } from "./modules/core/socket.js";
import { initSkinClient } from "./modules/ui/skins.js";

const serverUrl = "https://scoreboard-server-er33.onrender.com";
initSkinClient(serverUrl);

const socket = createClientSocket(serverUrl);

// initialize modules…

8. Versioning Policy
	•	Every release increments the “major” HTML version (control v2.XX, scoreboard v3.XX).
	•	Any change to this spec creates ARCHITECTURE_SPEC_v1.X.

⸻

9. Breaking Changes Are Forbidden
	•	No new DOM IDs removed
	•	No socket events renamed
	•	No module API changed
	•	No MatState fields removed or renamed

⸻

10. Enforcement

Any new major update must check:
	1.	DOM IDs intact
	2.	Socket events unchanged
	3.	MatState fields intact
	4.	Modules used instead of inline logic
	5.	JS loaded via ES Modules
	6.	Skin engine untouched

If any fail → the build is rejected.

⸻

End of Specification


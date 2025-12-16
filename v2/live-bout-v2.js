const BOUT_ID = 'hardcoded-for-now';

async function fetchBout() {
  // SELECT * FROM matside_v2.bouts WHERE id = BOUT_ID
}

function render(bout) {
  renderHeader(bout);
  renderStateBanner(bout);
  renderActions(bout);
}

async function startMatch() {
  await rpc('rpc_bout_start', { bout_id: BOUT_ID });
  await refresh();
}

async function score(color, points) {
  await rpc('rpc_apply_score_action', { /* explicit args */ });
  await refresh();
}

async function refresh() {
  const bout = await fetchBout();
  render(bout);
}

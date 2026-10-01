// Central registry of allowed receiver actions per status.
// Any attempt outside this table is ignored.

export const RECEIVER_ACTIONS = {
  SENT:               [],
  IN_TRANSIT:         [],
  READY_TO_COLLECT:   ['cash', 'bank'],
  COLLECTED:          [],
  FAILED:             []
};

export function canAct(status, action) {
  return RECEIVER_ACTIONS[status]?.includes(action) ?? false;
}
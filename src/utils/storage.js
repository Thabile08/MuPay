const KEY = 'mukuru.pending.v1';

export function readPending() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function writePending(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function enqueue(item) {
  const list = readPending();
  if (list.some((x) => x.ref === item.ref)) return list; // idempotent
  const next = [...list, item];
  writePending(next);
  return next;
}

export function dequeue(ref) {
  const list = readPending().filter((x) => x.ref !== ref);
  writePending(list);
  return list;
}
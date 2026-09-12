import { api } from "./api";

const KEY = "jalia-pending-events";

function readQueue() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function writeQueue(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

let listeners = [];
export function onQueueChange(fn) {
  listeners.push(fn);
  return () => { listeners = listeners.filter((l) => l !== fn); };
}
function notify() {
  const q = readQueue();
  listeners.forEach((l) => l(q));
}

export function enqueueEvent(careRecipientId, payload) {
  const queue = readQueue();
  const item = {
    localId: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    careRecipientId,
    payload,
    queuedAt: new Date().toISOString(),
    status: "pending", // pending | syncing | failed
  };
  queue.push(item);
  writeQueue(queue);
  notify();
  return item;
}

export function getQueue() {
  return readQueue();
}

export function getQueueForRecipient(careRecipientId) {
  return readQueue().filter((i) => i.careRecipientId === careRecipientId);
}

export async function syncQueue() {
  const queue = readQueue();
  if (queue.length === 0) return;

  const remaining = [...queue];
  for (const item of queue) {
    try {
      await api.post(`/care-recipients/${item.careRecipientId}/events`, item.payload);
      const idx = remaining.findIndex((r) => r.localId === item.localId);
      if (idx !== -1) remaining.splice(idx, 1);
    } catch {
      // leave it in the queue, try again next time
    }
  }
  writeQueue(remaining);
  notify();
}

let syncing = false;
export function initOfflineSync() {
  const trySync = async () => {
    if (syncing || !navigator.onLine) return;
    syncing = true;
    await syncQueue();
    syncing = false;
  };
  window.addEventListener("online", trySync);
  trySync();
  // periodic retry in case 'online' event is missed
  setInterval(trySync, 20000);
}

"use client";

import { useSyncExternalStore } from "react";

/**
 * The viewer's current time, to the minute, shared by everything that
 * depends on "now" (live / upcoming / replay, countdowns, the header's
 * live marker). Re-checked every 30 seconds.
 *
 * The pages are built ahead of time, so the server and the first
 * (hydration) render use `builtAt`, the build time; the browser then
 * immediately re-renders with the real time. That keeps server and
 * client HTML identical -- no hydration mismatch -- without setting
 * state in an effect.
 */
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
}
const minute = () => Math.floor(Date.now() / 60_000) * 60_000;

export function useNow(builtAt: number) {
  return useSyncExternalStore(subscribe, minute, () => builtAt);
}

/** False on the server and during hydration, true afterwards. For output
 *  that depends on the viewer's time zone (local times, countdowns). */
const noop = () => () => {};
export function useIsClient() {
  return useSyncExternalStore(noop, () => true, () => false);
}

export type LiveStatus = "live" | "upcoming" | "past";

export function liveStatus(item: { kind: string; start: string; end?: string }, now: number): LiveStatus {
  const start = Date.parse(item.start);
  if (now < start) return "upcoming";
  if (item.kind === "stream" && item.end && now < Date.parse(item.end)) return "live";
  return "past";
}

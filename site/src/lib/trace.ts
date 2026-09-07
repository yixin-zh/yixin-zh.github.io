import type { LineItem, Manifest, Step, Trace, Value } from "./types";

const BASE: string = import.meta.env.BASE_URL;

export function manifestUrl(): string {
  return `${BASE}traces/index.json`;
}

export function traceUrl(id: string): string {
  return `${BASE}traces/${id}.json`;
}

/** Absolute site URL for a media path emitted by the tracer. */
export function assetUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE}${path.replace(/^\/+/, "")}`;
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} while loading ${url}`);
  }
  return (await response.json()) as T;
}

export const fetchManifest = () => getJson<Manifest>(manifestUrl());
export const fetchTrace = (id: string) => getJson<Trace>(traceUrl(id));

export function clampStep(index: number, total: number): number {
  if (!Number.isFinite(index)) return 0;
  return Math.min(Math.max(index, 0), Math.max(total - 1, 0));
}

/**
 * The lines revealed once `stepIndex` has been reached: every source line the
 * trace has touched so far, in first-touch order, with the renderings produced
 * on that line.  This is what makes the page "advance" line by line.
 */
export function computeLines(trace: Trace, stepIndex: number): LineItem[] {
  const hidden = trace.hidden_line_numbers ?? {};
  const byKey = new Map<string, LineItem>();

  for (let i = 0; i <= stepIndex && i < trace.steps.length; i++) {
    const step = trace.steps[i];
    const top = step.stack[step.stack.length - 1];
    if (!top) continue;
    const key = `${top.path}:${top.line_number}`;
    const existing = byKey.get(key);
    byKey.set(key, {
      key,
      path: top.path,
      lineNumber: top.line_number,
      code: top.code,
      depth: Math.max(step.stack.length - 1, 0),
      renderings: [...(existing?.renderings ?? []), ...step.renderings],
      isCurrent: i === stepIndex,
    });
  }

  return [...byKey.values()].filter(
    (line) => !(hidden[line.path] ?? []).includes(line.lineNumber),
  );
}

/**
 * Variables to show at `stepIndex`: walk backwards so the most recent value of
 * each name wins, and treat an explicit null (`@clear`) as "no longer shown".
 */
export function computeEnv(trace: Trace, stepIndex: number): Record<string, Value> {
  const env: Record<string, Value> = {};
  for (let i = Math.min(stepIndex, trace.steps.length - 1); i >= 0; i--) {
    const entries = Object.entries(trace.steps[i].env ?? {});
    for (const [name, value] of entries) {
      if (name in env) continue;
      if (value === null) continue;
      env[name] = value;
    }
  }
  return env;
}

/** Next (or previous) step that does not go deeper into the call stack. */
export function stepOverIndex(trace: Trace, index: number, direction: 1 | -1): number {
  const depth = trace.steps[index]?.stack.length ?? 1;
  let next = index + direction;
  while (next >= 0 && next < trace.steps.length && trace.steps[next].stack.length > depth) {
    next += direction;
  }
  return clampStep(next, trace.steps.length);
}

/** Previous step that is higher up the call stack. */
export function stepUpIndex(trace: Trace, index: number): number {
  const depth = trace.steps[index]?.stack.length ?? 1;
  let previous = index - 1;
  while (previous >= 0 && trace.steps[previous].stack.length >= depth) {
    previous -= 1;
  }
  return previous >= 0 ? previous : index;
}

export function lastVisitIndex(trace: Trace, index: number, target: LineItem): number {
  for (let i = trace.steps.length - 1; i >= 0; i--) {
    const top = trace.steps[i].stack[trace.steps[i].stack.length - 1];
    if (top && top.path === target.path && top.line_number === target.lineNumber) return i;
  }
  return index;
}

export function stepAt(trace: Trace, index: number): Step | undefined {
  return trace.steps[index];
}

import { useMemo } from "react";
import { computeEnv, computeLines } from "../lib/trace";
import type { LineItem, Trace } from "../lib/types";
import { EnvPanel } from "./EnvPanel";
import { LineRow } from "./LineRow";

export function TraceViewer({
  trace,
  stepIndex,
  showNotes,
  onSelectLine,
}: {
  trace: Trace;
  stepIndex: number;
  showNotes: boolean;
  onSelectLine: (line: LineItem) => void;
}) {
  const lines = useMemo(() => computeLines(trace, stepIndex), [trace, stepIndex]);
  const env = useMemo(() => computeEnv(trace, stepIndex), [trace, stepIndex]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="min-w-0 space-y-2.5">
        {lines.map((line) => (
          <LineRow key={line.key} line={line} showNotes={showNotes} onSelect={onSelectLine} />
        ))}
      </section>
      <EnvPanel env={env} />
    </div>
  );
}

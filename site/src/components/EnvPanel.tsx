import { Variable } from "lucide-react";
import type { Value } from "../lib/types";

function preview(value: Value): string {
  const contents = value.contents;
  if (contents === null || contents === undefined) return "None";
  if (typeof contents === "string") return contents;
  if (typeof contents === "object") {
    try {
      return JSON.stringify(contents);
    } catch {
      return String(contents);
    }
  }
  return String(contents);
}

export function EnvPanel({ env }: { env: Record<string, Value> }) {
  const entries = Object.entries(env);

  return (
    <aside className="glass sticky top-20 hidden max-h-[calc(100vh-9rem)] overflow-auto rounded-2xl border border-line/10 p-4 lg:block">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
        <Variable className="h-3.5 w-3.5 text-accent-2" />
        Variables
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-fg-subtle">
          Variables annotated with <code className="text-fg-muted"># @inspect x</code> show up here
          as the trace reaches them.
        </p>
      ) : (
        <div className="space-y-2">
          {entries.map(([name, value]) => (
            <div
              key={name}
              className="animate-fade rounded-xl border border-line/5 bg-surface-2 px-3 py-2"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[12px] text-accent-2">{name}</span>
                <span className="text-[10px] uppercase tracking-wide text-fg-subtle">
                  {value.type}
                  {value.shape ? ` ${value.shape.join("x")}` : ""}
                  {value.dtype ? ` · ${value.dtype}` : ""}
                </span>
              </div>
              <div className="mt-1 break-words font-mono text-[12px] text-fg">
                {preview(value).length > 320
                  ? `${preview(value).slice(0, 320)}…`
                  : preview(value)}
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

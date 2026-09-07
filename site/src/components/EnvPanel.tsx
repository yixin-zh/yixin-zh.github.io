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
    <aside className="glass sticky top-20 hidden max-h-[calc(100vh-9rem)] overflow-auto rounded-2xl border border-white/10 p-4 lg:block">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Variable className="h-3.5 w-3.5 text-brand-cyan" />
        Variables
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-slate-500">
          Variables annotated with <code className="text-slate-300"># @inspect x</code> show up here
          as the trace reaches them.
        </p>
      ) : (
        <div className="space-y-2">
          {entries.map(([name, value]) => (
            <div
              key={name}
              className="animate-fade-up rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[12px] text-brand-cyan">{name}</span>
                <span className="text-[10px] uppercase tracking-wide text-slate-500">
                  {value.type}
                  {value.shape ? ` ${value.shape.join("x")}` : ""}
                  {value.dtype ? ` · ${value.dtype}` : ""}
                </span>
              </div>
              <div className="mt-1 break-words font-mono text-[12px] text-slate-200">
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

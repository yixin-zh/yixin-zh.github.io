import clsx from "clsx";
import { useEffect, useRef } from "react";
import { highlightPython } from "../lib/highlight";
import type { LineItem } from "../lib/types";
import { RenderingList } from "./Renderings";

export function LineRow({
  line,
  showNotes,
  onSelect,
}: {
  line: LineItem;
  showNotes: boolean;
  onSelect: (line: LineItem) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (line.isCurrent) {
      ref.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [line.isCurrent]);

  const indent = Math.min(line.depth, 5);

  return (
    <div
      ref={ref}
      style={{ marginLeft: indent * 18 }}
      className={clsx(
        "animate-fade-up border-l-2 py-1 pl-3 transition-colors duration-200",
        line.isCurrent
          ? "border-brand-indigo bg-gradient-to-r from-brand-indigo/10 to-transparent"
          : "border-white/5 hover:border-white/15",
      )}
    >
      <div className="flex items-baseline gap-3">
        <button
          type="button"
          onClick={() => onSelect(line)}
          title="Jump to this line"
          className={clsx(
            "w-9 shrink-0 cursor-pointer select-none text-right font-mono text-[11px] transition",
            line.isCurrent ? "text-brand-cyan" : "text-slate-600 hover:text-slate-400",
          )}
        >
          {line.lineNumber}
        </button>
        <code
          className="code-line whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-slate-300"
          dangerouslySetInnerHTML={{ __html: highlightPython(line.code) }}
        />
      </div>

      {line.renderings.length > 0 ? (
        <div className="mt-2 pl-12">
          <RenderingList renderings={line.renderings} showNotes={showNotes} />
        </div>
      ) : null}
    </div>
  );
}

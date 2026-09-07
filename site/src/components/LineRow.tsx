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
    // Only scroll when the current line is actually out of view: the page should
    // not jump around while you read it.
    if (!line.isCurrent) return;
    const node = ref.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    const visible = box.top >= 72 && box.bottom <= window.innerHeight - 96;
    if (!visible) {
      node.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [line.isCurrent]);

  const indent = Math.min(line.depth, 5);

  return (
    <div
      ref={ref}
      style={{ marginLeft: indent * 18 }}
      className={clsx(
        "border-l-2 py-1 pl-3 transition-colors duration-200",
        line.isCurrent
          ? "border-accent bg-gradient-to-r from-accent/10 to-transparent"
          : "border-line/5 hover:border-line/15",
      )}
    >
      <div className="flex items-baseline gap-3">
        <button
          type="button"
          onClick={() => onSelect(line)}
          title="Jump to this line"
          className={clsx(
            "w-9 shrink-0 cursor-pointer select-none text-right font-mono text-[11px] transition",
            line.isCurrent ? "text-accent-2" : "text-fg-subtle hover:text-fg-muted",
          )}
        >
          {line.lineNumber}
        </button>
        <code
          className="code-line whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-fg-muted"
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

import {
  ChevronsLeft,
  ChevronsRight,
  Eye,
  EyeOff,
  Pause,
  Play,
  SkipForward,
  StickyNote,
} from "lucide-react";

export function Controls({
  index,
  total,
  animate,
  hideEnv,
  showNotes,
  onStep,
  onFirst,
  onLast,
  onStepOver,
  onToggleAnimate,
  onToggleEnv,
  onToggleNotes,
}: {
  index: number;
  total: number;
  animate: boolean;
  hideEnv: boolean;
  showNotes: boolean;
  onStep: (index: number) => void;
  onFirst: () => void;
  onLast: () => void;
  onStepOver: () => void;
  onToggleAnimate: () => void;
  onToggleEnv: () => void;
  onToggleNotes: () => void;
}) {
  const progress = total > 1 ? (index / (total - 1)) * 100 : 100;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line/10 bg-surface/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2.5">
        <button
          type="button"
          onClick={onFirst}
          title="Play from the start"
          className="control-button"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onToggleAnimate}
          title={animate ? "Pause (space)" : "Play (space)"}
          className="control-button control-button-primary"
        >
          {animate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button type="button" onClick={onStepOver} title="Step over (shift + →)" className="control-button">
          <SkipForward className="h-4 w-4" />
        </button>
        <button type="button" onClick={onLast} title="Jump to the last step" className="control-button">
          <ChevronsRight className="h-4 w-4" />
        </button>

        <input
          type="range"
          min={0}
          max={Math.max(total - 1, 0)}
          value={index}
          onChange={(event) => onStep(Number(event.target.value))}
          aria-label="Step"
          className="mx-2 h-1.5 min-w-[140px] flex-1 cursor-pointer appearance-none rounded-full accent-accent"
          style={{
            background: `linear-gradient(90deg, rgb(var(--accent)) ${progress}%, rgb(var(--line) / 0.12) ${progress}%)`,
          }}
        />

        <span className="whitespace-nowrap font-mono text-[11px] text-fg-subtle">
          {index + 1} / {total}
        </span>

        <button
          type="button"
          onClick={onToggleEnv}
          title="Toggle variables panel (E)"
          className="control-button"
        >
          {hideEnv ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={onToggleNotes}
          title="Toggle notes (N)"
          className="control-button"
        >
          <StickyNote className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

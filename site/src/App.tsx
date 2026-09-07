import { useCallback, useEffect, useState } from "react";
import { Controls } from "./components/Controls";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { TraceViewer } from "./components/TraceViewer";
import {
  clampStep,
  fetchManifest,
  fetchTrace,
  lastVisitIndex,
  stepOverIndex,
} from "./lib/trace";
import { useUrlState } from "./lib/useUrlState";
import type { LineItem, Manifest, Trace } from "./lib/types";

const DEFAULT_SECTION = "home";
const ANIMATE_DELAY = 650;

export default function App() {
  const { params, update } = useUrlState();

  const sectionId = params.get("trace") ?? DEFAULT_SECTION;
  const animate = params.get("animate") === "1";
  const hideEnv = params.get("hideEnv") === "1";
  const showNotes = params.get("showNotes") === "1";

  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [trace, setTrace] = useState<Trace | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dark, setDark] = useState(() => window.localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    let cancelled = false;
    fetchManifest()
      .then((loaded) => {
        if (!cancelled) setManifest(loaded);
      })
      .catch((cause) => {
        console.error(cause);
        if (!cancelled) setError("Could not load traces/index.json — run `python3 build.py` first.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setTrace(null);
    setError(null);
    fetchTrace(sectionId)
      .then((loaded) => {
        if (!cancelled) setTrace(loaded);
      })
      .catch((cause) => {
        console.error(cause);
        if (!cancelled) setError(`Could not load the "${sectionId}" trace. Run \`python3 build.py\`.`);
      });
    return () => {
      cancelled = true;
    };
  }, [sectionId]);

  const total = trace?.steps.length ?? 0;
  const requestedStep = Number.parseInt(params.get("step") ?? "", 10);
  // With no explicit `?step=` the whole section is shown (the portfolio should be
  // readable without pressing anything); press play to walk it from line one.
  const stepIndex = clampStep(Number.isNaN(requestedStep) ? total - 1 : requestedStep, total);

  const goto = useCallback(
    (index: number) => {
      update((next) => next.set("step", String(clampStep(index, total))));
    },
    [total, update],
  );

  const selectSection = useCallback(
    (id: string) => {
      update((next) => {
        next.set("trace", id);
        next.delete("step");
        next.delete("animate");
      });
    },
    [update],
  );

  const toggleFlag = useCallback(
    (flag: string) => {
      update((next) => {
        if (next.get(flag) === "1") next.delete(flag);
        else next.set(flag, "1");
      });
    },
    [update],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (!trace) return;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          goto(event.shiftKey ? stepOverIndex(trace, stepIndex, 1) : stepIndex + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          goto(event.shiftKey ? stepOverIndex(trace, stepIndex, -1) : stepIndex - 1);
          break;
        case " ":
          event.preventDefault();
          toggleFlag("animate");
          break;
        case "e":
          toggleFlag("hideEnv");
          break;
        case "n":
          toggleFlag("showNotes");
          break;
        case "Home":
          goto(0);
          break;
        case "End":
          goto(total - 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goto, stepIndex, toggleFlag, total, trace]);

  useEffect(() => {
    if (!animate || !trace || total === 0) return;
    if (stepIndex >= total - 1) {
      update((next) => next.delete("animate"));
      return;
    }
    const timer = window.setTimeout(() => goto(stepIndex + 1), ANIMATE_DELAY);
    return () => window.clearTimeout(timer);
  }, [animate, goto, stepIndex, total, trace, update]);

  useEffect(() => {
    const label = manifest?.sections.find((section) => section.id === sectionId)?.label;
    document.title = manifest?.site.name
      ? `${manifest.site.name}${label ? ` · ${label}` : ""}`
      : "Online Portfolio";
  }, [manifest, sectionId]);

  const onSelectLine = useCallback(
    (line: LineItem) => {
      if (!trace) return;
      goto(lastVisitIndex(trace, stepIndex, line));
    },
    [goto, stepIndex, trace],
  );

  return (
    <div className="min-h-screen bg-surface text-fg transition-colors">
      <Nav
        site={manifest?.site ?? null}
        sections={manifest?.sections ?? []}
        current={sectionId}
        dark={dark}
        onSelect={selectSection}
        onViewAll={() => update((next) => next.delete("step"))}
        onToggleTheme={() => setDark((value) => !value)}
      />

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-20">
        {trace ? (
          <>
            <TraceViewer
              trace={trace}
              stepIndex={stepIndex}
              showNotes={showNotes}
              onSelectLine={onSelectLine}
            />
            <Footer site={manifest?.site ?? null} />
          </>
        ) : (
          <div className="glass rounded-2xl border border-line/10 p-8 text-sm text-fg-muted">
            {error ?? "Loading trace…"}
          </div>
        )}
      </main>

      {trace ? (
        <Controls
          index={stepIndex}
          total={total}
          animate={animate}
          hideEnv={hideEnv}
          showNotes={showNotes}
          onStep={goto}
          onFirst={() => {
            update((next) => {
              next.set("step", "0");
              next.set("animate", "1");
            });
          }}
          onLast={() => update((next) => next.delete("step"))}
          onStepOver={() => goto(stepOverIndex(trace, stepIndex, 1))}
          onToggleAnimate={() => toggleFlag("animate")}
          onToggleEnv={() => toggleFlag("hideEnv")}
          onToggleNotes={() => toggleFlag("showNotes")}
        />
      ) : null}
    </div>
  );
}

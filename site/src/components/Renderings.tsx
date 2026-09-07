import { ArrowUpRight, StickyNote } from "lucide-react";
import { useMemo } from "react";
import { marked } from "marked";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { assetUrl } from "../lib/trace";
import type { Rendering } from "../lib/types";

marked.setOptions({ gfm: true, breaks: true });

function Markdown({ content, style }: { content: string; style?: Record<string, string | number> }) {
  const html = useMemo(() => {
    const parsed = marked.parse(content ?? "", { async: false }) as string;
    return parsed.replace(
      /<a href="(https?:[^"]*)"/g,
      '<a target="_blank" rel="noreferrer" href="$1"',
    );
  }, [content]);
  return <div className="markdown" style={style as never} dangerouslySetInnerHTML={{ __html: html }} />;
}

function PlotView({ spec }: { spec: Record<string, unknown> }) {
  const title = (spec.title as string) ?? "";
  const unit = (spec.unit as string) ?? "";
  const data = ((spec.items as { label: string; value: number }[]) ?? []).map((item) => ({
    name: item.label,
    value: item.value,
  }));

  return (
    <div className="rounded-2xl border border-line/10 bg-surface-2 p-4">
      {title ? <p className="mb-3 text-sm font-semibold text-fg">{title}</p> : null}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -18 }}>
          <defs>
            <linearGradient id="plotBar" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} interval={0} />
          <YAxis fontSize={11} tickLine={false} axisLine={false} width={44} />
          <Tooltip
            cursor={{ fill: "rgb(var(--accent) / 0.08)" }}
            formatter={(value: number) => [`${value}${unit}`, ""]}
            contentStyle={{
              background: "rgb(var(--surface-2))",
              border: "1px solid rgb(var(--line) / 0.15)",
              borderRadius: 12,
              color: "rgb(var(--fg))",
              fontSize: 12,
            }}
          />
          <Bar dataKey="value" fill="url(#plotBar)" radius={[6, 6, 0, 0]} maxBarSize={54} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function LinkCard({ rendering }: { rendering: Rendering }) {
  const info = (rendering.external_link ?? {}) as Record<string, string>;
  const url = info.url ?? "";
  const title = info.title ?? (rendering.data as string) ?? url;
  const source = info.source as string | undefined;
  const internal = rendering.internal_link;

  if (!url && internal) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line/10 bg-surface-2 px-3 py-1 text-xs font-medium text-fg-muted">
        {rendering.data as string}
      </span>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-between gap-4 rounded-2xl border border-line/10 bg-surface-2 px-4 py-3 transition hover:-translate-y-0.5 hover:border-accent/60 hover:bg-surface-3"
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-fg">{title}</span>
        {source ? <span className="block truncate text-xs text-fg-subtle">{source}</span> : null}
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-accent-2 transition group-hover:translate-x-0.5" />
    </a>
  );
}

function Media({ rendering }: { rendering: Rendering }) {
  const source = assetUrl(String(rendering.data ?? ""));
  const style = (rendering.style ?? {}) as Record<string, string | number>;
  const width = typeof style.width === "number" ? `${style.width}px` : (style.width as string);

  if (rendering.type === "video") {
    return (
      <video
        controls
        preload="metadata"
        src={source}
        className="w-full max-w-3xl rounded-2xl border border-line/10 shadow-lg shadow-black/10"
      />
    );
  }

  return (
    <img
      src={source}
      alt=""
      loading="lazy"
      style={width ? { width, maxWidth: "100%" } : undefined}
      className="rounded-2xl border border-line/10 bg-surface-2 shadow-lg shadow-black/10"
    />
  );
}

function Note({ rendering }: { rendering: Rendering }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
      <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{String(rendering.data ?? "")}</span>
    </div>
  );
}

export function RenderingList({
  renderings,
  showNotes,
}: {
  renderings: Rendering[];
  showNotes: boolean;
}) {
  const visible = renderings.filter((item) => item.type !== "note" || showNotes);

  return (
    <div className="space-y-3">
      {visible.map((rendering, index) => {
        if (rendering.type === "markdown") {
          return (
            <Markdown
              key={index}
              content={String(rendering.data ?? "")}
              style={(rendering.style ?? undefined) as never}
            />
          );
        }
        if (rendering.type === "image" || rendering.type === "video") {
          return <Media key={index} rendering={rendering} />;
        }
        if (rendering.type === "link") {
          return <LinkCard key={index} rendering={rendering} />;
        }
        if (rendering.type === "plot") {
          return <PlotView key={index} spec={(rendering.data ?? {}) as Record<string, unknown>} />;
        }
        if (rendering.type === "note") {
          return <Note key={index} rendering={rendering} />;
        }
        return null;
      })}
    </div>
  );
}

import clsx from "clsx";
import {
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  ChevronsRight,
  Layers,
  Menu,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import type { SectionMeta, SiteMeta } from "../lib/types";

const ICONS = {
  user: User,
  briefcase: BriefcaseBusiness,
  layers: Layers,
  book: BookOpen,
} as const;

export function Nav({
  site,
  sections,
  current,
  onSelect,
  onViewAll,
}: {
  site: SiteMeta | null;
  sections: SectionMeta[];
  current: string;
  onSelect: (id: string) => void;
  onViewAll: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const name = site?.name ?? "Online Portfolio";

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <button
          type="button"
          onClick={() => onSelect(sections[0]?.id ?? "home")}
          className="flex min-w-0 items-center gap-2.5"
        >
          <span className="h-8 w-8 shrink-0 rounded-xl bg-gradient-to-br from-brand-indigo via-brand-violet to-brand-cyan shadow-lg shadow-brand-indigo/30" />
          <span className="min-w-0 text-left">
            <span className="block truncate text-sm font-semibold text-slate-100">{name}</span>
            <span className="block truncate text-[11px] text-slate-500">
              {site?.title ?? "executable portfolio"}
            </span>
          </span>
        </button>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {sections.map((section) => {
            const Icon = ICONS[section.icon as keyof typeof ICONS] ?? User;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSelect(section.id)}
                className={clsx(
                  "flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition",
                  section.id === current
                    ? "bg-white/[0.07] text-slate-100"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200",
                )}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onViewAll}
            className="hidden cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-brand-indigo/60 hover:text-white sm:flex"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
            View all
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Sections"
            className="cursor-pointer rounded-lg border border-white/10 bg-white/[0.04] p-2 text-slate-300 transition hover:text-white md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/10 bg-ink-900/95 px-4 py-2 md:hidden">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => {
                onSelect(section.id);
                setMenuOpen(false);
              }}
              className={clsx(
                "flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm",
                section.id === current
                  ? "bg-white/[0.07] text-slate-100"
                  : "text-slate-400 hover:text-slate-200",
              )}
            >
              {section.label}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      ) : null}
    </header>
  );
}

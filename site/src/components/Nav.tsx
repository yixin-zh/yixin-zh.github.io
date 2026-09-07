import clsx from "clsx";
import {
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  ChevronsRight,
  Layers,
  Menu,
  Moon,
  Sun,
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
  dark,
  onSelect,
  onViewAll,
  onToggleTheme,
}: {
  site: SiteMeta | null;
  sections: SectionMeta[];
  current: string;
  dark: boolean;
  onSelect: (id: string) => void;
  onViewAll: () => void;
  onToggleTheme: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const name = site?.name ?? "Online Portfolio";

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/10 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <button
          type="button"
          onClick={() => onSelect(sections[0]?.id ?? "home")}
          className="flex min-w-0 items-center gap-2.5"
        >
          <span className="h-8 w-8 shrink-0 rounded-xl bg-gradient-to-br from-accent via-accent-3 to-accent-2 shadow-lg shadow-accent/30" />
          <span className="min-w-0 text-left">
            <span className="block truncate text-sm font-semibold text-fg">{name}</span>
            <span className="block truncate text-[11px] text-fg-subtle">
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
                    ? "bg-surface-3 text-fg"
                    : "text-fg-muted hover:bg-surface-3 hover:text-fg",
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
            className="hidden cursor-pointer items-center gap-1.5 rounded-lg border border-line/10 bg-surface-2 px-3 py-2 text-xs font-medium text-fg-muted transition hover:border-accent/60 hover:text-fg sm:flex"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
            View all
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            title={dark ? "Light mode" : "Dark mode"}
            className="cursor-pointer rounded-lg border border-line/10 bg-surface-2 p-2 text-fg-muted transition hover:text-fg"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Sections"
            className="cursor-pointer rounded-lg border border-line/10 bg-surface-2 p-2 text-fg-muted transition hover:text-fg md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-line/10 bg-surface/95 px-4 py-2 md:hidden">
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
                section.id === current ? "bg-surface-3 text-fg" : "text-fg-muted hover:text-fg",
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

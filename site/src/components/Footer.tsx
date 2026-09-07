import {
  FaEnvelope,
  FaFilePdf,
  FaGithub,
  FaGraduationCap,
  FaLinkedin,
  FaRss,
} from "react-icons/fa";
import type { ReactNode } from "react";
import type { SiteMeta } from "../lib/types";

const ICONS: Record<string, ReactNode> = {
  GitHub: <FaGithub />,
  LinkedIn: <FaLinkedin />,
  "Google Scholar": <FaGraduationCap />,
  Blog: <FaRss />,
  "Resume (PDF)": <FaFilePdf />,
};

export function Footer({ site }: { site: SiteMeta | null }) {
  const links = Object.entries(site?.links ?? {});

  return (
    <footer className="mt-12 border-t border-white/10 pt-6 text-sm text-slate-400">
      <div className="flex flex-wrap items-center gap-3">
        {links.map(([label, url]) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 transition hover:-translate-y-0.5 hover:border-brand-indigo/60 hover:text-slate-100"
          >
            <span className="text-brand-cyan">{ICONS[label] ?? <FaRss />}</span>
            {label}
          </a>
        ))}
        {site?.email ? (
          <a
            href={`mailto:${site.email}`}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 transition hover:-translate-y-0.5 hover:border-brand-indigo/60 hover:text-slate-100"
          >
            <FaEnvelope className="text-brand-cyan" />
            {site.email}
          </a>
        ) : null}
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Every line above is produced by a Python script in this repository; the page is a recording
        of that script running.
      </p>
    </footer>
  );
}

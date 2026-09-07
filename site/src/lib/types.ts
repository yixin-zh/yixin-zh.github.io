export interface Value {
  type: string;
  contents: unknown;
  dtype: string | null;
  shape: number[] | null;
}

export interface Rendering {
  type: string;
  data: unknown;
  style: Record<string, string | number> | null;
  external_link: Record<string, unknown> | null;
  internal_link: { path: string | null; line_number: number | null } | null;
}

export interface StackElement {
  path: string;
  line_number: number;
  function_name: string;
  code: string;
}

export interface Step {
  stack: StackElement[];
  env: Record<string, Value | null>;
  renderings: Rendering[];
}

export interface Trace {
  files: Record<string, string>;
  hidden_line_numbers: Record<string, number[]>;
  steps: Step[];
}

export interface SectionMeta {
  id: string;
  label: string;
  icon: string;
  steps: number;
  trace: string;
}

export interface SiteMeta {
  name: string;
  title: string;
  location: string;
  email: string;
  links: Record<string, string>;
}

export interface Manifest {
  site: SiteMeta;
  sections: SectionMeta[];
}

export interface LineItem {
  key: string;
  path: string;
  lineNumber: number;
  code: string;
  depth: number;
  renderings: Rendering[];
  isCurrent: boolean;
}

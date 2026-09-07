const KEYWORDS = new Set([
  "def", "return", "for", "in", "if", "elif", "else", "while", "with", "as",
  "import", "from", "class", "lambda", "not", "and", "or", "is", "None",
  "True", "False", "pass", "yield", "try", "except", "raise", "break", "continue",
]);

const TOKEN =
  /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(\d+\.?\d*)\b|([A-Za-z_][A-Za-z0-9_]*)/g;

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
};

function escapeHtml(text: string): string {
  return text.replace(/[&<>"]/g, (char) => ESCAPES[char] ?? char);
}

/** Tiny Python highlighter: enough colour for one-line statements, no dependency. */
export function highlightPython(code: string): string {
  let html = "";
  let lastIndex = 0;
  TOKEN.lastIndex = 0;

  let match = TOKEN.exec(code);
  while (match !== null) {
    html += escapeHtml(code.slice(lastIndex, match.index));
    const [raw, comment, string, number, word] = match;

    if (comment !== undefined) {
      html += `<span class="tok-comment">${escapeHtml(raw)}</span>`;
    } else if (string !== undefined) {
      html += `<span class="tok-string">${escapeHtml(raw)}</span>`;
    } else if (number !== undefined) {
      html += `<span class="tok-number">${escapeHtml(raw)}</span>`;
    } else if (word !== undefined && KEYWORDS.has(word)) {
      html += `<span class="tok-keyword">${escapeHtml(raw)}</span>`;
    } else {
      html += escapeHtml(raw);
    }

    lastIndex = match.index + raw.length;
    match = TOKEN.exec(code);
  }

  html += escapeHtml(code.slice(lastIndex));
  return html;
}

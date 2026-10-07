const KEYWORDS = new Set([
  "def", "return", "if", "else", "elif", "for", "while", "in", "and", "or", "not",
  "True", "False", "None", "function", "const", "let", "var", "true", "false", "null", "of",
  "import", "from", "class", "public", "static", "void", "new", "extends", "async", "await",
]);

function parts(code: string) {
  const pattern = /(`(?:\\.|[^`])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*|\/\/[^\n]*|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|\n|.)/g;
  return code.match(pattern) ?? [code];
}

export function CodeBlock({ code, caption }: { code: string; caption?: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-[#f8fafc]">
      {caption ? (
        <figcaption className="border-b border-line bg-white px-4 py-2 text-[11px] font-medium text-muted">
          {caption}
        </figcaption>
      ) : null}
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] leading-6">
        <code>
          {parts(code).map((part, index) => {
            let className = "text-slate-800";
            if (part.startsWith("#") || part.startsWith("//")) className = "text-slate-400";
            else if (part.startsWith('"') || part.startsWith("'") || part.startsWith("`")) className = "text-emerald-700";
            else if (/^\d/.test(part)) className = "text-violet-600";
            else if (KEYWORDS.has(part)) className = "text-primary";
            return <span key={`${part}-${index}`} className={className}>{part}</span>;
          })}
        </code>
      </pre>
    </figure>
  );
}

export function LessonCopy({
  blocks,
}: {
  blocks: import("@/lib/types").ContentBlock[];
}) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        if (block.type === "p") {
          return <p key={index} className="leading-relaxed text-ink">{block.text}</p>;
        }
        if (block.type === "ul") {
          return (
            <ul key={index} className="list-disc space-y-2 pl-5 marker:text-slate-400">
              {block.items.map((item) => <li key={item} className="leading-relaxed">{item}</li>)}
            </ul>
          );
        }
        if (block.type === "tip") {
          return (
            <aside
              key={index}
              className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3.5 text-sm leading-relaxed text-ink"
            >
              {block.title ? (
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">{block.title}</p>
              ) : null}
              <p>{block.text}</p>
            </aside>
          );
        }
        if (block.type === "steps") {
          return (
            <div key={index} className="rounded-xl border border-line bg-surface-2/80 px-4 py-3.5">
              {block.title ? (
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">{block.title}</p>
              ) : null}
              <ol className="list-decimal space-y-2 pl-5 marker:font-semibold marker:text-primary">
                {block.items.map((item) => <li key={item} className="leading-relaxed pl-1">{item}</li>)}
              </ol>
            </div>
          );
        }
        return <CodeBlock key={index} code={block.code} caption={block.caption} />;
      })}
    </div>
  );
}

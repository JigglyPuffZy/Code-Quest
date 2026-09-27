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
  blocks: Array<{ type: "p"; text: string } | { type: "ul"; items: string[] } | { type: "code"; code: string; caption?: string }>;
}) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        if (block.type === "p") return <p key={index}>{block.text}</p>;
        if (block.type === "ul") {
          return (
            <ul key={index} className="list-disc space-y-2 pl-5 marker:text-slate-400">
              {block.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          );
        }
        return <CodeBlock key={index} code={block.code} caption={block.caption} />;
      })}
    </div>
  );
}

'use client';

interface CodeExampleProps {
  code: string;
  language: string;
  className?: string;
}

export function CodeExample({ code, language, className }: CodeExampleProps) {
  return (
    <div className={`rounded-lg border bg-muted/50 ${className}`}>
      <div className="flex items-center justify-between border-b bg-muted px-4 py-2">
        <span className="text-sm font-medium text-muted-foreground">
          {language}
        </span>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Copy
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm text-foreground whitespace-pre-wrap">
          {code}
        </code>
      </pre>
    </div>
  );
} 
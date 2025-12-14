import { AlertCircle, CheckCircle2 } from "lucide-react";

interface EvaluationSummaryProps {
  summary: string;
  strengths: string[];
  gaps: string[];
}

export function EvaluationSummary({ summary, strengths, gaps }: EvaluationSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Main Summary */}
      <div className="p-5 rounded-lg bg-gradient-to-br from-accent/50 to-card border border-border">
        <p className="text-foreground leading-relaxed">{summary}</p>
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-success flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Clear Strengths
          </h4>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li
                key={index}
                className="text-sm text-foreground/80 pl-6 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-success"
              >
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gaps */}
      {gaps.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-insight flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Non-Negotiable Gaps
          </h4>
          <ul className="space-y-2">
            {gaps.map((gap, index) => (
              <li
                key={index}
                className="text-sm text-foreground/80 pl-6 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-insight"
              >
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

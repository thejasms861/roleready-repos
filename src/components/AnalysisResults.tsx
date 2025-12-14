import { ScoreDisplay } from "./ScoreDisplay";
import { EvaluationSummary } from "./EvaluationSummary";
import { Roadmap } from "./Roadmap";
import { Role } from "./RoleSelector";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

interface AnalysisResultsProps {
  repoUrl: string;
  role: Role;
  score: number;
  tier: "not-ready" | "emerging" | "hire-approaching" | "role-ready";
  badge: "bronze" | "silver" | "gold";
  summary: string;
  strengths: string[];
  gaps: string[];
  roadmap: { action: string; impact: string; effort: "low" | "medium" | "high" }[];
  onReset: () => void;
}

const roleLabels: Record<Role, string> = {
  frontend: "Frontend Developer",
  backend: "Backend Developer",
  fullstack: "Full-Stack Developer",
  "data-ml": "Data / ML Engineer",
  opensource: "Open Source / Generalist",
};

export function AnalysisResults({
  repoUrl,
  role,
  score,
  tier,
  badge,
  summary,
  strengths,
  gaps,
  roadmap,
  onReset,
}: AnalysisResultsProps) {
  const repoName = repoUrl.split("/").slice(-2).join("/");

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Analyze another repo
          </Button>

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground">Evaluation Report</h1>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              {repoName}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Evaluated for: <span className="text-foreground font-medium">{roleLabels[role]}</span>
          </p>
        </div>

        {/* Score Section */}
        <section className="card-elevated rounded-xl p-8 mb-6 animate-slide-up">
          <ScoreDisplay score={score} tier={tier} badge={badge} />
        </section>

        {/* Summary Section */}
        <section className="card-elevated rounded-xl p-6 mb-6 animate-slide-up delay-100" style={{ opacity: 0 }}>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full" />
            Evaluation Summary
          </h2>
          <EvaluationSummary summary={summary} strengths={strengths} gaps={gaps} />
        </section>

        {/* Roadmap Section */}
        <section className="card-elevated rounded-xl p-6 animate-slide-up delay-200" style={{ opacity: 0 }}>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-insight rounded-full" />
            Improvement Roadmap
          </h2>
          <Roadmap items={roadmap} />
        </section>
      </div>
    </div>
  );
}

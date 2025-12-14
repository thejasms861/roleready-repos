import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  tier: "Not Ready" | "Emerging" | "Hire-Approaching" | "Role-Ready";
  badge: "bronze" | "silver" | "gold" | "none";
}

const tierColors: Record<string, string> = {
  "Not Ready": "text-destructive",
  "Emerging": "text-muted-foreground",
  "Hire-Approaching": "text-insight",
  "Role-Ready": "text-success",
};

const badgeStyles: Record<string, string> = {
  bronze: "badge-bronze",
  silver: "badge-silver",
  gold: "badge-gold",
  none: "bg-muted text-muted-foreground",
};

export function ScoreDisplay({ score, tier, badge }: ScoreDisplayProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Circular Score */}
      <div className="relative">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold font-mono text-foreground">
            {score}
          </span>
          <span className="text-xs text-muted-foreground font-mono">/100</span>
        </div>
      </div>

      {/* Tier Label */}
      <div className="text-center space-y-2">
        <div className={cn("text-lg font-semibold", tierColors[tier] || "text-muted-foreground")}>
          {tier}
        </div>
        
        {/* Badge */}
        {badge !== "none" && (
          <div
            className={cn(
              "inline-block px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide",
              badgeStyles[badge]
            )}
          >
            {badge}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-xs font-mono">
        This score reflects readiness for the selected role — not general talent.
      </p>
    </div>
  );
}

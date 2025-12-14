import { ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoadmapItem {
  action: string;
  impact: string;
  effort: "low" | "medium" | "high";
}

interface RoadmapProps {
  items: RoadmapItem[];
}

const effortColors = {
  low: "bg-success/20 text-success border-success/30",
  medium: "bg-insight/20 text-insight border-insight/30",
  high: "bg-destructive/20 text-destructive border-destructive/30",
};

export function Roadmap({ items }: RoadmapProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
        <Zap className="w-4 h-4 text-insight" />
        <span>Ordered by impact → effort</span>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="group p-4 rounded-lg border border-border bg-card/50 hover:bg-accent/50 transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-mono text-primary">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-foreground">{item.action}</span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full border font-mono uppercase",
                      effortColors[item.effort]
                    )}
                  >
                    {item.effort} effort
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowRight className="w-3 h-3 text-insight flex-shrink-0" />
                  <span>{item.impact}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-insight font-medium pt-2 border-t border-border">
        Do these things and your repo moves from "interesting" to "interview-worthy."
      </p>
    </div>
  );
}

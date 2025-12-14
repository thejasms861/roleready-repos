import { cn } from "@/lib/utils";
import { Code, Database, Layers, Sparkles, GitBranch } from "lucide-react";

export type Role = 
  | "frontend" 
  | "backend" 
  | "fullstack" 
  | "data-ml" 
  | "opensource";

interface RoleSelectorProps {
  selectedRole: Role | null;
  onSelectRole: (role: Role) => void;
}

const roles: { id: Role; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: "frontend",
    label: "Frontend Developer",
    description: "UI, components, state management",
    icon: <Code className="w-5 h-5" />,
  },
  {
    id: "backend",
    label: "Backend Developer",
    description: "APIs, databases, security",
    icon: <Database className="w-5 h-5" />,
  },
  {
    id: "fullstack",
    label: "Full-Stack Developer",
    description: "End-to-end architecture",
    icon: <Layers className="w-5 h-5" />,
  },
  {
    id: "data-ml",
    label: "Data / ML Engineer",
    description: "Pipelines, models, analysis",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: "opensource",
    label: "Open Source / Generalist",
    description: "Community, documentation, versatility",
    icon: <GitBranch className="w-5 h-5" />,
  },
];

export function RoleSelector({ selectedRole, onSelectRole }: RoleSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground font-mono">
        Your repo will be evaluated as if you applied for this role tomorrow.
      </p>
      <div className="grid gap-2">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            className={cn(
              "flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 text-left",
              "hover:border-primary/50 hover:bg-accent/50",
              selectedRole === role.id
                ? "border-primary bg-accent/80 shadow-md"
                : "border-border bg-card/50"
            )}
          >
            <div
              className={cn(
                "p-2 rounded-md transition-colors",
                selectedRole === role.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {role.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground">{role.label}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {role.description}
              </p>
            </div>
            <div
              className={cn(
                "w-4 h-4 rounded-full border-2 transition-all",
                selectedRole === role.id
                  ? "border-primary bg-primary"
                  : "border-muted-foreground"
              )}
            >
              {selectedRole === role.id && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
